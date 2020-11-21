import crypto from "crypto";

/**
 * Random token of 32 bytes in hex using crypto.randomBytes
 */
export function getRandomToken(bytes = 32): string {
  return crypto.randomBytes(bytes).toString("hex");
}
