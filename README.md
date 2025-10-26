# PayAI402

**Pay with USDC → Generate AI Images**

一个基于 x402 协议的 AI 内容生成器，用户通过支付 USDC 解锁 AI 图像生成功能。所有 AI 推理在浏览器本地运行，零服务器成本。

---

## ✨ 特性

- 🔐 **x402 支付协议**: 实现 HTTP 402 Payment Required 标准
- 💎 **USDC 支付**: 使用 Base 链上的 USDC 进行小额支付
- 🤖 **本地 AI 推理**: 所有模型在用户浏览器运行（WebGPU）
- 💰 **零服务器成本**: 部署在 Vercel 免费版，无 GPU 费用
- 🔒 **链上验证**: 自动验证区块链交易真实性

---

## 🎯 工作流程

```
1. 用户访问网站
     ↓
2. 选择 AI 生成功能 → 后端返回 402 Payment Required
     ↓
3. 连接 MetaMask 钱包 → 支付 0.1 USDC
     ↓
4. 后端验证链上交易 → 签发 License Token
     ↓
5. 前端解锁生成器 → WebGPU 本地加载模型
     ↓
6. 输入 Prompt → 生成图像 → 下载/分享
```

---

## 🚀 快速开始

### 1. 克隆项目
```bash
git clone https://github.com/你的用户名/payai402.git
cd payai402
```

### 2. 安装依赖
```bash
npm install
```

### 3. 配置环境变量
复制 `.env.example` 为 `.env.local` 并填写：
```bash
cp .env.example .env.local
```

编辑 `.env.local`：
```env
# 生成钱包（运行 node generate-wallet.js）
RECIPIENT_ADDRESS=0xYourWalletAddress
PRIVATE_KEY=0xYourPrivateKey

# 生成随机 JWT Secret
JWT_SECRET=your-random-secret-here

# Base 主网配置（默认值，可不修改）
NEXT_PUBLIC_CHAIN_ID=8453
NEXT_PUBLIC_RPC_URL=https://mainnet.base.org
NEXT_PUBLIC_USDC_ADDRESS=0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913
NEXT_PUBLIC_PAYMENT_AMOUNT=0.1
```

### 4. 生成钱包
```bash
node generate-wallet.js
```
将输出的 `PRIVATE_KEY` 和 `Address` 填入 `.env.local`

### 5. 运行开发服务器
```bash
npm run dev
```
访问 http://localhost:3000

---

## 📦 部署到 Vercel

详细部署指南请查看 [DEPLOYMENT.md](./DEPLOYMENT.md)

