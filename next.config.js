/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer }) => {
    // 支持 WebAssembly (ONNX Runtime 需要)
    config.experiments = {
      ...config.experiments,
      asyncWebAssembly: true,
      layers: true,
    };

    // 处理 onnxruntime-web 的 wasm 文件
    config.module.rules.push({
      test: /\.wasm$/,
      type: 'asset/resource',
    });

    // 客户端优化
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
        crypto: false,
      };
    }

    return config;
  },
  // 允许从 Hugging Face 加载模型
  images: {
    domains: ['huggingface.co'],
  },
};

module.exports = nextConfig;
