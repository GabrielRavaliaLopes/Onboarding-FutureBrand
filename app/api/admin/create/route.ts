import { NextRequest, NextResponse } from "next/server";
import { nanoid } from "nanoid";
import { redis } from "@/lib/redis";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { ciphertext, iv, createdFor } = body ?? {};

  if (!ciphertext || !iv) {
    return NextResponse.json({ error: "Dados incompletos." }, { status: 400 });
  }

  const now = Date.now();
  const id = nanoid(24);

  await redis.set(
    `onboarding:${id}`,
    JSON.stringify({
      credCiphertext: ciphertext,
      credIv: iv,
      createdFor: typeof createdFor === "string" ? createdFor.slice(0, 100) : undefined,
      createdAt: now,
    })
  );

  return NextResponse.json({ id });
}
