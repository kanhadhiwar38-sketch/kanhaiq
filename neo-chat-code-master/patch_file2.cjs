const fs = require('fs');
const file = 'src/lib/security/localSecrets.ts';
let code = fs.readFileSync(file, 'utf8');

const target = `  const plaintext = await crypto.subtle.decrypt(
    {
      name: "AES-GCM",
      iv: bytesToArrayBuffer(base64UrlToBytes(envelope.iv)),
      additionalData: new TextEncoder().encode(expectedContext),
    },
    key,
    bytesToArrayBuffer(base64UrlToBytes(envelope.ciphertext)),
  );
  return new TextDecoder().decode(plaintext);`;

const replacement = `  try {
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
  } catch (err) {
    console.error("Decryption failed", err);
    return undefined;
  }`;

if (code.includes(target)) {
  fs.writeFileSync(file, code.replace(target, replacement));
  console.log("Patched successfully");
} else {
  console.log("Could not find the target");
}
