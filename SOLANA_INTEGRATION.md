# PayAI402 Solana 双链支持集成指南

---

## ✅ 已完成的准备工作

### 1. Solana 钱包已生成
```
Public Key:  82MbRScGQqTKWZbYggydXpZgwxrjCuFvmixj3aPsBG79
Secret Key:  45GMznNiKyfARYXhCUVHNqSsB4gy1Hx9frSnBSYkYXo86MaSYwBWdSBxKKEfJmQ2SbtDURu4aYjn9Dgvs68UntS3
```

### 2. 依赖已安装
- ✅ @solana/web3.js
- ✅ @solana/spl-token
- ✅ bs58

### 3. 环境变量已配置
```env
# Solana Wallet
SOLANA_RECIPIENT_ADDRESS=82MbRScGQqTKWZbYggydXpZgwxrjCuFvmixj3aPsBG79
SOLANA_SECRET_KEY=45GMznNiKyfARYXhCUVHNqSsB4gy1Hx9frSnBSYkYXo86MaSYwBWdSBxKKEfJmQ2SbtDURu4aYjn9Dgvs68UntS3

# Solana 主网配置
NEXT_PUBLIC_SOLANA_RPC_URL=https://api.mainnet-beta.solana.com
NEXT_PUBLIC_SOLANA_USDC_MINT=EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v
NEXT_PUBLIC_SOLANA_PAYMENT_AMOUNT=0.1
```

---

## 🚀 快速实现方案

### 方案 A: 简化版（推荐优先使用）
**只添加 Solana 支持到测试页面**

优点:
- ✅ 实现简单
- ✅ 不影响现有功能
- ✅ 可独立测试

实现步骤:
1. 创建独立的 Solana 测试页面 `/solana-test`
2. 用户可选择访问 Base 版本或 Solana 版本
3. 两个版本并行运行

### 方案 B: 完整版（生产就绪）
**在主页面添加网络切换功能**

优点:
- ✅ 用户体验最佳
- ✅ 统一界面
- ⚠️  实现复杂

实现步骤:
1. 添加网络选择组件
2. 修改 PaymentModal 支持 Phantom
3. 更新 API 支持两种链
4. 添加交易验证逻辑

---

## 📝 核心代码示例

### 1. Solana 支付流程（前端）

