/**
 * NFT卡片组件
 * 显示文字版春联，点击查看显示IPFS图片
 */

"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { 
  Heart, 
  Eye,
  Gift,
  Calendar,
  User,
} from "lucide-react"
import { NFTData } from "@/types/nft"
import { useLikeNFT, useUnlikeNFT } from "@/hooks/use-nft-data"
import { useAccount } from "wagmi"
import { toast } from "sonner"

interface NFTCardProps {
  nft: NFTData
  viewMode: 'grid' | 'list'
  onImageClick: (imageUrl: string) => void
  onTransferClick: (tokenId: string) => void
}

export function NFTCard({ nft, viewMode, onImageClick, onTransferClick }: NFTCardProps) {
  const { address: userAddress } = useAccount()

  // 添加调试日志
  console.log('NFTCard 渲染:', {
    tokenId: nft.tokenId,
    upperLine: nft.content.upperLine,
    lowerLine: nft.content.lowerLine,
    horizontalScroll: nft.content.horizontalScroll,
    upperLineLength: nft.content.upperLine?.length,
    lowerLineLength: nft.content.lowerLine?.length,
  })

  // 点赞相关
  const { mutate: likeNFT, isPending: isLiking } = useLikeNFT()
  const { mutate: unlikeNFT, isPending: isUnliking } = useUnlikeNFT()

  // 判断是否为所有者
  const isOwner = userAddress && nft.owner.toLowerCase() === userAddress.toLowerCase()

  // 格式化地址
  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  // 格式化时间
  const formatTime = (timestamp: bigint) => {
    const date = new Date(Number(timestamp) * 1000)
    return date.toLocaleDateString('zh-CN')
  }

  // 处理点赞
  const handleLike = async (e: React.MouseEvent) => {
    e.stopPropagation()
    
    if (!userAddress) {
      toast.error('请先连接钱包')
      return
    }

    try {
      if (nft.isLikedByUser) {
        unlikeNFT(nft.tokenId, {
          onSuccess: () => toast.success('取消点赞成功'),
          onError: (error) => toast.error(`取消点赞失败: ${error.message}`)
        })
      } else {
        likeNFT(nft.tokenId, {
          onSuccess: () => toast.success('点赞成功'),
          onError: (error) => toast.error(`点赞失败: ${error.message}`)
        })
      }
    } catch (error) {
      console.error('Like operation failed:', error)
    }
  }

  // 处理赠送
  const handleGift = (e: React.MouseEvent) => {
    e.stopPropagation()
    
    if (!userAddress) {
      toast.error('请先连接钱包')
      return
    }

    if (!isOwner) {
      toast.error('只有NFT所有者才能赠送')
      return
    }

    onTransferClick(nft.tokenId)
  }

  // 处理图片查看
  const handleViewImage = (e: React.MouseEvent) => {
    e.stopPropagation()
    console.log('NFTCard: 点击查看按钮')
    console.log('NFTCard: 图片URL:', nft.content.imageUrl)
    onImageClick(nft.content.imageUrl)
  }

  // 网格模式渲染 - 文字版春联
  if (viewMode === 'grid') {
    return (
      <Card className="group hover:shadow-2xl hover:shadow-red-500/25 transition-all duration-300 hover:-translate-y-2 overflow-hidden bg-gradient-to-br from-red-50 via-amber-50/50 to-red-50 dark:from-red-950/30 dark:via-amber-950/20 dark:to-red-950/30 border-red-500/20 backdrop-blur-sm">
        <CardContent className="p-4">
          {/* 春联文字展示区 */}
          <div className="flex flex-col items-center py-6 relative min-h-[300px]">
            {/* 装饰边框 */}
            <div className="absolute inset-0 rounded-lg border-2 border-red-500/30 pointer-events-none" />
            <div className="absolute inset-1 rounded-md border border-dashed border-amber-400/40 pointer-events-none" />
            
            {/* 横批 */}
            <div className="mb-6 px-4 py-2 bg-gradient-to-r from-red-500 to-amber-500 rounded-lg shadow-lg z-10">
              <span className="text-lg font-bold tracking-wider text-white">
                {nft.content.horizontalScroll}
              </span>
            </div>

            {/* 上下联 */}
            <div className="flex justify-center gap-6 z-10">
              {/* 上联 */}
              <div className="flex flex-col items-center">
                <div className="bg-red-600 rounded-lg px-2 py-3 shadow-lg min-w-[40px] h-[200px] flex items-center overflow-hidden">
                  <div className="flex flex-col gap-0.5 items-center justify-center w-full h-full py-2">
                    {nft.content.upperLine.split("").map((char, i) => (
                      <span
                        key={i}
                        className="text-white font-bold leading-tight"
                        style={{
                          fontSize: `${Math.min(18, Math.max(12, 180 / nft.content.upperLine.length))}px`
                        }}
                      >
                        {char}
                      </span>
                    ))}
                  </div>
                </div>
                <span className="mt-2 text-xs text-muted-foreground">上联</span>
              </div>

              {/* 下联 */}
              <div className="flex flex-col items-center">
                <div className="bg-red-600 rounded-lg px-2 py-3 shadow-lg min-w-[40px] h-[200px] flex items-center overflow-hidden">
                  <div className="flex flex-col gap-0.5 items-center justify-center w-full h-full py-2">
                    {nft.content.lowerLine.split("").map((char, i) => (
                      <span
                        key={i}
                        className="text-white font-bold leading-tight"
                        style={{
                          fontSize: `${Math.min(18, Math.max(12, 180 / nft.content.lowerLine.length))}px`
                        }}
                      >
                        {char}
                      </span>
                    ))}
                  </div>
                </div>
                <span className="mt-2 text-xs text-muted-foreground">下联</span>
              </div>
            </div>
          </div>

          {/* 信息区 */}
          <div className="space-y-3 border-t border-red-300/40 dark:border-red-500/20 pt-3">
            <div className="flex items-center justify-between">
              <Badge variant="outline" className="text-xs border-red-500/50 text-red-600 dark:text-red-400">
                #{nft.tokenId}
              </Badge>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Calendar className="h-3 w-3" />
                {formatTime(nft.content.mintTime)}
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <User className="h-3 w-3" />
                {formatAddress(nft.owner)}
              </div>
              
              <div className="flex items-center gap-2">
                <button
                  onClick={handleLike}
                  disabled={isLiking || isUnliking}
                  className="flex items-center gap-1 text-xs text-muted-foreground hover:text-red-500 transition-colors disabled:opacity-50"
                >
                  <Heart className={`h-4 w-4 ${nft.isLikedByUser ? "fill-red-500 text-red-500" : ""} ${(isLiking || isUnliking) ? "animate-pulse" : ""}`} />
                  {nft.likeCount}
                </button>
              </div>
            </div>

            {/* 操作按钮 */}
            <div className="flex gap-2 pt-2">
              <Button
                size="sm"
                variant="outline"
                onClick={handleViewImage}
                className="flex-1 border-red-500/30 text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30"
              >
                <Eye className="h-4 w-4 mr-1" />
                查看
              </Button>
              {isOwner && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleGift}
                  className="border-amber-500/30 text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-950/30"
                >
                  <Gift className="h-4 w-4 mr-1" />
                  赠送
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  // 列表模式渲染 - 文字版春联（横向排列，固定高度）
  return (
    <Card className="group hover:shadow-xl hover:shadow-red-500/20 transition-all duration-300 overflow-hidden bg-gradient-to-br from-red-50 via-amber-50/50 to-red-50 dark:from-red-950/30 dark:via-amber-950/20 dark:to-red-950/30 border-red-500/20 backdrop-blur-sm">
      <CardContent className="p-3">
        <div className="flex items-center gap-6">
          {/* 左侧春联文字 - 固定宽度，支持滚动 */}
          <div className="flex-1 flex items-center gap-4 min-w-0 overflow-hidden">
            {/* 横批 - 固定宽度 */}
            <div className="flex-shrink-0 px-3 py-2 bg-gradient-to-r from-red-500 to-amber-500 text-white rounded-lg shadow-md min-w-[80px] max-w-[100px] flex items-center justify-center">
              <span className="text-sm font-bold truncate w-full text-center">
                {nft.content.horizontalScroll}
              </span>
            </div>

            {/* 上下联（在同一个红色框中）*/}
            <div className="bg-gradient-to-r from-red-600/90 to-red-700/90 text-white rounded px-4 py-2 shadow flex-1 min-w-0 max-w-[600px]">
              <div className="flex items-center gap-4">
                {/* 上联 */}
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <span className="text-xs whitespace-nowrap flex-shrink-0">上联：</span>
                  <span 
                    className="text-sm font-bold tracking-wide truncate" 
                    title={nft.content.upperLine}
                  >
                    {nft.content.upperLine}
                  </span>
                </div>

                {/* 下联 */}
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <span className="text-xs whitespace-nowrap flex-shrink-0">下联：</span>
                  <span 
                    className="text-sm font-bold tracking-wide truncate"
                    title={nft.content.lowerLine}
                  >
                    {nft.content.lowerLine}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* 右侧信息和操作 - 固定宽度 */}
          <div className="flex items-center gap-4 flex-shrink-0">
            {/* 信息 */}
            <div className="flex flex-col gap-2 w-[160px]">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="border-red-500/50 text-red-600 dark:text-red-400 flex-shrink-0">
                  #{nft.tokenId}
                </Badge>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Calendar className="h-3 w-3 flex-shrink-0" />
                  <span className="truncate">{formatTime(nft.content.mintTime)}</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-1 text-xs text-muted-foreground min-w-0">
                  <User className="h-3 w-3 flex-shrink-0" />
                  <span className="truncate">{formatAddress(nft.owner)}</span>
                </div>
                
                <button
                  onClick={handleLike}
                  disabled={isLiking || isUnliking}
                  className="flex items-center gap-1 text-xs text-muted-foreground hover:text-red-500 transition-colors disabled:opacity-50 flex-shrink-0"
                >
                  <Heart className={`h-4 w-4 ${nft.isLikedByUser ? "fill-red-500 text-red-500" : ""} ${(isLiking || isUnliking) ? "animate-pulse" : ""}`} />
                  {nft.likeCount}
                </button>
              </div>
            </div>

            {/* 操作按钮 */}
            <div className="flex gap-2 flex-shrink-0">
              <Button
                size="sm"
                variant="outline"
                onClick={handleViewImage}
                className="border-red-500/30 text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30"
              >
                <Eye className="h-4 w-4 mr-1" />
                查看
              </Button>
              {isOwner && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleGift}
                  className="border-amber-500/30 text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-950/30"
                >
                  <Gift className="h-4 w-4 mr-1" />
                  赠送
                </Button>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}