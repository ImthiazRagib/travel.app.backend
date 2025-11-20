import { HttpException } from "@nestjs/common";
import { HttpStatus } from "@nestjs/common";
import crypto from "crypto";

const SECRET = "SECRET_KEY";
const ALGO = "aes-256-cbc";

// Always derive a full 32-byte key from the secret
function getKey(secret: string) {
  return crypto.createHash("sha256").update(secret).digest();
}

export function isValidEncodedData(token: string, expected?: string): boolean {
  try {
    // Must include the dot separator
    if (!token.includes(".")) return false;

    const [ivStr, encryptedStr] = token.split(".");
    if (!ivStr || !encryptedStr) return false;

    // Base62 validation (only allowed characters)
    const base62Regex = /^[0-9A-Za-z]+$/;
    if (!base62Regex.test(ivStr) || !base62Regex.test(encryptedStr)) return false;

    // // Try decoding
    // const decoded = decrypt(token);

    // // Optional match check
    // if (expected !== undefined && decoded !== expected) {
    //   return false;
    // }

    return true; // Valid encrypted data
  } catch (err) {
    return false; // Any failure = invalid
  }
}


const SECRET_KEY = getKey(SECRET); // 32 bytes

const IV_LENGTH = 16;
const BASE62_CHARS = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

function toBase62(buffer: Buffer) {
  let value = BigInt("0x" + buffer.toString("hex"));
  let result = "";

  while (value > 0) {
    result = BASE62_CHARS[Number(value % 62n)] + result;
    value /= 62n;
  }
  return result;
}

function fromBase62(str: string) {
  let value = 0n;
  for (let char of str) {
    value = value * 62n + BigInt(BASE62_CHARS.indexOf(char));
  }
  return Buffer.from(value.toString(16), "hex");
}

export function encryptData(plaintext: string): string {
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(ALGO, SECRET_KEY, iv);
  const encrypted = Buffer.concat([cipher.update(plaintext), cipher.final()]);
  return toBase62(iv) + "." + toBase62(encrypted);
}

export function decryptData(encoded: string): string {

  if (!isValidEncodedData(encoded)) throw new HttpException("Invalid encoded data", HttpStatus.BAD_REQUEST);

  const [ivStr, encryptedStr] = encoded.split(".");
  const iv = fromBase62(ivStr);
  const encrypted = fromBase62(encryptedStr);

  const decipher = crypto.createDecipheriv(ALGO, SECRET_KEY, iv);
  const decrypted = Buffer.concat([decipher.update(encrypted), decipher.final()]);
  return decrypted.toString();
}
