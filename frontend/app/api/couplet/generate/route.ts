import { NextRequest, NextResponse } from "next/server";
import {
  generateCouplet,
  type CoupletConfig,
} from "@/lib/couplet-generator";

/**
 * POST /api/couplet/generate
 * 
 * 生成春联 API
 * 
 * 请求体：CoupletConfig
 * {
 *   zodiac: string;
 *   wordCount: "五言" | "七言" | "九言";
 *   style: string;
 *   theme: string;
 *   atmosphere: string;
 *   isAcrostic?: boolean;
 *   acrosticText?: string;
 * }
 * 
 * 响应：
 * {
 *   success: boolean;
 *   data?: CoupletResult;
 *   error?: string;
 * }
 */
export async function POST(request: NextRequest) {
  try {
    // 解析请求体
    const body = await request.json();

    // 验证必填字段
    const requiredFields = [
      "zodiac",
      "wordCount",
      "style",
      "theme",
      "atmosphere",
    ];
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

    // 验证字数字段
    const validWordCounts = ["五言", "七言", "九言"];
    if (!validWordCounts.includes(body.wordCount)) {
      return NextResponse.json(
        {
          success: false,
          error: `字数必须是以下之一: ${validWordCounts.join(", ")}`,
        },
        { status: 400 }
      );
    }

    // 验证藏头春联参数
    if (body.isAcrostic) {
      if (!body.acrosticText || body.acrosticText.length < 2) {
        return NextResponse.json(
          {
            success: false,
            error: "藏头春联至少需要2个字",
          },
          { status: 400 }
        );
      }
      if (body.acrosticText.length > 4) {
        return NextResponse.json(
          {
            success: false,
            error: "藏头春联最多支持4个字",
          },
          { status: 400 }
        );
      }
    }

    const coupletConfig: CoupletConfig = {
      zodiac: body.zodiac,
      wordCount: body.wordCount,
      style: body.style,
      theme: body.theme,
      atmosphere: body.atmosphere,
      ...(body.isAcrostic && {
        isAcrostic: body.isAcrostic,
        acrosticText: body.acrosticText,
      }),
    };

    // 从环境变量获取 API 配置
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        {
          success: false,
          error: "服务器配置错误：未设置 OPENAI_API_KEY",
        },
        { status: 500 }
      );
    }

    // 生成春联
    const result = await generateCouplet(
      {
        apiKey,
        model: process.env.OPENAI_MODEL || "gpt-4",
        temperature: Number(process.env.OPENAI_TEMPERATURE) || 0.8,
        maxTokens: Number(process.env.OPENAI_MAX_TOKENS) || 500,
        ...(process.env.OPENAI_BASE_URL && {
          baseURL: process.env.OPENAI_BASE_URL,
        }),
      },
      coupletConfig
    );

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error("生成春联失败：", error);

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
 * GET /api/couplet/generate
 * 
 * 获取 API 使用说明
 */
export async function GET() {
  return NextResponse.json({
    name: "春联生成 API",
    version: "1.0.0",
    description: "基于 LangChain 的智能春联生成接口",
    method: "POST",
    endpoint: "/api/couplet/generate",
    requestBody: {
      zodiac: "生肖（如：🐍 蛇年）",
      wordCount: "字数（五言 | 七言 | 九言）",
      style: "创作风格（如：传统典雅、现代简约、幽默搞笑、文艺清新）",
      theme: "祝福主题（如：万事如意、财源广进、事业顺利）",
      atmosphere: "预期氛围（如：活泼、温馨、庄重、霸气）",
      isAcrostic: "是否启用藏头春联（可选）",
      acrosticText: "藏头文字内容，2-4个字（可选，需要 isAcrostic=true）",
    },
    response: {
      success: "是否成功",
      data: {
        upper: "上联",
        lower: "下联",
        horizontal: "横批",
        explanation: "解释说明",
      },
      error: "错误信息（失败时）",
    },
    example: {
      request: {
        zodiac: "🐍 蛇年",
        wordCount: "七言",
        style: "传统典雅",
        theme: "万事如意",
        atmosphere: "活泼",
        isAcrostic: true,
        acrosticText: "新春",
      },
      response: {
        success: true,
        data: {
          upper: "金蛇舞动迎春到",
          lower: "福气临门万象新",
          horizontal: "万事如意",
          explanation: "这副春联以蛇年为主题...",
        },
      },
    },
  });
}
