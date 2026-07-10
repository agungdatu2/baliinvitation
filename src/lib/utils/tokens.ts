import { randomBytes } from "crypto";

// Tanpa karakter ambigu (0/O, 1/I/l) supaya aman diketik ulang manual kalau perlu
const GUEST_CODE_ALPHABET = "23456789ABCDEFGHJKMNPQRSTUVWXYZ";

function randomFromAlphabet(alphabet: string, length: number): string {
  const bytes = randomBytes(length);
  let out = "";
  for (let i = 0; i < length; i++) {
    out += alphabet[bytes[i] % alphabet.length];
  }
  return out;
}

// 8 karakter, non-sequential — dipakai di link personalisasi ?g={guestCode}
export function generateGuestCode(): string {
  return randomFromAlphabet(GUEST_CODE_ALPHABET, 8);
}

// 32 karakter hex, cryptographically random — satu-satunya "otentikasi" Portal Client
export function generatePortalToken(): string {
  return randomBytes(16).toString("hex");
}
