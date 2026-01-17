import { NextRequest, NextResponse } from "next/server";

/**
 * POST /api/couplet/image
 * 
 * 根据春联内容生成图片 API
 * 使用阿里云 DashScope 的 qwen-image-max 模型
 * 
 * 请求体：
 * {
 *   upper: string;      // 上联
 *   lower: string;      // 下联
 *   horizontal: string; // 横批
 * }
 * 
 * 响应：
 * {
 *   success: boolean;
 *   data?: { imageUrl: string };
 *   error?: string;
 * }
 */
export async function POST(request: NextRequest) {
  try {
    // 解析请求体
    const body = await request.json();

    // 验证必填字段
    const requiredFields = ["upper", "lower", "horizontal"];
    const missingFields = requiredFields.filter((field) => !body[field]);

    if (missingFields.length > 0) {
      return NextResponse.json(
        {
          success: false,
          error: `缺少必填字段: ${missingFields.join(", ")}`,
        },
        { status: 400 }
      );
    }

    const { upper, lower, horizontal } = body;

    // 从环境变量获取 DashScope API Key
    const apiKey = process.env.DASHSCOPE_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        {
          success: false,
          error: "服务器配置错误：未设置 DASHSCOPE_API_KEY",
        },
        { status: 500 }
      );
    }

    // 构建详细的图像生成提示词
    const prompt = `
一副典雅庄重的对联悬挂于厅堂之中，房间是个安静古典的中式布置，桌子上放着一些青花瓷。
对联左书"${upper}"，右书"${lower}"，横批"${horizontal}"。
字体飘逸，在中间挂着一幅中国风的画作。
背景装饰有：红色灯笼、梅花、祥云、金色花纹。
画面风格：喜庆、典雅、传统中国新年氛围，高清，精美工笔画风格。
整体布局对称，色彩鲜艳，充满节日喜庆气氛。
`.trim();

    console.log("[图片生成] 开始生成春联图片", { upper, lower, horizontal });

    // 调用 DashScope API 生成图片（使用 multimodal-generation API）
    const response = await fetch(
      "https://dashscope.aliyuncs.com/api/v1/services/aigc/multimodal-generation/generation",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "qwen-image-max",
          input: {
            messages: [
              {
                role: "user",
                content: [
                  {
                    text: prompt,
                  },
                ],
              },
            ],
          },
          parameters: {
            negative_prompt: "低分辨率，低画质，肢体畸形，手指畸形，画面过饱和，蜡像感，人脸无细节，过度光滑，画面具有AI感。构图混乱。文字模糊，扭曲。",
            prompt_extend: true,
            watermark: false,
            size: "1664*928",
          },
        }),
        signal: AbortSignal.timeout(60000), // 60秒超时
      }
    );

    // 解析响应
    const responseData = await response.json();

    // 检查是否有错误
    if (responseData.code || !response.ok) {
      console.error("[图片生成] API 返回错误", responseData);
      return NextResponse.json(
        {
          success: false,
          error: responseData.message || "图片生成失败",
        },
        { status: response.status }
      );
    }

    // 处理成功响应
    if (responseData && responseData.output) {
      console.log("[图片生成] 生成成功");

      // 提取图片 URL (multimodal-generation API 返回结构)
      if (
        responseData.output.choices &&
        responseData.output.choices.length > 0 &&
        responseData.output.choices[0].message &&
        responseData.output.choices[0].message.content &&
        responseData.output.choices[0].message.content.length > 0
      ) {
        const imageUrl = responseData.output.choices[0].message.content[0].image;
        
        if (imageUrl) {
          return NextResponse.json({
            success: true,
            data: { imageUrl },
          });
        }
      }
      
      console.error("[图片生成] 响应数据中未找到图片 URL", responseData);
      return NextResponse.json(
        {
          success: false,
          error: "生成失败：未找到图片 URL",
        },
        { status: 500 }
      );
    } else {
      console.error("[图片生成] 响应数据异常", responseData);
      return NextResponse.json(
        {
          success: false,
          error: "生成失败：响应数据异常",
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("[图片生成] 生成春联图片失败", error);

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "生成失败，请稍后重试",
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/couplet/image
 * 
 * 获取 API 使用说明
 */
export async function GET() {
  return NextResponse.json({
    name: "春联图片生成 API",
    version: "1.0.0",
    description: "基于阿里云 DashScope qwen-image-max 模型的春联图片生成接口",
    method: "POST",
    endpoint: "/api/couplet/image",
    requestBody: {
      upper: "上联内容",
      lower: "下联内容",
      horizontal: "横批内容",
    },
    response: {
      success: "是否成功",
      data: {
        imageUrl: "生成的图片 URL",
      },
      error: "错误信息（失败时）",
    },
    example: {
      request: {
        upper: "门迎旭日财源广",
        lower: "户纳春风吉庆多",
        horizontal: "四季平安",
      },
      response: {
        success: true,
        data: {
          imageUrl: "https://dashscope.aliyuncs.com/...",
        },
      },
    },
    requirements: {
      environment: "需要设置 DASHSCOPE_API_KEY 环境变量",
      model: "qwen-image-max",
      timeout: "60秒",
    },
  });
}
