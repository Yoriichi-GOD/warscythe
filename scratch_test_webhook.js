import crypto from 'crypto';
import fs from 'fs';

// Load .env if it exists
let webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET || '';
try {
  const envContent = fs.readFileSync('.env', 'utf-8');
  const match = envContent.match(/^RAZORPAY_WEBHOOK_SECRET=(.*)$/m);
  if (match) webhookSecret = match[1].trim();
} catch (e) {}

const userId = process.argv[2];
const testType = process.argv[3] || 'cosmetic';

if (!userId) {
  console.error("Usage: node scratch_test_webhook.js <USER_UUID> [cosmetic|sub-charge|sub-cancel] [WEBHOOK_SECRET]");
  process.exit(1);
}

const passedSecret = process.argv[4] || webhookSecret;
if (!passedSecret) {
  console.error("Error: Webhook secret not found. Provide it as the 4th argument, or set it in .env as RAZORPAY_WEBHOOK_SECRET.");
  process.exit(1);
}

const supabaseUrl = "https://yrxchjontmgkjaazrybh.supabase.co";
const url = `${supabaseUrl}/functions/v1/razorpay-webhook`;

let payload = {};

if (testType === 'cosmetic') {
  payload = {
    event: "payment.captured",
    payload: {
      payment: {
        entity: {
          id: `pay_test_${Math.random().toString(36).substring(2, 9)}`,
          amount: 5000,
          currency: "INR",
          status: "captured",
          description: "Acquire cosmic_harvester scythe",
          notes: {
            user_id: userId,
            item_id: "cosmic_harvester",
            item_type: "scythe"
          }
        }
      }
    }
  };
} else if (testType === 'sub-charge') {
  payload = {
    event: "subscription.charged",
    payload: {
      subscription: {
        entity: {
          id: `sub_test_${Math.random().toString(36).substring(2, 9)}`,
          status: "active",
          notes: {
            user_id: userId
          }
        }
      }
    }
  };
} else if (testType === 'sub-cancel') {
  payload = {
    event: "subscription.cancelled",
    payload: {
      subscription: {
        entity: {
          id: `sub_test_${Math.random().toString(36).substring(2, 9)}`,
          status: "cancelled",
          notes: {
            user_id: userId
          }
        }
      }
    }
  };
} else {
  console.error("Unknown test type. Use: cosmetic, sub-charge, or sub-cancel");
  process.exit(1);
}

const bodyStr = JSON.stringify(payload);
const signature = crypto.createHmac('sha256', passedSecret).update(bodyStr).digest('hex');

console.log("\n========================================================");
console.log(`TEST TYPE: ${testType.toUpperCase()}`);
console.log("========================================================");
console.log("\n--- JSON BODY (Copy to Supabase Test Panel) ---");
console.log(JSON.stringify(payload, null, 2));
console.log("\n--- SIGNATURE HEADER ---");
console.log(`x-razorpay-signature: ${signature}`);
console.log("\n--- CURL COMMAND ---");
console.log(`curl -X POST "${url}" \\
  -H "Content-Type: application/json" \\
  -H "x-razorpay-signature: ${signature}" \\
  -d '${bodyStr}'`);
console.log("========================================================\n");

console.log("Sending request to Supabase...");
fetch(url, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'x-razorpay-signature': signature
  },
  body: bodyStr
})
.then(async res => {
  console.log(`Response Status: ${res.status}`);
  console.log("Response Body:", await res.text());
})
.catch(err => {
  console.error("Request failed:", err);
});
