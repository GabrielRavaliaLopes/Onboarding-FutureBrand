import { NextRequest, NextResponse } from "next/server";
import { OnboardingRecord, redis } from "@/lib/redis";

// Este GET não apaga o registro: o mesmo QR Code pode ser consultado novamente.
// As credenciais permanecem cifradas e só podem ser abertas com a chave do link.
export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const raw = await redis.get<string>(`onboarding:${params.id}`);

  if (!raw) {
    return NextResponse.json({ available: false });
  }

  const record: OnboardingRecord = typeof raw === "string" ? JSON.parse(raw) : raw;

  return NextResponse.json({
    available: true,
    ciphertext: record.credCiphertext,
    iv: record.credIv,
    createdFor: record.createdFor,
  });
}
