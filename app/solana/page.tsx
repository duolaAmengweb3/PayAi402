'use client';

import { useState } from 'react';

export default function SolanaPage() {
  const [step, setStep] = useState(1);

  return (
    <main className="min-h-screen p-8 bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-900 dark:to-purple-900">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <header className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-purple-600 text-white px-4 py-2 rounded-full text-sm font-semibold">
              SOLANA NETWORK
            </div>
          </div>
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            PayAI402 Solana
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Pay with USDC on Solana → Generate AI Images
          </p>
          <p className="text-sm text-purple-600 dark:text-purple-400 mt-2">
            Powered by x402 Protocol + Phantom Wallet
          </p>
        </header>

        {/* Network Info */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 mb-8">
          <h2 className="text-2xl font-bold mb-6 flex items-center">
            <span className="mr-3">🌐</span>
            网络配置
          </h2>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
              <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                网络
              </div>
              <div className="font-semibold text-purple-600">Solana 主网</div>
            </div>

            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
              <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                代币
              </div>
              <div className="font-semibold text-blue-600">USDC (SPL Token)</div>
            </div>

            <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
              <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                支付金额
              </div>
              <div className="font-semibold text-green-600">
                {process.env.NEXT_PUBLIC_SOLANA_PAYMENT_AMOUNT || '0.1'} USDC
              </div>
            </div>

            <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg">
              <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                钱包
              </div>
              <div className="font-semibold text-orange-600">Phantom</div>
            </div>
          </div>
        </div>

        {/* Wallet Info */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 mb-8">
          <h2 className="text-2xl font-bold mb-4">💰 收款地址</h2>
          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg font-mono text-sm break-all">
            82MbRScGQqTKWZbYggydXpZgwxrjCuFvmixj3aPsBG79
          </div>
          <a
            href="https://solscan.io/account/82MbRScGQqTKWZbYggydXpZgwxrjCuFvmixj3aPsBG79"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-purple-600 hover:underline mt-2 inline-block"
          >
            在 Solscan 查看 →
          </a>
        </div>

        {/* Setup Instructions */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 mb-8">
          <h2 className="text-2xl font-bold mb-6">🚀 使用指南</h2>

          <div className="space-y-6">
            {/* Step 1 */}
            <div className="flex">
              <div className="flex-shrink-0 w-10 h-10 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center text-purple-600 font-bold mr-4">
                1
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-lg mb-2">安装 Phantom 钱包</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-3">
                  Phantom 是 Solana 生态最流行的钱包插件
                </p>
                <a
                  href="https://phantom.app/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg transition-colors"
                >
                  下载 Phantom
                </a>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex">
              <div className="flex-shrink-0 w-10 h-10 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center text-purple-600 font-bold mr-4">
                2
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-lg mb-2">获取 USDC</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  确保你的 Phantom 钱包中有足够的 USDC（至少 0.1 USDC）
                </p>
                <p className="text-sm text-gray-500 mt-2">
                  💡 提示：你可以从交易所（如 Binance、OKX）提取 USDC 到 Solana 网络
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex">
              <div className="flex-shrink-0 w-10 h-10 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center text-purple-600 font-bold mr-4">
                3
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-lg mb-2">完整功能即将推出</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Solana 支付集成正在开发中
                </p>
                <div className="mt-3 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                  <p className="text-sm text-blue-800 dark:text-blue-200">
                    <strong>当前状态：</strong> 基础设施已就绪
                  </p>
                  <ul className="text-sm text-blue-700 dark:text-blue-300 mt-2 space-y-1">
                    <li>✅ Solana 钱包已生成</li>
                    <li>✅ 依赖包已安装</li>
                    <li>✅ 环境变量已配置</li>
                    <li>⏳ UI 组件开发中</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Technical Details */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 mb-8">
          <h2 className="text-2xl font-bold mb-4">🔧 技术详情</h2>

          <div className="space-y-4 text-sm">
            <div>
              <strong className="text-purple-600">USDC Mint 地址:</strong>
              <div className="font-mono bg-gray-50 dark:bg-gray-700 p-2 rounded mt-1 break-all">
                EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v
              </div>
            </div>

            <div>
              <strong className="text-purple-600">RPC 端点:</strong>
              <div className="font-mono bg-gray-50 dark:bg-gray-700 p-2 rounded mt-1">
                {process.env.NEXT_PUBLIC_SOLANA_RPC_URL || 'https://api.mainnet-beta.solana.com'}
              </div>
            </div>

            <div>
              <strong className="text-purple-600">实现文档:</strong>
              <p className="mt-1">
                查看项目根目录的 <code className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">SOLANA_INTEGRATION.md</code> 获取完整的实现指南
              </p>
            </div>
          </div>
        </div>

        {/* Compare Networks */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
          <h2 className="text-2xl font-bold mb-6">⚖️ Base vs Solana</h2>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b dark:border-gray-700">
                  <th className="text-left py-3 px-4">特性</th>
                  <th className="text-left py-3 px-4">Base (EVM)</th>
                  <th className="text-left py-3 px-4">Solana</th>
                </tr>
              </thead>
              <tbody className="divide-y dark:divide-gray-700">
                <tr>
                  <td className="py-3 px-4 font-semibold">交易速度</td>
                  <td className="py-3 px-4">~2 秒</td>
                  <td className="py-3 px-4 text-green-600">~0.4 秒 ✨</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-semibold">Gas 费</td>
                  <td className="py-3 px-4">~$0.01</td>
                  <td className="py-3 px-4 text-green-600">~$0.0001 ✨</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-semibold">钱包</td>
                  <td className="py-3 px-4">MetaMask</td>
                  <td className="py-3 px-4">Phantom</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-semibold">当前状态</td>
                  <td className="py-3 px-4">
                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">
                      ✅ 已部署
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs">
                      ⏳ 开发中
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="mt-6 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
            <p className="text-sm text-purple-800 dark:text-purple-200">
              💡 <strong>提示:</strong> 两条链都将支持，用户可自由选择使用 Base 或 Solana 支付
            </p>
          </div>
        </div>

        {/* Navigation */}
        <div className="mt-8 flex gap-4">
          <a
            href="/"
            className="flex-1 text-center bg-gray-600 hover:bg-gray-700 text-white font-semibold px-6 py-3 rounded-lg transition-colors"
          >
            ← 返回 Base 版本
          </a>
          <a
            href="/test"
            className="flex-1 text-center bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg transition-colors"
          >
            测试页面 →
          </a>
        </div>
      </div>
    </main>
  );
}