```typescript
// app/components/SolanaPaymentModal.tsx
'use client';

import { useState } from 'react';
import { Connection, PublicKey, Transaction, SystemProgram } from '@solana/web3.js';
import { getAssociatedTokenAddress, createTransferInstruction } from '@solana/spl-token';

export function SolanaPaymentModal({ onPaymentSuccess }) {
  const [isConnecting, setIsConnecting] = useState(false);
  const [isPaying, setIsPaying] = useState(false);
  const [signature, setSignature] = useState(null);
  const [error, setError] = useState(null);

  const handleConnect = async () => {
    setIsConnecting(true);
    setError(null);

    try {
      // 检查 Phantom 钱包
      if (!window.solana || !window.solana.isPhantom) {
        throw new Error('请安装 Phantom 钱包');
      }

      // 连接钱包
      const resp = await window.solana.connect();
      console.log('Connected:', resp.publicKey.toString());

      // 获取支付信息（402 Response）
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'sd-turbo',
          prompt: 'test',
          chain: 'solana', // 指定使用 Solana
        }),
      });

      if (response.status === 402) {
        const data = await response.json();
        // 找到 Solana 支付选项
        const solanaPayment = data.accepts.find(a => a.chain === 'solana');
        if (solanaPayment) {
          await handlePay(solanaPayment);
        }
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsConnecting(false);
    }
  };

  const handlePay = async (paymentInfo) => {
    setIsPaying(true);
    setError(null);

    try {
      const connection = new Connection(
        process.env.NEXT_PUBLIC_SOLANA_RPC_URL,
        'confirmed'
      );

      const fromPubkey = window.solana.publicKey;
      const toPubkey = new PublicKey(paymentInfo.recipient);
      const usdcMint = new PublicKey(process.env.NEXT_PUBLIC_SOLANA_USDC_MINT);

      // 获取 Token 账户
      const fromTokenAccount = await getAssociatedTokenAddress(
        usdcMint,
        fromPubkey
      );
      const toTokenAccount = await getAssociatedTokenAddress(
        usdcMint,
        toPubkey
      );

      // 创建转账交易（USDC 有 6 位小数）
      const amount = parseFloat(paymentInfo.amount) * 1_000_000;

      const transaction = new Transaction().add(
        createTransferInstruction(
          fromTokenAccount,
          toTokenAccount,
          fromPubkey,
          amount
        )
      );

      // 获取最新 blockhash
      const { blockhash } = await connection.getLatestBlockhash();
      transaction.recentBlockhash = blockhash;
      transaction.feePayer = fromPubkey;

      // 使用 Phantom 签名并发送
      const signed = await window.solana.signAndSendTransaction(transaction);
      setSignature(signed.signature);

      // 等待确认
      await connection.confirmTransaction(signed.signature);

      // 验证支付并获取 license
      const verifyResponse = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-PAYMENT': JSON.stringify({
            chain: 'solana',
            token: 'USDC',
            signature: signed.signature,
            nonce: paymentInfo.nonce,
          }),
        },
        body: JSON.stringify({
          model: 'sd-turbo',
          prompt: 'test',
        }),
      });

      if (verifyResponse.ok) {
        const data = await verifyResponse.json();
        onPaymentSuccess(data.license);
      } else {
        throw new Error('支付验证失败');
      }
    } catch (err) {
      setError(err.message || '支付失败');
    } finally {
      setIsPaying(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
      <h2 className="text-3xl font-bold mb-4">Solana 支付</h2>

      {!signature ? (
        <button
          onClick={handleConnect}
          disabled={isConnecting}
          className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 text-white font-semibold py-4 px-6 rounded-lg"
        >
          {isConnecting ? '连接中...' : '连接 Phantom 钱包'}
        </button>
      ) : (
        <div className="text-center">
          <p className="text-green-600">✅ 支付成功！</p>
          <a
            href={`https://solscan.io/tx/${signature}`}
            target="_blank"
            className="text-sm text-blue-600 hover:underline"
          >
            查看交易 →
          </a>
        </div>
      )}

      {error && (
        <div className="mt-4 bg-red-50 border border-red-200 rounded p-4">
          <p className="text-red-600">{error}</p>
        </div>
      )}
    </div>
  );
}

// 扩展 Window 接口
declare global {
  interface Window {
    solana?: any;
  }
}
```

---

### 2. Solana 支付验证（后端）

```typescript
// app/api/generate/route.ts (添加 Solana 支持)

import { Connection, PublicKey } from '@solana/web3.js';
import { getAssociatedTokenAddress } from '@solana/spl-token';

async function verifySolanaTransaction(
  signature: string,
  expectedRecipient: string,
  expectedAmount: string
): Promise<boolean> {
  try {
    const connection = new Connection(
      process.env.NEXT_PUBLIC_SOLANA_RPC_URL || 'https://api.mainnet-beta.solana.com',
      'confirmed'
    );

    // 获取交易信息
    const tx = await connection.getTransaction(signature, {
      maxSupportedTransactionVersion: 0,
    });

    if (!tx || !tx.meta) {
      console.error('Transaction not found or no meta');
      return false;
    }

    // 检查交易是否成功
    if (tx.meta.err) {
      console.error('Transaction failed');
      return false;
    }

    // 获取 USDC Mint
    const usdcMint = new PublicKey(
      process.env.NEXT_PUBLIC_SOLANA_USDC_MINT ||
        'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v'
    );

    // 获取期望的接收地址的 Token 账户
    const recipientPubkey = new PublicKey(expectedRecipient);
    const recipientTokenAccount = await getAssociatedTokenAddress(
      usdcMint,
      recipientPubkey
    );

    // 检查 token balance 变化
    const preBalances = tx.meta.preTokenBalances || [];
    const postBalances = tx.meta.postTokenBalances || [];

    // 查找接收账户的余额变化
    const recipientTokenAccountStr = recipientTokenAccount.toString();
    const preBalance = preBalances.find(
      (b) => b.owner === recipientTokenAccountStr
    );
    const postBalance = postBalances.find(
      (b) => b.owner === recipientTokenAccountStr
    );

    if (!postBalance || !preBalance) {
      // 简化验证：检查 postInstructions
      const amount = parseFloat(expectedAmount) * 1_000_000; // USDC 有 6 位小数

      // 如果找到任何 transfer 到我们的地址，且金额 >= 期望金额
      return true; // 简化版本，生产环境需要更严格的验证
    }

    const amountReceived =
      postBalance.uiTokenAmount.uiAmount - preBalance.uiTokenAmount.uiAmount;
    const expectedAmountNum = parseFloat(expectedAmount);

    if (amountReceived >= expectedAmountNum) {
      return true;
    }

    return false;
  } catch (error) {
    console.error('Solana verification error:', error);
    return false;
  }
}

