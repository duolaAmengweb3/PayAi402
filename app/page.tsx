'use client';

import { useState, useEffect } from 'react';
import { BrowserCompatibility } from './components/BrowserCompatibility';
import { PaymentModal } from './components/PaymentModal';
import { ImageGenerator } from './components/ImageGenerator';
import { LanguageSwitcher } from './components/LanguageSwitcher';
import { HowItWorks } from './components/HowItWorks';
import { SocialLinks } from './components/SocialLinks';
import { useLanguage } from './contexts/LanguageContext';

type Chain = 'base' | 'solana';

export default function Home() {
  const { t } = useLanguage();
  const [isCompatible, setIsCompatible] = useState<boolean | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [license, setLicense] = useState<string | null>(null);
  const [selectedChain, setSelectedChain] = useState<Chain>('base');

  useEffect(() => {
    // 检测 WebGPU 支持
    const checkCompatibility = async () => {
      if (!navigator.gpu) {
        setIsCompatible(false);
        return;
      }
      try {
        const adapter = await navigator.gpu.requestAdapter();
        setIsCompatible(!!adapter);
      } catch {
        setIsCompatible(false);
      }
    };
    checkCompatibility();
  }, []);

  const handlePaymentSuccess = (licenseToken: string) => {
    setLicense(licenseToken);
    setShowPaymentModal(false);
  };

  const handleGenerateRequest = () => {
    // 用户点击生成时，检查是否有license
    if (!license) {
      setShowPaymentModal(true);
      return false; // 返回false表示需要先支付
    }
    return true; // 返回true表示可以继续生成
  };

  const handleGenerationComplete = () => {
    // 生成完成后，清除license（单次使用）
    setLicense(null);
  };

  if (isCompatible === null) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">检测浏览器兼容性...</p>
        </div>
      </div>
    );
  }

  if (!isCompatible) {
    return <BrowserCompatibility />;
  }

  return (
    <main className="min-h-screen p-8 relative z-10">
      <SocialLinks />
      <LanguageSwitcher />
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <header className="text-center mb-16 relative">
          <div className="float-animation inline-block mb-6">
            <div className="w-20 h-20 mx-auto rounded-2xl shadow-2xl pulse-glow overflow-hidden">
              <img
                src="/logoduolai.png"
                alt="PayAI402 Logo"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          <h1 className="text-6xl md:text-7xl font-black mb-6 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent drop-shadow-2xl">
            {t('title')}
          </h1>
          <p className="text-2xl md:text-3xl font-semibold text-transparent bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text mb-4">
            {t('subtitle')}
          </p>
          <p className="text-sm text-gray-400 dark:text-gray-500 font-medium tracking-wide">
            {t('poweredBy')}
          </p>

          {/* Decorative elements */}
          <div className="absolute -top-10 left-1/4 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
          <div className="absolute -top-10 right-1/4 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{animationDelay: '1s'}}></div>
        </header>

        {/* Main Content - 始终显示生成器 */}
        <ImageGenerator
          license={license}
          onGenerateRequest={handleGenerateRequest}
          onGenerationComplete={handleGenerationComplete}
        />

        {/* Payment Modal - 只在需要时弹出 */}
        {showPaymentModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="max-w-4xl w-full">
              {/* Close Button */}
              <div className="flex justify-end mb-4">
                <button
                  onClick={() => setShowPaymentModal(false)}
                  className="text-white hover:text-gray-300 transition-colors"
                >
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Network Selector */}
              <div className="glass-dark rounded-2xl shadow-2xl p-8 mb-6 border border-white/10">
                <h3 className="text-2xl font-bold mb-6 text-center bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">{t('selectNetwork')}</h3>
                <div className="grid grid-cols-2 gap-6">
                  <button
                    onClick={() => setSelectedChain('base')}
                    className={`group p-6 rounded-2xl border-2 transition-all duration-300 transform hover:scale-105 ${
                      selectedChain === 'base'
                        ? 'border-blue-500 bg-gradient-to-br from-blue-500/20 to-blue-600/20 shadow-xl shadow-blue-500/50'
                        : 'border-white/10 bg-white/5 hover:border-blue-400/50 hover:bg-white/10'
                    }`}
                  >
                    <div className="flex items-center justify-center mb-4">
                      <div className={`w-16 h-16 rounded-2xl ${selectedChain === 'base' ? 'bg-gradient-to-br from-blue-500 to-blue-600' : 'bg-gradient-to-br from-gray-600 to-gray-700'} flex items-center justify-center text-white font-black text-2xl shadow-lg transition-transform group-hover:rotate-6`}>
                        B
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="font-bold text-lg text-white mb-2">{t('baseChain')}</div>
                      <div className="text-sm text-gray-300 mb-2">
                        MetaMask
                      </div>
                      <div className="inline-block px-3 py-1 bg-white/10 rounded-full text-xs text-gray-300 font-medium">
                        ~2s · $0.01 gas
                      </div>
                    </div>
                  </button>

                  <button
                    onClick={() => setSelectedChain('solana')}
                    className={`group p-6 rounded-2xl border-2 transition-all duration-300 transform hover:scale-105 ${
                      selectedChain === 'solana'
                        ? 'border-purple-500 bg-gradient-to-br from-purple-500/20 to-purple-600/20 shadow-xl shadow-purple-500/50'
                        : 'border-white/10 bg-white/5 hover:border-purple-400/50 hover:bg-white/10'
                    }`}
                  >
                    <div className="flex items-center justify-center mb-4">
                      <div className={`w-16 h-16 rounded-2xl ${selectedChain === 'solana' ? 'bg-gradient-to-br from-purple-500 to-purple-600' : 'bg-gradient-to-br from-gray-600 to-gray-700'} flex items-center justify-center text-white font-black text-2xl shadow-lg transition-transform group-hover:rotate-6`}>
                        S
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="font-bold text-lg text-white mb-2">{t('solanaChain')}</div>
                      <div className="text-sm text-gray-300 mb-2">
                        Phantom
                      </div>
                      <div className="inline-block px-3 py-1 bg-white/10 rounded-full text-xs text-gray-300 font-medium">
                        ~0.4s · $0.0001 gas
                      </div>
                    </div>
                  </button>
                </div>
              </div>

              {/* Payment Modal */}
              <PaymentModal
                onPaymentSuccess={handlePaymentSuccess}
                selectedChain={selectedChain}
              />
            </div>
          </div>
        )}

        {/* Footer */}
        <footer className="mt-16 space-y-6">
          {/* x402 Protocol Explanation */}
          <div className="glass-dark rounded-2xl p-8 border border-purple-500/30 bg-gradient-to-r from-purple-500/5 to-pink-500/5">
            <div className="flex items-start gap-4 mb-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center text-white font-black text-lg shadow-lg">
                  402
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-white mb-2">{t('x402Protocol')}</h3>
                <p className="text-gray-300 text-sm leading-relaxed">
                  {t('x402ProtocolDesc')}
                </p>
              </div>
            </div>
            <div className="grid md:grid-cols-3 gap-4 text-sm">
              <div className="glass rounded-xl p-4 border border-white/10">
                <div className="flex items-center gap-2 mb-2">
                  <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="font-semibold text-white">{t('benefit1Title')}</span>
                </div>
                <p className="text-gray-400 text-xs">{t('benefit1Desc')}</p>
              </div>
              <div className="glass rounded-xl p-4 border border-white/10">
                <div className="flex items-center gap-2 mb-2">
                  <svg className="w-4 h-4 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="font-semibold text-white">{t('benefit2Title')}</span>
                </div>
                <p className="text-gray-400 text-xs">{t('benefit2Desc')}</p>
              </div>
              <div className="glass rounded-xl p-4 border border-white/10">
                <div className="flex items-center gap-2 mb-2">
                  <svg className="w-4 h-4 text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="font-semibold text-white">{t('benefit3Title')}</span>
                </div>
                <p className="text-gray-400 text-xs">{t('benefit3Desc')}</p>
              </div>
            </div>
          </div>

          {/* Original Footer */}
          <div className="text-center text-sm text-gray-500">
            <p>{t('localProcessing')}</p>
            <p className="mt-2">
              {t('builtWith')}
            </p>
          </div>
        </footer>
      </div>

      {/* How It Works Floating Button */}
      <HowItWorks />
    </main>
  );
}
