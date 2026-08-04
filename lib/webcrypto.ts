// Todas as funções abaixo rodam no navegador (Web Crypto API).
// A chave de criptografia nunca é enviada ao servidor: ela vive só na URL,
// depois do "#" (fragment), que o navegador nunca inclui em requisições HTTP.

function bufToBase64Url(buf: ArrayBuffer): string {
  const bytes = new Uint8Array(buf);
  let binary = "";
  bytes.forEach((b) => (binary += String.fromCharCode(b)));
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function base64UrlToBuf(b64url: string): ArrayBuffer {
  const b64 = b64url.replace(/-/g, "+").replace(/_/g, "/").padEnd(
    b64url.length + ((4 - (b64url.length % 4)) % 4),
    "="
  );
  const binary = atob(b64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes.buffer;
}

export async function generateKey(): Promise<CryptoKey> {
  return crypto.subtle.generateKey({ name: "AES-GCM", length: 256 }, true, [
    "encrypt",
    "decrypt",
  ]);
}

export async function exportKeyToUrlSafeString(key: CryptoKey): Promise<string> {
  const raw = await crypto.subtle.exportKey("raw", key);
  return bufToBase64Url(raw);
}

export async function importKeyFromUrlSafeString(keyStr: string): Promise<CryptoKey> {
  const raw = base64UrlToBuf(keyStr);
  return crypto.subtle.importKey("raw", raw, { name: "AES-GCM" }, true, ["decrypt"]);
}

export async function encryptJson(
  data: unknown,
  key: CryptoKey
): Promise<{ ciphertext: string; iv: string }> {
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const encoded = new TextEncoder().encode(JSON.stringify(data));
  const cipherBuf = await crypto.subtle.encrypt({ name: "AES-GCM", iv }, key, encoded);
  return {
    ciphertext: bufToBase64Url(cipherBuf),
    iv: bufToBase64Url(iv.buffer),
  };
}

export async function decryptJson<T>(
  ciphertext: string,
  iv: string,
  key: CryptoKey
): Promise<T> {
  const cipherBuf = base64UrlToBuf(ciphertext);
  const ivBuf = new Uint8Array(base64UrlToBuf(iv));
  const plainBuf = await crypto.subtle.decrypt({ name: "AES-GCM", iv: ivBuf }, key, cipherBuf);
  const text = new TextDecoder().decode(plainBuf);
  return JSON.parse(text) as T;
}
