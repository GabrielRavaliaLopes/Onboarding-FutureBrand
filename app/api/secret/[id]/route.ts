import { NextRequest, NextResponse } from "next/server";
import { OnboardingRecord, redis } from "@/lib/redis";

// Importante: este GET não apaga o registro (não é mais "uso único").
// O conteúdo fixo da página independe deste endpoint — ele só cuida da
// parte de credenciais, que tem prazo próprio (credExpiresAt).
export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const raw = await redis.get<string>(`onboarding:${params.id}`);

  if (!raw) {
    return NextResponse.json({ available: false });
  }

  const record: OnboardingRecord = typeof raw === "string" ? JSON.parse(raw) : raw;
  const expired = Date.now() >= record.credExpiresAt;

  if (expired) {
    return NextResponse.json({ available: false, expired: true });
  }

  return NextResponse.json({
    available: true,
    ciphertext: record.credCiphertext,
    iv: record.credIv,
    createdFor: record.createdFor,
  });
}
