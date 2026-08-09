import crypto from "crypto";

const ENCRYPTION_KEY = process.env.NEXTAUTH_SECRET || "fallback_secret_key_for_dev_only_123456789"; // Must be 256 bits (32 characters)
const IV_LENGTH = 16; // For AES, this is always 16

// Ensure the key is exactly 32 bytes
const getValidKey = () => crypto.createHash('sha256').update(String(ENCRYPTION_KEY)).digest('base64').substring(0, 32);

export function encryptEmail(text: string) {
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(getValidKey()), iv);
  let encrypted = cipher.update(text);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return iv.toString('hex') + ':' + encrypted.toString('hex');
}

export function decryptEmail(text: string) {
  try {
    const textParts = text.split(':');
    if (textParts.length !== 2) return null;
    
    const iv = Buffer.from(textParts[0], 'hex');
    const encryptedText = Buffer.from(textParts[1], 'hex');
    const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(getValidKey()), iv);
    
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    
    return decrypted.toString();
  } catch (error) {
    return null;
  }
}
