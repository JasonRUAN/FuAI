/**
 * NFT卡片组件
 * 支持网格和列表两种显示模式
 */

"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { 
  Heart, 
  Share2, 
  ExternalLink, 
  Download, 
  Send,
  Calendar,
  User,
  Eye,
  Loader2
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
  const [imageLoading, setImageLoading] = useState(true)
  const [imageError, setImageError] = useState(false)

  // 点赞相关
  const { mutate: likeNFT, isPending: isLiking } = useLikeNFT()
  const { mutate: unlikeNFT, isPending: isUnliking } = useUnlikeNFT()

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

  // 处理分享
  const handleShare = async (e: React.MouseEvent) => {
    e.stopPropagation()
    
    const shareData = {
      title: `春联NFT #${nft.tokenId}`,
      text: `${nft.content.upperLine} | ${nft.content.lowerLine} | ${nft.content.horizontalScroll}`,
      url: window.location.href
    }

    try {
      if (navigator.share) {
        await navigator.share(shareData)
      } else {
        await navigator.clipboard.writeText(shareData.url)
        toast.success('链接已复制到剪贴板')
      }
    } catch (error) {
      console.error('Share failed:', error)
      toast.error('分享失败')
    }
  }

  // 处理下载
  const handleDownload = async (e: React.MouseEvent) => {
    e.stopPropagation()
    
    try {
      const response = await fetch(nft.content.imageUrl)
      const blob = await response.blob()
      const url = URL.createObjectURL(blob)
      
      const a = document.createElement('a')
      a.href = url
      a.download = `couplet-nft-${nft.tokenId}.jpg`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
      
      toast.success('图片下载成功')
    } catch (error) {
      console.error('Download failed:', error)
      toast.error('下载失败')
    }
  }

  // 处理转移
  const handleTransfer = (e: React.MouseEvent) => {
    e.stopPropagation()
    
    if (!userAddress) {
      toast.error('请先连接钱包')
      return
    }

    if (nft.owner.toLowerCase() !== userAddress.toLowerCase()) {
      toast.error('只有NFT所有者才能转移')
      return
    }

    onTransferClick(nft.tokenId)
  }

  // 处理图片点击
  const handleImageClick = () => {
    if (!imageError) {
      onImageClick(nft.content.imageUrl)
    }
  }

  // 网格模式渲染
  if (viewMode === 'grid') {
    return (
      <Card className="group hover:shadow-2xl hover:shadow-red-500/25 transition-all duration-300 hover:-translate-y-2 overflow-hidden bg-red-50/50 dark:bg-red-950/20 border-red-500/20 backdrop-blur-sm">
        <CardContent className="p-0">
          {/* NFT图片区 */}
          <div className="relative aspect-square overflow-hidden cursor-pointer" onClick={handleImageClick}>
            {imageLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-red-100 dark:bg-red-900/30">
                <Loader2 className="h-8 w-8 animate-spin text-red-500" />
              </div>
            )}
            
            {!imageError ? (
              <img
                src={nft.content.imageUrl}
                alt={nft.content.horizontalScroll}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                onLoad={() => setImageLoading(false)}
                onError={() => {
                  setImageLoading(false)
                  setImageError(true)
                }}
                style={{ display: imageLoading ? 'none' : 'block' }}
              />
            ) : (
              <div className="w-full h-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                <div className="text-center text-red-400">
                  <Eye className="h-12 w-12 mx-auto mb-2" />
                  <p className="text-sm">图片加载失败</p>
                </div>
              </div>
            )}

            {/* 悬浮操作按钮 */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="absolute bottom-3 left-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-y-2 group-hover:translate-y-0">
              <div className="flex gap-2">
                <Button 
                  size="sm" 
                  variant="secondary" 
                  className="flex-1 bg-white/20 backdrop-blur-sm border-white/30 text-white hover:bg-white/30"
                  onClick={handleImageClick}
                >
                  <Eye className="h-4 w-4 mr-1" />
                  查看
                </Button>
                <Button 
                  size="sm" 
                  variant="secondary"
                  className="bg-white/20 backdrop-blur-sm border-white/30 text-white hover:bg-white/30"
                  onClick={handleDownload}
                >
                  <Download className="h-4 w-4" />
                </Button>
                <Button 
                  size="sm" 
                  variant="secondary"
                  className="bg-white/20 backdrop-blur-sm border-white/30 text-white hover:bg-white/30"
                  onClick={handleShare}
                >
                  <Share2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* 春联展示区 */}
          <div className="bg-gradient-to-b from-red-500/20 to-amber-500/10 p-4">
            <div className="flex flex-col items-center">
              <div className="mb-3 px-4 py-1 bg-gradient-to-r from-red-500 to-amber-500 text-white rounded-full text-sm font-bold">
                {nft.content.horizontalScroll}
              </div>
              <div className="flex gap-4">
                <div className="bg-gradient-to-b from-red-600/90 to-red-700/90 text-white rounded-lg px-2 py-1 shadow-lg">
                  {nft.content.upperLine.split("").map((char, i) => (
                    <div key={i} className="w-5 h-5 flex items-center justify-center text-xs font-medium">
                      {char}
                    </div>
                  ))}
                </div>
                <div className="bg-gradient-to-b from-red-600/90 to-red-700/90 text-white rounded-lg px-2 py-1 shadow-lg">
                  {nft.content.lowerLine.split("").map((char, i) => (
                    <div key={i} className="w-5 h-5 flex items-center justify-center text-xs font-medium">
                      {char}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* 信息区 */}
          <div className="p-4 space-y-3 bg-red-50/30 dark:bg-red-950/10">
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
                
                {userAddress && nft.owner.toLowerCase() === userAddress.toLowerCase() && (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={handleTransfer}
                    className="h-6 px-2 text-xs text-muted-foreground hover:text-amber-600"
                  >
                    <Send className="h-3 w-3 mr-1" />
                    转移
                  </Button>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  // 列表模式渲染
  return (
    <Card className="group hover:shadow-xl hover:shadow-red-500/20 transition-all duration-300 overflow-hidden bg-red-50/50 dark:bg-red-950/20 border-red-500/20 backdrop-blur-sm">
      <CardContent className="p-0">
        <div className="flex">
          {/* 左侧图片 */}
          <div className="relative w-32 h-32 flex-shrink-0 overflow-hidden cursor-pointer" onClick={handleImageClick}>
            {imageLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-red-100 dark:bg-red-900/30">
                <Loader2 className="h-6 w-6 animate-spin text-red-500" />
              </div>
            )}
            
            {!imageError ? (
              <img
                src={nft.content.imageUrl}
                alt={nft.content.horizontalScroll}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                onLoad={() => setImageLoading(false)}
                onError={() => {
                  setImageLoading(false)
                  setImageError(true)
                }}
                style={{ display: imageLoading ? 'none' : 'block' }}
              />
            ) : (
              <div className="w-full h-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                <Eye className="h-8 w-8 text-red-400" />
              </div>
            )}
          </div>

          {/* 右侧内容 */}
          <div className="flex-1 p-4 flex flex-col justify-between">
            {/* 春联内容 */}
            <div>
              <div className="flex items-center gap-4 mb-3">
                <Badge className="bg-gradient-to-r from-red-500 to-amber-500 text-white">
                  {nft.content.horizontalScroll}
                </Badge>
                <Badge variant="outline" className="border-red-500/50 text-red-600 dark:text-red-400">
                  #{nft.tokenId}
                </Badge>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-3">
                <div className="text-sm text-foreground">
                  <span className="text-muted-foreground">上联：</span>
                  {nft.content.upperLine}
                </div>
                <div className="text-sm text-foreground">
                  <span className="text-muted-foreground">下联：</span>
                  {nft.content.lowerLine}
                </div>
              </div>
            </div>

            {/* 底部信息和操作 */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <User className="h-3 w-3" />
                  {formatAddress(nft.owner)}
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {formatTime(nft.content.mintTime)}
                </div>
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

                <Button size="sm" variant="ghost" onClick={handleDownload} className="hover:text-amber-600">
                  <Download className="h-4 w-4" />
                </Button>

                <Button size="sm" variant="ghost" onClick={handleShare} className="hover:text-amber-600">
                  <Share2 className="h-4 w-4" />
                </Button>

                {userAddress && nft.owner.toLowerCase() === userAddress.toLowerCase() && (
                  <Button size="sm" variant="ghost" onClick={handleTransfer} className="hover:text-amber-600">
                    <Send className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}