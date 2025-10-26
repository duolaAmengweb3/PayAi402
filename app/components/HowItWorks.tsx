'use client';

import { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';

export function HowItWorks() {
  const { t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-8 right-8 z-40 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 hover:from-blue-600 hover:via-purple-600 hover:to-pink-600 text-white font-bold py-4 px-6 rounded-2xl shadow-2xl shadow-purple-500/50 hover:shadow-purple-500/70 transform hover:scale-105 transition-all duration-300 flex items-center gap-2"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        {t('howItWorks')}
      </button>

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
          <div className="max-w-4xl w-full max-h-[90vh] overflow-y-auto glass-dark rounded-3xl shadow-2xl p-10 border border-white/10">
            {/* Header */}
            <div className="flex justify-between items-start mb-8">
              <div>
                <h2 className="text-4xl font-black bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
                  {t('howItWorksTitle')}
                </h2>
                <p className="text-gray-300 text-lg">{t('howItWorksSubtitle')}</p>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-white hover:text-gray-300 transition-colors"
              >
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* x402 Protocol Badge */}
            <div className="mb-8 p-6 glass rounded-2xl border-2 border-purple-500/50 bg-gradient-to-r from-purple-500/10 to-pink-500/10">
              <div className="flex items-center gap-4 mb-3">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center text-white font-black text-xl">
                  402
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">{t('x402Protocol')}</h3>
                  <p className="text-sm text-gray-300">{t('x402ProtocolDesc')}</p>
                </div>
              </div>
            </div>

            {/* Flow Steps */}
            <div className="space-y-6 mb-8">
              {/* Step 1 */}
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center text-white font-black text-lg shadow-lg">
                    1
                  </div>
                </div>
                <div className="flex-1 glass rounded-2xl p-6 border border-white/10">
                  <h4 className="text-xl font-bold text-white mb-2">{t('step1Title')}</h4>
                  <p className="text-gray-300 mb-3">{t('step1Desc')}</p>
                  <div className="bg-black/30 rounded-lg p-3 font-mono text-sm text-green-400">
                    GET /api/generate → <span className="text-red-400">HTTP 402 Payment Required</span>
                  </div>
                </div>
              </div>

              {/* Step 2 */}
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-black text-lg shadow-lg">
                    2
                  </div>
                </div>
                <div className="flex-1 glass rounded-2xl p-6 border border-white/10">
                  <h4 className="text-xl font-bold text-white mb-2">{t('step2Title')}</h4>
                  <p className="text-gray-300 mb-3">{t('step2Desc')}</p>
                  <div className="bg-black/30 rounded-lg p-3 font-mono text-xs text-blue-400 overflow-x-auto">
                    {`{
  "accepts": [{
    "chain": "base",
    "token": "USDC",
    "amount": "1.0",
    "recipient": "0x..."
  }]
}`}
                  </div>
                </div>
              </div>

              {/* Step 3 */}
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-pink-600 rounded-xl flex items-center justify-center text-white font-black text-lg shadow-lg">
                    3
                  </div>
                </div>
                <div className="flex-1 glass rounded-2xl p-6 border border-white/10">
                  <h4 className="text-xl font-bold text-white mb-2">{t('step3Title')}</h4>
                  <p className="text-gray-300 mb-3">{t('step3Desc')}</p>
                  <div className="flex gap-2">
                    <div className="px-3 py-1 bg-blue-500/20 border border-blue-500/50 rounded-lg text-blue-300 text-sm font-semibold">
                      Base (MetaMask)
                    </div>
                    <div className="px-3 py-1 bg-purple-500/20 border border-purple-500/50 rounded-lg text-purple-300 text-sm font-semibold">
                      Solana (Phantom)
                    </div>
                  </div>
                </div>
              </div>

              {/* Step 4 */}
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center text-white font-black text-lg shadow-lg">
                    4
                  </div>
                </div>
                <div className="flex-1 glass rounded-2xl p-6 border border-white/10">
                  <h4 className="text-xl font-bold text-white mb-2">{t('step4Title')}</h4>
                  <p className="text-gray-300 mb-3">{t('step4Desc')}</p>
                  <div className="bg-black/30 rounded-lg p-3 font-mono text-sm text-green-400">
                    X-PAYMENT: {`{"chain":"base","tx":"0x...","nonce":"..."}`}
                  </div>
                </div>
              </div>

              {/* Step 5 */}
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl flex items-center justify-center text-white font-black text-lg shadow-lg">
                    5
                  </div>
                </div>
                <div className="flex-1 glass rounded-2xl p-6 border border-white/10">
                  <h4 className="text-xl font-bold text-white mb-2">{t('step5Title')}</h4>
                  <p className="text-gray-300 mb-3">{t('step5Desc')}</p>
                  <div className="bg-black/30 rounded-lg p-3 font-mono text-sm text-green-400">
                    HTTP 200 OK + <span className="text-yellow-400">License Token</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Why x402 Section */}
            <div className="glass rounded-2xl p-8 border border-white/10 bg-gradient-to-br from-blue-500/5 to-purple-500/5">
              <h3 className="text-2xl font-bold text-white mb-4">{t('whyX402Title')}</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="flex gap-3">
                  <div className="flex-shrink-0">
                    <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-bold text-white mb-1">{t('benefit1Title')}</h4>
                    <p className="text-sm text-gray-300">{t('benefit1Desc')}</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="flex-shrink-0">
                    <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-bold text-white mb-1">{t('benefit2Title')}</h4>
                    <p className="text-sm text-gray-300">{t('benefit2Desc')}</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="flex-shrink-0">
                    <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-bold text-white mb-1">{t('benefit3Title')}</h4>
                    <p className="text-sm text-gray-300">{t('benefit3Desc')}</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="flex-shrink-0">
                    <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-bold text-white mb-1">{t('benefit4Title')}</h4>
                    <p className="text-sm text-gray-300">{t('benefit4Desc')}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="mt-8 pt-6 border-t border-white/10 text-center">
              <p className="text-sm text-gray-400">{t('x402Footer')}</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
