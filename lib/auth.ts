// Usa Web Crypto (SubtleCrypto) em vez do módulo "crypto" do Node,
// porque o middleware roda em Edge Runtime, que não suporta módulos Node.

const COOKIE_NAME = "onb_admin_session";
const SESSION_VALUE = "ok";

function getKey(secret: string) {
  const enc = new TextEncoder();
  return crypto.subtle.importKey(
    "raw",
    enc.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"]
  );
}

function toHex(buf: ArrayBuffer): string {
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

async function sign(value: string): Promise<string> {
  const secret = process.env.ADMIN_SECRET || "";
  const key = await getKey(secret);
  const sig = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(value));
  return toHex(sig);
}

export async function createSessionCookieValue(): Promise<string> {
  const signature = await sign(SESSION_VALUE);
  return `${SESSION_VALUE}.${signature}`;
}

export async function isValidSessionCookieValue(
  cookieValue: string | undefined
): Promise<boolean> {
  if (!cookieValue) return false;
  const [value, signature] = cookieValue.split(".");
  if (!value || !signature) return false;
  const expected = await sign(value);
  if (signature.length !== expected.length) return false;
  let diff = 0;
  for (let i = 0; i < signature.length; i++) {
    diff |= signature.charCodeAt(i) ^ expected.charCodeAt(i);
  }
  return diff === 0;
}

export const ADMIN_COOKIE_NAME = COOKIE_NAME;
