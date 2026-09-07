const fs = require('fs');
const file = 'src/lib/security/localSecrets.ts';
let code = fs.readFileSync(file, 'utf8');

const oldFunc = `export async function decryptLocalSecret(
  envelope: LocalEncryptedSecretEnvelope | undefined,
  expectedContext: string,
): Promise<string | undefined> {
  if (!envelope) return undefined;
  if (!isLocalEncryptedSecretEnvelope(envelope)) {
    throw new Error("Invalid local secret envelope");
  }
  if (envelope.context !== expectedContext) {
    throw new Error("Local secret context mismatch");
  }

  const crypto = getCrypto();
  const { id, key } = await getKeyMaterial();

  if (envelope.keyId !== id) {
    throw new Error("Local secret key id mismatch");
  }

  const plaintext = await crypto.subtle.decrypt(
    {
      name: "AES-GCM",
      iv: bytesToArrayBuffer(base64UrlToBytes(envelope.iv)),
      additionalData: new TextEncoder().encode(expectedContext),
    },
    key,
    bytesToArrayBuffer(base64UrlToBytes(envelope.ciphertext)),
  );
  return new TextDecoder().decode(plaintext);
}`;

const newFunc = `export async function decryptLocalSecret(
  envelope: LocalEncryptedSecretEnvelope | undefined,
  expectedContext: string,
): Promise<string | undefined> {
  if (!envelope) return undefined;
  if (!isLocalEncryptedSecretEnvelope(envelope)) {
    console.warn("Invalid local secret envelope");
    return undefined;
  }
  if (envelope.context !== expectedContext) {
    console.warn("Local secret context mismatch");
    return undefined;
  }

  const crypto = getCrypto();
  let keyMaterial;
  try {
    keyMaterial = await getKeyMaterial();
  } catch (error) {
    console.error("Failed to get key material", error);
    return undefined;
  }
  
  const { id, key } = keyMaterial;

  if (envelope.keyId !== id) {
    console.warn("Local secret key id mismatch. Returning undefined to prompt for re-entry.");
    return undefined;
  }

  try {
    const plaintext = await crypto.subtle.decrypt(
      {
        name: "AES-GCM",
        iv: bytesToArrayBuffer(base64UrlToBytes(envelope.iv)),
        additionalData: new TextEncoder().encode(expectedContext),
      },
      key,
      bytesToArrayBuffer(base64UrlToBytes(envelope.ciphertext)),
    );
    return new TextDecoder().decode(plaintext);
  } catch (error) {
    console.error("Local secret decryption failed", error);
    return undefined;
  }
}`;

if (code.includes(oldFunc)) {
  fs.writeFileSync(file, code.replace(oldFunc, newFunc));
  console.log("Patched successfully");
} else {
  console.log("Could not find the function in the file");
}
