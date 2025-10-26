export const translations = {
  en: {
    // Header
    title: 'PayAI402',
    subtitle: 'Pay with USDC → Generate AI Images',
    poweredBy: 'Powered by x402 Protocol + WebGPU Stable Diffusion',

    // Browser Compatibility
    browserNotSupported: 'Browser Not Supported',
    webgpuRequired: 'This app requires WebGPU support to run AI inference locally in your browser.',
    supportedBrowsers: 'Supported Browsers',
    chromeVersion: 'Chrome 113+',
    edgeVersion: 'Edge 113+',
    operaVersion: 'Opera 99+',
    howToEnable: 'How to enable WebGPU',
    enableSteps: [
      'Open chrome://flags',
      'Search for "WebGPU"',
      'Enable "Unsafe WebGPU"',
      'Restart browser'
    ],
    learnMore: 'Learn more about WebGPU',

    // Payment Modal
    unlockAI: 'Pay to Generate One AI Image',
    payAmount: 'Pay {amount} USDC per image',
    connectWallet: 'Connect {wallet} Wallet',
    connecting: 'Connecting...',
    paying: 'Paying...',
    waitingConfirm: 'Waiting for confirmation...',
    payNow: 'Pay {amount} USDC',
    viewTransaction: 'View Transaction →',
    network: 'Network',
    token: 'Token',
    amount: 'Amount',
    recipient: 'Recipient Address',
    paymentProtocol: 'Using x402 protocol for payment verification',
    localInference: 'All AI inference runs locally in your browser',

    // Network Selection
    selectNetwork: 'Select Payment Network',
    baseChain: 'Base (EVM)',
    solanaChain: 'Solana',

    // Image Generator
    paymentSuccess: 'Payment Successful! You can generate ONE image',
    license: 'License',
    imageGenerator: 'Image Generator',
    promptLabel: 'Describe the image you want (English)',
    promptPlaceholder: 'e.g., a futuristic city at sunset, cyberpunk style',
    generateButton: 'Generate Image',
    generating: 'Generating... (about 30-60 seconds)',
    generationResult: 'Generation Result',
    download: 'Download',
    prompt: 'Prompt',
    loadingModel: 'Loading AI Model...',
    firstLoadNotice: 'First load requires downloading about 2GB model file',

    // Errors
    enterPrompt: 'Please enter an image description',
    modelLoadFailed: 'Model loading failed',
    generationFailed: 'Generation failed',
    installMetaMask: 'Please install MetaMask wallet',
    installPhantom: 'Please install Phantom wallet',
    fetchPaymentFailed: 'Failed to fetch payment information',
    paymentFailed: 'Payment failed',
    verificationFailed: 'Payment verification failed',

    // Footer
    localProcessing: 'All inference runs locally in your browser. No server costs.',
    builtWith: 'Built with Next.js + WebGPU + x402 Protocol',
    noUpload: 'Generated images are not uploaded to any server',

    // Language
    language: 'Language',
    english: 'English',
    chinese: '中文',

    // How It Works Modal
    howItWorks: 'How It Works',
    howItWorksTitle: 'How x402 Protocol Works',
    howItWorksSubtitle: 'Understanding the decentralized payment verification flow',
    x402Protocol: 'x402 Payment Protocol',
    x402ProtocolDesc: 'HTTP 402 Payment Required - A standardized protocol for pay-per-use APIs',

    step1Title: 'Request Resource (402 Response)',
    step1Desc: 'Your browser requests AI generation. Server returns HTTP 402 Payment Required status code with payment details.',

    step2Title: 'Receive Payment Instructions',
    step2Desc: 'The 402 response includes blockchain payment details: supported chains, token types, amounts, and recipient addresses.',

    step3Title: 'Make On-Chain Payment',
    step3Desc: 'You pay 1 USDC on-chain using your preferred wallet. Payment is verified on blockchain - completely trustless.',

    step4Title: 'Submit Payment Proof',
    step4Desc: 'Your transaction hash is sent in the X-PAYMENT header. Server verifies the payment on-chain.',

    step5Title: 'Access Granted',
    step5Desc: 'After on-chain verification, server issues a single-use license token. You can now generate one image.',

    whyX402Title: 'Why x402 Protocol Matters',
    benefit1Title: 'Decentralized Verification',
    benefit1Desc: 'Payment verified directly on blockchain - no centralized payment processor needed',
    benefit2Title: 'Standardized Protocol',
    benefit2Desc: 'HTTP 402 is a web standard, making micropayments native to the web',
    benefit3Title: 'Multi-Chain Support',
    benefit3Desc: 'Works with any blockchain (Base, Solana, etc.) - truly chain-agnostic',
    benefit4Title: 'Trustless & Transparent',
    benefit4Desc: 'All transactions verifiable on-chain - no trust required in intermediaries',
    x402Footer: 'This is a demo showcasing x402 protocol for decentralized pay-per-use APIs',
  },
  zh: {
    // Header
    title: 'PayAI402',
    subtitle: '支付 USDC → 生成 AI 图像',
    poweredBy: '基于 x402 协议 + WebGPU Stable Diffusion',

    // Browser Compatibility
    browserNotSupported: '浏览器不支持',
    webgpuRequired: '此应用需要 WebGPU 支持才能在浏览器中本地运行 AI 推理。',
    supportedBrowsers: '支持的浏览器',
    chromeVersion: 'Chrome 113+',
    edgeVersion: 'Edge 113+',
    operaVersion: 'Opera 99+',
    howToEnable: '如何启用 WebGPU',
    enableSteps: [
      '打开 chrome://flags',
      '搜索 "WebGPU"',
      '启用 "Unsafe WebGPU"',
      '重启浏览器'
    ],
    learnMore: '了解更多关于 WebGPU',

    // Payment Modal
    unlockAI: '支付生成一张 AI 图像',
    payAmount: '每张图片 {amount} USDC',
    connectWallet: '连接 {wallet} 钱包',
    connecting: '连接中...',
    paying: '支付中...',
    waitingConfirm: '等待确认...',
    payNow: '支付 {amount} USDC',
    viewTransaction: '查看交易记录 →',
    network: '网络',
    token: '代币',
    amount: '金额',
    recipient: '收款地址',
    paymentProtocol: '使用 x402 协议进行支付验证',
    localInference: '所有 AI 推理在你的浏览器本地运行',

    // Network Selection
    selectNetwork: '选择支付网络',
    baseChain: 'Base (EVM)',
    solanaChain: 'Solana',

    // Image Generator
    paymentSuccess: '支付成功！可以生成一张图像',
    license: 'License',
    imageGenerator: '图像生成器',
    promptLabel: '描述你想要的图像 (英文)',
    promptPlaceholder: '例如: a futuristic city at sunset, cyberpunk style',
    generateButton: '生成图像',
    generating: '生成中... (约 30-60 秒)',
    generationResult: '生成结果',
    download: '下载',
    prompt: 'Prompt',
    loadingModel: '加载 AI 模型中...',
    firstLoadNotice: '首次加载需要下载约 2GB 模型文件',

    // Errors
    enterPrompt: '请输入图像描述',
    modelLoadFailed: '模型加载失败',
    generationFailed: '生成失败',
    installMetaMask: '请安装 MetaMask 钱包',
    installPhantom: '请安装 Phantom 钱包',
    fetchPaymentFailed: '获取支付信息失败',
    paymentFailed: '支付失败',
    verificationFailed: '支付验证失败',

    // Footer
    localProcessing: '所有推理运行在你的浏览器本地，无服务器成本。',
    builtWith: '使用 Next.js + WebGPU + x402 协议构建',
    noUpload: '生成的图像不会上传到任何服务器',

    // Language
    language: '语言',
    english: 'English',
    chinese: '中文',

    // How It Works Modal
    howItWorks: '工作原理',
    howItWorksTitle: 'x402 协议工作原理',
    howItWorksSubtitle: '了解去中心化支付验证流程',
    x402Protocol: 'x402 支付协议',
    x402ProtocolDesc: 'HTTP 402 支付要求 - 用于按需付费 API 的标准化协议',

    step1Title: '请求资源（402 响应）',
    step1Desc: '你的浏览器请求 AI 生成服务。服务器返回 HTTP 402 支付要求状态码及支付详情。',

    step2Title: '接收支付指令',
    step2Desc: '402 响应包含区块链支付详情：支持的链、代币类型、金额和收款地址。',

    step3Title: '链上支付',
    step3Desc: '你使用钱包在链上支付 1 USDC。支付在区块链上验证 - 完全去信任化。',

    step4Title: '提交支付证明',
    step4Desc: '你的交易哈希通过 X-PAYMENT 请求头发送。服务器在链上验证支付。',

    step5Title: '授予访问权限',
    step5Desc: '链上验证后，服务器签发单次使用的许可证令牌。你现在可以生成一张图像。',

    whyX402Title: '为什么 x402 协议重要',
    benefit1Title: '去中心化验证',
    benefit1Desc: '支付直接在区块链上验证 - 无需中心化支付处理商',
    benefit2Title: '标准化协议',
    benefit2Desc: 'HTTP 402 是 Web 标准，让微支付成为网络原生功能',
    benefit3Title: '多链支持',
    benefit3Desc: '支持任何区块链（Base、Solana 等）- 真正的链无关',
    benefit4Title: '无需信任且透明',
    benefit4Desc: '所有交易可在链上验证 - 无需信任中介机构',
    x402Footer: '这是一个展示 x402 协议用于去中心化按需付费 API 的演示',
  }
};

export type Language = 'en' | 'zh';
export type TranslationKey = keyof typeof translations.en;
