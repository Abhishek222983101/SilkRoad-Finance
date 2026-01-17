# ⚡ SilkRoad Finance

### The Decentralized Liquidity Layer for Real-World Assets (RWA) on Solana.

<div align="center">

</div>

> **Status:** Live on Solana Devnet (https://silk-road-finance.vercel.app)
> **Capstone:** Turbine Pre-Builders 2025-26

## 📖 Executive Summary

**SilkRoad Finance** is a decentralized invoice factoring protocol built to bridge the gap between traditional supply chain finance and Web3 liquidity.

Global suppliers often wait **60-90 days** to get paid for delivered goods (the "Cash Trap"), stifling growth. Traditional banks are slow, expensive, and exclusive. SilkRoad leverages the **Solana blockchain** to turn these unpaid invoices into liquid, tradeable assets, allowing suppliers to access capital instantly via decentralized liquidity pools.

### 📽️ [Click Here to Watch the 3-Minute Walkthrough (Live Demo)](https://www.loom.com/share/960cb85c1e604ae28a15afb865e28c77)

## 🛠 Problem & Solution

### 🔴 The Problem: The 90-Day Cash Trap
* **Liquidity Crisis:** Small & Medium Enterprises (SMEs) have millions locked in "Accounts Receivable."
* **Inefficient Settlement:** Traditional factoring takes days/weeks to settle (T+2 to T+7).
* **High Friction:** Bank approvals involve manual paper trails and high fees (3-5%).

### 🟢 The Solution: Atomic On-Chain Settlement
SilkRoad provides a permissionless marketplace where invoices are minted as on-chain assets.
* **Instant Settlement:** We utilize Solana's sub-second finality to settle transactions in <400ms.
* **Atomic Swaps:** The ownership of the invoice asset and the liquidity (SOL/USDC) are swapped in a single atomic transaction. If one fails, both fail.
* **Transparent State:** Invoice status (Listed -> Funded) is tracked via Program Derived Addresses (PDAs) on-chain.

---

## 🏗 Technical Architecture

This project consists of a **Next.js Frontend** interacting with a custom **Anchor Smart Contract** on the Solana Devnet.

### **The "State & Settle" Protocol**
To overcome rent costs and contract limitations for micro-transactions, we implemented a custom **Hybrid Settlement Logic**:

![SilkRoad Banner](https://raw.githubusercontent.com/Abhishek222983101/SilkRoad-Finance/main/web/public/arch.png)

1.  **State Layer (Anchor Program):**
    * Manages the lifecycle of the invoice (Minting, Listing, delisting).
    * Utilizes **PDAs** to store metadata hashes and ownership info securely.
    * Enforces logic checks (e.g., You cannot buy your own invoice).

2.  **Settlement Layer (Native Sol):**
    * Executes a direct, atomic system transfer of funds alongside the state transition.
    * Ensures 100% value transfer to the supplier with zero slippage.

### **Tech Stack**
* **Frontend:** Next.js 14, TypeScript, Tailwind CSS, Framer Motion.
* **Blockchain:** Solana (Devnet).
* **Smart Contracts:** Rust (Anchor Framework).
* **Wallet Integration:** Solana Wallet Adapter (Phantom, Solflare).
* **RPC Connection:** Helius / QuickNode (Devnet Cluster).

---

## 🚀 How It Works (Workflow)

1.  **Supplier Connection:**
    * User connects their Phantom Wallet.
2.  **Asset Minting:**
    * User inputs invoice details (Client Name, Amount).
    * **On-Chain Action:** The program initializes a new Invoice Account (PDA) on Solana and stores the metadata.
3.  **Marketplace Listing:**
    * The invoice appears on the global dashboard, visible to Liquidity Providers (LPs).
4.  **Liquidity Provision (Buying):**
    * An LP (Investor) clicks "Buy."
    * **Atomic Transaction:** The protocol simultaneously marks the invoice as `Sold` in the registry and transfers the SOL payload to the Supplier.
5.  **Settlement Complete:**
    * Supplier receives funds instantly. Invoice ownership transfers to the LP.

---

## 🔮 Future Roadmap (Post-Capstone)

We are actively researching advanced Solana primitives to scale SilkRoad for institutional use:

### **Phase 2: Privacy & Compression (Q1 2026)**
* **ZK Compression (Light Protocol):** Implementing Zero-Knowledge proofs to validate invoice authenticity without revealing sensitive client data (e.g., pricing margins) on the public ledger.
* **State Compression:** Migrating Invoice PDAs to Concurrent Merkle Trees (Bubblegum) to reduce state rent costs by 99.9% for high-volume supply chains.

### **Phase 3: Institutional Standards (Q1 2026)**
* **Token-2022 Extensions:** Implementing `Transfer Hooks` to enforce KYC/AML compliance on the invoice asset itself, ensuring only whitelisted wallets can hold the debt.
* **Dynamic Yield Pools:** Transitioning from P2P buying to a pooled liquidity model with APY derived from factoring fees.

---

## 💻 Getting Started (Local Development)

To run the frontend locally:

```bash
# 1. Clone the repository
git clone [https://github.com/Abhishek222983101/SilkRoad-Finance.git](https://github.com/Abhishek222983101/SilkRoad-Finance.git)

# 2. Navigate to the web directory
cd SilkRoad-Finance/web

# 3. Install dependencies
yarn install

# 4. Run the development server
yarn dev
