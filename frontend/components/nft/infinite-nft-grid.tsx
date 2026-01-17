/**
 * 无限滚动NFT网格组件
 * 提供更好的性能和用户体验
 */

"use client"

import { useEffect, useRef, useCallback } from "react"
import { useInfiniteNFTList } from "@/hooks/use-nft-data"
import { PaginationParams, NFTData } from "@/types/nft"
import { NFTCard } from "./nft-card"
import { NFTGridSkeleton, NFTCardSkeleton } from "./nft-grid-skeleton"
import { Button } from "@/components/ui/button"
import { Loader2, AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface InfiniteNFTGridProps {
  searchTerm?: string
  sortBy?: PaginationParams['sortBy']
  viewMode: 'grid' | 'list'
  onImageClick: (imageUrl: string, nft?: NFTData) => void
  onTransferClick: (tokenId: string) => void
}

export function InfiniteNFTGrid({
  searchTerm,
  sortBy = 'newest',
  viewMode,
  onImageClick,
  onTransferClick
}: InfiniteNFTGridProps) {
  const observerRef = useRef<IntersectionObserver>()
  const loadMoreRef = useRef<HTMLDivElement>(null)

  // 查询参数
  const baseParams = {
    limit: 20,
    sortBy,
    filterBy: searchTerm ? { owner: searchTerm } : undefined
  }

  // 无限查询
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    error,
    refetch
  } = useInfiniteNFTList(baseParams)

  // 设置交叉观察器
  const lastNFTElementRef = useCallback((node: HTMLDivElement) => {
    if (isLoading) return
    if (observerRef.current) observerRef.current.disconnect()
    
    observerRef.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
        fetchNextPage()
      }
    }, {
      rootMargin: '100px' // 提前100px开始加载
    })
    
    if (node) observerRef.current.observe(node)
  }, [isLoading, hasNextPage, isFetchingNextPage, fetchNextPage])

  // 清理观察器
  useEffect(() => {
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect()
      }
    }
  }, [])

  // 扁平化所有页面的数据
  const allNFTs = data?.pages.flatMap(page => page.data) ?? []
  const totalCount = data?.pages[0]?.pagination.total ?? 0

  // 处理重试
  const handleRetry = () => {
    refetch()
  }

  // 加载状态
  if (isLoading) {
    return <NFTGridSkeleton count={20} viewMode={viewMode} />
  }

  // 错误状态
  if (error) {
    return (
      <Alert className="border-red-500/50 bg-red-500/10">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription className="text-red-300">
          加载NFT数据时出错: {error.message}
          <Button 
            variant="link" 
            size="sm" 
            onClick={handleRetry}
            className="ml-2 text-red-300 hover:text-red-200"
          >
            重试
          </Button>
        </AlertDescription>
      </Alert>
    )
  }

  // 空状态
  if (allNFTs.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="text-6xl mb-4">🎨</div>
        <h3 className="text-xl font-semibold text-slate-300 mb-2">暂无NFT作品</h3>
        <p className="text-slate-400 mb-6">
          {searchTerm ? '没有找到匹配的NFT作品' : '还没有人铸造春联NFT'}
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* 统计信息 */}
      <div className="text-center text-slate-400 text-sm">
        已加载 {allNFTs.length} / {totalCount} 个NFT
      </div>

      {/* NFT网格 */}
      <div className={`grid gap-6 ${
        viewMode === 'grid' 
          ? 'sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
          : 'grid-cols-1 max-w-4xl mx-auto'
      }`}>
        {allNFTs.map((nft, index) => {
          // 为最后几个元素添加ref以触发加载更多
          const isLastElement = index === allNFTs.length - 1
          
          return (
            <div
              key={nft.tokenId}
              ref={isLastElement ? lastNFTElementRef : undefined}
            >
              <NFTCard
                nft={nft}
                viewMode={viewMode}
                onImageClick={(imageUrl) => onImageClick(imageUrl, nft)}
                onTransferClick={onTransferClick}
              />
            </div>
          )
        })}
      </div>

      {/* 加载更多状态 */}
      {isFetchingNextPage && (
        <div className="flex justify-center py-8">
          <div className="flex items-center gap-3 text-slate-400">
            <Loader2 className="h-5 w-5 animate-spin" />
            <span>加载更多NFT...</span>
          </div>
        </div>
      )}

      {/* 手动加载更多按钮（备用） */}
      {hasNextPage && !isFetchingNextPage && (
        <div className="flex justify-center py-8">
          <Button
            variant="outline"
            onClick={() => fetchNextPage()}
            className="border-slate-700 text-slate-200 hover:bg-slate-800"
          >
            加载更多
          </Button>
        </div>
      )}

      {/* 加载完成提示 */}
      {!hasNextPage && allNFTs.length > 0 && (
        <div className="text-center py-8 text-slate-400 text-sm">
          已加载全部 {allNFTs.length} 个NFT
        </div>
      )}

      {/* 用于触发加载更多的隐藏元素 */}
      <div ref={loadMoreRef} className="h-1" />
    </div>
  )
}

/**
 * 虚拟化NFT网格组件（用于大量数据）
 */
export function VirtualizedNFTGrid({
  searchTerm,
  sortBy = 'newest',
  viewMode,
  onImageClick,
  onTransferClick
}: InfiniteNFTGridProps) {
  // 这里可以集成 react-window 或 react-virtualized 来处理大量数据
  // 暂时使用无限滚动作为替代方案
  return (
    <InfiniteNFTGrid
      searchTerm={searchTerm}
      sortBy={sortBy}
      viewMode={viewMode}
      onImageClick={onImageClick}
      onTransferClick={onTransferClick}
    />
  )
}

/**
 * 性能优化的NFT网格容器
 */
export function OptimizedNFTGrid(props: InfiniteNFTGridProps) {
  // 根据数据量选择合适的渲染策略
  // 少量数据使用普通渲染，大量数据使用虚拟化
  return <InfiniteNFTGrid {...props} />
}