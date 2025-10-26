'use client';

export function BrowserCompatibility() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8">
        <div className="text-center">
          {/* Warning Icon */}
          <div className="mx-auto w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mb-6">
            <svg
              className="w-8 h-8 text-yellow-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>

          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            浏览器不支持 WebGPU
          </h1>

          <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
            此应用需要 WebGPU 支持来运行 AI 模型推理
          </p>

          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6 mb-6 text-left">
            <h2 className="font-semibold text-blue-900 dark:text-blue-300 mb-3">
              推荐使用以下浏览器：
            </h2>
            <ul className="space-y-2 text-blue-800 dark:text-blue-200">
              <li className="flex items-center">
                <span className="mr-2">✓</span>
                <strong>Google Chrome 113+</strong> (桌面版)
              </li>
              <li className="flex items-center">
                <span className="mr-2">✓</span>
                <strong>Microsoft Edge 113+</strong> (桌面版)
              </li>
              <li className="flex items-center">
                <span className="mr-2">✓</span>
                <strong>Brave Browser</strong> (最新版)
              </li>
            </ul>
          </div>

          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 mb-6 text-left">
            <h2 className="font-semibold text-red-900 dark:text-red-300 mb-3">
              不支持的浏览器/环境：
            </h2>
            <ul className="space-y-2 text-red-800 dark:text-red-200">
              <li className="flex items-center">
                <span className="mr-2">✗</span>
                Safari (支持有限)
              </li>
              <li className="flex items-center">
                <span className="mr-2">✗</span>
                移动端浏览器 (iOS/Android)
              </li>
              <li className="flex items-center">
                <span className="mr-2">✗</span>
                Firefox (WebGPU 支持不完整)
              </li>
            </ul>
          </div>

          <a
            href="https://www.google.com/chrome/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-primary hover:bg-primary/90 text-white font-semibold px-8 py-3 rounded-lg transition-colors"
          >
            下载 Google Chrome
          </a>

          <p className="mt-6 text-sm text-gray-500">
            如果你已经在使用支持的浏览器，请确保浏览器已更新到最新版本
          </p>
        </div>
      </div>
    </div>
  );
}
