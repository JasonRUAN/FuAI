/**
 * NFT网格骨架屏组件
 */

"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

interface NFTGridSkeletonProps {
  count?: number
  viewMode?: 'grid' | 'list'
}

export function NFTGridSkeleton({ count = 20, viewMode = 'grid' }: NFTGridSkeletonProps) {
  // 网格模式骨架屏
  if (viewMode === 'grid') {
    return (
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array.from({ length: count }).map((_, index) => (
          <Card key={index} className="overflow-hidden bg-red-50/50 dark:bg-red-950/20 border-red-500/20">
            <CardContent className="p-0">
              {/* 图片区域 */}
              <div className="aspect-square">
                <Skeleton className="w-full h-full bg-red-200/50 dark:bg-red-800/30" />
              </div>

              {/* 春联展示区 */}
              <div className="p-4 space-y-3">
                <div className="flex flex-col items-center space-y-2">
                  <Skeleton className="h-6 w-20 bg-red-200/50 dark:bg-red-800/30" />
                  <div className="flex gap-4">
                    <Skeleton className="h-16 w-8 bg-red-200/50 dark:bg-red-800/30" />
                    <Skeleton className="h-16 w-8 bg-red-200/50 dark:bg-red-800/30" />
                  </div>
                </div>
              </div>

              {/* 信息区 */}
              <div className="p-4 space-y-3 bg-red-50/30 dark:bg-red-950/10">
                <div className="flex items-center justify-between">
                  <Skeleton className="h-4 w-12 bg-red-200/50 dark:bg-red-800/30" />
                  <Skeleton className="h-4 w-16 bg-red-200/50 dark:bg-red-800/30" />
                </div>
                <div className="flex items-center justify-between">
                  <Skeleton className="h-4 w-20 bg-red-200/50 dark:bg-red-800/30" />
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-4 w-8 bg-red-200/50 dark:bg-red-800/30" />
                    <Skeleton className="h-4 w-12 bg-red-200/50 dark:bg-red-800/30" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  // 列表模式骨架屏
  return (
    <div className="grid grid-cols-1 max-w-4xl mx-auto gap-6">
      {Array.from({ length: count }).map((_, index) => (
        <Card key={index} className="overflow-hidden bg-red-50/50 dark:bg-red-950/20 border-red-500/20">
          <CardContent className="p-0">
            <div className="flex">
              {/* 左侧图片 */}
              <div className="w-32 h-32 flex-shrink-0">
                <Skeleton className="w-full h-full bg-red-200/50 dark:bg-red-800/30" />
              </div>

              {/* 右侧内容 */}
              <div className="flex-1 p-4 space-y-3">
                {/* 标题区 */}
                <div className="flex items-center gap-4">
                  <Skeleton className="h-6 w-20 bg-red-200/50 dark:bg-red-800/30" />
                  <Skeleton className="h-6 w-16 bg-red-200/50 dark:bg-red-800/30" />
                </div>

                {/* 春联内容 */}
                <div className="grid grid-cols-2 gap-4">
                  <Skeleton className="h-4 w-full bg-red-200/50 dark:bg-red-800/30" />
                  <Skeleton className="h-4 w-full bg-red-200/50 dark:bg-red-800/30" />
                </div>

                {/* 底部信息 */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Skeleton className="h-4 w-20 bg-red-200/50 dark:bg-red-800/30" />
                    <Skeleton className="h-4 w-16 bg-red-200/50 dark:bg-red-800/30" />
                  </div>
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-4 w-8 bg-red-200/50 dark:bg-red-800/30" />
                    <Skeleton className="h-8 w-8 bg-red-200/50 dark:bg-red-800/30" />
                    <Skeleton className="h-8 w-8 bg-red-200/50 dark:bg-red-800/30" />
                    <Skeleton className="h-8 w-8 bg-red-200/50 dark:bg-red-800/30" />
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

/**
 * 单个NFT卡片骨架屏
 */
export function NFTCardSkeleton({ viewMode = 'grid' }: { viewMode?: 'grid' | 'list' }) {
  if (viewMode === 'grid') {
    return (
      <Card className="overflow-hidden bg-red-50/50 dark:bg-red-950/20 border-red-500/20 animate-pulse">
        <CardContent className="p-0">
          <div className="aspect-square bg-red-200/50 dark:bg-red-800/30" />
          <div className="p-4 space-y-3">
            <div className="flex flex-col items-center space-y-2">
              <div className="h-6 w-20 bg-red-200/50 dark:bg-red-800/30 rounded" />
              <div className="flex gap-4">
                <div className="h-16 w-8 bg-red-200/50 dark:bg-red-800/30 rounded" />
                <div className="h-16 w-8 bg-red-200/50 dark:bg-red-800/30 rounded" />
              </div>
            </div>
          </div>
          <div className="p-4 space-y-3 bg-red-50/30 dark:bg-red-950/10">
            <div className="flex items-center justify-between">
              <div className="h-4 w-12 bg-red-200/50 dark:bg-red-800/30 rounded" />
              <div className="h-4 w-16 bg-red-200/50 dark:bg-red-800/30 rounded" />
            </div>
            <div className="flex items-center justify-between">
              <div className="h-4 w-20 bg-red-200/50 dark:bg-red-800/30 rounded" />
              <div className="flex items-center gap-2">
                <div className="h-4 w-8 bg-red-200/50 dark:bg-red-800/30 rounded" />
                <div className="h-4 w-12 bg-red-200/50 dark:bg-red-800/30 rounded" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="overflow-hidden bg-red-50/50 dark:bg-red-950/20 border-red-500/20 animate-pulse">
      <CardContent className="p-0">
        <div className="flex">
          <div className="w-32 h-32 flex-shrink-0 bg-red-200/50 dark:bg-red-800/30" />
          <div className="flex-1 p-4 space-y-3">
            <div className="flex items-center gap-4">
              <div className="h-6 w-20 bg-red-200/50 dark:bg-red-800/30 rounded" />
              <div className="h-6 w-16 bg-red-200/50 dark:bg-red-800/30 rounded" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="h-4 w-full bg-red-200/50 dark:bg-red-800/30 rounded" />
              <div className="h-4 w-full bg-red-200/50 dark:bg-red-800/30 rounded" />
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="h-4 w-20 bg-red-200/50 dark:bg-red-800/30 rounded" />
                <div className="h-4 w-16 bg-red-200/50 dark:bg-red-800/30 rounded" />
              </div>
              <div className="flex items-center gap-2">
                <div className="h-4 w-8 bg-red-200/50 dark:bg-red-800/30 rounded" />
                <div className="h-8 w-8 bg-red-200/50 dark:bg-red-800/30 rounded" />
                <div className="h-8 w-8 bg-red-200/50 dark:bg-red-800/30 rounded" />
                <div className="h-8 w-8 bg-red-200/50 dark:bg-red-800/30 rounded" />
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}