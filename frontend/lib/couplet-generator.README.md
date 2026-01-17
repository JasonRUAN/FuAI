# 春联生成器 (Couplet Generator)

基于 LangChain 的智能春联生成库，支持结构化输出上联、下联、横批和解释说明。

## 功能特性

✨ **结构化输出**：使用 Zod Schema 确保输出格式准确
🎨 **高度可配置**：支持自定义生肖、字数、风格、主题、氛围
🔄 **批量生成**：支持一次生成多副春联
🌐 **灵活的 API 支持**：支持 OpenAI 官方 API 和自定义端点
📝 **详细解释**：自动生成春联的文化内涵和创作寓意
🚀 **易于集成**：提供多种使用方式，适配不同场景

## 安装依赖

项目已包含所需依赖：
- `@langchain/openai` - LangChain OpenAI 集成
- `langchain` - LangChain 核心库
- `zod` - TypeScript 类型验证

## 快速开始

### 1. 基本使用

```typescript
import { generateCouplet } from "@/lib/couplet-generator";

// 配置 LangChain
const langChainConfig = {
  apiKey: process.env.OPENAI_API_KEY!,
  model: "gpt-4",
  temperature: 0.8,
};

// 配置春联参数
const coupletConfig = {
  zodiac: "🐍 蛇年",
  wordCount: "七言",
  style: "传统典雅",
  theme: "万事如意",
  atmosphere: "活泼",
};

// 生成春联
const result = await generateCouplet(langChainConfig, coupletConfig);

console.log(result);
// 输出：
// {
//   upper: "金蛇舞动迎春到",
//   lower: "福气临门万象新",
//   horizontal: "万事如意",
//   explanation: "这副春联以蛇年为主题..."
// }
```

### 2. 使用类实例

```typescript
import { CoupletGenerator } from "@/lib/couplet-generator";

const generator = new CoupletGenerator({
  apiKey: process.env.OPENAI_API_KEY!,
  model: "gpt-4",
});

const result = await generator.generate({
  zodiac: "🐍 蛇年",
  wordCount: "七言",
  style: "传统典雅",
  theme: "万事如意",
  atmosphere: "活泼",
});
```

### 3. 批量生成

```typescript
import { createCoupletGenerator } from "@/lib/couplet-generator";

const generator = createCoupletGenerator({
  apiKey: process.env.OPENAI_API_KEY!,
  model: "gpt-4",
});

// 一次生成 3 副春联
const results = await generator.generateMultiple(
  {
    zodiac: "🐍 蛇年",
    wordCount: "七言",
    style: "传统典雅",
    theme: "财源广进",
    atmosphere: "喜庆",
  },
  3
);
```

### 4. 自定义提示词

```typescript
const generator = createCoupletGenerator({
  apiKey: process.env.OPENAI_API_KEY!,
  model: "gpt-4",
});

const result = await generator.generateWithCustomPrompt(`
请为一家科技公司创作一副充满创新气息的蛇年春联。
要求：七言对联，体现科技创新、人工智能等元素。
`);
```

## 配置说明

### LangChainConfig

| 参数 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| `apiKey` | `string` | ✅ | - | API 密钥 |
| `model` | `string` | ❌ | `"gpt-4"` | 模型名称 |
| `temperature` | `number` | ❌ | `0.8` | 温度参数 (0-1) |
| `maxTokens` | `number` | ❌ | `500` | 最大 token 数 |
| `baseURL` | `string` | ❌ | - | 自定义 API 端点 |

### CoupletConfig

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `zodiac` | `string` | ✅ | 生肖（如：🐍 蛇年） |
| `wordCount` | `"五言" \| "七言" \| "九言"` | ✅ | 春联字数 |
| `style` | `string` | ✅ | 创作风格（如：传统典雅、现代简约） |
| `theme` | `string` | ✅ | 祝福主题（如：万事如意、财源广进） |
| `atmosphere` | `string` | ✅ | 预期氛围（如：活泼、温馨、励志） |

### CoupletResult

生成的春联对象结构：

```typescript
{
  upper: string;        // 上联
  lower: string;        // 下联
  horizontal: string;   // 横批
  explanation: string;  // 解释说明（100-200字）
}
```

## 在 Next.js 中使用

### API Route 示例

创建 `app/api/generate-couplet/route.ts`：

```typescript
import { NextResponse } from "next/server";
import { generateCouplet, type CoupletConfig } from "@/lib/couplet-generator";

export async function POST(request: Request) {
  try {
    const body: CoupletConfig = await request.json();

    const result = await generateCouplet(
      {
        apiKey: process.env.OPENAI_API_KEY!,
        model: "gpt-4",
      },
      body
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
```

### React 组件示例

