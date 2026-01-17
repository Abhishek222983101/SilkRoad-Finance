import { useState, useEffect } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { Program, AnchorProvider, web3, BN } from "@coral-xyz/anchor";
import { PublicKey, Connection, clusterApiUrl, Transaction, ComputeBudgetProgram } from "@solana/web3.js";
import idl from "../utils/silkroad.json";
import dynamic from "next/dynamic";
import toast, { Toaster } from 'react-hot-toast';
import { GlowingEffect } from "@/components/ui/glowing-effect";
import { GlassNavbar } from "@/components/ui/glass-navbar";
import RetroGrid from "@/components/ui/retro-grid";
import { TextLoop } from "@/components/ui/text-loop";
import { LogoCloud } from "@/components/ui/logo-cloud";
import { SectionWithMockup } from "@/components/ui/section-with-mockup";
import { BentoGrid } from "@/components/ui/bento-grid";
import { useImageUpload } from "@/components/hooks/use-image-upload";
import { ShieldCheck, ArrowRight, Upload, Zap, Globe, Lock, FileText, Twitter, Github, Linkedin } from "lucide-react";
import { motion } from "motion/react";
import { Icons } from "@/components/ui/icons";
import { Canvas, useFrame } from "@react-three/fiber";
import { Stars } from "@react-three/drei";

const WalletMultiButtonDynamic = dynamic(
  async () => (await import('@solana/wallet-adapter-react-ui')).WalletMultiButton,
  { ssr: false }
);

const GlobeMesh = () => {
  const mesh = useState<any>(null);
  useFrame((state, delta) => { if (mesh[0]) mesh[0].rotation.y += delta * 0.05; });
  return (
    <mesh ref={mesh[1]} scale={[2.8, 2.8, 2.8]}>
      <sphereGeometry args={[1, 64, 64]} />
      <meshBasicMaterial color="#00E500" wireframe transparent opacity={0.15} />
      <mesh scale={[0.99, 0.99, 0.99]}>
         <sphereGeometry args={[1, 64, 64]} />
         <meshBasicMaterial color="#000000" />
      </mesh>
    </mesh>
  );
};

