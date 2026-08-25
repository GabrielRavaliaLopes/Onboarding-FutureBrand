import { Redis } from "@upstash/redis";

export const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

// Cada onboarding vira um registro permanente. O conteúdo sensível permanece
// cifrado e só pode ser aberto por quem possui o link completo com a chave.

export type OnboardingRecord = {
  credCiphertext: string; // base64 — login/senha, adobe, outras infos (criptografado no navegador)
  credIv: string; // base64
  createdFor?: string; // nome do colaborador (rótulo, não sigiloso)
  createdAt: number;
};
