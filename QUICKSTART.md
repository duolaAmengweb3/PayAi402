# 快速上手指南（5 分钟测试）

这个指南帮助你在 5 分钟内启动并测试 PayAI402 项目。

---

## 步骤 1：生成钱包（1 分钟）

```bash
cd /Users/huan/Desktop/project/x402/payai402
node generate-wallet.js
```

**输出示例**：
```
🔑 Private Key: 0xd49354f498f00a1f497655b0d62faf0532f65ec34f2a5901959a8eb7971b255e
📍 Address: 0xd4bb9860666c239e2519e34d9ec59ffd84979bed
```

⚠️ **保存这些信息！** 你需要用它们配置环境变量。

---

## 步骤 2：配置环境变量（1 分钟）

创建 `.env.local` 文件：
```bash
cat > .env.local << 'EOF'
# 从上面生成的钱包信息填入
RECIPIENT_ADDRESS=0xd4bb9860666c239e2519e34d9ec59ffd84979bed
PRIVATE_KEY=0xd49354f498f00a1f497655b0d62faf0532f65ec34f2a5901959a8eb7971b255e

# 生成随机 JWT Secret
JWT_SECRET=abc123randomsecret456def

# Base 主网配置
NEXT_PUBLIC_CHAIN_ID=8453
NEXT_PUBLIC_RPC_URL=https://mainnet.base.org
NEXT_PUBLIC_USDC_ADDRESS=0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913
NEXT_PUBLIC_PAYMENT_AMOUNT=0.1
EOF
```

> 💡 **提示**: 将上面的 `RECIPIENT_ADDRESS` 和 `PRIVATE_KEY` 替换为你自己生成的值。

---

## 步骤 3：安装依赖（2 分钟）

```bash
npm install
```

---

## 步骤 4：启动开发服务器（30 秒）

```bash
npm run dev
```

看到以下输出表示成功：
```
✓ Ready in 2.5s
○ Local:   http://localhost:3000
```

---

## 步骤 5：测试应用（1 分钟）

1. **打开浏览器**（必须是 Chrome 或 Edge）
   访问: http://localhost:3000

2. **检查浏览器兼容性**
   - ✅ 如果看到主页面：说明 WebGPU 支持正常
   - ❌ 如果看到警告页面：请切换到 Chrome 113+ 或 Edge 113+

3. **测试支付流程**（无需真实支付）
   - 点击 "连接 MetaMask 钱包"
   - 查看是否返回 402 支付信息
   - 检查控制台是否有错误

---

## 🧪 使用测试网测试（推荐）

### 切换到 Base Sepolia 测试网

编辑 `.env.local`，修改这几行：
```env
NEXT_PUBLIC_CHAIN_ID=84532
NEXT_PUBLIC_RPC_URL=https://sepolia.base.org
NEXT_PUBLIC_USDC_ADDRESS=0x036CbD53842c5426634e7929541eC2318f3dCF7e
NEXT_PUBLIC_PAYMENT_AMOUNT=0.01
```

### 获取测试资产

1. **获取测试 ETH**
   - 访问: https://www.coinbase.com/faucets/base-ethereum-goerli-faucet
   - 输入你的钱包地址
   - 领取测试 ETH（用于支付 Gas）

2. **获取测试 USDC**
   - 访问: https://faucet.circle.com/
   - 选择 Base Sepolia 网络
   - 领取测试 USDC

3. **完整测试支付流程**
   - 连接 MetaMask
   - 切换到 Base Sepolia 网络
   - 支付 0.01 测试 USDC
   - 验证是否解锁 AI 生成器

---

## 📊 验证一切正常

### 检查清单

- [ ] `npm run dev` 启动成功
- [ ] 浏览器打开 http://localhost:3000
- [ ] 看到 "PayAI402" 主页面
- [ ] 浏览器兼容性检测通过
- [ ] 点击"连接钱包"按钮有响应
- [ ] MetaMask 弹出连接请求
- [ ] 后端返回 402 支付信息

### 检查 API 端点

打开新终端，测试 API：
```bash
curl -X POST http://localhost:3000/api/generate \
  -H "Content-Type: application/json" \
  -d '{"model":"sd-turbo","prompt":"test"}'
```

**预期输出**（402 响应）：
```json
{
  "accepts": [
    {
      "chain": "base",
      "token": "USDC",
      "recipient": "0xYourAddress",
      "amount": "0.1",
      "nonce": "abc123...",
      "expires": 1735152000
    }
  ]
}
```

---

## 🐛 常见问题

### 1. `npm install` 失败
**错误**: `ERESOLVE unable to resolve dependency tree`

**解决**:
```bash
npm install --legacy-peer-deps
```

### 2. 端口 3000 被占用
**错误**: `Port 3000 is already in use`

**解决**:
```bash
# 使用其他端口
npm run dev -- -p 3001
```

### 3. MetaMask 无法连接
**原因**: 未安装 MetaMask 或被浏览器拦截

**解决**:
1. 安装 MetaMask: https://metamask.io/
2. 刷新页面并允许弹窗

### 4. WebGPU 不支持
**原因**: 浏览器版本过低或不支持

**解决**:
1. 更新 Chrome 到 113+ 版本
2. 或使用 Edge 113+ 版本
3. 检查 chrome://gpu 确认 WebGPU 状态

---

## 🎉 测试成功！

如果所有步骤都通过，说明项目已成功运行。

**下一步**:
1. 阅读 [DEPLOYMENT.md](./DEPLOYMENT.md) 部署到 Vercel
2. 阅读 [README.md](./README.md) 了解项目详情
3. 修改代码实现你的需求

---

## 📸 预期效果

### 主页面
- 大标题 "PayAI402"
- "Pay with USDC → Generate AI Images" 副标题
- "连接 MetaMask 钱包" 按钮

### 支付页面
- 显示支付金额（0.1 USDC）
- 收款地址（截断显示）
- "支付" 按钮

### 生成器页面
- 文本输入框（Prompt）
- "生成图像" 按钮
- 结果展示区域

---

## 🚀 准备好部署了吗？

查看 [DEPLOYMENT.md](./DEPLOYMENT.md) 获取详细的 Vercel 部署指南。
