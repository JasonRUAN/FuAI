/**
 * 性能监控组件
 * 监控NFT画廊的性能指标
 */

"use client"

import { useEffect, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  Activity, 
  Database, 
  Clock, 
  Zap,
  TrendingUp,
  TrendingDown,
  Minus
} from "lucide-react"
import { useCacheStats } from "@/hooks/use-nft-data"

interface PerformanceMetrics {
  loadTime: number
  renderTime: number
  cacheHitRate: number
  memoryUsage: number
  networkRequests: number
  errorRate: number
}

interface PerformanceMonitorProps {
  showDetails?: boolean
  onToggleDetails?: () => void
}

export function PerformanceMonitor({ 
  showDetails = false, 
  onToggleDetails 
}: PerformanceMonitorProps) {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    loadTime: 0,
    renderTime: 0,
    cacheHitRate: 0,
    memoryUsage: 0,
    networkRequests: 0,
    errorRate: 0
  })

  const [isVisible, setIsVisible] = useState(false)
  const { data: cacheStats } = useCacheStats()

  // 性能指标收集
  useEffect(() => {
    const startTime = performance.now()
    let renderStartTime = 0

    // 监听页面加载性能
    const updateMetrics = () => {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
      const loadTime = navigation.loadEventEnd - navigation.loadEventStart
      
      // 获取内存使用情况（如果支持）
      const memoryInfo = (performance as any).memory
      const memoryUsage = memoryInfo ? 
        (memoryInfo.usedJSHeapSize / memoryInfo.totalJSHeapSize) * 100 : 0

      // 计算渲染时间
      const renderTime = performance.now() - startTime

      // 获取网络请求数量
      const resourceEntries = performance.getEntriesByType('resource')
      const networkRequests = resourceEntries.length

      setMetrics(prev => ({
        ...prev,
        loadTime: Math.round(loadTime),
        renderTime: Math.round(renderTime),
        memoryUsage: Math.round(memoryUsage),
        networkRequests,
        cacheHitRate: cacheStats ? 
          Math.round((cacheStats.memorySize / (cacheStats.memorySize + networkRequests)) * 100) : 0
      }))
    }

    // 延迟更新以确保所有资源加载完成
    const timer = setTimeout(updateMetrics, 1000)

    return () => clearTimeout(timer)
  }, [cacheStats])

  // 性能等级评估
  const getPerformanceGrade = (metrics: PerformanceMetrics): {
    grade: 'A' | 'B' | 'C' | 'D' | 'F'
    color: string
    icon: React.ReactNode
  } => {
    const score = (
      (metrics.loadTime < 1000 ? 20 : metrics.loadTime < 3000 ? 15 : 10) +
      (metrics.renderTime < 100 ? 20 : metrics.renderTime < 300 ? 15 : 10) +
      (metrics.cacheHitRate > 80 ? 20 : metrics.cacheHitRate > 60 ? 15 : 10) +
      (metrics.memoryUsage < 50 ? 20 : metrics.memoryUsage < 80 ? 15 : 10) +
      (metrics.errorRate < 1 ? 20 : metrics.errorRate < 5 ? 15 : 10)
    )

    if (score >= 90) return { grade: 'A', color: 'text-green-400', icon: <TrendingUp className="h-4 w-4" /> }
    if (score >= 80) return { grade: 'B', color: 'text-blue-400', icon: <TrendingUp className="h-4 w-4" /> }
    if (score >= 70) return { grade: 'C', color: 'text-yellow-400', icon: <Minus className="h-4 w-4" /> }
    if (score >= 60) return { grade: 'D', color: 'text-orange-400', icon: <TrendingDown className="h-4 w-4" /> }
    return { grade: 'F', color: 'text-red-400', icon: <TrendingDown className="h-4 w-4" /> }
  }

  const performanceGrade = getPerformanceGrade(metrics)

  // 开发环境下显示性能监控
  if (process.env.NODE_ENV !== 'development' && !isVisible) {
    return null
  }

  return (
    <>
      {/* 性能指示器 */}
      <div className="fixed bottom-4 right-4 z-50">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsVisible(!isVisible)}
          className="bg-slate-800/90 backdrop-blur-sm border-slate-700 text-slate-200 hover:bg-slate-700"
        >
          <Activity className="h-4 w-4 mr-2" />
          性能 {performanceGrade.grade}
        </Button>
      </div>

      {/* 详细性能面板 */}
      {isVisible && (
        <div className="fixed bottom-16 right-4 z-50 w-80">
          <Card className="bg-slate-900/95 backdrop-blur-sm border-slate-700">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center justify-between text-slate-200">
                <div className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  性能监控
                </div>
                <div className={`flex items-center gap-1 ${performanceGrade.color}`}>
                  {performanceGrade.icon}
                  <span className="font-bold">{performanceGrade.grade}</span>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* 核心指标 */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-1 text-xs text-slate-400">
                    <Clock className="h-3 w-3" />
                    加载时间
                  </div>
                  <div className="text-sm font-mono text-slate-200">
                    {metrics.loadTime}ms
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-1 text-xs text-slate-400">
                    <Zap className="h-3 w-3" />
                    渲染时间
                  </div>
                  <div className="text-sm font-mono text-slate-200">
                    {metrics.renderTime}ms
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-1 text-xs text-slate-400">
                    <Database className="h-3 w-3" />
                    缓存命中率
                  </div>
                  <div className="text-sm font-mono text-slate-200">
                    {metrics.cacheHitRate}%
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-1 text-xs text-slate-400">
                    <Activity className="h-3 w-3" />
                    内存使用
                  </div>
                  <div className="text-sm font-mono text-slate-200">
                    {metrics.memoryUsage}%
                  </div>
                </div>
              </div>

              {/* 缓存统计 */}
              {cacheStats && (
                <div className="border-t border-slate-700 pt-3">
                  <div className="text-xs text-slate-400 mb-2">缓存状态</div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-400">内存缓存</span>
                      <span className="text-slate-200 font-mono">
                        {cacheStats.memorySize}/{cacheStats.maxMemorySize}
                      </span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-400">使用率</span>
                      <span className="text-slate-200 font-mono">
                        {Math.round(cacheStats.memoryUsage)}%
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* 网络统计 */}
              <div className="border-t border-slate-700 pt-3">
                <div className="text-xs text-slate-400 mb-2">网络统计</div>
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-400">请求数量</span>
                    <span className="text-slate-200 font-mono">
                      {metrics.networkRequests}
                    </span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-400">错误率</span>
                    <span className="text-slate-200 font-mono">
                      {metrics.errorRate}%
                    </span>
                  </div>
                </div>
              </div>

              {/* 性能建议 */}
              <div className="border-t border-slate-700 pt-3">
                <div className="text-xs text-slate-400 mb-2">性能建议</div>
                <div className="space-y-1 text-xs text-slate-300">
                  {metrics.loadTime > 3000 && (
                    <div className="text-yellow-400">• 页面加载时间较长，考虑优化资源</div>
                  )}
                  {metrics.cacheHitRate < 60 && (
                    <div className="text-yellow-400">• 缓存命中率较低，检查缓存策略</div>
                  )}
                  {metrics.memoryUsage > 80 && (
                    <div className="text-red-400">• 内存使用率过高，可能存在内存泄漏</div>
                  )}
                  {performanceGrade.grade === 'A' && (
                    <div className="text-green-400">• 性能表现优秀！</div>
                  )}
                </div>
              </div>

              {/* 操作按钮 */}
              <div className="flex gap-2 pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.location.reload()}
                  className="flex-1 text-xs border-slate-700 text-slate-300 hover:bg-slate-800"
                >
                  刷新测试
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsVisible(false)}
                  className="flex-1 text-xs border-slate-700 text-slate-300 hover:bg-slate-800"
                >
                  关闭
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  )
}

/**
 * 性能指标收集Hook
 */
export function usePerformanceMetrics() {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    loadTime: 0,
    renderTime: 0,
    cacheHitRate: 0,
    memoryUsage: 0,
    networkRequests: 0,
    errorRate: 0
  })

  useEffect(() => {
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries()
      
      entries.forEach((entry) => {
        if (entry.entryType === 'navigation') {
          const navEntry = entry as PerformanceNavigationTiming
          setMetrics(prev => ({
            ...prev,
            loadTime: navEntry.loadEventEnd - navEntry.loadEventStart
          }))
        }
        
        if (entry.entryType === 'measure') {
          setMetrics(prev => ({
            ...prev,
            renderTime: entry.duration
          }))
        }
      })
    })

    observer.observe({ entryTypes: ['navigation', 'measure'] })

    return () => observer.disconnect()
  }, [])

  return metrics
}