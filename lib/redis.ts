import { Redis } from "@upstash/redis";

export const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

// Cada onboarding vira UM registro. As credenciais têm prazo próprio
// (credExpiresAt) e somem sozinhas depois desse prazo — mas o registro em si
// não é apagado na primeira leitura (dá pra escanear o mesmo QR várias vezes
// dentro da janela de validade). O TTL do Redis abaixo é só faxina de longo
// prazo (o link para de fazer sentido de qualquer forma depois disso).
export const HOUSEKEEPING_TTL_SECONDS = 60 * 60 * 24 * 90; // 90 dias

export type OnboardingRecord = {
  credCiphertext: string; // base64 — login/senha, adobe, outras infos (criptografado no navegador)
  credIv: string; // base64
  credExpiresAt: number; // epoch ms — depois disso, as credenciais somem da página
  createdFor?: string; // nome do colaborador (rótulo, não sigiloso)
  createdAt: number;
};
