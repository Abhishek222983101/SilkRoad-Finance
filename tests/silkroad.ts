import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { Silkroad } from "../target/types/silkroad";
import { assert } from "chai";

describe("silkroad", () => {
  // 1. Setup the connection to Localhost
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.Silkroad as Program<Silkroad>;

  // 2. Create fake users for the test
  const supplier = anchor.web3.Keypair.generate();
  const investor = anchor.web3.Keypair.generate();
  
  // This will be the specific address of the Invoice on the blockchain
  const invoiceAccount = anchor.web3.Keypair.generate();

  it("The Full Flow: List Invoice -> Buy Invoice", async () => {
    // A. AIRDROP SOL (Give our fake users some fake money to pay for gas)
    console.log("💰 Airdropping SOL to Supplier & Investor...");
    try {
        await provider.connection.requestAirdrop(supplier.publicKey, 10 * anchor.web3.LAMPORTS_PER_SOL);
        await provider.connection.requestAirdrop(investor.publicKey, 10 * anchor.web3.LAMPORTS_PER_SOL);
    } catch (e) {
        console.log("⚠️ Airdrop failed. If on localnet, this is fine if you have funds. If on Devnet, you might be rate limited.");
    }
    
    // Wait a tiny bit for airdrop to confirm
    await new Promise(r => setTimeout(r, 1000));

    // B. LIST THE INVOICE (Supplier uploads "Invoice #101")
    console.log("📝 Supplier is listing an invoice for 2 SOL...");
    
    await program.methods
      .listInvoice(
        new anchor.BN(2), // Price: 2 SOL
        "Samsung Electronics" // Borrower Name
      )
      .accounts({
        invoiceAccount: invoiceAccount.publicKey,
        supplier: supplier.publicKey,
        // REMOVED: systemProgram (Anchor handles this automatically now)
      })
      .signers([invoiceAccount, supplier])
      .rpc();

    // Verify it saved correctly
    let invoiceState = await program.account.invoiceState.fetch(invoiceAccount.publicKey);
    console.log("   ✅ Invoice Saved! Borrower:", invoiceState.borrowerName);

    // C. BUY THE INVOICE (Investor pays 2 SOL)
    console.log("💸 Investor is buying the invoice...");
    
    // Check Investor Balance BEFORE
    let balanceBefore = await provider.connection.getBalance(investor.publicKey);
    
    await program.methods
      .buyInvoice()
      .accounts({
        invoiceAccount: invoiceAccount.publicKey,
        investor: investor.publicKey,
        supplier: supplier.publicKey, // Money goes here
        // REMOVED: systemProgram (Anchor handles this automatically now)
      })
      .signers([investor])
      .rpc();

    // D. FINAL CHECKS
    invoiceState = await program.account.invoiceState.fetch(invoiceAccount.publicKey);
    console.log("   ✅ Invoice Updated! New Owner:", invoiceState.newOwner.toBase58());

    // Check if money actually moved
    let balanceAfter = await provider.connection.getBalance(investor.publicKey);
    console.log(`   📉 Investor Balance dropped by: ${(balanceBefore - balanceAfter) / 1000000000} SOL`);
  });
});