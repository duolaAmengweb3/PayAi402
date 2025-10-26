# 真实 AI 图像生成集成

## ✅ 已完成

### 功能说明

现在 PayAI402 使用 **真实的 Stable Diffusion AI 模型** 来生成图像！

- ✅ 集成 Hugging Face Inference API
- ✅ 使用 SDXL Turbo (Stable Diffusion XL Turbo) 模型
- ✅ 支付后生成真实的 AI 图像
- ✅ 如果 API token 未配置，显示提示占位符

---

## 🚀 如何启用真实 AI 生成

### 步骤 1: 获取 Hugging Face API Token

1. 访问 [Hugging Face](https://huggingface.co/)
2. 注册/登录账号
3. 进入设置页面: https://huggingface.co/settings/tokens
4. 点击 "New token"
5. 选择权限: **Read** (免费，足够使用 Inference API)
6. 复制生成的 token

**示例 token**: `hf_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`

### 步骤 2: 配置 Token

编辑 `.env.local` 文件：

```env
# Hugging Face API (用于AI图像生成)
# 免费获取 token: https://huggingface.co/settings/tokens
HUGGINGFACE_API_TOKEN=hf_your_actual_token_here
```

### 步骤 3: 重启服务

```bash
npm run dev -- -p 3009
```

---

## 🎨 使用的模型

### Stable Diffusion XL Turbo

**模型**: `stabilityai/sdxl-turbo`

**特点**:
- ✅ 快速生成 (1-4 秒)
- ✅ 高质量图像
- ✅ 512x512 或更高分辨率
- ✅ 理解复杂的英文 prompt
- ✅ 完全免费 (Hugging Face 免费额度)

**示例 Prompts**:
- "a cat astronaut on the moon, 4k, detailed"
- "sunset over mountains, oil painting style"
- "futuristic city with flying cars, cyberpunk"
- "cute robot reading a book in library"

---

## 💰 费用说明

### Hugging Face Inference API

**免费额度**:
- ✅ 每月 1000+ 次调用 (足够个人使用)
- ✅ 无需信用卡
- ✅ 社区模型完全免费

**速率限制**:
- 免费账户: ~1-2 次/秒
- 如果超过限制，会收到 503 或 429 错误
- 系统会自动回退到占位符，并提示稍后重试

---

## 🔧 工作原理

### 架构

```
用户支付 USDC
    ↓
获得 License
    ↓
输入 Prompt → 前端 (ImageGenerator)
    ↓
调用 /api/generate-image
    ↓
后端向 Hugging Face API 请求
    ↓
SDXL Turbo 生成图像
    ↓
返回 base64 图像
    ↓
前端显示 + 可下载
```

### API 端点

**路径**: `/api/generate-image`

**请求**:
```json
{
  "prompt": "a cat astronaut on the moon"
}
```

**响应** (成功):
```json
{
  "isPlaceholder": false,
  "image": "data:image/png;base64,iVBORw0KG...",
  "prompt": "a cat astronaut on the moon"
}
```

**响应** (未配置 token):
```json
{
  "isPlaceholder": true,
  "message": "API token not configured. Using placeholder."
}
```

---

## 🧪 测试步骤

### 1. 配置 API Token (推荐)

```bash
# 编辑 .env.local
HUGGINGFACE_API_TOKEN=hf_your_token_here

# 重启服务
npm run dev -- -p 3009
```

### 2. 完成支付流程

1. 访问 http://localhost:3009
2. 选择 Base 或 Solana
3. 连接钱包
4. 支付 0.1 USDC

### 3. 生成真实 AI 图像

1. 输入英文 prompt (如: "a dragon flying over castle")
2. 点击 "Generate Image" / "生成图像"
3. 等待 5-15 秒
4. ✅ 看到真实的 AI 生成图像！
5. 点击 "Download" / "下载" 保存图像

---

## 🔄 替代方案 (如果不想用 Hugging Face)

### 方案 1: Replicate API

**优势**: 更快，质量更好
**费用**: $0.00025/图像 (极低)

```typescript
// app/api/generate-image/route.ts
const response = await fetch('https://api.replicate.com/v1/predictions', {
  method: 'POST',
  headers: {
    'Authorization': `Token ${process.env.REPLICATE_API_TOKEN}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    version: 'stability-ai/sdxl:39ed52f2a78e934b3ba6e2a89f5b1c712de7dfea535525255b1aa35c5565e08b',
    input: { prompt }
  })
});
```

### 方案 2: Together AI

**优势**: 超快 (1-2秒)
**费用**: $0.0008/图像

```typescript
const response = await fetch('https://api.together.xyz/inference', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${process.env.TOGETHER_API_KEY}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    model: 'stabilityai/stable-diffusion-xl-base-1.0',
    prompt: prompt,
    steps: 20,
  })
});
```

### 方案 3: 本地运行 (完全免费，但需要好显卡)

使用之前研究的 MLC-AI Web Stable Diffusion 或 Transformers.js:

**要求**:
- GPU: NVIDIA RTX 3060 或更好
- 内存: 8GB+
- 浏览器: Chrome/Edge 113+ with WebGPU

**优势**:
- 完全本地，无隐私问题
- 无 API 费用
- 更快 (如果用户有好显卡)

**缺点**:
- 首次加载慢 (需要下载 2-4GB 模型)
- 需要用户有好显卡
- 不是所有浏览器都支持

---

## 📊 性能对比

| 方案 | 速度 | 质量 | 费用 | 易用性 |
|------|------|------|------|--------|
| Hugging Face (当前) | 5-15秒 | ⭐⭐⭐⭐ | 免费 | ⭐⭐⭐⭐⭐ |
| Replicate | 3-8秒 | ⭐⭐⭐⭐⭐ | $0.00025/图 | ⭐⭐⭐⭐ |
| Together AI | 1-3秒 | ⭐⭐⭐⭐ | $0.0008/图 | ⭐⭐⭐⭐ |
| 本地 WebGPU | 2-5秒 | ⭐⭐⭐⭐⭐ | 免费 | ⭐⭐ |
| Canvas 占位符 | 即时 | ⭐ | 免费 | ⭐⭐⭐⭐⭐ |

---

## ⚠️ 常见问题

### 问题 1: 图片显示占位符

**原因**: `HUGGINGFACE_API_TOKEN` 未配置或无效

**解决**:
1. 检查 `.env.local` 中的 token
2. 确保 token 以 `hf_` 开头
3. 确认 token 有 **Read** 权限
4. 重启服务

### 问题 2: 生成很慢或超时

**原因**:
- Hugging Face 免费模型可能在冷启动
- 网络延迟

**解决**:
1. 第一次调用等待 20-30 秒（模型加载）
2. 后续调用会快很多（3-10秒）
3. 或者使用付费方案 (Replicate/Together AI)

### 问题 3: 收到 503 错误

**原因**: 模型正在加载

**解决**: 系统会自动显示占位符，并提示稍后重试

### 问题 4: 收到 429 错误

**原因**: 超过速率限制

**解决**:
1. 等待几秒后重试
2. 或升级到 Hugging Face Pro ($9/月，无限制)
3. 或使用其他 API 提供商

---

## 🎯 生产环境建议

### 推荐配置

**免费个人项目**:
- 使用 Hugging Face 免费 API ✅
- 占位符作为后备 ✅

**商业产品 (少量用户)**:
- 使用 Together AI ($0.0008/图)
- 预算: ~$10/月 = 12,500 张图

**商业产品 (大量用户)**:
- 使用 Replicate (按需付费)
- 或自建 GPU 服务器

---

## 📝 相关文件

- **API 路由**: `app/api/generate-image/route.ts`
- **前端组件**: `app/components/ImageGenerator.tsx`
- **环境配置**: `.env.local`

---

## ✅ 当前状态

**真实 AI 生成**: ✅ 已集成
**API 提供商**: Hugging Face Inference API
**模型**: SDXL Turbo
**占位符后备**: ✅ 已实现
**编译状态**: ✅ 成功
**服务地址**: http://localhost:3009

---

## 🎉 下一步

1. **获取 Hugging Face API token**: https://huggingface.co/settings/tokens
2. **配置 `.env.local`**
3. **重启服务**
4. **测试真实 AI 图像生成**
5. **（可选）尝试其他 API 提供商**

---

**更新时间**: 2025-10-26
**功能**: 真实 AI 图像生成
**状态**: ✅ 完成
