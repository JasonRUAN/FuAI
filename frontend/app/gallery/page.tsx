"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { 
  Search, 
  SortAsc, 
  SortDesc, 
  RefreshCw, 
  Filter,
  Grid3X3,
  List,
  AlertCircle,
  UserCircle
} from "lucide-react"
import { useNFTList, useTotalSupply, usePreloadNextPage, useRefreshNFTData } from "@/hooks/use-nft-data"
import { PaginationParams, NFTData } from "@/types/nft"
import { NFTCard } from "@/components/nft/nft-card"
import { NFTGridSkeleton } from "@/components/nft/nft-grid-skeleton"
import { ImageViewer } from "@/components/nft/image-viewer"
import { TransferModal } from "@/components/nft/transfer-modal"
import { Pagination } from "@/components/ui/pagination"
import { useAccount } from "wagmi"

export default function GalleryPage() {
  // 获取当前连接的钱包地址
  const { address: userAddress } = useAccount()
  
  // 状态管理
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState<PaginationParams['sortBy']>('newest')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [currentPage, setCurrentPage] = useState(1)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [showMyNFTs, setShowMyNFTs] = useState(false) // 是否只显示我的NFT
  
  // 图片查看器状态
  const [imageViewerOpen, setImageViewerOpen] = useState(false)
  const [selectedNFT, setSelectedNFT] = useState<NFTData | null>(null)
  const [selectedImageUrl, setSelectedImageUrl] = useState<string>("")
  
  // 转移弹窗状态
  const [transferModalOpen, setTransferModalOpen] = useState(false)
  const [transferNFT, setTransferNFT] = useState<NFTData | null>(null)
  
  const pageSize = 20

  // 查询参数 - 根据showMyNFTs状态决定是否过滤当前用户的NFT
  const queryParams: PaginationParams = {
    page: currentPage,
    limit: pageSize,
    sortBy,
    filterBy: showMyNFTs && userAddress 
      ? { owner: userAddress } 
      : searchTerm 
        ? { owner: searchTerm } 
        : undefined
  }

  const { 
    data: nftListData, 
    isLoading, 
    error, 
    refetch: refetchList 
  } = useNFTList(queryParams)
  
  const { 
    data: totalSupply, 
    isLoading: totalSupplyLoading 
  } = useTotalSupply()

  // 预加载和刷新
  const preloadNextPage = usePreloadNextPage()
  const { refreshAll, refreshList } = useRefreshNFTData()

  // 预加载下一页
  useEffect(() => {
    if (nftListData?.pagination.hasNext) {
      preloadNextPage(currentPage, pageSize)
    }
  }, [currentPage, pageSize, nftListData?.pagination.hasNext, preloadNextPage])

  // 处理刷新
  const handleRefresh = async () => {
    setIsRefreshing(true)
    try {
      await refreshList(queryParams)
      await refetchList()
    } finally {
      setIsRefreshing(false)
    }
  }

  // 处理搜索
  const handleSearch = (value: string) => {
    setSearchTerm(value)
    setCurrentPage(1) // 重置到第一页
  }

  // 处理排序
  const handleSortChange = (value: string) => {
    setSortBy(value as PaginationParams['sortBy'])
    setCurrentPage(1)
  }

  // 处理"我的NFT"切换
  const handleMyNFTsToggle = () => {
    setShowMyNFTs(!showMyNFTs)
    setSearchTerm("") // 清除搜索词
    setCurrentPage(1) // 重置到第一页
  }

  // 处理分页
  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // 处理图片点击
  const handleImageClick = (imageUrl: string, nft?: NFTData) => {
    console.log('Gallery: 处理图片点击')
    console.log('Gallery: imageUrl:', imageUrl)
    console.log('Gallery: nft:', nft)
    setSelectedImageUrl(imageUrl)
    setSelectedNFT(nft || null)
    setImageViewerOpen(true)
    console.log('Gallery: 设置完成，imageViewerOpen应该为true')
  }

  // 处理转移点击
  const handleTransferClick = (tokenId: string) => {
    const nft = nftListData?.data.find(n => n.tokenId === tokenId)
    if (nft) {
      setTransferNFT(nft)
      setTransferModalOpen(true)
    }
  }

  // 关闭图片查看器
  const closeImageViewer = () => {
    setImageViewerOpen(false)
    setSelectedNFT(null)
    setSelectedImageUrl("")
  }

  // 关闭转移弹窗
  const closeTransferModal = () => {
    setTransferModalOpen(false)
    setTransferNFT(null)
  }

  // 格式化地址显示
  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-amber-50/30 to-red-50 dark:from-red-950/20 dark:via-amber-950/10 dark:to-red-950/20 pt-20 pb-12 relative overflow-hidden">
      {/* 背景装饰 - 漂浮的春节元素 */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute top-20 left-10 text-4xl animate-bounce opacity-10"
          style={{ animationDuration: "3s" }}
        >
          🧧
        </div>
        <div
          className="absolute top-40 right-20 text-3xl animate-bounce opacity-10"
          style={{ animationDuration: "2.5s", animationDelay: "0.5s" }}
        >
          🏮
        </div>
        <div
          className="absolute bottom-40 left-20 text-3xl animate-bounce opacity-10"
          style={{ animationDuration: "3.5s", animationDelay: "1s" }}
        >
          🎆
        </div>
        <div
          className="absolute bottom-20 right-10 text-4xl animate-bounce opacity-10"
          style={{ animationDuration: "2.8s", animationDelay: "0.3s" }}
        >
          🎊
        </div>
        <div
          className="absolute top-1/2 left-5 text-2xl animate-pulse opacity-5"
          style={{ animationDuration: "2s" }}
        >
          ✨
        </div>
        <div
          className="absolute top-1/3 right-5 text-2xl animate-pulse opacity-5"
          style={{ animationDuration: "2.2s" }}
        >
          ✨
        </div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* 页面标题和统计 */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 mb-4">
            <span
              className="text-3xl animate-bounce"
              style={{ animationDuration: "1s" }}
            >
              🏮
            </span>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-red-500 via-amber-500 to-red-500 bg-clip-text text-transparent bg-[length:200%_auto] animate-shimmer">
              福联NFT画廊
            </h1>
            <span
              className="text-3xl animate-bounce"
              style={{ animationDuration: "1s", animationDelay: "0.5s" }}
            >
              🏮
            </span>
          </div>
          <div className="flex items-center justify-center gap-4 text-muted-foreground">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="border-red-500/50 text-red-600 dark:text-red-400 bg-red-50/50 dark:bg-red-950/30">
                {totalSupplyLoading ? (
                  <Skeleton className="h-4 w-8" />
                ) : (
                  `总计 ${totalSupply || 0} 个NFT`
                )}
              </Badge>
            </div>
          </div>
        </div>

        {/* 工具栏 */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            {/* 搜索框和过滤按钮 */}
            <div className="flex items-center gap-2 flex-1 max-w-md">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-red-400/60 h-4 w-4" />
                <Input
                  placeholder="搜索创作者地址..."
                  value={searchTerm}
                  onChange={(e) => handleSearch(e.target.value)}
                  disabled={showMyNFTs} // 显示我的NFT时禁用搜索
                  className="pl-10 bg-red-50/50 dark:bg-red-950/20 border-red-500/20 hover:border-red-500/40 text-foreground placeholder:text-muted-foreground disabled:opacity-50"
                />
              </div>
              
              {/* 我的NFT过滤按钮 */}
              <Button
                variant={showMyNFTs ? 'default' : 'outline'}
                size="sm"
                onClick={handleMyNFTsToggle}
                disabled={!userAddress}
                className={`flex-shrink-0 ${
                  showMyNFTs 
                    ? 'bg-gradient-to-r from-red-500 to-amber-500 hover:from-red-600 hover:to-amber-600 text-white' 
                    : 'border-red-500/20 hover:border-red-500/40 text-foreground hover:bg-red-50 dark:hover:bg-red-950/30'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
                title={!userAddress ? '请先连接钱包' : showMyNFTs ? '显示全部NFT' : '只看我的NFT'}
              >
                <UserCircle className="h-4 w-4 mr-1" />
                我的NFT
              </Button>
            </div>

            {/* 控制按钮组 */}
            <div className="flex items-center gap-2">
              {/* 排序选择 */}
              <Select value={sortBy} onValueChange={handleSortChange}>
                <SelectTrigger className="w-32 bg-red-50/50 dark:bg-red-950/20 border-red-500/20 hover:border-red-500/40 text-foreground">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-background border-red-500/20">
                  <SelectItem value="newest">最新</SelectItem>
                  <SelectItem value="oldest">最早</SelectItem>
                  <SelectItem value="mostLiked">最受欢迎</SelectItem>
                </SelectContent>
              </Select>

              {/* 视图模式切换 */}
              <div className="flex rounded-lg bg-red-50/50 dark:bg-red-950/20 border border-red-500/20 p-1">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                  className={`h-8 w-8 p-0 ${viewMode === 'grid' ? 'bg-gradient-to-r from-red-500 to-amber-500 hover:from-red-600 hover:to-amber-600' : 'hover:bg-red-100 dark:hover:bg-red-900/30'}`}
                >
                  <Grid3X3 className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                  className={`h-8 w-8 p-0 ${viewMode === 'list' ? 'bg-gradient-to-r from-red-500 to-amber-500 hover:from-red-600 hover:to-amber-600' : 'hover:bg-red-100 dark:hover:bg-red-900/30'}`}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>

              {/* 刷新按钮 */}
              <Button
                variant="outline"
                size="sm"
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="border-red-500/20 hover:border-red-500/40 text-foreground hover:bg-red-50 dark:hover:bg-red-950/30"
              >
                <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              </Button>
            </div>
          </div>
        </div>

        {/* 错误状态 */}
        {error && (
          <Alert className="mb-8 border-red-500/50 bg-red-50/50 dark:bg-red-950/20">
            <AlertCircle className="h-4 w-4 text-red-500" />
            <AlertDescription className="text-red-700 dark:text-red-300">
              加载NFT数据时出错: {error.message}
              <Button 
                variant="link" 
                size="sm" 
                onClick={handleRefresh}
                className="ml-2 text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
              >
                重试
              </Button>
            </AlertDescription>
          </Alert>
        )}

        {/* NFT网格/列表 */}
        {isLoading ? (
          <NFTGridSkeleton count={pageSize} viewMode={viewMode} />
        ) : nftListData?.data.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🎨</div>
            <h3 className="text-xl font-semibold text-foreground mb-2">
              {showMyNFTs ? '您还没有春联NFT' : '暂无NFT作品'}
            </h3>
            <p className="text-muted-foreground mb-6">
              {showMyNFTs 
                ? '快去创建您的第一个春联NFT吧！' 
                : searchTerm 
                  ? '没有找到匹配的NFT作品' 
                  : '还没有人铸造春联NFT'
              }
            </p>
            {searchTerm && (
              <Button 
                variant="outline" 
                onClick={() => handleSearch('')}
                className="border-red-500/20 hover:border-red-500/40 text-foreground hover:bg-red-50 dark:hover:bg-red-950/30"
              >
                清除搜索
              </Button>
            )}
          </div>
        ) : (
          <>
            {/* NFT网格 */}
            <div className={`grid gap-6 mb-8 ${
              viewMode === 'grid' 
                ? 'sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
                : 'grid-cols-1'
            }`}>
              {nftListData?.data.map((nft) => {
                // 添加调试日志
                console.log('Gallery: 准备渲染NFT卡片:', {
                  tokenId: nft.tokenId,
                  hasContent: !!nft.content,
                  upperLine: nft.content?.upperLine,
                  lowerLine: nft.content?.lowerLine,
                  horizontalScroll: nft.content?.horizontalScroll,
                })
                return (
                  <NFTCard
                    key={nft.tokenId}
                    nft={nft}
                    viewMode={viewMode}
                    onImageClick={(imageUrl) => handleImageClick(imageUrl, nft)}
                    onTransferClick={handleTransferClick}
                  />
                )
              })}
              </div>

            {/* 分页控制 */}
            {nftListData && nftListData.pagination.totalPages > 1 && (
              <div className="flex justify-center">
                <Pagination
                  currentPage={nftListData.pagination.page}
                  totalPages={nftListData.pagination.totalPages}
                  onPageChange={handlePageChange}
                  showQuickJumper
                  className="text-foreground"
                />
              </div>
            )}
          </>
        )}
      </div>

      {/* 图片查看器 */}
      <ImageViewer
        isOpen={imageViewerOpen}
        onClose={closeImageViewer}
        nft={selectedNFT}
        imageUrl={selectedImageUrl}
        onTransferClick={handleTransferClick}
      />

      {/* 转移弹窗 */}
      <TransferModal
        isOpen={transferModalOpen}
        onClose={closeTransferModal}
        nft={transferNFT}
      />
    </div>
  )
}