```typescript
"use client";

import { useState } from "react";
import type { CoupletResult } from "@/lib/couplet-generator";

export default function CoupletGenerator() {
  const [result, setResult] = useState<CoupletResult | null>(null);
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/generate-couplet", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          zodiac: "🐍 蛇年",
          wordCount: "七言",
          style: "传统典雅",
          theme: "万事如意",
          atmosphere: "活泼",
        }),
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
    <div className="space-y-4">
      <button
        onClick={handleGenerate}
        disabled={loading}
        className="px-4 py-2 bg-red-600 text-white rounded"
      >
        {loading ? "生成中..." : "生成春联"}
      </button>

      {result && (
        <div className="space-y-2 p-4 border rounded">
          <p className="text-xl">上联：{result.upper}</p>
          <p className="text-xl">下联：{result.lower}</p>
          <p className="text-lg font-bold">横批：{result.horizontal}</p>
          <p className="text-sm text-gray-600">{result.explanation}</p>
        </div>
      )}
    </div>
  );
}
```

## 使用自定义 API 端点

如果你使用国内镜像或其他 OpenAI 兼容 API：

```typescript
import { CoupletGenerator } from "@/lib/couplet-generator";

const generator = new CoupletGenerator({
  apiKey: "your-api-key",
  model: "Kimi-K2-Instruct", // 或其他模型
  baseURL: "http://api.haihub.cn/v1", // 自定义端点
  temperature: 0.7,
});

const result = await generator.generate({
  zodiac: "🐍 蛇年",
  wordCount: "七言",
  style: "传统典雅",
  theme: "万事如意",
  atmosphere: "活泼",
});
```

## 环境变量配置

在 `.env.local` 中添加：

```bash
OPENAI_API_KEY=your_openai_api_key_here

# 如果使用自定义端点
# OPENAI_BASE_URL=http://api.haihub.cn/v1
# OPENAI_MODEL=gpt-4
```

## 最佳实践

### 1. 错误处理

```typescript
try {
  const result = await generateCouplet(langChainConfig, coupletConfig);
  console.log(result);
} catch (error) {
  if (error instanceof Error) {
    console.error("生成失败：", error.message);
  }
  // 显示友好的错误提示给用户
}
```

### 2. 超时处理

```typescript
const generateWithTimeout = async (timeout = 30000) => {
  const timeoutPromise = new Promise((_, reject) =>
    setTimeout(() => reject(new Error("请求超时")), timeout)
  );

  const generatePromise = generateCouplet(langChainConfig, coupletConfig);

  return Promise.race([generatePromise, timeoutPromise]);
};
```

### 3. 缓存结果

```typescript
const cache = new Map<string, CoupletResult>();

async function getCachedCouplet(config: CoupletConfig) {
  const key = JSON.stringify(config);
  
  if (cache.has(key)) {
    return cache.get(key)!;
  }

  const result = await generateCouplet(langChainConfig, config);
  cache.set(key, result);
  
  return result;
}
```

## 类型定义

```typescript
// 导出的主要类型
export type {
  CoupletConfig,     // 春联配置
  CoupletResult,     // 春联结果
  LangChainConfig,   // LangChain 配置
};

// 导出的主要类和函数
export {
  CoupletGenerator,          // 生成器类
  CoupletSchema,             // Zod Schema
  createCoupletGenerator,    // 创建生成器
  generateCouplet,           // 快捷生成函数
};
```

## 后续集成建议

生成的春联可以用于：

1. **图片生成**：将春联内容传递给图像生成 API（如 DALL-E、Stable Diffusion）
2. **语音合成**：使用 TTS 服务朗读春联
3. **分享功能**：生成精美的春联卡片图片供用户分享
4. **打印功能**：导出为 PDF 或图片格式用于打印

### 图片生成示例（使用 DALL-E）

```typescript
async function generateCoupletImage(couplet: CoupletResult) {
  const prompt = `
中国传统春联书法作品：
上联：${couplet.upper}
下联：${couplet.lower}
横批：${couplet.horizontal}
风格：红色背景，金色楷书，对称布局
`;

  // 调用图像生成 API
  const response = await fetch("https://api.openai.com/v1/images/generations", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: "dall-e-3",
      prompt,
      n: 1,
      size: "1024x1024",
    }),
  });

  const data = await response.json();
  return data.data[0].url;
}
```

## 常见问题

### Q: 如何控制春联的质量？

A: 调整 `temperature` 参数：
- 较低的值（0.5-0.7）：更保守、传统的春联
- 较高的值（0.8-1.0）：更有创意、多样的春联

### Q: 生成速度慢怎么办？

A: 
1. 使用更快的模型（如 `gpt-3.5-turbo`）
2. 减少 `maxTokens` 参数
3. 使用批量生成时考虑并发限制

### Q: 如何确保春联符合要求？

A: 
1. 在配置中提供详细的 `style`、`theme` 和 `atmosphere`
2. 使用 `generateWithCustomPrompt` 方法提供更详细的要求
3. 生成多副春联后让用户选择最满意的

## 许可证

MIT

## 贡献

欢迎提交 Issue 和 Pull Request！
