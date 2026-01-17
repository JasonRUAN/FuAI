/**
 * 春联生成器测试文件
 * 
 * 注意：这些测试需要真实的 API Key 才能运行
 * 建议在开发环境中手动运行测试
 */

import {
  CoupletGenerator,
  createCoupletGenerator,
  generateCouplet,
  type CoupletConfig,
  type LangChainConfig,
} from "./couplet-generator";

// 测试配置
const TEST_API_KEY = process.env.OPENAI_API_KEY || "test-key";
const TEST_BASE_URL = process.env.OPENAI_BASE_URL;

const testLangChainConfig: LangChainConfig = {
  apiKey: TEST_API_KEY,
  model: "gpt-4",
  temperature: 0.8,
  maxTokens: 500,
  ...(TEST_BASE_URL && { baseURL: TEST_BASE_URL }),
};

const testCoupletConfig: CoupletConfig = {
  zodiac: "🐍 蛇年",
  wordCount: "七言",
  style: "传统典雅",
  theme: "万事如意",
  atmosphere: "活泼",
};

/**
 * 验证春联结果的结构
 */
function validateCoupletResult(result: any): boolean {
  return (
    typeof result === "object" &&
    typeof result.upper === "string" &&
    result.upper.length > 0 &&
    typeof result.lower === "string" &&
    result.lower.length > 0 &&
    typeof result.horizontal === "string" &&
    result.horizontal.length > 0 &&
    typeof result.explanation === "string" &&
    result.explanation.length > 0
  );
}

/**
 * 测试 1: 基本生成功能
 */
async function testBasicGeneration() {
  console.log("\n=== 测试 1: 基本生成功能 ===");

  try {
    const generator = new CoupletGenerator(testLangChainConfig);
    const result = await generator.generate(testCoupletConfig);

    console.log("✅ 生成成功");
    console.log("上联：", result.upper);
    console.log("下联：", result.lower);
    console.log("横批：", result.horizontal);
    console.log("解释：", result.explanation.substring(0, 50) + "...");

    if (!validateCoupletResult(result)) {
      throw new Error("结果结构验证失败");
    }

    console.log("✅ 结果结构验证通过");
    return true;
  } catch (error) {
    console.error("❌ 测试失败：", error);
    return false;
  }
}

/**
 * 测试 2: 快捷函数
 */
async function testShortcutFunction() {
  console.log("\n=== 测试 2: 快捷函数 ===");

  try {
    const result = await generateCouplet(
      testLangChainConfig,
      testCoupletConfig
    );

    console.log("✅ 快捷函数生成成功");
    console.log("上联：", result.upper);
    console.log("下联：", result.lower);
    console.log("横批：", result.horizontal);

    if (!validateCoupletResult(result)) {
      throw new Error("结果结构验证失败");
    }

    console.log("✅ 结果结构验证通过");
    return true;
  } catch (error) {
    console.error("❌ 测试失败：", error);
    return false;
  }
}

/**
 * 测试 3: 批量生成
 */
async function testBatchGeneration() {
  console.log("\n=== 测试 3: 批量生成 ===");

  try {
    const generator = createCoupletGenerator(testLangChainConfig);
    const count = 2; // 减少测试数量以节省时间
    const results = await generator.generateMultiple(testCoupletConfig, count);

    console.log(`✅ 成功生成 ${results.length} 副春联`);

    results.forEach((result, index) => {
      console.log(`\n--- 第 ${index + 1} 副春联 ---`);
      console.log("上联：", result.upper);
      console.log("下联：", result.lower);
      console.log("横批：", result.horizontal);

      if (!validateCoupletResult(result)) {
        throw new Error(`第 ${index + 1} 副春联结构验证失败`);
      }
    });

    if (results.length !== count) {
      throw new Error(`期望生成 ${count} 副，实际生成 ${results.length} 副`);
    }

    console.log("✅ 批量生成验证通过");
    return true;
  } catch (error) {
    console.error("❌ 测试失败：", error);
    return false;
  }
}

/**
 * 测试 4: 自定义提示词
 */
async function testCustomPrompt() {
  console.log("\n=== 测试 4: 自定义提示词 ===");

  try {
    const generator = createCoupletGenerator(testLangChainConfig);
    const customPrompt = `
请创作一副蛇年春联，要求：
- 七言对联
- 体现科技创新和人工智能主题
- 风格现代但不失传统韵味
- 寓意美好、积极向上
`;

    const result = await generator.generateWithCustomPrompt(customPrompt);

    console.log("✅ 自定义提示词生成成功");
    console.log("上联：", result.upper);
    console.log("下联：", result.lower);
    console.log("横批：", result.horizontal);
    console.log("解释：", result.explanation.substring(0, 50) + "...");

    if (!validateCoupletResult(result)) {
      throw new Error("结果结构验证失败");
    }

    console.log("✅ 结果结构验证通过");
    return true;
  } catch (error) {
    console.error("❌ 测试失败：", error);
    return false;
  }
}

