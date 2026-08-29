import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const tbc = Boolean(process.env.TBC_API_KEY && process.env.TBC_CLIENT_ID && process.env.TBC_CLIENT_SECRET);
  const bankTransfer = Boolean(process.env.BANK_TRANSFER_IBAN && process.env.BANK_TRANSFER_BENEFICIARY);
  const crypto = Boolean(process.env.CRYPTO_PAYMENT_ADDRESS && process.env.CRYPTO_PAYMENT_ASSET && process.env.CRYPTO_PAYMENT_NETWORK);

  return NextResponse.json({
    providers: {
      tbc,
      bankTransfer: bankTransfer
        ? {
            enabled: true,
            bank: process.env.BANK_TRANSFER_BANK || "Georgian bank",
            beneficiary: process.env.BANK_TRANSFER_BENEFICIARY,
            iban: process.env.BANK_TRANSFER_IBAN,
            swift: process.env.BANK_TRANSFER_SWIFT || null,
            currency: process.env.BANK_TRANSFER_CURRENCY || "GEL",
          }
        : { enabled: false },
      crypto: crypto
        ? {
            enabled: true,
            asset: process.env.CRYPTO_PAYMENT_ASSET,
            network: process.env.CRYPTO_PAYMENT_NETWORK,
            address: process.env.CRYPTO_PAYMENT_ADDRESS,
          }
        : { enabled: false },
    },
  });
}
