# PayAI402 – 模型选型与加载方案 (MVP 版)

## 🎯 目标
为 MVP 实现一个零成本、纯前端可运行的 AI 内容生成体验。用户通过钱包支付 USDC（x402 协议）后，即可本地生成图像与语音。所有模型均在浏览器侧运行，无需服务器或 API 费用。

---

## ✅ 推荐模型组合（MVP 首选）

| 功能 | 模型名称 | 框架 | 模型体积 | 是否纯前端可跑 | 说明 |
|------|-----------|--------|-------------|----------------|------|
| **图像生成（核心）** | **Stable Diffusion Turbo (SD-Turbo)** | ONNX Runtime Web / MLC Web Stable Diffusion | ≈ 2 GB | ✅ | 高性能轻量版 Stable Diffusion，优化为快速生成，桌面 GPU 可 1–2 秒出图。权重可浏览器缓存。 |
| **语音生成（TTS）** | **Bark-mini / tts-web (Transformers.js)** | Transformers.js + WebGPU | ≈ 100 MB | ✅ | 英文语音自然度高、体积小；纯前端语音合成，可生成音频文件或直接播放。 |

> ✅ 建议首版组合： **SD-Turbo + Bark-mini**。
>
> 展示效果：用户付费 → 生成图像 → 自动语音朗读 Prompt → 可下载或分享结果。

---

## 🧠 替代与补充模型

| 功能 | 模型 | 框架 | 说明 |
|------|------|------|------|
| **语音识别（ASR）** | Whisper Tiny / Base | ONNX Runtime Web / Transformers.js | 可选，用于语音输入或字幕生成；纯前端可跑，75 MB。 |
| **文字生成** | Phi-2 (WebLLM) | MLC Web LLM / WebLLM | 小语言模型，可做 Prompt→短回答演示；加载较慢，不建议 MVP 首版。 |

---

## ⚙️ 加载与使用示例

### 🖼️ Stable Diffusion Turbo（ONNX）
```js
import { InferenceSession } from 'onnxruntime-web';

// 加载模型
const session = await InferenceSession.create('./models/sd-turbo.onnx');

// 调用推理
const image = await session.run({ prompt: 'A cat astronaut on the moon' });
```
> 模型来源： [stabilityai/sd-turbo](https://huggingface.co/stabilityai/sd-turbo)  
> 可量化为 ~1GB，加载更快。

### 🔊 Bark-mini (TTS)
```js
import { pipeline } from '@xenova/transformers';

const tts = await pipeline('text-to-speech', 'Xenova/bark-small');
const audio = await tts('Hello from PayAI402!');
const audioUrl = URL.createObjectURL(audio.audio);
const player = new Audio(audioUrl);
player.play();
```
> 模型来源： [Xenova/bark-small](https://huggingface.co/Xenova/bark-small)

---

## 🧩 模型托管与加载优化

### 文件位置建议
- 模型文件放在 `/public/models/` 或使用 CDN（如 jsDelivr、Hugging Face Hub）。

### 缓存策略
- 使用 **Service Worker + IndexedDB** 缓存模型；
- 首次加载显示进度条（例如“模型加载中 65%”）；
- 加载完后后续几乎零延迟；
- 可通过分块或量化权重减小文件体积。

---

## 📱 性能与兼容性

| 场景 | 运行要求 | 性能 | 备注 |
|------|-----------|------|------|
| 桌面浏览器 (Chrome / Edge / Brave) | 支持 WebGPU | ✅ 优秀 | 推荐主要演示环境 |
| macOS Safari | 部分支持 WebGPU | ⚠️ 有限制 | 建议提示“请使用 Chrome/Edge” |
| 移动端浏览器 | WebGPU 兼容性弱 | ⚠️ 降级或禁止生成 | 可提示“仅限桌面端体验” |

---

## 🔮 后续扩展方向
- 增加 **多语言语音模型**（如 Coqui / SeamlessM4T）；
- 增加 **SDXL Lite / Flux** 等更高质量图像模型；
- 引入 **LoRA/ControlNet** 插件，实现风格与姿态控制；
- 结合 x402 Explorer 展示每次生成的付费记录与链上 Proof。

---

## ✅ 总结
- 首版只需 **两个模型 (SD-Turbo + Bark-mini)**，即能完整演示“链上支付 → AI 内容生成”闭环。
- 所有推理在用户浏览器运行，无服务器、无 API 费用。
- 部署简单：放模型文件、接 x402 支付、上线 Vercel 即可。