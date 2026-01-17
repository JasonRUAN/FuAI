/**
 * 构图选择组件
 * 
 * 提供多种布局选择，支持可视化预览和尺寸信息
 */

import React from 'react'
import { motion } from 'framer-motion'
import { Check, Layout, Monitor, Smartphone, Square, Ratio, ScrollText } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { LayoutType, LayoutOption } from '../../types/image-generation'
import { layoutOptions } from '../../lib/image-generation-config'

// ==================== 组件Props ====================

export interface LayoutSelectorProps {
  value: LayoutType
  onChange: (value: LayoutType) => void
  disabled?: boolean
  className?: string
  variant?: 'visual' | 'list' | 'compact'
  size?: 'sm' | 'md' | 'lg'
  showDimensions?: boolean
  showAspectRatio?: boolean
}

// ==================== 图标映射 ====================

const layoutIcons = {
  horizontal: Monitor,
  vertical: Smartphone,
  square: Square,
  'golden-ratio': Ratio,
  'traditional-scroll': ScrollText,
}

// ==================== 主组件 ====================

export function LayoutSelector({
  value,
  onChange,
  disabled = false,
  className,
  variant = 'visual',
  size = 'md',
  showDimensions = true,
  showAspectRatio = true,
}: LayoutSelectorProps) {
  // ==================== 样式配置 ====================
  
  const sizeClasses = {
    sm: {
      card: 'p-3',
      preview: 'w-16 h-12',
      title: 'text-sm font-medium',
      description: 'text-xs',
      badge: 'text-xs px-1.5 py-0.5',
    },
    md: {
      card: 'p-4',
      preview: 'w-20 h-16',
      title: 'text-base font-semibold',
      description: 'text-sm',
      badge: 'text-xs px-2 py-1',
    },
    lg: {
      card: 'p-6',
      preview: 'w-24 h-20',
      title: 'text-lg font-bold',
      description: 'text-base',
      badge: 'text-sm px-3 py-1.5',
    },
  }

  const currentSize = sizeClasses[size]

  // ==================== 预览组件 ====================
  
  const LayoutPreview = ({ layout, className: previewClassName }: { 
    layout: LayoutOption
    className?: string 
  }) => {
    const aspectRatios = {
      horizontal: 'aspect-[16/9]',
      vertical: 'aspect-[9/16]',
      square: 'aspect-square',
      'golden-ratio': 'aspect-[16/10]',
      'traditional-scroll': 'aspect-[3/4]',
    }

    return (
      <div className={cn(
        'relative bg-gradient-to-br from-red-100 to-amber-100 dark:from-red-900/30 dark:to-amber-900/20',
        'border-2 border-red-200 dark:border-red-700 rounded-lg overflow-hidden',
        aspectRatios[layout.value],
        previewClassName
      )}>
        {/* 春联模拟布局 */}
        <div className="absolute inset-2 flex items-center justify-center">
          {layout.value === 'horizontal' && (
            <div className="flex items-center gap-1">
              <div className="w-1 h-6 bg-red-400 rounded-full" />
              <div className="w-4 h-1 bg-amber-400 rounded-full" />
              <div className="w-1 h-6 bg-red-400 rounded-full" />
            </div>
          )}
          
          {layout.value === 'vertical' && (
            <div className="flex flex-col items-center gap-1">
              <div className="w-4 h-1 bg-amber-400 rounded-full" />
              <div className="w-1 h-8 bg-red-400 rounded-full" />
              <div className="w-1 h-8 bg-red-400 rounded-full" />
            </div>
          )}
          
          {layout.value === 'square' && (
            <div className="flex items-center gap-1">
              <div className="w-1 h-8 bg-red-400 rounded-full" />
              <div className="flex flex-col gap-1">
                <div className="w-3 h-0.5 bg-amber-400 rounded-full" />
                <div className="w-2 h-0.5 bg-amber-300 rounded-full" />
              </div>
              <div className="w-1 h-8 bg-red-400 rounded-full" />
            </div>
          )}
          
          {layout.value === 'golden-ratio' && (
            <div className="flex items-center gap-1">
              <div className="w-1 h-6 bg-red-400 rounded-full" />
              <div className="w-5 h-1 bg-amber-400 rounded-full" />
              <div className="w-1 h-6 bg-red-400 rounded-full" />
            </div>
          )}
          
          {layout.value === 'traditional-scroll' && (
            <div className="flex flex-col items-center gap-1">
              <div className="w-3 h-0.5 bg-amber-400 rounded-full" />
              <div className="w-1 h-10 bg-red-400 rounded-full" />
              <div className="w-1 h-10 bg-red-400 rounded-full" />
            </div>
          )}
        </div>
        
        {/* 装饰元素 */}
        <div className="absolute top-1 left-1 w-1 h-1 bg-red-300 rounded-full opacity-60" />
        <div className="absolute top-1 right-1 w-1 h-1 bg-amber-300 rounded-full opacity-60" />
        <div className="absolute bottom-1 left-1 w-1 h-1 bg-amber-300 rounded-full opacity-60" />
        <div className="absolute bottom-1 right-1 w-1 h-1 bg-red-300 rounded-full opacity-60" />
      </div>
    )
  }

  // ==================== 渲染函数 ====================
  
  const renderLayoutOption = (option: LayoutOption, index: number) => {
    const isSelected = value === option.value
    const isDisabled = disabled
    const IconComponent = layoutIcons[option.value]

    return (
      <TooltipProvider key={option.value}>
        <Tooltip>
          <TooltipTrigger asChild>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ scale: isDisabled ? 1 : 1.02 }}
              whileTap={{ scale: isDisabled ? 1 : 0.98 }}
            >
              <Card
                className={cn(
                  'relative cursor-pointer transition-all duration-300 group',
                  'hover:shadow-lg border-2',
                  isSelected
                    ? 'border-red-500 bg-gradient-to-br from-red-50 to-amber-50 dark:from-red-950/30 dark:to-amber-950/20 shadow-lg shadow-red-500/20'
                    : 'border-gray-200 hover:border-red-300 dark:border-gray-700 dark:hover:border-red-600',
                  isDisabled && 'opacity-50 cursor-not-allowed',
                  className
                )}
                onClick={() => !isDisabled && onChange(option.value)}
              >
                <CardContent className={currentSize.card}>
                  {/* 选中状态指示器 */}
                  {isSelected && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute top-2 right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center z-10"
                    >
                      <Check className="w-3 h-3 text-white" />
                    </motion.div>
                  )}

                  {/* 布局预览 */}
                  <div className="flex items-start gap-4 mb-3">
                    <LayoutPreview 
                      layout={option} 
                      className={cn(currentSize.preview, 'flex-shrink-0')} 
                    />
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <IconComponent className="w-4 h-4 text-red-500" />
                        <h3 className={cn(
                          currentSize.title,
                          'text-gray-900 dark:text-gray-100 truncate'
                        )}>
                          {option.label}
                        </h3>
                      </div>
                      
                      <p className={cn(
                        currentSize.description,
                        'text-gray-600 dark:text-gray-400 line-clamp-2 mb-2'
                      )}>
                        {option.description}
                      </p>

                      {/* 尺寸信息 */}
                      <div className="flex flex-wrap gap-1.5">
                        {showAspectRatio && (
                          <Badge
                            variant="secondary"
                            className={cn(
                              currentSize.badge,
                              'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
                            )}
                          >
                            {option.aspectRatio}
                          </Badge>
                        )}
                        
                        {showDimensions && (
                          <Badge
                            variant="outline"
                            className={cn(currentSize.badge, 'text-gray-600 dark:text-gray-400')}
                          >
                            {option.dimensions.width}×{option.dimensions.height}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* 悬浮效果 */}
                  <div className={cn(
                    'absolute inset-0 rounded-lg bg-gradient-to-r from-red-500/5 to-amber-500/5',
                    'opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none'
                  )} />
                </CardContent>
              </Card>
            </motion.div>
          </TooltipTrigger>
          
          <TooltipContent side="top" className="max-w-xs">
            <div className="space-y-2">
              <p className="font-medium">{option.label}</p>
              <p className="text-sm text-muted-foreground">{option.description}</p>
              <div className="flex gap-2 text-xs">
                <span>比例: {option.aspectRatio}</span>
                <span>•</span>
                <span>尺寸: {option.dimensions.width}×{option.dimensions.height}</span>
              </div>
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    )
  }

  // ==================== 紧凑布局渲染 ====================
  
  if (variant === 'compact') {
    return (
      <div className={cn('space-y-3', className)}>
        <div className="flex items-center gap-2 mb-3">
          <Layout className="w-4 h-4 text-red-500" />
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">构图</span>
        </div>
        
        <div className="grid grid-cols-1 gap-2">
          {layoutOptions.map((option, index) => {
            const isSelected = value === option.value
            const IconComponent = layoutIcons[option.value]
            
            return (
              <button
                key={option.value}
                onClick={() => !disabled && onChange(option.value)}
                disabled={disabled}
                className={cn(
                  'flex items-center gap-3 p-3 rounded-lg border-2 transition-all duration-200',
                  'hover:shadow-md text-left',
                  isSelected
                    ? 'border-red-500 bg-red-50 dark:bg-red-950/30'
                    : 'border-gray-200 hover:border-red-300 dark:border-gray-700',
                  disabled && 'opacity-50 cursor-not-allowed'
                )}
              >
                <LayoutPreview layout={option} className="w-12 h-8 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <IconComponent className="w-3 h-3 text-red-500" />
                    <div className="text-sm font-medium truncate">{option.label}</div>
                  </div>
                  <div className="text-xs text-gray-500">{option.aspectRatio}</div>
                </div>
                {isSelected && (
                  <Check className="w-4 h-4 text-red-500 flex-shrink-0" />
                )}
              </button>
            )
          })}
        </div>
      </div>
    )
  }

  // ==================== 列表布局渲染 ====================
  
  if (variant === 'list') {
    return (
      <div className={cn('space-y-4', className)}>
        <div className="flex items-center gap-2">
          <Layout className="w-5 h-5 text-red-500" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            构图布局
          </h3>
        </div>
        
        <div className="space-y-2">
          {layoutOptions.map((option, index) => renderLayoutOption(option, index))}
        </div>
      </div>
    )
  }

  // ==================== 默认可视化布局渲染 ====================
  
  return (
    <div className={cn('space-y-4', className)}>
      {/* 标题区域 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Layout className="w-5 h-5 text-red-500" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            构图布局
          </h3>
        </div>
        
        <Badge variant="outline" className="text-xs">
          {layoutOptions.length} 种布局
        </Badge>
      </div>

      {/* 网格布局 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {layoutOptions.map((option, index) => renderLayoutOption(option, index))}
      </div>

      {/* 使用建议 */}
      <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-950/30 rounded-lg border border-blue-200 dark:border-blue-800">
        <div className="flex items-start gap-2">
          <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center mt-0.5">
            <span className="text-white text-xs">💡</span>
          </div>
          <div className="flex-1">
            <h4 className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-1">
              布局选择建议
            </h4>
            <p className="text-xs text-blue-700 dark:text-blue-300">
              横版适合社交分享，竖版适合手机壁纸，方形适合头像，黄金比例视觉效果最佳，传统卷轴符合中国文化习惯。
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

// ==================== 导出 ====================

export default LayoutSelector