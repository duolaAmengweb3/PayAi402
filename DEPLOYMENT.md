# PayAI402 部署指南

## 🚀 快速部署到 Vercel (5 分钟)

### 前置准备
1. 一个 GitHub 账号
2. 已生成的钱包地址和私钥（见下方说明）

---

## 步骤 1：生成钱包（已完成）

运行以下命令生成钱包：
```bash
node generate-wallet.js
```

你会得到：
- **Private Key（私钥）**: 用于签名和验证
- **Address（收款地址）**: 用户支付的 USDC 会发送到这里

⚠️ **重要**: 请妥善保管私钥，不要泄露或提交到 Git！

---

## 步骤 2：推送代码到 GitHub

```bash
# 初始化 Git（如果还没有）
git init
git add .
git commit -m "Initial commit: PayAI402 MVP"

# 创建 GitHub 仓库并推送
# 1. 访问 https://github.com/new 创建新仓库
# 2. 运行以下命令：
git remote add origin https://github.com/你的用户名/payai402.git
git branch -M main
git push -u origin main
```

---

## 步骤 3：部署到 Vercel

### 3.1 连接 Vercel
1. 访问 [https://vercel.com](https://vercel.com)
2. 使用 GitHub 账号登录
3. 点击 **"Add New Project"**
4. 选择你刚创建的 `payai402` 仓库

### 3.2 配置环境变量
在 Vercel 部署页面，找到 **"Environment Variables"** 部分，添加以下变量：

| 变量名 | 值 | 说明 |
|--------|-----|------|
| `RECIPIENT_ADDRESS` | `0xYourWalletAddress` | 你的钱包收款地址 |
| `PRIVATE_KEY` | `0xYourPrivateKey` | 你的钱包私钥（⚠️ 保密！） |
| `JWT_SECRET` | `随机字符串` | 用于签名 license token |
| `NEXT_PUBLIC_CHAIN_ID` | `8453` | Base 主网 Chain ID |
| `NEXT_PUBLIC_RPC_URL` | `https://mainnet.base.org` | Base RPC 端点 |
| `NEXT_PUBLIC_USDC_ADDRESS` | `0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913` | Base 主网 USDC 合约地址 |
| `NEXT_PUBLIC_PAYMENT_AMOUNT` | `0.1` | 每次支付金额（USDC） |

#### 生成 JWT_SECRET
```bash
# 在终端运行
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 3.3 部署
1. 点击 **"Deploy"** 按钮
2. 等待 2-3 分钟构建完成
3. 完成！你会得到一个 `.vercel.app` 域名

---

## 步骤 4：测试部署

### 4.1 访问网站
打开你的 Vercel 部署 URL（例如 `https://payai402.vercel.app`）

### 4.2 测试流程
1. ✅ 确认浏览器兼容性检测正常
2. ✅ 点击"连接 MetaMask 钱包"
3. ✅ 确认支付信息显示正确
4. ⚠️ **不要立即支付真钱！** 先用测试网测试

---

## 🧪 使用测试网测试（推荐）

### 切换到 Base Sepolia 测试网

修改 Vercel 环境变量：
```
NEXT_PUBLIC_CHAIN_ID=84532
NEXT_PUBLIC_RPC_URL=https://sepolia.base.org
NEXT_PUBLIC_USDC_ADDRESS=0x036CbD53842c5426634e7929541eC2318f3dCF7e
NEXT_PUBLIC_PAYMENT_AMOUNT=0.01
```

### 获取测试 USDC
1. 访问 [Base Sepolia Faucet](https://www.coinbase.com/faucets/base-ethereum-goerli-faucet)
2. 领取测试 ETH
3. 访问 [Circle USDC Faucet](https://faucet.circle.com/) 领取测试 USDC

### 测试支付流程
用测试网测试完整流程后，再切换回主网。

---

## 📊 监控和维护

### 查看收款
在 [BaseScan](https://basescan.org) 输入你的 `RECIPIENT_ADDRESS` 查看收到的 USDC。

### 提取资金
使用你的私钥导入 MetaMask，即可提取收到的 USDC：
1. 打开 MetaMask
2. 点击右上角头像 → "导入账户"
3. 粘贴私钥
4. 即可看到余额并转账

### 查看 Vercel 日志
1. 登录 Vercel Dashboard
2. 选择项目 → "Deployments" → 点击最新部署
3. 查看 "Functions" 标签下的日志

---

## ⚠️ 安全注意事项

### 必须做：
- ✅ 将 `PRIVATE_KEY` 设为 Vercel 环境变量（Secret）
- ✅ 确保 `.env` 文件在 `.gitignore` 中
- ✅ 定期检查收款地址的余额并提取
- ✅ 使用强随机字符串作为 `JWT_SECRET`

### 不要做：
- ❌ 不要将私钥提交到 Git
- ❌ 不要在公共频道分享私钥
- ❌ 不要使用简单密码作为 JWT_SECRET

---

## 🐛 常见问题

### 1. 支付后验证失败
**原因**: RPC 延迟或交易未确认
**解决**: 等待 30 秒后重试，或检查 BaseScan 确认交易状态

### 2. 模型加载失败
**原因**: WebGPU 不支持或网络问题
**解决**: 确保使用 Chrome 113+ 桌面版，检查控制台错误

### 3. MetaMask 连接失败
**原因**: 用户未安装 MetaMask 或拒绝连接
**解决**: 提示用户安装 MetaMask 并授权

### 4. Vercel 函数超时
**原因**: RPC 调用太慢
**解决**: 考虑使用 Alchemy 或 Infura 的专用 RPC（免费）

---

## 🎉 部署完成！

恭喜！你的 PayAI402 应用已成功部署。

**下一步**：
1. 在社交媒体分享你的应用
2. 监控收款地址
3. 优化模型加载速度
4. 添加更多 AI 模型功能

**需要帮助？**
- 查看 [Next.js 文档](https://nextjs.org/docs)
- 查看 [Vercel 文档](https://vercel.com/docs)
- 查看 [Base 文档](https://docs.base.org)
