const pemStr = "'-----BEGIN PRIVATE KEY-----\\n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\\n+UiOOmiKjUS/U2yMkSxJjtY=\\n-----END PRIVATE KEY-----'";

const step1 = pemStr.trim().replace(/\\n/g, "\n");
const step2 = step1.replace(/\\n/g, "\n").trim();
const match = step2.match(/-----BEGIN PRIVATE KEY-----([\s\S]+?)-----END PRIVATE KEY-----/);

if (!match) {
  console.log("NO MATCH");
  process.exit(1);
}

const base64Str = match[1].replace(/\s+/g, "");
console.log("Base64 string length:", base64Str.length);

const padded = base64Str.replace(/-/g, "+").replace(/_/g, "/");
const padLength = (4 - (padded.length % 4)) % 4;
const base64 = `${padded}${"=".repeat(padLength)}`;

try {
  const buf = Buffer.from(base64, "base64");
  console.log("Buffer length:", buf.length);
} catch (e) {
  console.error("Base64 decode failed:", e);
}
