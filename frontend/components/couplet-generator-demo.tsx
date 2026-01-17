"use client";

import { useState } from "react";
import { useCoupletGenerator } from "@/hooks/use-couplet-generator";
import type { CoupletConfig } from "@/lib/couplet-generator";

/**
 * 春联生成器演示组件
 *
 * 这是一个完整的示例组件，展示如何使用春联生成器
 */
export function CoupletGeneratorDemo() {
  const { result, loading, error, generate } = useCoupletGenerator();

  // 表单状态
  const [config, setConfig] = useState<CoupletConfig>({
    zodiac: "🐎 马年",
    wordCount: "七言",
    style: "传统典雅",
    theme: "万事如意",
    atmosphere: "活泼",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await generate(config);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-red-600">🎊 AI 春联生成器</h1>
        <p className="text-gray-600">基于 LangChain 的智能春联创作助手</p>
      </div>

      {/* 配置表单 */}
      <form
        onSubmit={handleSubmit}
        className="space-y-4 bg-white p-6 rounded-lg shadow"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* 生肖 */}
          <div>
            <label className="block text-sm font-medium mb-2">生肖</label>
            <input
              type="text"
              value={config.zodiac}
              onChange={(e) => setConfig({ ...config, zodiac: e.target.value })}
              className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-red-500"
              placeholder="如：🐎 马年"
            />
          </div>

          {/* 字数 */}
          <div>
            <label className="block text-sm font-medium mb-2">字数</label>
            <select
              value={config.wordCount}
              onChange={(e) =>
                setConfig({
                  ...config,
                  wordCount: e.target.value as "五言" | "七言" | "九言",
                })
              }
              className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-red-500"
            >
              <option value="五言">五言</option>
              <option value="七言">七言</option>
              <option value="九言">九言</option>
            </select>
          </div>

          {/* 创作风格 */}
          <div>
            <label className="block text-sm font-medium mb-2">创作风格</label>
            <input
              type="text"
              value={config.style}
              onChange={(e) => setConfig({ ...config, style: e.target.value })}
              className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-red-500"
              placeholder="如：传统典雅、现代简约"
            />
          </div>

          {/* 祝福主题 */}
          <div>
            <label className="block text-sm font-medium mb-2">祝福主题</label>
            <input
              type="text"
              value={config.theme}
              onChange={(e) => setConfig({ ...config, theme: e.target.value })}
              className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-red-500"
              placeholder="如：万事如意、财源广进"
            />
          </div>

          {/* 预期氛围 */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-2">预期氛围</label>
            <input
              type="text"
              value={config.atmosphere}
              onChange={(e) =>
                setConfig({ ...config, atmosphere: e.target.value })
              }
              className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-red-500"
              placeholder="如：活泼、温馨、励志"
            />
          </div>
        </div>

        {/* 提交按钮 */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-red-600 text-white py-3 rounded-md font-medium hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? "生成中..." : "🎨 生成春联"}
        </button>
      </form>

      {/* 错误提示 */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
          <p className="font-medium">生成失败</p>
          <p className="text-sm">{error}</p>
        </div>
      )}

      {/* 春联结果 */}
      {result && (
        <div className="bg-gradient-to-br from-red-50 to-orange-50 p-8 rounded-lg shadow-lg space-y-6">
          {/* 横批 */}
          <div className="text-center">
            <div className="inline-block bg-red-600 text-white px-8 py-3 rounded-lg text-2xl font-bold shadow-md">
              {result.horizontal}
            </div>
          </div>

          {/* 上下联 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* 上联 */}
            <div className="bg-white p-6 rounded-lg shadow-md border-2 border-red-400">
              <p className="text-gray-500 text-sm mb-2">上联</p>
              <p className="text-2xl font-serif text-red-800 leading-relaxed">
                {result.upper}
              </p>
            </div>

            {/* 下联 */}
            <div className="bg-white p-6 rounded-lg shadow-md border-2 border-red-400">
              <p className="text-gray-500 text-sm mb-2">下联</p>
              <p className="text-2xl font-serif text-red-800 leading-relaxed">
                {result.lower}
              </p>
            </div>
          </div>

          {/* 解释 */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <p className="text-gray-700 font-medium mb-2">📖 创作解释</p>
            <p className="text-gray-600 leading-relaxed">
              {result.explanation}
            </p>
          </div>

          {/* 操作按钮 */}
          <div className="flex gap-4 justify-center">
            <button
              onClick={() => generate(config)}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              🔄 重新生成
            </button>
            <button
              onClick={() => {
                const text = `${result.upper}\n${result.lower}\n${result.horizontal}`;
                navigator.clipboard.writeText(text);
                alert("春联已复制到剪贴板！");
              }}
              className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
            >
              📋 复制春联
            </button>
          </div>
        </div>
      )}

      {/* 使用说明 */}
      <div className="bg-blue-50 p-4 rounded-md text-sm text-gray-700">
        <p className="font-medium mb-2">💡 使用提示：</p>
        <ul className="list-disc list-inside space-y-1">
          <li>填写完整的配置信息以获得更好的春联效果</li>
          <li>可以多次生成，每次都会得到不同的春联</li>
          <li>生成的春联包含详细的文化内涵解释</li>
          <li>支持五言、七言、九言三种格式</li>
        </ul>
      </div>
    </div>
  );
}
