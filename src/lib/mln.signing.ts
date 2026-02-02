import { createHmac, randomBytes } from "crypto";

const SUBMIT_TOKEN_TTL_MS = 10 * 60 * 1000;
const SUBMIT_PREFIX = "mln.store:";

const usedNonces = new Map<string, number>();

function getSecret(): string {
  const s = process.env.MLN_SIGNING_SECRET;
  if (!s || s.length < 16) {
    throw new Error("MLN_SIGNING_SECRET must be set and at least 16 chars");
  }
  return s;
}

function cleanupNonces() {
  const now = Date.now();
  for (const [nonce, expiry] of Array.from(usedNonces)) {
    if (expiry < now) usedNonces.delete(nonce);
  }
}

export function signPayload(body: string): string {
  const secret = getSecret();
  return createHmac("sha256", secret).update(body).digest("base64url");
}

export function createSubmitToken(): {
  nonce: string;
  timestamp: number;
  token: string;
} {
  const secret = getSecret();
  const nonce = randomBytes(16).toString("base64url");
  const timestamp = Date.now();
  const payload = `${SUBMIT_PREFIX}${nonce}:${timestamp}`;
  const token = createHmac("sha256", secret).update(payload).digest("base64url");
  return { nonce, timestamp, token };
}

export function verifySubmitToken(
  nonce: string,
  timestamp: number,
  token: string
): boolean {
  const secret = getSecret();
  const now = Date.now();
  if (now - timestamp > SUBMIT_TOKEN_TTL_MS || now - timestamp < 0) return false;
  if (usedNonces.has(nonce)) return false;
  const payload = `${SUBMIT_PREFIX}${nonce}:${timestamp}`;
  const expected = createHmac("sha256", secret).update(payload).digest("base64url");
  if (expected !== token) return false;
  cleanupNonces();
  usedNonces.set(nonce, timestamp + SUBMIT_TOKEN_TTL_MS);
  return true;
}
