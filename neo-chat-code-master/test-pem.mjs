import crypto from "crypto";

const pem = `-----BEGIN PRIVATE KEY-----
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
ttmdvkg3fMOX25Cx1m1b7nc=
-----END PRIVATE KEY-----`;

function cleanPem(value) {
  return value.replace(/\\n/g, "\n").trim();
}

function pemToDer(pem) {
  const normalized = cleanPem(pem);
  const match = normalized.match(
    /-----BEGIN PRIVATE KEY-----([\s\S]+?)-----END PRIVATE KEY-----/,
  );
  if (!match) {
    throw new Error("BYOK private key must be a PKCS#8 PEM private key");
  }

  // base64UrlToBytes
  const base64Str = match[1].replace(/\s+/g, "");
  const padded = base64Str.replace(/-/g, "+").replace(/_/g, "/");
  const padLength = (4 - (padded.length % 4)) % 4;
  const base64 = `${padded}${"=".repeat(padLength)}`;
  return Buffer.from(base64, "base64");
}

console.log("length:", pemToDer(pem).length);
