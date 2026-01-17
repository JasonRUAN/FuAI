/**
 * 画风选择组件
 * 
 * 提供多种艺术风格选择，支持卡片式和网格布局
 */

import React from 'react'
import { motion } from 'framer-motion'
import { Check, Palette, Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { ArtStyle, ArtStyleOption } from '../../types/image-generation'
import { artStyleOptions } from '../../lib/image-generation-config'

// ==================== 组件Props ====================

export interface ArtStyleSelectorProps {
  value: ArtStyle
  onChange: (value: ArtStyle) => void
  disabled?: boolean
  className?: string
  variant?: 'card' | 'grid' | 'compact'
  size?: 'sm' | 'md' | 'lg'
  showDescription?: boolean
  showTags?: boolean
  allowCustom?: boolean
}

// ==================== 主组件 ====================

export function ArtStyleSelector({
  value,
  onChange,
  disabled = false,
  className,
  variant = 'card',
  size = 'md',
  showDescription = true,
  showTags = true,
  allowCustom = false,
}: ArtStyleSelectorProps) {
  // ==================== 样式配置 ====================
  
  const sizeClasses = {
    sm: {
      card: 'p-3',
      icon: 'text-lg',
      title: 'text-sm font-medium',
      description: 'text-xs',
      badge: 'text-xs px-1.5 py-0.5',
    },
    md: {
      card: 'p-4',
      icon: 'text-xl',
      title: 'text-base font-semibold',
      description: 'text-sm',
      badge: 'text-xs px-2 py-1',
    },
    lg: {
      card: 'p-6',
      icon: 'text-2xl',
      title: 'text-lg font-bold',
      description: 'text-base',
      badge: 'text-sm px-3 py-1.5',
    },
  }

  const currentSize = sizeClasses[size]

  // ==================== 渲染函数 ====================
  
  const renderStyleOption = (option: ArtStyleOption, index: number) => {
    const isSelected = value === option.value
    const isDisabled = disabled

    return (
      <TooltipProvider key={option.value}>
        <Tooltip>
          <TooltipTrigger asChild>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
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
                      className="absolute top-2 right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center"
                    >
                      <Check className="w-3 h-3 text-white" />
                    </motion.div>
                  )}

                  {/* 图标和标题 */}
                  <div className="flex items-start gap-3 mb-3">
                    <div className={cn(
                      'flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center',
                      'bg-gradient-to-br from-red-100 to-amber-100 dark:from-red-900/30 dark:to-amber-900/20',
                      'group-hover:from-red-200 group-hover:to-amber-200 dark:group-hover:from-red-800/40 dark:group-hover:to-amber-800/30',
                      'transition-colors duration-300'
                    )}>
                      <span className={currentSize.icon}>{option.icon}</span>
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h3 className={cn(
                        currentSize.title,
                        'text-gray-900 dark:text-gray-100 mb-1 truncate'
                      )}>
                        {option.label}
                      </h3>
                      
                      {showDescription && (
                        <p className={cn(
                          currentSize.description,
                          'text-gray-600 dark:text-gray-400 line-clamp-2'
                        )}>
                          {option.description}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* 标签 */}
                  {showTags && option.tags && option.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {option.tags.slice(0, 3).map((tag) => (
                        <Badge
                          key={tag}
                          variant="secondary"
                          className={cn(
                            currentSize.badge,
                            'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300',
                            'group-hover:bg-red-100 group-hover:text-red-700 dark:group-hover:bg-red-900/30 dark:group-hover:text-red-300'
                          )}
                        >
                          {tag}
                        </Badge>
                      ))}
                      {option.tags.length > 3 && (
                        <Badge
                          variant="outline"
                          className={cn(currentSize.badge, 'text-gray-500')}
                        >
                          +{option.tags.length - 3}
                        </Badge>
                      )}
                    </div>
                  )}

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
              {option.tags && (
                <div className="flex flex-wrap gap-1">
                  {option.tags.map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    )
  }

  // ==================== 网格布局渲染 ====================
  
  if (variant === 'grid') {
    return (
      <div className={cn('space-y-4', className)}>
        {/* 标题 */}
        <div className="flex items-center gap-2">
          <Palette className="w-5 h-5 text-red-500" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            选择画风
          </h3>
          <Sparkles className="w-4 h-4 text-amber-500" />
        </div>
        
        {/* 网格布局 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {artStyleOptions.map((option, index) => renderStyleOption(option, index))}
        </div>
      </div>
    )
  }

  // ==================== 紧凑布局渲染 ====================
  
  if (variant === 'compact') {
    return (
      <div className={cn('space-y-3', className)}>
        <div className="flex items-center gap-2 mb-3">
          <Palette className="w-4 h-4 text-red-500" />
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">画风</span>
        </div>
        
        <div className="grid grid-cols-2 gap-2">
          {artStyleOptions.map((option, index) => {
            const isSelected = value === option.value
            
            return (
              <button
                key={option.value}
                onClick={() => !disabled && onChange(option.value)}
                disabled={disabled}
                className={cn(
                  'flex items-center gap-2 p-3 rounded-lg border-2 transition-all duration-200',
                  'hover:shadow-md text-left',
                  isSelected
                    ? 'border-red-500 bg-red-50 dark:bg-red-950/30'
                    : 'border-gray-200 hover:border-red-300 dark:border-gray-700',
                  disabled && 'opacity-50 cursor-not-allowed'
                )}
              >
                <span className="text-lg">{option.icon}</span>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium truncate">{option.label}</div>
                  <div className="text-xs text-gray-500 truncate">{option.tags?.[0]}</div>
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

  // ==================== 默认卡片布局渲染 ====================
  
  return (
    <div className={cn('space-y-4', className)}>
      {/* 标题区域 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Palette className="w-5 h-5 text-red-500" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            艺术画风
          </h3>
          <Sparkles className="w-4 h-4 text-amber-500" />
        </div>
        
        <Badge variant="outline" className="text-xs">
          {artStyleOptions.length} 种风格
        </Badge>
      </div>

      {/* 选项列表 */}
      <div className="space-y-3">
        {artStyleOptions.map((option, index) => renderStyleOption(option, index))}
      </div>

      {/* 自定义选项 */}
      {allowCustom && (
        <Card className="border-2 border-dashed border-gray-300 dark:border-gray-600">
          <CardContent className="p-4 text-center">
            <div className="flex flex-col items-center gap-2">
              <div className="w-12 h-12 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-gray-400" />
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  自定义画风
                </h4>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  即将推出更多风格选项
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

// ==================== 导出 ====================

export default ArtStyleSelector