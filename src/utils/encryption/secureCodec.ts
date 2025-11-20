import crypto from "crypto";

// const SECRET = "SECRET_KEY";
const ALGO = "aes-256-cbc";

// // Always derive a full 32-byte key from the secret
// function getKey(secret) {
//   return crypto.createHash("sha256").update(secret).digest();
// }

// export function encrypt(text) {
//   const iv = crypto.randomBytes(16);
//   const key = getKey(SECRET);

//   const cipher = crypto.createCipheriv(ALGO, key, iv);
//   let encrypted = cipher.update(text, "utf8", "base64");
//   encrypted += cipher.final("base64");

//   // Return iv + encrypted text together
//   return iv.toString("base64") + ":" + encrypted;
// }

// export function decrypt(enc) {
//   const [ivStr, encrypted] = enc.split(":");
//   const iv = Buffer.from(ivStr, "base64");
//   const key = getKey(SECRET);

//   const decipher = crypto.createDecipheriv(ALGO, key, iv);
//   let decrypted = decipher.update(encrypted, "base64", "utf8");
//   decrypted += decipher.final("utf8");
//   return decrypted;
// }

const SECRET_KEY = crypto.createHash("sha256")
  .update("SECRET_KEY")
  .digest(); // 32 bytes

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

export function encrypt(plaintext: string): string {
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(ALGO, SECRET_KEY, iv);
  const encrypted = Buffer.concat([cipher.update(plaintext), cipher.final()]);
  return toBase62(iv) + "." + toBase62(encrypted);
}

export function decrypt(encoded: string): string {
  const [ivStr, encryptedStr] = encoded.split(".");
  const iv = fromBase62(ivStr);
  const encrypted = fromBase62(encryptedStr);

  const decipher = crypto.createDecipheriv(ALGO, SECRET_KEY, iv);
  const decrypted = Buffer.concat([decipher.update(encrypted), decipher.final()]);
  return decrypted.toString();
}
