import { NextRequest, NextResponse } from "next/server";
import { nanoid } from "nanoid";
import { HOUSEKEEPING_TTL_SECONDS, redis } from "@/lib/redis";

const ALLOWED_TTL_HOURS = [24, 48];

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { ciphertext, iv, ttlHours, createdFor } = body ?? {};

  if (!ciphertext || !iv) {
    return NextResponse.json({ error: "Dados incompletos." }, { status: 400 });
  }

  const ttl = ALLOWED_TTL_HOURS.includes(ttlHours) ? ttlHours : 24;
  const id = nanoid(24);
  const now = Date.now();

  await redis.set(
    `onboarding:${id}`,
    JSON.stringify({
      credCiphertext: ciphertext,
      credIv: iv,
      credExpiresAt: now + ttl * 60 * 60 * 1000,
      createdFor: typeof createdFor === "string" ? createdFor.slice(0, 100) : undefined,
      createdAt: now,
    }),
    { ex: HOUSEKEEPING_TTL_SECONDS }
  );

  return NextResponse.json({ id });
}
