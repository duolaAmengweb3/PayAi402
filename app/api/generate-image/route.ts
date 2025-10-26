import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { prompt } = await request.json();

    if (!prompt || typeof prompt !== 'string') {
      return NextResponse.json(
        { error: 'Invalid prompt' },
        { status: 400 }
      );
    }

    const apiToken = process.env.HUGGINGFACE_API_TOKEN;

    if (!apiToken || apiToken === 'your_token_here') {
      console.warn('⚠️  Hugging Face API token not configured. Using placeholder image.');

      // 返回占位符标识
      return NextResponse.json({
        isPlaceholder: true,
        message: 'API token not configured. Using placeholder.'
      });
    }

    // 调用 Hugging Face Inference API
    // 使用 Stable Diffusion XL Base 1.0 (高质量)
    const response = await fetch(
      'https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0',
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          inputs: prompt,
          options: {
            wait_for_model: true, // 如果模型正在加载，等待它
          }
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Hugging Face API error:', response.status, errorText);

      // 如果是速率限制或模型加载中，返回占位符
      if (response.status === 503 || response.status === 429) {
        return NextResponse.json({
          isPlaceholder: true,
          message: 'Model is loading or rate limited. Please try again in a moment.',
          retryAfter: response.headers.get('retry-after') || '20'
        });
      }

      throw new Error(`API responded with ${response.status}: ${errorText}`);
    }

    // 获取图像 blob
    const imageBlob = await response.blob();

    // 转换为 base64
    const arrayBuffer = await imageBlob.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64Image = buffer.toString('base64');
    const imageDataUrl = `data:image/png;base64,${base64Image}`;

    return NextResponse.json({
      isPlaceholder: false,
      image: imageDataUrl,
      prompt: prompt,
    });

  } catch (error: any) {
    console.error('Image generation error:', error);
    return NextResponse.json(
      {
        error: 'Failed to generate image',
        details: error.message,
        isPlaceholder: true
      },
      { status: 500 }
    );
  }
}
