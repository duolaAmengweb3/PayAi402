# 如何启用真实 AI 图像生成

## 🚀 快速开始 (5分钟)

### 1. 获取免费 API Token

访问 [Hugging Face Settings](https://huggingface.co/settings/tokens) 并:

1. 注册/登录账号 (完全免费)
2. 点击 **"New token"**
3. Token 类型选择: **Read**
4. 复制生成的 token (格式: `hf_xxxxx...`)

### 2. 配置 Token

编辑项目根目录的 `.env.local` 文件:

```bash
# 找到这一行
HUGGINGFACE_API_TOKEN=your_token_here

# 替换为你的 token
HUGGINGFACE_API_TOKEN=hf_your_actual_token_goes_here
```

### 3. 重启服务

```bash
# 如果服务正在运行，先停止 (Ctrl+C)
# 然后重新启动
npm run dev -- -p 3009
```

### 4. 测试

1. 访问 http://localhost:3009
2. 支付 0.1 USDC (Base 或 Solana)
3. 输入 prompt (英文): `"a cat astronaut on the moon"`
4. 点击 **生成图像**
5. 等待 5-15 秒
6. ✅ 看到真实的 AI 生成图像！

---

## 💡 提示

### 如果没有配置 Token

- 系统会自动显示占位符图像
- 占位符上会提示: **"⚠️ Placeholder Image - Configure HUGGINGFACE_API_TOKEN"**
- 功能仍然可用，只是图像不是真实 AI 生成的

### 免费额度

- Hugging Face 免费提供 **1000+ 次/月** 的 API 调用
- 对个人项目和测试完全足够
- 无需信用卡

### 如果速率受限

- 如果短时间内调用太多次，可能收到 503/429 错误
- 系统会自动回退到占位符
- 等待几秒后重试即可

---

## 📸 示例 Prompts

试试这些 prompt (用英文):

```
a cat astronaut on the moon, 4k, detailed
sunset over mountains, oil painting style
futuristic city with flying cars, cyberpunk art
cute robot reading a book in library, cartoon style
dragon flying over medieval castle, fantasy art
steampunk airship in clouds, detailed illustration
underwater city with bioluminescent plants
portrait of a wise old wizard, digital art
```

---

## 🔧 技术细节

- **模型**: Stable Diffusion XL Turbo (SDXL-Turbo)
- **提供商**: Hugging Face Inference API
- **图像尺寸**: 512x512 或更高
- **生成时间**: 5-15 秒 (首次可能需要 30 秒，因为模型冷启动)
- **格式**: PNG (base64)

---

## ❓ 常见问题

### 问: 必须配置 API token 吗？

答: 不必须。如果不配置，会显示占位符图像，功能仍可使用。

### 问: Hugging Face 账号是免费的吗？

答: 是的，完全免费，无需信用卡。

### 问: 生成速度慢吗？

答: 首次调用可能需要 20-30 秒（模型冷启动），后续调用会快很多（5-10 秒）。

### 问: 可以用中文 prompt 吗？

答: 建议使用英文 prompt，因为 Stable Diffusion 对英文理解更好。

### 问: 如何获得更快的生成速度？

答: 可以考虑使用付费 API (Replicate, Together AI)，详见 `REAL_AI_GENERATION.md`

---

## 📝 更多信息

详细文档请查看: `REAL_AI_GENERATION.md`

---

✅ 配置完成后，你的 PayAI402 就会生成**真实的 AI 图像**了！
