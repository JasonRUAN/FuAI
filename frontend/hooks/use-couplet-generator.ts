import { useState, useCallback } from "react";
import type { CoupletConfig, CoupletResult } from "@/lib/couplet-generator";

interface UseCoupletGeneratorReturn {
  /** 生成的春联结果 */
  result: CoupletResult | null;
  /** 是否正在生成 */
  loading: boolean;
  /** 错误信息 */
  error: string | null;
  /** 生成春联函数 */
  generate: (config: CoupletConfig) => Promise<void>;
  /** 重置状态 */
  reset: () => void;
}

/**
 * 春联生成器 Hook
 *
 * @example
 * ```tsx
 * const { result, loading, error, generate } = useCoupletGenerator();
 *
 * const handleGenerate = async () => {
 *   await generate({
 *     zodiac: "🐎 马年",
 *     wordCount: "七言",
 *     style: "传统典雅",
 *     theme: "万事如意",
 *     atmosphere: "活泼",
 *   });
 * };
 * ```
 */
export function useCoupletGenerator(): UseCoupletGeneratorReturn {
  const [result, setResult] = useState<CoupletResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generate = useCallback(async (config: CoupletConfig) => {
    // 重置状态
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch("/api/couplet/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(config),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || "生成失败");
      }

      setResult(data.data);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "生成失败，请稍后重试";
      setError(errorMessage);
      console.error("生成春联失败：", err);
    } finally {
      setLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setResult(null);
    setError(null);
    setLoading(false);
  }, []);

  return {
    result,
    loading,
    error,
    generate,
    reset,
  };
}

/**
 * 批量生成春联 Hook
 */
interface UseBatchCoupletGeneratorReturn {
  /** 生成的春联结果数组 */
  results: CoupletResult[];
  /** 是否正在生成 */
  loading: boolean;
  /** 错误信息 */
  error: string | null;
  /** 批量生成春联函数 */
  generateBatch: (config: CoupletConfig, count: number) => Promise<void>;
  /** 重置状态 */
  reset: () => void;
}

/**
 * 批量春联生成器 Hook
 *
 * @example
 * ```tsx
 * const { results, loading, error, generateBatch } = useBatchCoupletGenerator();
 *
 * const handleGenerate = async () => {
 *   await generateBatch({
 *     zodiac: "🐎 马年",
 *     wordCount: "七言",
 *     style: "传统典雅",
 *     theme: "万事如意",
 *     atmosphere: "活泼",
 *   }, 3);
 * };
 * ```
 */
export function useBatchCoupletGenerator(): UseBatchCoupletGeneratorReturn {
  const [results, setResults] = useState<CoupletResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateBatch = useCallback(
    async (config: CoupletConfig, count: number) => {
      setLoading(true);
      setError(null);
      setResults([]);

      try {
        // 并发请求
        const promises = Array.from({ length: count }, () =>
          fetch("/api/couplet/generate", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(config),
          }).then((res) => res.json())
        );

        const responses = await Promise.all(promises);

        // 检查是否有失败的请求
        const failedResponse = responses.find((res) => !res.success);
        if (failedResponse) {
          throw new Error(failedResponse.error || "生成失败");
        }

        // 提取所有结果
        const generatedResults = responses.map((res) => res.data);
        setResults(generatedResults);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "批量生成失败，请稍后重试";
        setError(errorMessage);
        console.error("批量生成春联失败：", err);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const reset = useCallback(() => {
    setResults([]);
    setError(null);
    setLoading(false);
  }, []);

  return {
    results,
    loading,
    error,
    generateBatch,
    reset,
  };
}
