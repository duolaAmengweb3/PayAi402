# x402 AI Content Generator – MVP Development Document

## 1. Project Overview
### 1.1 Concept
**x402 AI Content Generator** is a zero-cost, Web3-native demo showcasing how users can **pay with USDC via the x402 protocol** to unlock AI content generation (images, speech, or short clips). The key goal is to prove that x402 micro-payments can gate real computation services—even when the computation itself runs entirely **client-side** (WebGPU / browser inference).

### 1.2 Value Proposition
- **Demonstrates x402 real-world use case**: Pay-per-use AI generation.
- **Zero server/GPU cost**: All model inference runs in the browser.
- **Deployable on Vercel free tier**: Only uses lightweight Serverless functions for payment verification.
- **Educational and viral**: Great for developer demos, x402 ecosystem exposure, and crypto media coverage.

### 1.3 Tech Stack Summary
| Layer | Technology | Cost | Purpose |
|-------|-------------|------|----------|
| Frontend | Next.js + WebGPU (Stable Diffusion / Transformers.js) | $0 | Client UI + model inference |
| Backend | Vercel Serverless (Node.js) | $0 | x402 payment verification + 402 response |
| Blockchain | Base / Solana (USDC) | $0 | Payment + transaction validation |
| Hosting | Vercel (Free Tier) | $0 | Static site + API routes |

---

## 2. User Flow
1. **User visits** the site and selects an AI service: _Image, Voice, or Text_.
2. **User clicks “Generate” → backend responds 402 Payment Required**, including payment details (`accepts` array, nonce, expiry, chain, token, recipient, amount`).
3. **Frontend triggers wallet payment** (e.g., MetaMask or Phantom). The user confirms and sends 0.1 USDC to the specified address.
4. **Frontend polls blockchain RPC** or re-sends the request with `X-PAYMENT` header containing the signed tx hash.
5. **Backend verifies transaction** (amount, recipient, token, nonce validity).
6. **Upon success**, backend returns HTTP 200 + signed **license token**.
7. **Frontend unlocks the generator** → model loads locally (WebGPU) → AI result generated → output displayed/downloadable.
8. (Optional) User can share output on social channels or see on-chain payment proof.

---

## 3. System Architecture
### 3.1 High-Level Diagram
```
User → Frontend (Next.js)
   ↳ /api/generate (Vercel Serverless)
       ↳ Return 402 + accepts[] → Wallet Payment
       ↳ Validate tx → Issue license
   ↳ Local WebGPU inference → Display result
Blockchain RPC (Base/Solana)
```

### 3.2 Module Breakdown
| Module | Function | Tech | Notes |
|---------|-----------|------|-------|
| /api/generate | Core endpoint: returns 402 or license | Vercel Node Function | Stateless, verifies tx |
| Frontend UI | Display model options & payment status | Next.js + Tailwind | Simple SPA |
| Wallet integration | USDC payment flow | ethers.js / solana/web3.js | Use minimal dependencies |
| WebGPU inference | AI model execution | MLC Web Stable Diffusion / Transformers.js | Heavy load once, then cached |
| Payment verifier | On-chain tx check | Public RPC (Base/Solana) | Match recipient + amount + token |
| Token issuance | License response | JWT or simple signed JSON | Prevent re-use |

---

## 4. API Design
### 4.1 `POST /api/generate`
**Request (initial call):**
```json
{
  "model": "sd-turbo",
  "prompt": "cat astronaut"
}
```
**Response (if unpaid):** `402 Payment Required`
```json
{
  "accepts": [
    {
      "chain": "base",
      "token": "USDC",
      "recipient": "0xABCD...1234",
      "amount": "0.1",
      "nonce": "a8f93f12",
      "expires": 1735152000
    }
  ]
}
```
**Response (after valid payment + X-PAYMENT header):** `200 OK`
```json
{
  "license": "eyJhbGciOiJI...",
  "expires_in": 300,
  "allow_inference": true
}
```

### 4.2 Payment Verification Logic (simplified)
```js
verifyTx(txHash, expected) {
  const tx = getTxFromRPC(txHash)
  return (
    tx.to == expected.recipient &&
    tx.amount >= expected.amount &&
    tx.token == expected.token &&
    tx.timestamp < expected.expires
  )
}
```

---

## 5. Frontend Logic
### 5.1 Payment Workflow
1. Request `/api/generate` → receive 402 response.
2. Parse `accepts` → display pay modal → connect wallet.
3. Send 0.1 USDC transaction → record `txHash`.
4. Re-send request with header:
```
X-PAYMENT: {"chain":"base","token":"USDC","tx":"0xabc..."}
```
5. If backend validates → UI loads inference model.

### 5.2 WebGPU Inference (client-side)
```js
import { pipeline } from '@xenova/transformers';

const pipe = await pipeline('text-to-image', 'stabilityai/stable-diffusion-2');
const image = await pipe(prompt);
document.querySelector('#result').src = image;
```

---

## 6. Deployment Plan
| Step | Action | Tool |
|------|---------|------|
| 1 | Fork repo (Next.js) | GitHub |
| 2 | Set `VERCEL_URL`, `PRIVATE_KEY` (for signing) | Vercel Env |
| 3 | Deploy with one-click Vercel import | Vercel |
| 4 | Test 402 → Payment → Unlock flow | Wallet (Base/Solana) |
| 5 | Optimize model caching | Service Worker + IndexedDB |

---

## 7. Security & Edge Cases
| Scenario | Mitigation |
|-----------|-------------|
| Reuse of old payment | Include nonce & expiry, reject duplicates |
| Fake tx | Verify on-chain with public RPC |
| Model not loading | Check WebGPU support → fallback message |
| Network congestion | Add retry logic & timeouts |
| Payment timeout | Expire unpaid invoices after 5 min |

---

## 8. MVP Deliverables
| Deliverable | Description |
|--------------|--------------|
| Frontend | Minimal UI with image prompt input, wallet connect, result preview |
| Serverless API | 402 handling, tx verification, license issuance |
| Chain integration | Base + Solana USDC support |
| Demo deployment | Hosted on Vercel public URL |
| README | Setup + usage guide |

---

## 9. Future Extensions
- Add **multi-chain payment selector** (Base / Solana / Arbitrum)
- Extend to **AI voice / video generation**
- Enable **revenue dashboard** (aggregate USDC inflow)
- Add **on-chain proof explorer** integration
- Offer SDK for third-party developers (x402 Wrapper)

---

## 10. Summary
**Why it matters:** This MVP demonstrates a full x402 payment cycle connected to real user value (AI content). It requires zero backend compute, zero API spend, and is deployable on free infrastructure—making it a perfect viral demo for the x402 ecosystem.

> "Pay 0.1 USDC → Get an AI image in seconds."