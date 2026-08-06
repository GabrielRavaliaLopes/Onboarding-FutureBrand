import { NextRequest, NextResponse } from "next/server";
import { nanoid } from "nanoid";
import { HOUSEKEEPING_TTL_SECONDS, redis } from "@/lib/redis";

const MAX_EXPIRY_MS = 30 * 24 * 60 * 60 * 1000;

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { ciphertext, iv, expiresAt, createdFor } = body ?? {};

  if (!ciphertext || !iv) {
    return NextResponse.json({ error: "Dados incompletos." }, { status: 400 });
  }

  const now = Date.now();
  const expiryTimestamp = Number(expiresAt);

  if (
    !Number.isFinite(expiryTimestamp) ||
    expiryTimestamp <= now ||
    expiryTimestamp > now + MAX_EXPIRY_MS
  ) {
    return NextResponse.json(
      { error: "Escolha um vencimento futuro de até 30 dias." },
      { status: 400 }
    );
  }

  const id = nanoid(24);

  await redis.set(
    `onboarding:${id}`,
    JSON.stringify({
      credCiphertext: ciphertext,
      credIv: iv,
      credExpiresAt: expiryTimestamp,
      createdFor: typeof createdFor === "string" ? createdFor.slice(0, 100) : undefined,
      createdAt: now,
    }),
    { ex: HOUSEKEEPING_TTL_SECONDS }
  );

  return NextResponse.json({ id, expiresAt: expiryTimestamp });
}
