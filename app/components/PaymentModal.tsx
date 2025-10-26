'use client';

import { useState } from 'react';
import { ethers } from 'ethers';
import { Connection, PublicKey, Transaction } from '@solana/web3.js';
import {
  getAssociatedTokenAddress,
  createTransferInstruction,
  createAssociatedTokenAccountInstruction
} from '@solana/spl-token';
import { useLanguage } from '../contexts/LanguageContext';

interface PaymentModalProps {
  onPaymentSuccess: (license: string) => void;
  selectedChain: 'base' | 'solana';
}

interface PaymentInfo {
  chain: string;
  token: string;
  recipient: string;
  amount: string;
  nonce: string;
  expires: number;
}

export function PaymentModal({ onPaymentSuccess, selectedChain }: PaymentModalProps) {
  const { t } = useLanguage();
  const [isConnecting, setIsConnecting] = useState(false);
  const [isPaying, setIsPaying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [txHash, setTxHash] = useState<string | null>(null);
  const [paymentInfo, setPaymentInfo] = useState<PaymentInfo | null>(null);

  const handleConnect = async () => {
    setIsConnecting(true);
    setError(null);

    try {
      // 根据选择的链检查相应钱包
      if (selectedChain === 'solana') {
        if (!window.solana || !window.solana.isPhantom) {
          throw new Error(t('installPhantom'));
        }
        // 连接 Phantom 钱包
        await window.solana.connect();
      } else {
        // 检查 MetaMask (Base)
        if (!window.ethereum) {
          throw new Error(t('installMetaMask'));
        }
        // 请求连接钱包
        await window.ethereum.request({ method: 'eth_requestAccounts' });
      }

      // 请求支付信息 (402 Payment Required)
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'sd-turbo',
          prompt: 'test',
          chain: selectedChain,
        }),
      });

      if (response.status === 402) {
        const data = await response.json();
        // 找到对应链的支付信息
        const chainPayment = data.accepts.find((a: any) => a.chain === selectedChain);
        if (chainPayment) {
          setPaymentInfo(chainPayment);
        } else {
          throw new Error('未找到支付信息');
        }
      } else {
        throw new Error('获取支付信息失败');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsConnecting(false);
    }
  };

  const handlePay = async () => {
    if (!paymentInfo) return;

    setIsPaying(true);
    setError(null);

    try {
      let transactionId: string;

      if (selectedChain === 'solana') {
        // Solana 支付流程
        const connection = new Connection(
          process.env.NEXT_PUBLIC_SOLANA_RPC_URL || 'https://api.mainnet-beta.solana.com',
          'confirmed'
        );

        const fromPubkey = window.solana.publicKey;
        const toPubkey = new PublicKey(paymentInfo.recipient);
        const usdcMint = new PublicKey(
          process.env.NEXT_PUBLIC_SOLANA_USDC_MINT || 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v'
        );

        // 获取 Token 账户
        const fromTokenAccount = await getAssociatedTokenAddress(usdcMint, fromPubkey);
        const toTokenAccount = await getAssociatedTokenAddress(usdcMint, toPubkey);

        // 检查接收方 Token 账户是否存在
        const toAccountInfo = await connection.getAccountInfo(toTokenAccount);

        // USDC 有 6 位小数
        const amount = parseFloat(paymentInfo.amount) * 1_000_000;

        // 创建转账交易
        const transaction = new Transaction();

        // 如果接收方账户不存在，需要先创建
        if (!toAccountInfo) {
          transaction.add(
            createAssociatedTokenAccountInstruction(
              fromPubkey, // payer
              toTokenAccount, // ata
              toPubkey, // owner
              usdcMint // mint
            )
          );
        }

        // 添加转账指令
        transaction.add(
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
        transactionId = signed.signature;
        setTxHash(transactionId);

        // 等待确认
        await connection.confirmTransaction(transactionId);
      } else {
        // Base/EVM 支付流程
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();

        // USDC 合约地址 (Base 主网)
        const usdcAddress = process.env.NEXT_PUBLIC_USDC_ADDRESS!;

        // USDC ERC20 ABI (只需 transfer 方法)
        const usdcAbi = [
          'function transfer(address to, uint256 amount) returns (bool)',
          'function decimals() view returns (uint8)',
        ];

        const usdcContract = new ethers.Contract(usdcAddress, usdcAbi, signer);

        // USDC 有 6 位小数
        const amount = ethers.parseUnits(paymentInfo.amount, 6);

        // 发送 USDC
        const tx = await usdcContract.transfer(paymentInfo.recipient, amount);
        transactionId = tx.hash;
        setTxHash(transactionId);

        // 等待确认
        await tx.wait();
      }

      // 验证支付并获取 license
      const verifyResponse = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-PAYMENT': JSON.stringify({
            chain: selectedChain,
            token: 'USDC',
            tx: selectedChain === 'base' ? transactionId : undefined,
            signature: selectedChain === 'solana' ? transactionId : undefined,
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
    } catch (err: any) {
      setError(err.message || '支付失败');
    } finally {
      setIsPaying(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto glass-dark rounded-3xl shadow-2xl p-10 border border-white/10 backdrop-blur-xl">
      {/* x402 Protocol Badge */}
      <div className="mb-6 flex justify-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 glass rounded-full border border-purple-500/50 bg-gradient-to-r from-purple-500/10 to-pink-500/10">
          <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center text-white font-black text-sm">
            402
          </div>
          <span className="text-sm font-semibold text-white">{t('x402Protocol')}</span>
        </div>
      </div>

      <div className="text-center mb-10 relative">
        <div className="float-animation mx-auto w-24 h-24 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-3xl flex items-center justify-center mb-6 pulse-glow">
          <svg
            className="w-14 h-14 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
            />
          </svg>
        </div>
        <h2 className="text-4xl font-black bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-3">
          {t('unlockAI')}
        </h2>
        <p className="text-xl text-gray-300 font-semibold">
          {t('payAmount', { amount: process.env.NEXT_PUBLIC_PAYMENT_AMOUNT || '1' })}
        </p>
      </div>

      {/* 402 Status Flow Indicator */}
      {!paymentInfo && (
        <div className="mb-6 glass rounded-2xl p-4 border border-yellow-500/30 bg-yellow-500/5">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 mt-0.5">
              <svg className="w-5 h-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="flex-1">
              <p className="text-sm text-gray-300 mb-2">
                <span className="font-semibold text-yellow-400">Step 1:</span> {t('step1Desc')}
              </p>
              <div className="bg-black/30 rounded-lg p-2 font-mono text-xs text-red-400">
                HTTP 402 Payment Required
              </div>
            </div>
          </div>
        </div>
      )}

      {paymentInfo && (
        <div className="mb-6 glass rounded-2xl p-4 border border-green-500/30 bg-green-500/5">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 mt-0.5">
              <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="flex-1">
              <p className="text-sm text-gray-300">
                <span className="font-semibold text-green-400">Step 2:</span> {t('step2Desc')}
              </p>
            </div>
          </div>
        </div>
      )}

      {!paymentInfo ? (
        <button
          onClick={handleConnect}
          disabled={isConnecting}
          className="w-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 hover:from-blue-600 hover:via-purple-600 hover:to-pink-600 disabled:opacity-50 text-white font-bold py-5 px-8 rounded-2xl transition-all duration-300 flex items-center justify-center shadow-xl shadow-purple-500/50 hover:shadow-2xl hover:shadow-purple-500/70 transform hover:scale-105 glow-button"
        >
          {isConnecting ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
              {t('connecting')}
            </>
          ) : (
            <>
              <svg
                className="w-5 h-5 mr-2"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
              </svg>
              {t('connectWallet', { wallet: selectedChain === 'solana' ? 'Phantom' : 'MetaMask' })}
            </>
          )}
        </button>
      ) : (
        <div className="space-y-6">
          <div className="glass rounded-2xl p-8 space-y-4 border border-white/20">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-300">{t('network')}:</span>
              <span className="font-semibold">{selectedChain === 'solana' ? 'Solana' : 'Base'}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-300">{t('token')}:</span>
              <span className="font-semibold">{paymentInfo.token}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-300">{t('amount')}:</span>
              <span className="font-semibold">{paymentInfo.amount} USDC</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-300">{t('recipient')}:</span>
              <span className="font-mono text-xs">
                {paymentInfo.recipient.slice(0, 6)}...{paymentInfo.recipient.slice(-4)}
              </span>
            </div>
          </div>

          <button
            onClick={handlePay}
            disabled={isPaying}
            className="w-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 hover:from-blue-600 hover:via-purple-600 hover:to-pink-600 disabled:opacity-50 text-white font-bold py-5 px-8 rounded-2xl transition-all duration-300 shadow-xl shadow-purple-500/50 hover:shadow-2xl hover:shadow-purple-500/70 transform hover:scale-105 glow-button"
          >
            {isPaying ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white inline-block mr-2"></div>
                {txHash ? t('waitingConfirm') : t('paying')}
              </>
            ) : (
              t('payNow', { amount: paymentInfo.amount })
            )}
          </button>

          {txHash && (
            <div className="text-center text-sm">
              <a
                href={
                  selectedChain === 'solana'
                    ? `https://solscan.io/tx/${txHash}`
                    : `https://basescan.org/tx/${txHash}`
                }
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                {t('viewTransaction')}
              </a>
            </div>
          )}
        </div>
      )}

      {error && (
        <div className="mt-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <p className="text-red-600 dark:text-red-300 text-sm">{error}</p>
        </div>
      )}

      <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700 text-center text-sm text-gray-500">
        <p>{t('paymentProtocol')}</p>
        <p className="mt-1">{t('localInference')}</p>
      </div>
    </div>
  );
}

// 扩展 Window 接口以支持 ethereum 和 solana
declare global {
  interface Window {
    ethereum?: any;
    solana?: any;
  }
}
