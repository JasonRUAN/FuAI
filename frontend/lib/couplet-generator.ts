import { ChatOpenAI } from "@langchain/openai";
import * as z from "zod";

/**
 * 春联配置接口
 */
export interface CoupletConfig {
  /** 生肖（如：🐎 马年） */
  zodiac: string;
  /** 字数（如：五言、七言） */
  wordCount: "五言" | "七言" | "九言";
  /** 创作风格 */
  style: string;
  /** 祝福主题 */
  theme: string;
  /** 预期氛围 */
  atmosphere: string;
  /** 是否启用藏头春联 */
  isAcrostic?: boolean;
  /** 藏头春联的文字内容（通常为2-4个字） */
  acrosticText?: string;
}

/**
 * 春联结果结构
 */
export const CoupletSchema = z.object({
  /** 上联 */
  upper: z.string().describe("春联的上联内容"),
  /** 下联 */
  lower: z.string().describe("春联的下联内容"),
  /** 横批 */
  horizontal: z.string().describe("春联的横批内容"),
  /** 解释说明 */
  explanation: z.string().describe("春联的创作寓意和文化内涵解释"),
});

export type CoupletResult = z.infer<typeof CoupletSchema>;

/**
 * LangChain 配置接口
 */
export interface LangChainConfig {
  /** API Key */
  apiKey: string;
  /** 模型名称（默认：gpt-4） */
  model?: string;
  /** 温度参数（0-1，默认：0.8） */
  temperature?: number;
  /** 最大 token 数（默认：500） */
  maxTokens?: number;
  /** 自定义 baseURL（可选） */
  baseURL?: string;
}

/**
 * 春联生成器类
 */
export class CoupletGenerator {
  private llm: ChatOpenAI;
  private modelWithStructuredOutput: ReturnType<
    ChatOpenAI["withStructuredOutput"]
  >;

  constructor(config: LangChainConfig) {
    const {
      apiKey,
      model = "gpt-4",
      temperature = 0.8,
      maxTokens = 500,
      baseURL,
    } = config;

    // 初始化 LangChain ChatOpenAI 实例
    this.llm = new ChatOpenAI({
      apiKey,
      model,
      temperature,
      maxTokens,
      ...(baseURL && {
        configuration: {
          baseURL,
        },
      }),
    });

    // 使用结构化输出
    this.modelWithStructuredOutput =
      this.llm.withStructuredOutput(CoupletSchema);
  }

  /**
   * 生成春联
   * @param config 春联配置
   * @returns 包含上联、下联、横批和解释的春联对象
   */
  async generate(config: CoupletConfig): Promise<CoupletResult> {
    const {
      zodiac,
      wordCount,
      style,
      theme,
      atmosphere,
      isAcrostic,
      acrosticText,
    } = config;

    // 构建系统提示词
    const systemPrompt = `你是一位精通中国传统文化的春联创作大师，擅长根据不同风格、主题创作对仗工整、寓意吉祥的春联。

你需要根据用户提供的配置信息，创作一副完整的春联，包括：
1. 上联：字数符合要求，对仗工整
2. 下联：与上联字数相同，对仗工整，音韵和谐
3. 横批：通常为四字，点明主题
4. 解释：详细说明春联的创作寓意、文化内涵、对仗技巧等（100-200字）

请确保春联内容积极向上、寓意吉祥，符合中国传统文化和春节习俗。

重要：请以 JSON 格式返回结果，包含 upper（上联）、lower（下联）、horizontal（横批）、explanation（解释）四个字段。`;

    // 构建用户提示词
    let userPrompt = `请根据以下配置创作一副春联：

【生肖】：${zodiac}
【字数】：${wordCount}
【创作风格】：${style}
【祝福主题】：${theme}
【预期氛围】：${atmosphere}`;

    // 如果启用了藏头春联，添加特殊要求
    if (isAcrostic && acrosticText && acrosticText.length >= 2) {
      const chars = acrosticText.split("");
      userPrompt += `
【藏头要求】：这是一副藏头春联，请务必满足以下要求：
  - 上联的第一个字必须是「${chars[0]}」
  - 下联的第一个字必须是「${chars[1]}」
  ${chars[2] ? `- 横批的第一个字建议包含「${chars[2]}」` : ""}
  ${chars[3] ? `- 横批的第二个字建议包含「${chars[3]}」` : ""}
  - 在保证藏头的前提下，仍然要确保对仗工整、意境连贯、寓意吉祥
  - 藏头内容：「${acrosticText}」应当自然融入春联，不显生硬`;
    }

    userPrompt += `

请创作一副符合以上要求的春联，并提供详细的解释说明。`;

    try {
      // 调用 LangChain 进行结构化输出
      const result = await this.modelWithStructuredOutput.invoke([
        {
          role: "system",
          content: systemPrompt,
        },
        {
          role: "user",
          content: userPrompt,
        },
      ]);

      return result as CoupletResult;
    } catch (error) {
      throw new Error(
        `春联生成失败: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }

  /**
   * 批量生成多副春联
   * @param config 春联配置
   * @param count 生成数量（默认：3）
   * @returns 春联数组
   */
  async generateMultiple(
    config: CoupletConfig,
    count: number = 3
  ): Promise<CoupletResult[]> {
    const promises = Array.from({ length: count }, () => this.generate(config));
    return Promise.all(promises);
  }

  /**
   * 根据自定义提示词生成春联
   * @param customPrompt 自定义提示词
   * @returns 春联对象
   */
  async generateWithCustomPrompt(customPrompt: string): Promise<CoupletResult> {
    const systemPrompt = `你是一位精通中国传统文化的春联创作大师，擅长根据不同风格、主题创作对仗工整、寓意吉祥的春联。

请根据用户的要求创作春联，并提供详细的解释说明（100-200字），包括创作寓意、文化内涵、对仗技巧等。

重要：请以 JSON 格式返回结果，包含 upper（上联）、lower（下联）、horizontal（横批）、explanation（解释）四个字段。`;

    try {
      const result = await this.modelWithStructuredOutput.invoke([
        {
          role: "system",
          content: systemPrompt,
        },
        {
          role: "user",
          content: customPrompt,
        },
      ]);

      return result as CoupletResult;
    } catch (error) {
      throw new Error(
        `春联生成失败: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }
}

/**
 * 快捷函数：创建春联生成器实例
 */
export function createCoupletGenerator(
  config: LangChainConfig
): CoupletGenerator {
  return new CoupletGenerator(config);
}

/**
 * 快捷函数：一次性生成春联
 */
export async function generateCouplet(
  langChainConfig: LangChainConfig,
  coupletConfig: CoupletConfig
): Promise<CoupletResult> {
  const generator = new CoupletGenerator(langChainConfig);
  return generator.generate(coupletConfig);
}