### 快速部署
1. 推送代码到 GitHub
2. 访问 [vercel.com](https://vercel.com) 并导入项目
3. 配置环境变量（见部署文档）
4. 点击 Deploy

---

## 🏗️ 技术栈

| 层级 | 技术 | 用途 |
|------|------|------|
| 前端 | Next.js 14 + TypeScript | React 框架 + 类型安全 |
| 样式 | Tailwind CSS | 快速 UI 开发 |
| 区块链 | ethers.js v6 | 以太坊钱包交互 |
| 支付 | Base + USDC | Layer 2 低费用支付 |
| AI 模型 | WebGPU + ONNX Runtime | 浏览器端推理 |
| 部署 | Vercel Serverless | 无服务器函数 |

---

## 📁 项目结构

```
payai402/
├── app/
│   ├── api/
│   │   └── generate/
│   │       └── route.ts          # 402 支付验证 API
│   ├── components/
│   │   ├── BrowserCompatibility.tsx  # 浏览器检测
│   │   ├── PaymentModal.tsx          # 支付界面
│   │   └── ImageGenerator.tsx        # 图像生成器
│   ├── layout.tsx                # 根布局
│   ├── page.tsx                  # 主页
│   └── globals.css               # 全局样式
├── public/                       # 静态资源
├── .env.example                  # 环境变量模板
├── package.json                  # 依赖配置
├── next.config.js                # Next.js 配置
├── tailwind.config.js            # Tailwind 配置
├── vercel.json                   # Vercel 部署配置
├── generate-wallet.js            # 钱包生成脚本
├── DEPLOYMENT.md                 # 部署文档
└── README.md                     # 本文档
```

---

## 🔒 安全说明

### 私钥管理
- ⚠️ **绝不要** 将 `PRIVATE_KEY` 提交到 Git
- ✅ 使用 Vercel 环境变量存储敏感信息
- ✅ 定期检查收款地址余额并提取

### 支付验证
- ✅ 每个 nonce 只能使用一次（防止重放攻击）
- ✅ 验证交易的收款地址、金额、代币
- ✅ 检查交易确认状态

---

## 🧪 测试网测试

在使用主网前，建议先用 Base Sepolia 测试网测试：

### 切换到测试网
修改 `.env.local`：
```env
NEXT_PUBLIC_CHAIN_ID=84532
NEXT_PUBLIC_RPC_URL=https://sepolia.base.org
NEXT_PUBLIC_USDC_ADDRESS=0x036CbD53842c5426634e7929541eC2318f3dCF7e
NEXT_PUBLIC_PAYMENT_AMOUNT=0.01
```

### 获取测试资产
- Base Sepolia ETH: https://www.coinbase.com/faucets
- 测试 USDC: https://faucet.circle.com/

---

## ⚙️ 配置选项

### 修改支付金额
编辑 `NEXT_PUBLIC_PAYMENT_AMOUNT` 环境变量（单位：USDC）

### 更换区块链网络
支持所有 EVM 兼容链，修改以下环境变量：
- `NEXT_PUBLIC_CHAIN_ID`
- `NEXT_PUBLIC_RPC_URL`
- `NEXT_PUBLIC_USDC_ADDRESS`

### 集成真实 AI 模型
当前版本使用占位符图像演示。要集成真实 Stable Diffusion：

1. 取消注释 `ImageGenerator.tsx` 中的模型加载代码
2. 下载 ONNX 格式的 SD-Turbo 模型
3. 配置模型文件路径

---

## 📊 成本分析

| 项目 | 成本 |
|------|------|
| Vercel 托管 | **$0** (免费版) |
| AI 模型推理 | **$0** (用户浏览器运行) |
| 区块链 RPC | **$0** (公共端点) |
| Gas 费 | **$0** (用户承担) |
| **总计** | **$0** |

---

## 🌐 浏览器兼容性

### ✅ 支持
- Chrome 113+ (桌面版)
- Edge 113+ (桌面版)
- Brave (最新版)

### ❌ 不支持
- Safari (WebGPU 支持有限)
- Firefox (WebGPU 支持不完整)
- 移动端浏览器 (性能不足)

---

## 🐛 常见问题

### Q: 支付后验证失败？
**A**: 等待交易确认（约 2 秒），检查 BaseScan 确认交易状态

### Q: 模型加载失败？
**A**: 确保使用支持 WebGPU 的浏览器（Chrome 113+）

### Q: MetaMask 连接失败？
**A**: 确保已安装 MetaMask 并切换到 Base 网络

### Q: Vercel 部署失败？
**A**: 检查环境变量是否正确配置，查看部署日志

---

## 🛣️ 未来计划

- [ ] 集成真实 Stable Diffusion 模型
- [ ] 支持多链支付（Solana、Arbitrum）
- [ ] 添加语音生成功能（TTS）
- [ ] 实现支付记录仪表盘
- [ ] 提供 x402 SDK 供开发者使用

---

## 📄 许可证

MIT License

---

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

---

## 📧 联系方式

- Twitter: [@payai402](https://twitter.com/payai402)
- GitHub: [payai402](https://github.com/你的用户名/payai402)

---

## 🙏 致谢

- [x402 Protocol](https://github.com/x402) - HTTP 402 支付标准
- [Base](https://base.org) - Layer 2 区块链
- [Stable Diffusion](https://stability.ai/) - AI 图像生成模型
- [Vercel](https://vercel.com) - 免费托管平台

---

**Built with ❤️ using x402 Protocol**
