/**
 * 实时预览面板组件
 * 
 * 展示配置选项的视觉效果，提供实时预览和配置调整
 */

import React, { useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Eye, 
  Settings, 
  RefreshCw, 
  Download, 
  Share2, 
  Maximize2,
  Minimize2,
  Palette,
  Layout,
  Sparkles,
  Info
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { 
  ImageGenerationConfig,
  ArtStyleOption,
  LayoutOption,
  ColorSchemeOption 
} from '../../types/image-generation'
import { 
  artStyleOptions,
  layoutOptions,
  colorSchemeOptions,
  getConfigLabel 
} from '../../lib/image-generation-config'

// ==================== 组件Props ====================

export interface PreviewPanelProps {
  config: ImageGenerationConfig
  coupletContent?: {
    upper: string
    lower: string
    horizontal: string
  }
  isLoading?: boolean
  onConfigChange?: (config: Partial<ImageGenerationConfig>) => void
  onGenerate?: () => void
  className?: string
  variant?: 'full' | 'compact' | 'minimal'
  showControls?: boolean
  showConfigSummary?: boolean
}

// ==================== 主组件 ====================

export function PreviewPanel({
  config,
  coupletContent,
  isLoading = false,
  onConfigChange,
  onGenerate,
  className,
  variant = 'full',
  showControls = true,
  showConfigSummary = true,
}: PreviewPanelProps) {
  // ==================== 状态管理 ====================
  
  const [isExpanded, setIsExpanded] = useState(false)
  const [showDetails, setShowDetails] = useState(false)

  // ==================== 计算属性 ====================
  
  const currentArtStyle = useMemo(() => 
    artStyleOptions.find(opt => opt.value === config.artStyle),
    [config.artStyle]
  )
  
  const currentLayout = useMemo(() => 
    layoutOptions.find(opt => opt.value === config.layout),
    [config.layout]
  )
  
  const currentColorScheme = useMemo(() => 
    colorSchemeOptions.find(opt => opt.value === config.colorScheme),
    [config.colorScheme]
  )

  // ==================== 预览渲染组件 ====================
  
  const PreviewCanvas = ({ className: canvasClassName }: { className?: string }) => {
    const aspectRatios = {
      horizontal: 'aspect-[16/9]',
      vertical: 'aspect-[9/16]',
      square: 'aspect-square',
      'golden-ratio': 'aspect-[16/10]',
      'traditional-scroll': 'aspect-[3/4]',
    }

    const layoutAspect = aspectRatios[config.layout] || 'aspect-[16/9]'

    return (
      <div className={cn(
        'relative rounded-lg overflow-hidden border-2 border-gray-200 dark:border-gray-700',
        layoutAspect,
        canvasClassName
      )}>
        {/* 背景渐变 */}
        {currentColorScheme?.gradient && (
          <div 
            className="absolute inset-0"
            style={{ background: currentColorScheme.gradient }}
          />
        )}
        
        {/* 纯色背景（备选） */}
        {!currentColorScheme?.gradient && currentColorScheme?.colors && (
          <div 
            className="absolute inset-0"
            style={{ backgroundColor: currentColorScheme.colors[0] }}
          />
        )}

        {/* 春联内容模拟 */}
        <div className="absolute inset-4 flex items-center justify-center">
          {coupletContent ? (
            <div className="flex flex-col items-center gap-2">
              {/* 横批 */}
              <div className="text-center mb-2">
                <div className="px-4 py-1 bg-white/20 rounded-lg backdrop-blur-sm">
                  <span className="text-sm font-bold text-white drop-shadow-lg">
                    {coupletContent.horizontal}
                  </span>
                </div>
              </div>
              
              {/* 上下联 */}
              <div className="flex items-center gap-6">
                {/* 上联 */}
                <div className="flex flex-col gap-1">
                  {coupletContent.upper.split('').map((char, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="w-6 h-6 flex items-center justify-center bg-white/20 rounded backdrop-blur-sm"
                    >
                      <span className="text-xs font-bold text-white drop-shadow-lg">
                        {char}
                      </span>
                    </motion.div>
                  ))}
                </div>
                
                {/* 下联 */}
                <div className="flex flex-col gap-1">
                  {coupletContent.lower.split('').map((char, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: (index + coupletContent.upper.length) * 0.1 }}
                      className="w-6 h-6 flex items-center justify-center bg-white/20 rounded backdrop-blur-sm"
                    >
                      <span className="text-xs font-bold text-white drop-shadow-lg">
                        {char}
                      </span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mb-2">
                <Eye className="w-8 h-8 text-white/60" />
              </div>
              <p className="text-sm text-white/80">
                生成春联后可预览效果
              </p>
            </div>
          )}
        </div>

        {/* 装饰元素 */}
        <div className="absolute top-2 left-2 w-3 h-3 bg-white/30 rounded-full" />
        <div className="absolute top-2 right-2 w-3 h-3 bg-white/30 rounded-full" />
        <div className="absolute bottom-2 left-2 w-3 h-3 bg-white/30 rounded-full" />
        <div className="absolute bottom-2 right-2 w-3 h-3 bg-white/30 rounded-full" />

        {/* 加载状态 */}
        {isLoading && (
          <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
            <div className="flex flex-col items-center gap-2">
              <RefreshCw className="w-8 h-8 text-white animate-spin" />
              <span className="text-sm text-white">生成中...</span>
            </div>
          </div>
        )}
      </div>
    )
  }

  // ==================== 配置摘要组件 ====================
  
  const ConfigSummary = () => (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Settings className="w-4 h-4 text-gray-500" />
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
          当前配置
        </span>
      </div>
      
      <div className="grid grid-cols-2 gap-3">
        {/* 画风 */}
        <div className="space-y-1">
          <div className="flex items-center gap-1">
            <Palette className="w-3 h-3 text-red-500" />
            <span className="text-xs text-gray-500">画风</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-lg">{currentArtStyle?.icon}</span>
            <span className="text-sm font-medium truncate">
              {currentArtStyle?.label}
            </span>
          </div>
        </div>

        {/* 构图 */}
        <div className="space-y-1">
          <div className="flex items-center gap-1">
            <Layout className="w-3 h-3 text-blue-500" />
            <span className="text-xs text-gray-500">构图</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium truncate">
              {currentLayout?.label}
            </span>
            <Badge variant="outline" className="text-xs">
              {currentLayout?.aspectRatio}
            </Badge>
          </div>
        </div>

        {/* 色调 */}
        <div className="space-y-1 col-span-2">
          <div className="flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-purple-500" />
            <span className="text-xs text-gray-500">色调</span>
          </div>
          <div className="flex items-center gap-2">
            {currentColorScheme?.colors && (
              <div className="flex gap-1">
                {currentColorScheme.colors.slice(0, 3).map((color, index) => (
                  <div
                    key={index}
                    className="w-4 h-4 rounded-full border border-white shadow-sm"
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            )}
            <span className="text-sm font-medium truncate">
              {currentColorScheme?.label}
            </span>
          </div>
        </div>
      </div>
    </div>
  )

  // ==================== 紧凑版本渲染 ====================
  
  if (variant === 'compact') {
    return (
      <Card className={cn('w-full', className)}>
        <CardContent className="p-4">
          <div className="flex gap-4">
            <PreviewCanvas className="w-32 flex-shrink-0" />
            <div className="flex-1 space-y-3">
              {showConfigSummary && <ConfigSummary />}
              {showControls && onGenerate && (
                <Button
                  onClick={onGenerate}
                  disabled={isLoading}
                  size="sm"
                  className="w-full"
                >
                  {isLoading ? (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      生成中...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 mr-2" />
                      生成图片
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  // ==================== 最小版本渲染 ====================
  
  if (variant === 'minimal') {
    return (
      <div className={cn('space-y-2', className)}>
        <PreviewCanvas />
        {showControls && onGenerate && (
          <Button
            onClick={onGenerate}
            disabled={isLoading}
            size="sm"
            className="w-full"
          >
            {isLoading ? '生成中...' : '生成图片'}
          </Button>
        )}
      </div>
    )
  }

  // ==================== 完整版本渲染 ====================
  
  return (
    <Card className={cn('w-full', className)}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Eye className="w-5 h-5 text-red-500" />
            实时预览
          </CardTitle>
          
          <div className="flex items-center gap-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowDetails(!showDetails)}
                  >
                    <Info className="w-4 h-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>显示/隐藏配置详情</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? (
                <Minimize2 className="w-4 h-4" />
              ) : (
                <Maximize2 className="w-4 h-4" />
              )}
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* 预览画布 */}
        <PreviewCanvas className={cn(
          'transition-all duration-300',
          isExpanded ? 'h-80' : 'h-48'
        )} />

        {/* 配置详情 */}
        <AnimatePresence>
          {(showDetails || showConfigSummary) && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
            >
              <Separator className="mb-4" />
              <ConfigSummary />
            </motion.div>
          )}
        </AnimatePresence>

        {/* 控制按钮 */}
        {showControls && (
          <div className="flex gap-2">
            {onGenerate && (
              <Button
                onClick={onGenerate}
                disabled={isLoading}
                className="flex-1"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    生成中...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 mr-2" />
                    生成图片
                  </>
                )}
              </Button>
            )}
            
            <Button variant="outline" size="icon" disabled>
              <Download className="w-4 h-4" />
            </Button>
            
            <Button variant="outline" size="icon" disabled>
              <Share2 className="w-4 h-4" />
            </Button>
          </div>
        )}

        {/* 提示信息 */}
        <div className="text-xs text-gray-500 text-center">
          预览效果仅供参考，实际生成图片可能有所差异
        </div>
      </CardContent>
    </Card>
  )
}

// ==================== 导出 ====================

export default PreviewPanel