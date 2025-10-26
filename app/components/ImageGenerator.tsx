'use client';

import { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';

interface ImageGeneratorProps {
  license: string | null;
  onGenerateRequest: () => boolean; // 返回true表示可以继续，false表示需要先支付
  onGenerationComplete: () => void; // 生成完成后的回调（用于清除license）
}

export function ImageGenerator({ license, onGenerateRequest, onGenerationComplete }: ImageGeneratorProps) {
  const { t } = useLanguage();
  const [prompt, setPrompt] = useState('a cat astronaut on the moon');
  const [isLoading, setIsLoading] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [modelLoaded, setModelLoaded] = useState(false);

  // 模拟模型加载 (实际实现需要使用 ONNX Runtime Web 或 Transformers.js)
  useEffect(() => {
    loadModel();
  }, []);

  const loadModel = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // 模拟加载进度
      for (let i = 0; i <= 100; i += 10) {
        setLoadingProgress(i);
        await new Promise((resolve) => setTimeout(resolve, 200));
      }

      // 实际实现：使用 Transformers.js 加载 Stable Diffusion
      // const { pipeline } = await import('@xenova/transformers');
      // const model = await pipeline('text-to-image', 'stabilityai/stable-diffusion-2');

      setModelLoaded(true);
    } catch (err: any) {
      setError('模型加载失败: ' + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const generateImage = async () => {
    if (!prompt.trim()) {
      setError(t('enterPrompt'));
      return;
    }

    // 检查是否有权限生成（是否已支付）
    const canGenerate = onGenerateRequest();
    if (!canGenerate) {
      // 如果返回false，说明需要先支付，会弹出支付模态框
      return;
    }

    setIsLoading(true);
    setError(null);
    setGeneratedImage(null);

    try {
      // 调用真实的 AI 图像生成 API
      const response = await fetch('/api/generate-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Generation failed');
      }

      // 如果是占位符（API token 未配置或模型加载中）
      if (data.isPlaceholder) {
        console.warn('Using placeholder:', data.message);

        // 生成本地 Canvas 占位图像
        const canvas = document.createElement('canvas');
        canvas.width = 512;
        canvas.height = 512;
        const ctx = canvas.getContext('2d');

        if (ctx) {
          // 渐变背景
          const gradient = ctx.createLinearGradient(0, 0, 512, 512);
          gradient.addColorStop(0, '#667eea');
          gradient.addColorStop(1, '#764ba2');
          ctx.fillStyle = gradient;
          ctx.fillRect(0, 0, 512, 512);

          // 添加文本
          ctx.fillStyle = 'white';
          ctx.font = 'bold 24px Arial';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';

          // 提示信息
          ctx.fillText('⚠️ Placeholder Image', 256, 180);
          ctx.font = '16px Arial';
          ctx.fillText('Configure HUGGINGFACE_API_TOKEN', 256, 220);
          ctx.fillText('in .env.local for real AI generation', 256, 245);

          // Prompt (分行显示)
          ctx.font = '16px Arial';
          const words = prompt.split(' ');
          let line = '';
          let y = 290;

          for (let word of words) {
            const testLine = line + word + ' ';
            const metrics = ctx.measureText(testLine);
            if (metrics.width > 450 && line !== '') {
              ctx.fillText(line, 256, y);
              line = word + ' ';
              y += 25;
            } else {
              line = testLine;
            }
          }
          ctx.fillText(line, 256, y);

          // 时间戳
          ctx.font = '14px Arial';
          ctx.fillText(new Date().toLocaleString(), 256, 450);
        }

        const imageDataUrl = canvas.toDataURL('image/png');
        setGeneratedImage(imageDataUrl);
        setError(data.message || 'API token not configured');
      } else {
        // 真实的 AI 生成图像
        setGeneratedImage(data.image);

        // 生成成功后，清除license（单次使用）
        onGenerationComplete();
      }
    } catch (err: any) {
      setError(t('generationFailed') + ': ' + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const downloadImage = () => {
    if (!generatedImage) return;

    try {
      const link = document.createElement('a');
      link.href = generatedImage;
      link.download = `payai402-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error('Download failed:', err);
      setError('Download failed. Please try again.');
    }
  };

  if (!modelLoaded && isLoading) {
    return (
      <div className="max-w-2xl mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
        <div className="text-center">
          <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
            <div className="animate-spin rounded-full h-10 w-10 border-4 border-primary border-t-transparent"></div>
          </div>
          <h2 className="text-2xl font-bold mb-2">{t('loadingModel')}</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            {t('firstLoadNotice')}
          </p>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4 mb-2">
            <div
              className="bg-gradient-to-r from-primary to-secondary h-4 rounded-full transition-all duration-300"
              style={{ width: `${loadingProgress}%` }}
            ></div>
          </div>
          <p className="text-sm text-gray-500">{loadingProgress}%</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Success Badge - 只在支付成功后显示 */}
      {license && (
        <div className="glass-dark border-2 border-green-400/50 rounded-2xl p-6 flex items-center shadow-xl shadow-green-500/20 animate-pulse">
          <svg
            className="w-6 h-6 text-green-600 mr-3"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <div>
            <p className="font-semibold text-green-900 dark:text-green-300">
              {t('paymentSuccess')}
            </p>
            <p className="text-sm text-green-700 dark:text-green-400 mt-1">
              {t('license')}: {license.slice(0, 20)}...
            </p>
          </div>
        </div>
      )}

      {/* Input Area */}
      <div className="glass-dark rounded-3xl shadow-2xl p-10 border border-white/10">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-black bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">{t('imageGenerator')}</h2>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 glass rounded-full border border-purple-500/50 bg-gradient-to-r from-purple-500/10 to-pink-500/10">
            <div className="w-6 h-6 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center text-white font-black text-xs">
              402
            </div>
            <span className="text-xs font-semibold text-gray-300">{t('x402Protocol')}</span>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              {t('promptLabel')}
            </label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder={t('promptPlaceholder')}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary dark:bg-gray-700 resize-none"
              rows={3}
            />
          </div>

          <button
            onClick={generateImage}
            disabled={isLoading || !prompt.trim()}
            className="w-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 hover:from-blue-600 hover:via-purple-600 hover:to-pink-600 disabled:opacity-50 text-white font-bold py-5 px-8 rounded-2xl transition-all duration-300 flex items-center justify-center shadow-xl shadow-purple-500/50 hover:shadow-2xl hover:shadow-purple-500/70 transform hover:scale-105 glow-button"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                {t('generating')}
              </>
            ) : (
              <>
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                {t('generateButton')}
              </>
            )}
          </button>

          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
              <p className="text-red-600 dark:text-red-300 text-sm">{error}</p>
            </div>
          )}
        </div>
      </div>

      {/* Result Area */}
      {generatedImage && (
        <div className="glass-dark rounded-3xl shadow-2xl p-10 border border-white/10 animate-in fade-in duration-500">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-black bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">{t('generationResult')}</h3>
            <button
              onClick={downloadImage}
              className="flex items-center px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white rounded-xl transition-all duration-300 font-bold shadow-lg shadow-green-500/50 hover:shadow-xl hover:shadow-green-500/70 transform hover:scale-105"
            >
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                />
              </svg>
              {t('download')}
            </button>
          </div>

          <div className="rounded-2xl overflow-hidden border-2 border-white/20 shadow-2xl">
            <img
              src={generatedImage}
              alt="Generated"
              className="w-full h-auto hover:scale-105 transition-transform duration-500"
            />
          </div>

          <div className="mt-6 p-6 glass rounded-2xl border border-white/20">
            <p className="text-sm text-gray-600 dark:text-gray-300">
              <strong>{t('prompt')}:</strong> {prompt}
            </p>
          </div>
        </div>
      )}

      {/* Info */}
      <div className="text-center text-sm text-gray-500">
        <p>{t('localProcessing')}</p>
        <p className="mt-1">{t('noUpload')}</p>
      </div>
    </div>
  );
}