// --- FLOATING FOOTER (Z-INDEX FIX) ---
const FloatingFooter = () => (
  // Updated z-index to 50 to ensure links are clickable above the background
  <div className="relative z-50 container max-w-7xl mx-auto px-6 pb-12 mt-20">
    <div className="bg-[#050505] border border-[#00E500]/20 rounded-3xl p-10 md:p-14 relative overflow-hidden shadow-2xl">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/3 h-[2px] bg-gradient-to-r from-transparent via-[#00E500] to-transparent opacity-60"></div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
        <div className="col-span-1">
          <div className="flex items-center space-x-2 mb-6">
            <div className="w-8 h-8 bg-[#00E500]/10 border border-[#00E500]/30 rounded-lg flex items-center justify-center">
               <Icons.logo className="h-4 w-4 text-[#00E500]" />
            </div>
            <span className="text-xl font-bold text-white tracking-tight">SilkRoad</span>
          </div>
          <p className="text-sm text-gray-500 leading-relaxed">
            The decentralized liquidity layer for real-world assets. <br/> Built on Solana.
          </p>
        </div>
        
        <div>
          <h4 className="font-bold text-white mb-5 text-sm uppercase tracking-wider">Platform</h4>
          <ul className="space-y-3 text-sm text-gray-400">
            <li className="hover:text-[#00E500] cursor-pointer transition-colors flex items-center"><ArrowRight className="w-3 h-3 mr-2 opacity-0 hover:opacity-100 transition-opacity"/> Marketplace</li>
            <li className="hover:text-[#00E500] cursor-pointer transition-colors flex items-center"><ArrowRight className="w-3 h-3 mr-2 opacity-0 hover:opacity-100 transition-opacity"/> Supplier Portal</li>
            <li className="hover:text-[#00E500] cursor-pointer transition-colors flex items-center"><ArrowRight className="w-3 h-3 mr-2 opacity-0 hover:opacity-100 transition-opacity"/> Tokenomics</li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold text-white mb-5 text-sm uppercase tracking-wider">Resources</h4>
          <ul className="space-y-3 text-sm text-gray-400">
            <li className="hover:text-[#00E500] cursor-pointer transition-colors">Documentation</li>
            <li className="hover:text-[#00E500] cursor-pointer transition-colors">GitHub</li>
            <li className="hover:text-[#00E500] cursor-pointer transition-colors">Audits</li>
          </ul>
        </div>

        <div>
           <h4 className="font-bold text-white mb-5 text-sm uppercase tracking-wider">Connect</h4>
           <div className="flex space-x-4">
              <a href="https://twitter.com/Abhishekislinux" target="_blank" rel="noopener noreferrer" className="p-2 bg-white/5 rounded-full hover:bg-[#00E500]/20 hover:text-[#00E500] transition-all cursor-pointer relative z-50"><Twitter className="w-5 h-5"/></a>
              <a href="https://github.com/Abhishek222983101/SilkRoad-Finance" target="_blank" rel="noopener noreferrer" className="p-2 bg-white/5 rounded-full hover:bg-[#00E500]/20 hover:text-[#00E500] transition-all cursor-pointer relative z-50"><Github className="w-5 h-5"/></a>
              <a href="https://in.linkedin.com/in/abhishek-tiwari-345066294" target="_blank" rel="noopener noreferrer" className="p-2 bg-white/5 rounded-full hover:bg-[#00E500]/20 hover:text-[#00E500] transition-all cursor-pointer relative z-50"><Linkedin className="w-5 h-5"/></a>
           </div>
        </div>
      </div>

      <div className="mt-12 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center text-xs text-gray-600">
        <p>© 2026 SilkRoad Finance. All rights reserved.</p>
        <div className="flex space-x-6 mt-4 md:mt-0">
           <span className="hover:text-white cursor-pointer">Privacy Policy</span>
           <span className="hover:text-white cursor-pointer">Terms of Service</span>
        </div>
      </div>
    </div>
  </div>
);

export default function SilkRoadApp() {
  const [connection] = useState(() => new Connection(clusterApiUrl("devnet"), "confirmed"));
  const wallet = useWallet();
  const [invoices, setInvoices] = useState<any[]>([]);
  const [borrowerName, setBorrowerName] = useState("");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const { previewUrl, fileInputRef, handleThumbnailClick, handleFileChange, handleRemove } = useImageUpload();

  const DEVNET_PROGRAM_ID = "C1gro7yAZrKGp1B13wehgQhvMSTx7UxGt8MWc8ozPB4d";

  useEffect(() => { setIsClient(true); }, []);

  const fetchInvoices = async () => {
    if (!wallet.publicKey) return;
    try {
      const dummyWallet = { publicKey: wallet.publicKey, signTransaction: () => Promise.resolve(), signAllTransactions: () => Promise.resolve() };
      const provider = new AnchorProvider(connection, dummyWallet as any, {});
      const customIdl = { ...idl, address: DEVNET_PROGRAM_ID };
      const program = new Program(customIdl as any, provider);
      
      const allInvoices = await (program.account as any).invoiceState.all();
      
      const cleanInvoices = allInvoices.filter((inv: any) => {
          const name = inv.account.borrowerName || "";
          return name.startsWith("SR::"); 
      });

      setInvoices(cleanInvoices);
    } catch (e) { console.error("Fetch error", e); }
  };
  useEffect(() => { if (wallet.publicKey) fetchInvoices(); }, [wallet.publicKey]);

  // --- MINT FUNCTION ---
  const createInvoice = async () => {
    if (!wallet.publicKey) return;
    if (!amount) { toast.error("Enter Amount"); return; }

    setLoading(true);
    const toastId = toast.loading("Minting...");
    try {
      const provider = new AnchorProvider(connection, wallet as any, {});
      const customIdl = { ...idl, address: DEVNET_PROGRAM_ID };
      const program = new Program(customIdl as any, provider);
      
      const invoiceKeypair = web3.Keypair.generate();
      
      // Force 1 Lamport for contract stability
      const lamports = new BN(1); 

      // Embed Real Price
      const finalName = `SR::${borrowerName}::${amount}`;

      await program.methods.listInvoice(lamports, finalName)
        .accounts({ 
            invoiceAccount: invoiceKeypair.publicKey, 
            supplier: wallet.publicKey, 
            systemProgram: web3.SystemProgram.programId 
        } as any)
        .signers([invoiceKeypair])
        .rpc();

      toast.dismiss(toastId); 
      toast.success(`Minted ${amount} SOL Asset!`);
      fetchInvoices(); 
      setBorrowerName(""); 
      setAmount(""); 
      handleRemove();
    } catch (err) { 
        console.error(err); 
        toast.dismiss(toastId); 
        toast.error("Mint Failed"); 
    } finally { 
        setLoading(false); 
    }
  };

  // --- BUY FUNCTION ---
  const buyInvoice = async (invoicePubkey: PublicKey, supplierPubkey: PublicKey, realPriceSol: string) => {
    if (!wallet.publicKey) return;
    setLoading(true);
    const toastId = toast.loading(`Sending ${realPriceSol} SOL...`);

    try {
      if (wallet.publicKey.toBase58() === supplierPubkey.toBase58()) {
         throw new Error("Cannot buy your own invoice. Switch wallets!");
      }

      const transferLamports = parseFloat(realPriceSol) * web3.LAMPORTS_PER_SOL;
      const balance = await connection.getBalance(wallet.publicKey);
      if (balance < transferLamports) {
         throw new Error(`Insufficient Funds!`);
      }

      const dummyWallet = { publicKey: wallet.publicKey, signTransaction: () => Promise.reject(), signAllTransactions: () => Promise.reject() };
      const provider = new AnchorProvider(connection, dummyWallet as any, {});
      const customIdl = { ...idl, address: DEVNET_PROGRAM_ID };
      const program = new Program(customIdl as any, provider);

      const ixContract = await program.methods
        .buyInvoice()
        .accounts({
          invoiceAccount: invoicePubkey,
          buyer: wallet.publicKey, 
          investor: wallet.publicKey,
          user: wallet.publicKey,
          signer: wallet.publicKey,
          supplier: supplierPubkey,
          systemProgram: web3.SystemProgram.programId,
        } as any)
        .instruction();

      const ixTransfer = web3.SystemProgram.transfer({
        fromPubkey: wallet.publicKey,
        toPubkey: supplierPubkey,
        lamports: transferLamports, 
      });

      const transaction = new Transaction().add(ixContract).add(ixTransfer);
      
      const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash();
      transaction.recentBlockhash = blockhash;
      transaction.feePayer = wallet.publicKey;

      const signature = await wallet.sendTransaction(transaction, connection, { skipPreflight: true });
      console.log("Tx Sent:", signature);
      toast.loading("Settling on-chain...");

      const confirmation = await connection.confirmTransaction({ signature, blockhash, lastValidBlockHeight });

      if (confirmation.value.err) throw new Error("Transaction Failed");

      toast.dismiss();
      toast.success(`Sent ${realPriceSol} SOL Successfully!`);
      fetchInvoices();

    } catch (err: any) {
      console.error("Buy Error:", err);
      toast.dismiss();
      const msg = err.message ? err.message : JSON.stringify(err);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const InvoiceCard = ({ inv }: any) => {
    const rawString = inv.account.borrowerName;
    let displayName = "Invoice";
    let displayPrice = "0.0";

    if (rawString.startsWith("SR::")) {
        const parts = rawString.split("::");
        if(parts.length >= 3) {
            displayName = parts[1];
            displayPrice = parts[2];
        }
    }

    const isFunded = inv.account.isSold;

    return (
      <div className="relative rounded-xl p-[1px] mb-3 bg-gradient-to-r from-[#00E500]/30 to-transparent">
        <GlowingEffect spread={20} glow={true} disabled={false} proximity={64} inactiveZone={0.01} borderWidth={1} />
        <div className="relative bg-[#0A0C0A] p-4 rounded-xl flex items-center justify-between border border-[#00E500]/20">
          <div>
            <h4 className="font-bold text-white text-sm">{displayName}</h4>
            <p className="text-xs text-[#00E500] flex items-center mt-1 font-mono">
              <ShieldCheck className="w-3 h-3 mr-1" /> 
              {displayPrice} SOL
            </p>
          </div>
          {isFunded ? (
            <span className="px-3 py-1 bg-[#00E500]/20 text-[#00E500] text-[10px] font-bold rounded border border-[#00E500]/20">Funded</span>
          ) : (
            <button 
              onClick={() => buyInvoice(inv.publicKey, inv.account.supplier, displayPrice)} 
              className="px-4 py-1.5 bg-white text-black font-bold text-xs rounded hover:bg-[#00E500] transition-colors"
            >
              Buy
            </button>
          )}
        </div>
      </div>
    );
  };

  if (!isClient) return null;

  return (
    <div className="relative min-h-screen bg-black text-white font-sans selection:bg-[#00E500]/30 overflow-x-hidden">
      <Toaster position="bottom-right" toastOptions={{ style: { background: '#111', color: '#fff', border: '1px solid #333' } }} />
      <GlassNavbar />
      
      {/* HERO */}
      <div className="relative h-[90vh] w-full flex flex-col items-center justify-center overflow-visible">
         <div className="absolute inset-0 top-[20%] z-0">
            <Canvas camera={{ position: [0, 0, 4.5] }}>
               <ambientLight intensity={2.5} />
               <pointLight position={[10, 10, 10]} intensity={2} color="#00E500" />
               <Stars radius={150} depth={50} count={1200} factor={4} saturation={0} fade speed={0.5} />
               <GlobeMesh />
            </Canvas>
         </div>
         <div className="relative z-10 text-center max-w-5xl px-6 -mt-32">
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
               <div className="inline-flex items-center space-x-2 border border-[#00E500]/30 bg-[#00E500]/10 px-3 py-1 rounded-full mb-8 backdrop-blur-md">
                  <Icons.logo className="h-4 w-4 text-[#00E500] animate-spin-slow" />
                  <span className="text-[11px] font-bold tracking-[0.2em] uppercase text-green-400">Solana Turbine Capstone</span>
               </div>
               <h1 className="text-4xl md:text-7xl font-bold tracking-tighter text-white mb-6 leading-[1.1] flex flex-col items-center">
                  <span>Smart Liquidity for</span>
                  <span className="mt-1 -ml-1"><TextLoop /></span>
               </h1>
               <p className="max-w-xl mx-auto text-lg text-gray-400 mb-10 leading-relaxed">
                  Transform unpaid invoices into liquid assets. <br/> Powered by <strong>ZK-Compression</strong> on Solana.
               </p>
               <div className="flex justify-center space-x-4">
                  <button onClick={() => document.getElementById('dashboard')?.scrollIntoView({behavior: 'smooth'})} className="px-8 py-4 bg-[#00E500] text-black font-bold rounded-full hover:bg-green-400 hover:shadow-[0_0_40px_rgba(0,229,0,0.4)] transition-all flex items-center">
                     Start Minting <ArrowRight className="ml-2 w-4 h-4" />
                  </button>
               </div>
            </motion.div>
         </div>
      </div>
      
      {/* DASHBOARD */}
      <div id="dashboard" className="relative w-full z-20 -mt-48 pb-20">
         <div className="absolute top-20 left-0 w-full h-[150%] z-0 pointer-events-none opacity-40">
            <RetroGrid gridColor="#00E500" />
         </div>
         <div className="container max-w-7xl mx-auto px-6 relative z-10">
            <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }} 
               className="bg-[#050505]/90 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
                 <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-green-500 to-transparent opacity-50"></div>
                 <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 relative z-10">
                    <div className="lg:col-span-5 border-r border-white/5 pr-0 lg:pr-12 space-y-6">
                       <div>
                          <h3 className="text-xl font-bold text-white mb-1 flex items-center"><FileText className="text-[#00E500] mr-2 w-5 h-5"/> New Invoice</h3>
                          <p className="text-gray-500 text-xs">Mint your RWA instantly.</p>
                       </div>
                       <div className="space-y-4">
                          <input className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-sm focus:border-[#00E500] outline-none text-white transition-all" placeholder="Client Name" value={borrowerName} onChange={(e) => setBorrowerName(e.target.value)} />
                          <input className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-sm focus:border-[#00E500] outline-none text-white transition-all" type="number" placeholder="Value (SOL)" value={amount} onChange={(e) => setAmount(e.target.value)} />
                          <div onClick={handleThumbnailClick} className="border-2 border-dashed border-white/10 bg-black/20 rounded-xl p-6 text-center hover:border-[#00E500]/50 hover:bg-green-900/10 transition-all cursor-pointer relative overflow-hidden group">
                             <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
                             {previewUrl ? (
                                <div className="relative z-10 flex flex-col items-center">
                                   <img src={previewUrl} alt="Preview" className="h-20 rounded-lg object-cover shadow-lg border border-white/10" />
                                   <button onClick={(e) => { e.stopPropagation(); handleRemove(); }} className="mt-2 text-xs text-red-400 hover:text-red-300 underline">Remove</button>
                                </div>
                             ) : (
                                <>
                                   <Upload className="w-8 h-8 text-gray-600 mx-auto mb-3 group-hover:text-[#00E500] transition-colors" />
                                   <p className="text-gray-400 text-sm group-hover:text-white">Click to Upload Invoice</p>
                                </>
                             )}
                          </div>
                          <button onClick={createInvoice} disabled={loading} className="w-full bg-white text-black font-bold py-4 rounded-xl hover:bg-green-400 transition-all shadow-[0_0_20px_rgba(0,229,0,0.1)]">
                             {loading ? "Minting..." : "Mint Asset on Solana"}
                          </button>
                       </div>
                    </div>
                    <div className="lg:col-span-7 pl-0 lg:pl-4 flex flex-col h-full">
                       <div className="flex justify-between items-center mb-6">
                          <h3 className="text-xl font-bold text-white">Live Market</h3>
                          <span className="text-[10px] bg-[#00E500]/10 text-[#00E500] px-2 py-1 rounded border border-[#00E500]/20 animate-pulse">● LIVE</span>
                       </div>
                       <div className="grid grid-cols-2 gap-4 mb-6">
                          <div className="relative rounded-xl p-[1px] bg-gradient-to-b from-white/10 to-transparent">
                             <div className="bg-black/40 backdrop-blur-md p-4 rounded-xl flex flex-col justify-center items-center text-center h-full hover:bg-white/5 transition-all">
                                <Zap className="w-6 h-6 text-yellow-400 mb-2" />
                                <span className="text-sm font-bold text-white">Instant Settlement</span>
                                <span className="text-[10px] text-gray-500 mt-1">Funds settle in &lt;400ms</span>
                             </div>
                          </div>
                          <div className="relative rounded-xl p-[1px] bg-gradient-to-b from-white/10 to-transparent">
                             <div className="bg-black/40 backdrop-blur-md p-4 rounded-xl flex flex-col justify-center items-center text-center h-full hover:bg-white/5 transition-all">
                                <Lock className="w-6 h-6 text-[#00E500] mb-2" />
                                <span className="text-sm font-bold text-white">ZK-Privacy</span>
                                <span className="text-[10px] text-gray-500 mt-1">Zero-Knowledge Proofs</span>
                             </div>
                          </div>
                       </div>
                       <div className="flex-1 space-y-2 overflow-y-auto custom-scrollbar pr-2 min-h-[250px]">
                          {invoices.length === 0 ? (
                             <div className="h-full flex flex-col items-center justify-center text-gray-600 border border-dashed border-white/5 rounded-xl bg-black/20">
                                <Globe className="w-8 h-8 mb-2 opacity-20" />
                                <p className="text-sm">Ready to Mint.</p>
                             </div>
                          ) : (
                             invoices.map((inv, idx) => <InvoiceCard key={idx} inv={inv} />)
                          )}
                       </div>
                    </div>
                 </div>
            </motion.div>
         </div>
      </div>
      
      {/* FEATURES - ARCHITECTURE DIAGRAM SECTION */}
      <div className="relative z-20 bg-black pt-20 pb-20 overflow-hidden -mt-32">
         <div className="absolute inset-0 z-0 pointer-events-none">
              <div className="absolute inset-0" style={{ 
                  backgroundImage: `
                      radial-gradient(circle 900px at 50% 0px, rgba(0, 229, 0, 0.25), transparent 70%),
                      linear-gradient(to right, rgba(255, 255, 255, 0.05) 1px, transparent 1px),
                      linear-gradient(to bottom, rgba(255, 255, 255, 0.05) 1px, transparent 1px)
                  `,
                  backgroundSize: '100% 100%, 60px 60px, 60px 60px'
              }} />
              <div className="absolute top-0 left-0 w-1/4 h-[500px] opacity-30" 
                   style={{ background: 'radial-gradient(ellipse at left, rgba(0, 229, 0, 0.4), transparent 70%)' }}></div>
              <div className="absolute top-0 right-0 w-1/4 h-[500px] opacity-30" 
                   style={{ background: 'radial-gradient(ellipse at right, rgba(0, 229, 0, 0.4), transparent 70%)' }}></div>
         </div>
         <div className="relative z-10 pt-20">
             <LogoCloud />
             <SectionWithMockup 
               title={<>Bridging <span className="text-[#00E500]">Web3</span> & Real World</>}
               description="SilkRoad enables businesses to unlock capital trapped in unpaid invoices using the speed and security of the Solana blockchain. No banks, no delays."
               mockupImage="/arch.png" // Updated to clean filename
             />
             <BentoGrid />
         </div>
      </div>
      {/* FLOATING FOOTER */}
      <FloatingFooter />
    </div>
  );
}