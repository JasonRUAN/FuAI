/**
 * NFT图片查看器组件
 * 支持全屏预览、缩放、下载等功能
 */

"use client"

import { useState, useEffect, useCallback } from "react"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  X, 
  Download, 
  ZoomIn, 
  ZoomOut, 
  RotateCw, 
  Share2,
  Maximize2,
  Minimize2,
  Move,
  RefreshCw
} from "lucide-react"
import { NFTData } from "@/types/nft"
import { toast } from "sonner"

interface ImageViewerProps {
  isOpen: boolean
  onClose: () => void
  nft: NFTData | null
  imageUrl?: string
}

export function ImageViewer({ isOpen, onClose, nft, imageUrl }: ImageViewerProps) {
  const [scale, setScale] = useState(1)
  const [rotation, setRotation] = useState(0)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [imageLoading, setImageLoading] = useState(true)
  const [imageError, setImageError] = useState(false)
  const [fitMode, setFitMode] = useState<'contain' | 'cover' | 'fill'>('contain')

  const displayImageUrl = imageUrl || nft?.content.imageUrl

  console.log('ImageViewer: isOpen =', isOpen)
  console.log('ImageViewer: displayImageUrl =', displayImageUrl)

  // 重置状态
  const resetTransform = useCallback(() => {
    setScale(1)
    setRotation(0)
    setPosition({ x: 0, y: 0 })
    setFitMode('contain')
  }, [])

  // 当图片改变时重置状态
  useEffect(() => {
    if (isOpen && displayImageUrl) {
      resetTransform()
      setImageLoading(true)
      setImageError(false)
    }
  }, [isOpen, displayImageUrl, resetTransform])

  // 键盘快捷键
  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'Escape':
          onClose()
          break
        case '+':
        case '=':
          handleZoomIn()
          break
        case '-':
          handleZoomOut()
          break
        case 'r':
        case 'R':
          handleRotate()
          break
        case '0':
          resetTransform()
          break
        case 'd':
        case 'D':
          if (e.ctrlKey || e.metaKey) {
            e.preventDefault()
            handleDownload()
          }
          break
        case 's':
        case 'S':
          if (e.ctrlKey || e.metaKey) {
            e.preventDefault()
            handleShare()
          }
          break
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  // 缩放功能
  const handleZoomIn = () => {
    setScale(prev => Math.min(prev * 1.2, 5))
  }

  const handleZoomOut = () => {
    setScale(prev => Math.max(prev / 1.2, 0.1))
  }

  // 旋转功能
  const handleRotate = () => {
    setRotation(prev => (prev + 90) % 360)
  }

  // 全屏切换
  const toggleFullscreen = () => {
    setIsFullscreen(prev => !prev)
  }

  // 鼠标拖拽
  const handleMouseDown = (e: React.MouseEvent) => {
    if (scale <= 1) return
    
    setIsDragging(true)
    setDragStart({
      x: e.clientX - position.x,
      y: e.clientY - position.y
    })
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || scale <= 1) return

    setPosition({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    })
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  // 鼠标滚轮缩放
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault()
    const delta = e.deltaY > 0 ? 0.9 : 1.1
    setScale(prev => Math.max(0.1, Math.min(5, prev * delta)))
  }

  // 下载图片
  const handleDownload = async () => {
    if (!displayImageUrl) return

    try {
      const response = await fetch(displayImageUrl)
      const blob = await response.blob()
      const url = URL.createObjectURL(blob)
      
      const a = document.createElement('a')
      a.href = url
      a.download = nft ? `couplet-nft-${nft.tokenId}.jpg` : 'image.jpg'
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

  // 分享图片
  const handleShare = async () => {
    if (!displayImageUrl || !nft) return

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

  // 格式化地址
  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  // 格式化时间
  const formatTime = (timestamp: bigint) => {
    const date = new Date(Number(timestamp) * 1000)
    return date.toLocaleString('zh-CN')
  }

  if (!displayImageUrl) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent 
        showCloseButton={false}
        className={`${
          isFullscreen 
            ? '!max-w-full !max-h-full !w-screen !h-screen' 
            : '!max-w-[95vw] !w-[95vw] !h-[65vh]'
        } !p-0 !gap-0 bg-gradient-to-br from-red-950/95 via-amber-950/95 to-red-950/95 backdrop-blur-xl border-2 border-amber-500/30 overflow-hidden shadow-2xl shadow-red-900/50 flex flex-col`}
      >
        {/* 背景装饰 */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-10">
          <div className="absolute top-10 left-10 text-6xl animate-float" style={{ animationDuration: "3s" }}>
            🏮
          </div>
          <div className="absolute bottom-10 right-10 text-6xl animate-float" style={{ animationDuration: "3.5s", animationDelay: "0.5s" }}>
            🧧
          </div>
        </div>

        {/* 顶部工具栏 */}
        <div className="absolute top-0 left-0 right-0 z-10 bg-gradient-to-b from-red-950/90 via-red-950/80 to-transparent backdrop-blur-md border-b border-amber-500/20">
          <div className="flex items-center justify-between p-4">
            {/* 左侧信息 */}
            <div className="flex items-center gap-4">
              {nft && (
                <>
                  <Badge className="bg-gradient-to-r from-red-500 to-amber-500 text-white font-semibold px-3 py-1 shadow-lg shadow-red-900/50">
                    #{nft.tokenId}
                  </Badge>
                  <div className="text-base font-bold text-transparent bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-300 bg-clip-text">
                    {nft.content.horizontalScroll}
                  </div>
                  <div className="text-xs text-amber-400/80 font-medium">
                    {formatAddress(nft.owner)}
                  </div>
                </>
              )}
            </div>

            {/* 右侧操作按钮 */}
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleZoomOut}
                disabled={scale <= 0.1}
                className="text-amber-300 hover:text-amber-100 hover:bg-red-900/50 border border-amber-500/20 hover:border-amber-400/40 transition-all"
              >
                <ZoomOut className="h-4 w-4" />
              </Button>
              
              <div className="text-xs text-amber-400/80 font-semibold min-w-12 text-center px-2 py-1 bg-red-950/50 rounded border border-amber-500/20">
                {Math.round(scale * 100)}%
              </div>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={handleZoomIn}
                disabled={scale >= 5}
                className="text-amber-300 hover:text-amber-100 hover:bg-red-900/50 border border-amber-500/20 hover:border-amber-400/40 transition-all"
              >
                <ZoomIn className="h-4 w-4" />
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={handleRotate}
                className="text-amber-300 hover:text-amber-100 hover:bg-red-900/50 border border-amber-500/20 hover:border-amber-400/40 transition-all"
              >
                <RotateCw className="h-4 w-4" />
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={resetTransform}
                className="text-amber-300 hover:text-amber-100 hover:bg-red-900/50 border border-amber-500/20 hover:border-amber-400/40 transition-all"
              >
                <RefreshCw className="h-4 w-4" />
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={toggleFullscreen}
                className="text-amber-300 hover:text-amber-100 hover:bg-red-900/50 border border-amber-500/20 hover:border-amber-400/40 transition-all"
              >
                {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={handleDownload}
                className="text-amber-300 hover:text-amber-100 hover:bg-red-900/50 border border-amber-500/20 hover:border-amber-400/40 transition-all"
              >
                <Download className="h-4 w-4" />
              </Button>

              {nft && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleShare}
                  className="text-amber-300 hover:text-amber-100 hover:bg-red-900/50 border border-amber-500/20 hover:border-amber-400/40 transition-all"
                >
                  <Share2 className="h-4 w-4" />
                </Button>
              )}

              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="text-red-400 hover:text-red-300 hover:bg-red-900/50 border border-red-500/30 hover:border-red-400/50 transition-all ml-2"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>

        {/* 图片显示区域 */}
        <div 
          className="flex-1 flex items-center justify-center overflow-hidden pt-16 pb-20 px-8"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onWheel={handleWheel}
          style={{ cursor: isDragging ? 'grabbing' : scale > 1 ? 'grab' : 'default' }}
        >
          {imageLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-red-950/50">
              <div className="relative">
                <div className="animate-spin rounded-full h-16 w-16 border-4 border-amber-500/30 border-t-amber-500"></div>
                <div className="absolute inset-0 flex items-center justify-center text-amber-400 text-2xl animate-pulse">
                  🏮
                </div>
              </div>
            </div>
          )}

          {!imageError ? (
            <img
              src={displayImageUrl}
              alt={nft?.content.horizontalScroll || "春联NFT"}
              className="select-none transition-all duration-300 ease-out rounded-lg shadow-2xl shadow-red-900/50"
              style={{
                objectFit: fitMode,
                maxWidth: fitMode === 'contain' ? '100%' : 'none',
                maxHeight: fitMode === 'contain' ? '100%' : 'none',
                width: fitMode === 'fill' ? '100%' : 'auto',
                height: fitMode === 'cover' ? '100%' : 'auto',
                transform: `translate(${position.x}px, ${position.y}px) scale(${scale}) rotate(${rotation}deg)`,
                display: imageLoading ? 'none' : 'block',
                border: '3px solid rgba(255, 215, 0, 0.2)',
              }}
              onLoad={() => setImageLoading(false)}
              onError={() => {
                setImageLoading(false)
                setImageError(true)
              }}
              draggable={false}
            />
          ) : (
            <div className="text-center text-amber-300 bg-red-950/80 p-12 rounded-2xl border-2 border-amber-500/30 backdrop-blur-md">
              <div className="text-8xl mb-6 animate-bounce">🖼️</div>
              <p className="text-xl font-bold mb-2">图片加载失败</p>
              <p className="text-sm text-amber-400/70 mb-6">请检查网络连接或稍后重试</p>
              <Button 
                variant="outline" 
                className="border-amber-500/40 text-amber-300 hover:bg-red-900/50 hover:border-amber-400 transition-all"
                onClick={() => {
                  setImageError(false)
                  setImageLoading(true)
                }}
              >
                🔄 重新加载
              </Button>
            </div>
          )}
        </div>

        {/* 底部信息栏 */}
        {nft && (
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-red-950/90 via-red-950/80 to-transparent backdrop-blur-md border-t border-amber-500/20 py-3 px-6">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-6 flex-1 min-w-0">
                <div className="text-sm font-medium text-amber-100 flex items-center gap-2">
                  <span className="text-amber-400/70 shrink-0">🏮 上联：</span>
                  <span className="text-transparent bg-gradient-to-r from-amber-200 to-yellow-300 bg-clip-text font-bold truncate">
                    {nft.content.upperLine}
                  </span>
                </div>
                <div className="text-sm font-medium text-amber-100 flex items-center gap-2">
                  <span className="text-amber-400/70 shrink-0">🧧 下联：</span>
                  <span className="text-transparent bg-gradient-to-r from-amber-200 to-yellow-300 bg-clip-text font-bold truncate">
                    {nft.content.lowerLine}
                  </span>
                </div>
              </div>
              <div className="text-xs text-amber-400/80 bg-red-950/50 px-3 py-1 rounded-full border border-amber-500/20 whitespace-nowrap shrink-0">
                ⏰ {formatTime(nft.content.mintTime)}
              </div>
            </div>
          </div>
        )}

        {/* 快捷键提示 */}
        <div className="absolute bottom-16 right-4 text-xs text-amber-400/70 bg-red-950/80 rounded-lg px-3 py-2 border border-amber-500/20 backdrop-blur-sm font-mono">
          <div className="flex items-center gap-4">
            <span><span className="text-amber-300 font-bold">ESC</span>: 关闭</span>
            <span><span className="text-amber-300 font-bold">+/-</span>: 缩放</span>
            <span><span className="text-amber-300 font-bold">R</span>: 旋转</span>
            <span><span className="text-amber-300 font-bold">0</span>: 重置</span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}