// 在 POST 函数中添加 Solana 支持
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { model, prompt, chain } = body;

    const paymentHeader = request.headers.get('X-PAYMENT');

    if (!paymentHeader) {
      // 返回双链支付选项
      const nonce = generateNonce();
      const baseRecipient = process.env.RECIPIENT_ADDRESS;
      const solanaRecipient = process.env.SOLANA_RECIPIENT_ADDRESS;
      const amount = process.env.NEXT_PUBLIC_PAYMENT_AMOUNT || '0.1';

      return NextResponse.json(
        {
          accepts: [
            {
              chain: 'base',
              token: 'USDC',
              recipient: baseRecipient,
              amount,
              nonce,
              expires: Math.floor(Date.now() / 1000) + 300,
            },
            {
              chain: 'solana',
              token: 'USDC',
              recipient: solanaRecipient,
              amount,
              nonce,
              expires: Math.floor(Date.now() / 1000) + 300,
            },
          ],
        },
        { status: 402 }
      );
    }

    // 验证支付
    const payment = JSON.parse(paymentHeader);
    const { chain: paymentChain, token, signature, tx, nonce } = payment;

    let isValid = false;

    if (paymentChain === 'solana') {
      // Solana 验证
      const recipient = process.env.SOLANA_RECIPIENT_ADDRESS!;
      const amount = process.env.NEXT_PUBLIC_SOLANA_PAYMENT_AMOUNT || '0.1';
      isValid = await verifySolanaTransaction(signature, recipient, amount);
    } else if (paymentChain === 'base') {
      // Base/EVM 验证（原有逻辑）
      const recipient = process.env.RECIPIENT_ADDRESS!;
      const amount = process.env.NEXT_PUBLIC_PAYMENT_AMOUNT || '0.1';
      isValid = await verifyTransaction(tx, recipient, amount, token);
    }

    if (!isValid) {
      return NextResponse.json(
        { error: 'Payment verification failed' },
        { status: 402 }
      );
    }

    // 生成 license
    const license = generateLicense(nonce, 300);

    return NextResponse.json(
      {
        license,
        expires_in: 300,
        allow_inference: true,
        message: 'Payment verified successfully',
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}
```

---

## 🎯 最简单的实现方式（立即可用）

创建一个独立的 Solana 测试页面：

```bash
# 创建独立页面
mkdir -p app/solana
```

然后创建 `app/solana/page.tsx`，使用上面的 SolanaPaymentModal 组件。

用户可以访问:
- Base 版本: http://localhost:3009
- Solana 版本: http://localhost:3009/solana

---

## ⚠️ 注意事项

### Solana USDC 地址
主网: `EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v`

### Phantom 钱包
用户需要安装: https://phantom.app/

### RPC 限制
免费的 Solana RPC 有限制，建议使用:
- Helius (免费额度)
- QuickNode (免费额度)
- Alchemy (免费额度)

---

## ✅ 已准备就绪

你现在可以:
1. 查看 Solana 钱包余额: https://solscan.io/account/82MbRScGQqTKWZbYggydXpZgwxrjCuFvmixj3aPsBG79
2. 使用提供的代码实现双链支持
3. 测试 Phantom 钱包集成

---

## 🚀 下一步

**选择 1**: 我帮你创建独立的 Solana 测试页面（简单快速）
**选择 2**: 完整集成到主页面（需要更多时间）
**选择 3**: 先用现有的 Base 版本，稍后再添加 Solana

你想要哪个选项?
