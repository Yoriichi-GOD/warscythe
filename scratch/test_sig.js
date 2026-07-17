import crypto from 'crypto';

async function test() {
  const secret = "test_secret";
  const body = "hello world";

  // Node implementation
  const expectedNode = crypto.createHmac('sha256', secret).update(body).digest('hex');

  // Web Crypto implementation
  const encoder = new TextEncoder();
  const keyData = encoder.encode(secret);
  const key = await globalThis.crypto.subtle.importKey(
    "raw",
    keyData,
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const bodyData = encoder.encode(body);
  const signatureBuffer = await globalThis.crypto.subtle.sign("HMAC", key, bodyData);
  const hashArray = Array.from(new Uint8Array(signatureBuffer));
  const calculatedSignature = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

  console.log("Node Signature:      ", expectedNode);
  console.log("Web Crypto Signature:", calculatedSignature);
  console.log("Matches:", expectedNode === calculatedSignature);
}

test();
