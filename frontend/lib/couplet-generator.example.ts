/**
 * 春联生成器使用示例
 * 
 * 这个文件展示了如何使用 couplet-generator 库生成春联
 */

import {
  CoupletGenerator,
  createCoupletGenerator,
  generateCouplet,
  type CoupletConfig,
  type LangChainConfig,
  type CoupletResult,
} from "./couplet-generator";

// ============================================
// 示例 1: 使用类方式创建生成器
// ============================================
async function example1() {
  // 配置 LangChain
  const langChainConfig: LangChainConfig = {
    apiKey: process.env.OPENAI_API_KEY || "your-api-key-here",
    model: "gpt-4", // 或使用其他模型如 "gpt-3.5-turbo"
    temperature: 0.8,
    maxTokens: 500,
    // 如果使用自定义 API 端点
    // baseURL: "http://api.haihub.cn/v1",
  };

  // 创建生成器实例
  const generator = new CoupletGenerator(langChainConfig);

  // 配置春联参数
  const coupletConfig: CoupletConfig = {
    zodiac: "🐍 蛇年",
    wordCount: "七言",
    style: "传统典雅",
    theme: "万事如意",
    atmosphere: "活泼",
  };

  try {
    // 生成春联
    const result = await generator.generate(coupletConfig);
    
    console.log("=== 生成的春联 ===");
    console.log("上联：", result.upper);
    console.log("下联：", result.lower);
    console.log("横批：", result.horizontal);
    console.log("解释：", result.explanation);
    
    return result;
  } catch (error) {
    console.error("生成失败：", error);
    throw error;
  }
}

// ============================================
// 示例 2: 使用快捷函数创建生成器
// ============================================
async function example2() {
  const langChainConfig: LangChainConfig = {
    apiKey: process.env.OPENAI_API_KEY || "your-api-key-here",
    model: "gpt-4",
  };

  // 使用快捷函数创建生成器
  const generator = createCoupletGenerator(langChainConfig);

  const coupletConfig: CoupletConfig = {
    zodiac: "🐍 蛇年",
    wordCount: "五言",
    style: "现代简约",
    theme: "事业有成",
    atmosphere: "励志",
  };

  const result = await generator.generate(coupletConfig);
  console.log(result);
  
  return result;
}

// ============================================
// 示例 3: 一次性生成春联（最简单）
// ============================================
async function example3() {
  const langChainConfig: LangChainConfig = {
    apiKey: process.env.OPENAI_API_KEY || "your-api-key-here",
    model: "gpt-4",
  };

  const coupletConfig: CoupletConfig = {
    zodiac: "🐍 蛇年",
    wordCount: "七言",
    style: "诗意浪漫",
    theme: "家庭和睦",
    atmosphere: "温馨",
  };

  // 直接调用生成函数
  const result = await generateCouplet(langChainConfig, coupletConfig);
  console.log(result);
  
  return result;
}

// ============================================
// 示例 4: 批量生成多副春联
// ============================================
async function example4() {
  const langChainConfig: LangChainConfig = {
    apiKey: process.env.OPENAI_API_KEY || "your-api-key-here",
    model: "gpt-4",
  };

  const generator = createCoupletGenerator(langChainConfig);

  const coupletConfig: CoupletConfig = {
    zodiac: "🐍 蛇年",
    wordCount: "七言",
    style: "传统典雅",
    theme: "财源广进",
    atmosphere: "喜庆",
  };

  try {
    // 一次生成 3 副春联
    const results = await generator.generateMultiple(coupletConfig, 3);
    
    results.forEach((result, index) => {
      console.log(`\n=== 第 ${index + 1} 副春联 ===`);
      console.log("上联：", result.upper);
      console.log("下联：", result.lower);
      console.log("横批：", result.horizontal);
      console.log("解释：", result.explanation);
    });
    
    return results;
  } catch (error) {
    console.error("批量生成失败：", error);
    throw error;
  }
}

// ============================================
// 示例 5: 使用自定义提示词生成
// ============================================
async function example5() {
  const langChainConfig: LangChainConfig = {
    apiKey: process.env.OPENAI_API_KEY || "your-api-key-here",
    model: "gpt-4",
  };

  const generator = createCoupletGenerator(langChainConfig);

  const customPrompt = `
请为一家科技公司创作一副充满创新气息的蛇年春联。
要求：
- 七言对联
- 体现科技创新、人工智能等元素
- 保持传统春联的对仗和韵律
- 寓意公司蓬勃发展、勇于创新
`;

  const result = await generator.generateWithCustomPrompt(customPrompt);
  console.log(result);
  
  return result;
}

// ============================================
// 示例 6: 使用自定义 API 端点（如国内镜像）
// ============================================
async function example6() {
  const langChainConfig: LangChainConfig = {
    apiKey: process.env.API_KEY || "your-api-key-here",
    model: "Kimi-K2-Instruct", // 使用其他模型
    temperature: 0.7,
    baseURL: "http://api.haihub.cn/v1", // 自定义 API 端点
  };

  const generator = createCoupletGenerator(langChainConfig);

  const coupletConfig: CoupletConfig = {
    zodiac: "🐍 蛇年",
    wordCount: "七言",
    style: "传统典雅",
    theme: "万事如意",
    atmosphere: "活泼",
  };

  const result = await generator.generate(coupletConfig);
  console.log(result);
  
  return result;
}

// ============================================
// 示例 7: 在 Next.js API Route 中使用
// ============================================
// 文件路径: app/api/generate-couplet/route.ts
/*
import { NextResponse } from "next/server";
import { generateCouplet, type CoupletConfig } from "@/lib/couplet-generator";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const coupletConfig: CoupletConfig = body;

    const result = await generateCouplet(
      {
        apiKey: process.env.OPENAI_API_KEY!,
        model: "gpt-4",
      },
      coupletConfig
    );

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "生成失败",
      },
      { status: 500 }
    );
  }
}
*/

// ============================================
// 示例 8: 在 React 组件中使用
// ============================================
/*
"use client";

import { useState } from "react";
import type { CoupletResult, CoupletConfig } from "@/lib/couplet-generator";

export default function CoupletGeneratorComponent() {
  const [result, setResult] = useState<CoupletResult | null>(null);
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const config: CoupletConfig = {
        zodiac: "🐍 蛇年",
        wordCount: "七言",
        style: "传统典雅",
        theme: "万事如意",
        atmosphere: "活泼",
      };

      const response = await fetch("/api/generate-couplet", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(config),
      });

      const data = await response.json();
      if (data.success) {
        setResult(data.data);
      }
    } catch (error) {
      console.error("生成失败：", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button onClick={handleGenerate} disabled={loading}>
        {loading ? "生成中..." : "生成春联"}
      </button>
      
      {result && (
        <div>
          <p>上联：{result.upper}</p>
          <p>下联：{result.lower}</p>
          <p>横批：{result.horizontal}</p>
          <p>解释：{result.explanation}</p>
        </div>
      )}
    </div>
  );
}
*/

// 运行示例（根据需要取消注释）
// example1();
// example2();
// example3();
// example4();
// example5();
// example6();

export {
  example1,
  example2,
  example3,
  example4,
  example5,
  example6,
};
