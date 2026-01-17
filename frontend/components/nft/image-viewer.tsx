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

  const displayImageUrl = imageUrl || nft?.content.imageUrl

  // 重置状态
  const resetTransform = useCallback(() => {
    setScale(1)
    setRotation(0)
    setPosition({ x: 0, y: 0 })
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
        className={`${
          isFullscreen 
            ? 'max-w-full max-h-full w-screen h-screen' 
            : 'max-w-6xl max-h-[90vh] w-[90vw] h-[80vh]'
        } p-0 bg-black/95 border-slate-800 overflow-hidden`}
      >
        {/* 顶部工具栏 */}
        <div className="absolute top-0 left-0 right-0 z-10 bg-black/80 backdrop-blur-sm border-b border-slate-800">
          <div className="flex items-center justify-between p-4">
            {/* 左侧信息 */}
            <div className="flex items-center gap-4">
              {nft && (
                <>
                  <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                    #{nft.tokenId}
                  </Badge>
                  <div className="text-sm text-slate-300">
                    {nft.content.horizontalScroll}
                  </div>
                  <div className="text-xs text-slate-400">
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
                className="text-white hover:bg-white/20"
              >
                <ZoomOut className="h-4 w-4" />
              </Button>
              
              <div className="text-xs text-slate-400 min-w-12 text-center">
                {Math.round(scale * 100)}%
              </div>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={handleZoomIn}
                disabled={scale >= 5}
                className="text-white hover:bg-white/20"
              >
                <ZoomIn className="h-4 w-4" />
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={handleRotate}
                className="text-white hover:bg-white/20"
              >
                <RotateCw className="h-4 w-4" />
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={resetTransform}
                className="text-white hover:bg-white/20"
              >
                <RefreshCw className="h-4 w-4" />
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={toggleFullscreen}
                className="text-white hover:bg-white/20"
              >
                {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={handleDownload}
                className="text-white hover:bg-white/20"
              >
                <Download className="h-4 w-4" />
              </Button>

              {nft && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleShare}
                  className="text-white hover:bg-white/20"
                >
                  <Share2 className="h-4 w-4" />
                </Button>
              )}

              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="text-white hover:bg-white/20"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* 图片显示区域 */}
        <div 
          className="flex-1 flex items-center justify-center overflow-hidden cursor-move pt-16 pb-4"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onWheel={handleWheel}
          style={{ cursor: isDragging ? 'grabbing' : scale > 1 ? 'grab' : 'default' }}
        >
          {imageLoading && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
            </div>
          )}

          {!imageError ? (
            <img
              src={displayImageUrl}
              alt={nft?.content.horizontalScroll || "NFT Image"}
              className="max-w-none select-none transition-transform duration-200"
              style={{
                transform: `translate(${position.x}px, ${position.y}px) scale(${scale}) rotate(${rotation}deg)`,
                display: imageLoading ? 'none' : 'block'
              }}
              onLoad={() => setImageLoading(false)}
              onError={() => {
                setImageLoading(false)
                setImageError(true)
              }}
              draggable={false}
            />
          ) : (
            <div className="text-center text-slate-400">
              <div className="text-6xl mb-4">🖼️</div>
              <p className="text-lg">图片加载失败</p>
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={() => {
                  setImageError(false)
                  setImageLoading(true)
                }}
              >
                重新加载
              </Button>
            </div>
          )}
        </div>

        {/* 底部信息栏 */}
        {nft && (
          <div className="absolute bottom-0 left-0 right-0 bg-black/80 backdrop-blur-sm border-t border-slate-800 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-6">
                <div className="text-sm text-slate-300">
                  <span className="text-slate-500">上联：</span>
                  {nft.content.upperLine}
                </div>
                <div className="text-sm text-slate-300">
                  <span className="text-slate-500">下联：</span>
                  {nft.content.lowerLine}
                </div>
              </div>
              <div className="text-xs text-slate-400">
                铸造时间：{formatTime(nft.content.mintTime)}
              </div>
            </div>
          </div>
        )}

        {/* 快捷键提示 */}
        <div className="absolute bottom-4 right-4 text-xs text-slate-500 bg-black/60 rounded px-2 py-1">
          ESC: 关闭 | +/-: 缩放 | R: 旋转 | 0: 重置
        </div>
      </DialogContent>
    </Dialog>
  )
}