/**
 * 测试 5: 不同字数的春联
 */
async function testDifferentWordCounts() {
  console.log("\n=== 测试 5: 不同字数的春联 ===");

  const wordCounts: Array<"五言" | "七言" | "九言"> = ["五言", "七言", "九言"];

  for (const wordCount of wordCounts) {
    try {
      console.log(`\n--- 测试 ${wordCount} 春联 ---`);

      const config: CoupletConfig = {
        ...testCoupletConfig,
        wordCount,
      };

      const result = await generateCouplet(testLangChainConfig, config);

      console.log(`✅ ${wordCount} 春联生成成功`);
      console.log("上联：", result.upper);
      console.log("下联：", result.lower);
      console.log("横批：", result.horizontal);

      if (!validateCoupletResult(result)) {
        throw new Error("结果结构验证失败");
      }
    } catch (error) {
      console.error(`❌ ${wordCount} 春联测试失败：`, error);
      return false;
    }
  }

  console.log("\n✅ 所有字数测试通过");
  return true;
}

/**
 * 测试 6: 错误处理
 */
async function testErrorHandling() {
  console.log("\n=== 测试 6: 错误处理 ===");

  try {
    // 使用无效的 API Key
    const invalidConfig: LangChainConfig = {
      apiKey: "invalid-key",
      model: "gpt-4",
    };

    const generator = new CoupletGenerator(invalidConfig);

    try {
      await generator.generate(testCoupletConfig);
      console.error("❌ 应该抛出错误但没有");
      return false;
    } catch (error) {
      console.log("✅ 正确捕获了错误");
      console.log("错误信息：", error instanceof Error ? error.message : error);
      return true;
    }
  } catch (error) {
    console.error("❌ 测试失败：", error);
    return false;
  }
}

/**
 * 运行所有测试
 */
async function runAllTests() {
  console.log("🚀 开始运行春联生成器测试套件");
  console.log("注意：这些测试需要有效的 API Key");

  // 检查 API Key
  if (!TEST_API_KEY || TEST_API_KEY === "test-key") {
    console.warn(
      "\n⚠️  警告：未设置 OPENAI_API_KEY 环境变量，测试可能会失败"
    );
    console.warn("请设置环境变量后再运行测试：");
    console.warn("export OPENAI_API_KEY=your_api_key_here\n");
  }

  const tests = [
    { name: "基本生成功能", fn: testBasicGeneration },
    { name: "快捷函数", fn: testShortcutFunction },
    { name: "批量生成", fn: testBatchGeneration },
    { name: "自定义提示词", fn: testCustomPrompt },
    { name: "不同字数", fn: testDifferentWordCounts },
    { name: "错误处理", fn: testErrorHandling },
  ];

  const results = [];

  for (const test of tests) {
    try {
      const result = await test.fn();
      results.push({ name: test.name, passed: result });
    } catch (error) {
      console.error(`\n❌ 测试 "${test.name}" 执行失败：`, error);
      results.push({ name: test.name, passed: false });
    }
  }

  // 输出测试总结
  console.log("\n" + "=".repeat(50));
  console.log("📊 测试总结");
  console.log("=".repeat(50));

  let passedCount = 0;
  results.forEach((result) => {
    const status = result.passed ? "✅ 通过" : "❌ 失败";
    console.log(`${status} - ${result.name}`);
    if (result.passed) passedCount++;
  });

  console.log("=".repeat(50));
  console.log(
    `总计：${passedCount}/${results.length} 个测试通过`
  );

  if (passedCount === results.length) {
    console.log("🎉 所有测试通过！");
  } else {
    console.log(`⚠️  ${results.length - passedCount} 个测试失败`);
  }
}

// 导出测试函数
export {
  testBasicGeneration,
  testShortcutFunction,
  testBatchGeneration,
  testCustomPrompt,
  testDifferentWordCounts,
  testErrorHandling,
  runAllTests,
};

// 如果直接运行此文件，执行所有测试
if (require.main === module) {
  runAllTests().catch((error) => {
    console.error("测试套件执行失败：", error);
    process.exit(1);
  });
}
