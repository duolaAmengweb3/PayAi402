'use client';

import { useState, useEffect } from 'react';

interface TestResult {
  name: string;
  status: 'pending' | 'running' | 'passed' | 'failed';
  message: string;
  details?: string;
}

export default function TestPage() {
  const [tests, setTests] = useState<TestResult[]>([
    { name: 'WebGPU 支持检测', status: 'pending', message: '等待测试...' },
    { name: '环境变量加载', status: 'pending', message: '等待测试...' },
    { name: 'API 端点 (402 响应)', status: 'pending', message: '等待测试...' },
    { name: 'USDC 合约地址验证', status: 'pending', message: '等待测试...' },
    { name: '支付金额配置', status: 'pending', message: '等待测试...' },
    { name: '钱包地址格式验证', status: 'pending', message: '等待测试...' },
    { name: 'Nonce 生成唯一性', status: 'pending', message: '等待测试...' },
  ]);

  const [isRunning, setIsRunning] = useState(false);

  const updateTest = (index: number, updates: Partial<TestResult>) => {
    setTests((prev) =>
      prev.map((test, i) => (i === index ? { ...test, ...updates } : test))
    );
  };

  const runAllTests = async () => {
    setIsRunning(true);

    // Test 1: WebGPU Support
    updateTest(0, { status: 'running', message: '检测中...' });
    await new Promise((resolve) => setTimeout(resolve, 500));

    if (!navigator.gpu) {
      updateTest(0, {
        status: 'failed',
        message: '❌ WebGPU 不支持',
        details: '当前浏览器不支持 WebGPU，请使用 Chrome 113+ 或 Edge 113+',
      });
    } else {
      try {
        const adapter = await navigator.gpu.requestAdapter();
        if (adapter) {
          updateTest(0, {
            status: 'passed',
            message: '✅ WebGPU 支持正常',
            details: `Adapter: ${adapter.info?.vendor || 'Unknown'}`,
          });
        } else {
          updateTest(0, {
            status: 'failed',
            message: '❌ 无法获取 GPU Adapter',
          });
        }
      } catch (error: any) {
        updateTest(0, {
          status: 'failed',
          message: '❌ WebGPU 初始化失败',
          details: error.message,
        });
      }
    }

    // Test 2: Environment Variables
    updateTest(1, { status: 'running', message: '检查中...' });
    await new Promise((resolve) => setTimeout(resolve, 300));

    const requiredEnvVars = [
      'NEXT_PUBLIC_CHAIN_ID',
      'NEXT_PUBLIC_RPC_URL',
      'NEXT_PUBLIC_USDC_ADDRESS',
      'NEXT_PUBLIC_PAYMENT_AMOUNT',
    ];

    const missingVars = requiredEnvVars.filter(
      (key) => !process.env[key]
    );

    if (missingVars.length > 0) {
      updateTest(1, {
        status: 'failed',
        message: '❌ 环境变量缺失',
        details: `缺失: ${missingVars.join(', ')}`,
      });
    } else {
      updateTest(1, {
        status: 'passed',
        message: '✅ 所有环境变量已配置',
        details: `Chain ID: ${process.env.NEXT_PUBLIC_CHAIN_ID}`,
      });
    }

    // Test 3: API Endpoint (402 Response)
    updateTest(2, { status: 'running', message: '测试中...' });
    await new Promise((resolve) => setTimeout(resolve, 300));

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'sd-turbo',
          prompt: 'test',
        }),
      });

      if (response.status === 402) {
        const data = await response.json();
        if (data.accepts && data.accepts[0]) {
          updateTest(2, {
            status: 'passed',
            message: '✅ API 返回 402 响应正常',
            details: `Nonce: ${data.accepts[0].nonce.slice(0, 16)}...`,
          });

          // Store data for next tests
          (window as any).__testPaymentInfo = data.accepts[0];
        } else {
          updateTest(2, {
            status: 'failed',
            message: '❌ 402 响应格式错误',
            details: '缺少 accepts 数组',
          });
        }
      } else {
        updateTest(2, {
          status: 'failed',
          message: `❌ API 返回错误状态码: ${response.status}`,
          details: await response.text(),
        });
      }
    } catch (error: any) {
      updateTest(2, {
        status: 'failed',
        message: '❌ API 请求失败',
        details: error.message,
      });
    }

    // Test 4: USDC Contract Address
    updateTest(3, { status: 'running', message: '验证中...' });
    await new Promise((resolve) => setTimeout(resolve, 300));

    const usdcAddress = process.env.NEXT_PUBLIC_USDC_ADDRESS;
    const expectedUsdcAddress = '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913';

    if (usdcAddress?.toLowerCase() === expectedUsdcAddress.toLowerCase()) {
      updateTest(3, {
        status: 'passed',
        message: '✅ USDC 合约地址正确',
        details: `Base 主网 USDC: ${usdcAddress}`,
      });
    } else {
      updateTest(3, {
        status: 'failed',
        message: '❌ USDC 合约地址错误',
        details: `当前: ${usdcAddress}, 应为: ${expectedUsdcAddress}`,
      });
    }

    // Test 5: Payment Amount
    updateTest(4, { status: 'running', message: '检查中...' });
    await new Promise((resolve) => setTimeout(resolve, 300));

    const amount = process.env.NEXT_PUBLIC_PAYMENT_AMOUNT;
    const parsedAmount = parseFloat(amount || '0');

    if (parsedAmount > 0 && parsedAmount <= 1) {
      updateTest(4, {
        status: 'passed',
        message: '✅ 支付金额配置合理',
        details: `${amount} USDC`,
      });
    } else if (parsedAmount > 1) {
      updateTest(4, {
        status: 'failed',
        message: '⚠️ 支付金额过高',
        details: `${amount} USDC 可能导致用户流失`,
      });
    } else {
      updateTest(4, {
        status: 'failed',
        message: '❌ 支付金额无效',
        details: `当前值: ${amount}`,
      });
    }

    // Test 6: Wallet Address Format
    updateTest(5, { status: 'running', message: '验证中...' });
    await new Promise((resolve) => setTimeout(resolve, 300));

    const paymentInfo = (window as any).__testPaymentInfo;
    if (paymentInfo && paymentInfo.recipient) {
      const addressRegex = /^0x[a-fA-F0-9]{40}$/;
      if (addressRegex.test(paymentInfo.recipient)) {
        updateTest(5, {
          status: 'passed',
          message: '✅ 钱包地址格式正确',
          details: `${paymentInfo.recipient.slice(0, 10)}...${paymentInfo.recipient.slice(-8)}`,
        });
      } else {
        updateTest(5, {
          status: 'failed',
          message: '❌ 钱包地址格式错误',
          details: paymentInfo.recipient,
        });
      }
    } else {
      updateTest(5, {
        status: 'failed',
        message: '❌ 无法获取钱包地址',
        details: '402 响应中缺少 recipient',
      });
    }

    // Test 7: Nonce Uniqueness
    updateTest(6, { status: 'running', message: '测试中...' });
    await new Promise((resolve) => setTimeout(resolve, 300));

    try {
      const nonces = new Set<string>();
      let allUnique = true;

      // Request 5 times to check nonce uniqueness
      for (let i = 0; i < 5; i++) {
        const response = await fetch('/api/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ model: 'sd-turbo', prompt: 'test' }),
        });

        if (response.status === 402) {
          const data = await response.json();
          const nonce = data.accepts[0].nonce;
          if (nonces.has(nonce)) {
            allUnique = false;
            break;
          }
          nonces.add(nonce);
        }
      }

      if (allUnique && nonces.size === 5) {
        updateTest(6, {
          status: 'passed',
          message: '✅ Nonce 生成唯一性正常',
          details: `5 个请求生成了 5 个唯一 nonce`,
        });
      } else {
        updateTest(6, {
          status: 'failed',
          message: '❌ Nonce 重复',
          details: `生成了 ${nonces.size}/5 个唯一值`,
        });
      }
    } catch (error: any) {
      updateTest(6, {
        status: 'failed',
        message: '❌ Nonce 测试失败',
        details: error.message,
      });
    }

    setIsRunning(false);
  };

  const passedCount = tests.filter((t) => t.status === 'passed').length;
  const failedCount = tests.filter((t) => t.status === 'failed').length;
  const totalCount = tests.length;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            PayAI402 测试套件
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            验证所有核心功能和配置
          </p>
        </div>

        {/* Summary */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-semibold">测试摘要</h2>
            <button
              onClick={runAllTests}
              disabled={isRunning}
              className="bg-primary hover:bg-primary/90 disabled:bg-gray-400 text-white font-semibold px-6 py-2 rounded-lg transition-colors"
            >
              {isRunning ? '测试中...' : '运行所有测试'}
            </button>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
              <div className="text-3xl font-bold text-green-600">
                {passedCount}
              </div>
              <div className="text-sm text-green-700 dark:text-green-400">
                通过
              </div>
            </div>
            <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg">
              <div className="text-3xl font-bold text-red-600">
                {failedCount}
              </div>
              <div className="text-sm text-red-700 dark:text-red-400">
                失败
              </div>
            </div>
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
              <div className="text-3xl font-bold text-blue-600">
                {totalCount}
              </div>
              <div className="text-sm text-blue-700 dark:text-blue-400">
                总计
              </div>
            </div>
          </div>
        </div>

        {/* Test Results */}
        <div className="space-y-4">
          {tests.map((test, index) => (
            <div
              key={index}
              className="bg-white dark:bg-gray-800 rounded-lg shadow p-6"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center mb-2">
                    <StatusIcon status={test.status} />
                    <h3 className="text-lg font-semibold ml-3">
                      {test.name}
                    </h3>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 ml-9">
                    {test.message}
                  </p>
                  {test.details && (
                    <div className="mt-2 ml-9 p-3 bg-gray-50 dark:bg-gray-700 rounded text-sm font-mono">
                      {test.details}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="mt-8 flex gap-4">
          <a
            href="/"
            className="flex-1 text-center bg-gray-600 hover:bg-gray-700 text-white font-semibold px-6 py-3 rounded-lg transition-colors"
          >
            返回主页
          </a>
          <button
            onClick={() => window.location.reload()}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg transition-colors"
          >
            重新测试
          </button>
        </div>
      </div>
    </div>
  );
}

function StatusIcon({ status }: { status: TestResult['status'] }) {
  switch (status) {
    case 'pending':
      return (
        <div className="w-6 h-6 border-2 border-gray-300 rounded-full"></div>
      );
    case 'running':
      return (
        <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      );
    case 'passed':
      return (
        <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
          <svg
            className="w-4 h-4 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
      );
    case 'failed':
      return (
        <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
          <svg
            className="w-4 h-4 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </div>
      );
  }
}
