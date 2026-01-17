use anchor_lang::prelude::*;
use anchor_lang::system_program;

// 1. YOUR PROGRAM ID
// This must match the address in your Anchor.toml file.
declare_id!("C1gro7yAZrKGp1B13wehgQhvMSTx7UxGt8MWc8ozPB4d");

#[program]
pub mod silkroad {
    use super::*;

    // FUNCTION 1: LIST INVOICE (The Supplier creates the asset)
    // "I have an invoice worth 5 SOL from Samsung."
    pub fn list_invoice(
        ctx: Context<ListInvoice>, 
        amount_in_sol: u64, 
        borrower_name: String
    ) -> Result<()> {
        let invoice = &mut ctx.accounts.invoice_account;
        let supplier = &ctx.accounts.supplier;

        // Save the data to the blockchain
        invoice.supplier = supplier.key();
        invoice.price = amount_in_sol; // How much SOL they want
        invoice.borrower_name = borrower_name; // E.g., "Samsung Electronics"
        invoice.is_sold = false; // It's brand new
        
        msg!("Invoice Listed! Price: {} SOL", amount_in_sol);
        Ok(())
    }

    // FUNCTION 2: BUY INVOICE (The Investor funds it)
    // "I will buy this invoice. Here is the cash."
    pub fn buy_invoice(ctx: Context<BuyInvoice>) -> Result<()> {
        let invoice = &mut ctx.accounts.invoice_account;
        let investor = &mut ctx.accounts.investor;
        let supplier = &mut ctx.accounts.supplier;
        
        // 1. Security Checks
        if invoice.is_sold {
            return err!(ErrorCode::AlreadySold);
        }

        // 2. The Money Move (Instant Liquidity)
        // We use the System Program to transfer SOL from Investor -> Supplier
        let amount_lamports = invoice.price * 1_000_000_000; // Convert SOL to Lamports

        let cpi_context = CpiContext::new(
            ctx.accounts.system_program.to_account_info(),
            system_program::Transfer {
                from: investor.to_account_info(),
                to: supplier.to_account_info(),
            },
        );
        system_program::transfer(cpi_context, amount_lamports)?;

        // 3. Update State
        invoice.is_sold = true; // Mark as sold so it can't be bought twice
        invoice.new_owner = investor.key(); // Investor now owns the debt

        msg!("Liquidity Provided! {} SOL sent to Supplier.", invoice.price);
        Ok(())
    }
}

// DATA STRUCTURES (The "Forms" needed to run the functions)

#[derive(Accounts)]
pub struct ListInvoice<'info> {
    // This creates a BRAND NEW account to store the invoice data
    #[account(init, payer = supplier, space = 8 + 32 + 8 + 50 + 1 + 32)] 
    pub invoice_account: Account<'info, InvoiceState>,
    
    #[account(mut)]
    pub supplier: Signer<'info>, // The person paying for the gas (You)
    
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct BuyInvoice<'info> {
    // We need to write to this account to mark it as 'sold'
    #[account(mut)] 
    pub invoice_account: Account<'info, InvoiceState>,
    
    // The person PAYING for the invoice (The VC/Judge)
    #[account(mut)] 
    pub investor: Signer<'info>, 
    
    // The person RECEIVING the money (CHECK lets us accept any address)
    /// CHECK: We don't read data from this, we just send money to it.
    #[account(mut)] 
    pub supplier: UncheckedAccount<'info>, 
    
    pub system_program: Program<'info, System>,
}

// THE DATABASE SCHEMA (What an Invoice looks like)
#[account]
pub struct InvoiceState {
    pub supplier: Pubkey,      // 32 bytes
    pub price: u64,            // 8 bytes (Amount in SOL)
    pub borrower_name: String, // 50 bytes (e.g. "Apple Inc")
    pub is_sold: bool,         // 1 byte (True/False)
    pub new_owner: Pubkey,     // 32 bytes (Who bought it)
}

// ERROR CODES (If something goes wrong)
#[error_code]
pub enum ErrorCode {
    #[msg("This invoice has already been funded!")]
    AlreadySold,
}