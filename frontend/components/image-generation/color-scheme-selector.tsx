/**
 * 色调选择组件
 * 
 * 提供多种色彩方案选择，支持实时预览和渐变效果
 */

import React from 'react'
import { motion } from 'framer-motion'
import { Check, Palette, Droplets, Sun, Moon, Zap, Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { ColorScheme, ColorSchemeOption } from '../../types/image-generation'
import { colorSchemeOptions } from '../../lib/image-generation-config'

// ==================== 组件Props ====================

export interface ColorSchemeSelectorProps {
  value: ColorScheme
  onChange: (value: ColorScheme) => void
  disabled?: boolean
  className?: string
  variant?: 'palette' | 'card' | 'compact'
  size?: 'sm' | 'md' | 'lg'
  showColors?: boolean
  showGradient?: boolean
}

// ==================== 图标映射 ====================

const colorSchemeIcons = {
  'classic-red-gold': Sparkles,
  'warm-tone': Sun,
  'cool-tone': Droplets,
  'monochrome': Moon,
  'vibrant': Zap,
  'elegant-dark': Moon,
  'fresh-light': Sun,
  'gradient-sunset': Sparkles,
}

// ==================== 主组件 ====================

export function ColorSchemeSelector({
  value,
  onChange,
  disabled = false,
  className,
  variant = 'palette',
  size = 'md',
  showColors = true,
  showGradient = true,
}: ColorSchemeSelectorProps) {
  // ==================== 样式配置 ====================
  
  const sizeClasses = {
    sm: {
      card: 'p-3',
      palette: 'w-16 h-12',
      colorDot: 'w-3 h-3',
      title: 'text-sm font-medium',
      description: 'text-xs',
    },
    md: {
      card: 'p-4',
      palette: 'w-20 h-16',
      colorDot: 'w-4 h-4',
      title: 'text-base font-semibold',
      description: 'text-sm',
    },
    lg: {
      card: 'p-6',
      palette: 'w-24 h-20',
      colorDot: 'w-5 h-5',
      title: 'text-lg font-bold',
      description: 'text-base',
    },
  }

  const currentSize = sizeClasses[size]

  // ==================== 色彩预览组件 ====================
  
  const ColorPalette = ({ scheme, className: paletteClassName }: { 
    scheme: ColorSchemeOption
    className?: string 
  }) => {
    return (
      <div className={cn(
        'relative rounded-lg overflow-hidden border-2 border-gray-200 dark:border-gray-600',
        paletteClassName
      )}>
        {/* 渐变背景 */}
        {showGradient && scheme.gradient && (
          <div 
            className="absolute inset-0"
            style={{ background: scheme.gradient }}
          />
        )}
        
        {/* 纯色背景（当没有渐变时） */}
        {(!showGradient || !scheme.gradient) && (
          <div className="absolute inset-0 flex">
            {scheme.colors.map((color, index) => (
              <div
                key={index}
                className="flex-1"
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
        )}
        
        {/* 装饰元素 */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-6 h-1 bg-white/30 rounded-full" />
        </div>
        
        {/* 边框高光 */}
        <div className="absolute inset-0 border border-white/20 rounded-lg" />
      </div>
    )
  }

  // ==================== 渲染函数 ====================
  
  const renderColorSchemeOption = (option: ColorSchemeOption, index: number) => {
    const isSelected = value === option.value
    const isDisabled = disabled
    const IconComponent = colorSchemeIcons[option.value]

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

                  {/* 色彩预览和信息 */}
                  <div className="flex items-start gap-4 mb-3">
                    <ColorPalette 
                      scheme={option} 
                      className={cn(currentSize.palette, 'flex-shrink-0')} 
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

                      {/* 色彩点 */}
                      {showColors && (
                        <div className="flex gap-1.5">
                          {option.colors.slice(0, 4).map((color, colorIndex) => (
                            <div
                              key={colorIndex}
                              className={cn(
                                currentSize.colorDot,
                                'rounded-full border-2 border-white shadow-sm'
                              )}
                              style={{ backgroundColor: color }}
                            />
                          ))}
                          {option.colors.length > 4 && (
                            <div className={cn(
                              currentSize.colorDot,
                              'rounded-full bg-gray-200 dark:bg-gray-700 border-2 border-white',
                              'flex items-center justify-center text-xs text-gray-500'
                            )}>
                              +{option.colors.length - 4}
                            </div>
                          )}
                        </div>
                      )}
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
            <div className="space-y-3">
              <p className="font-medium">{option.label}</p>
              <p className="text-sm text-muted-foreground">{option.description}</p>
              
              {/* 色彩预览 */}
              <div className="space-y-2">
                <p className="text-xs font-medium">色彩组合:</p>
                <div className="flex gap-1">
                  {option.colors.map((color, index) => (
                    <div
                      key={index}
                      className="w-6 h-6 rounded border border-white/50"
                      style={{ backgroundColor: color }}
                      title={color}
                    />
                  ))}
                </div>
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
          <Palette className="w-4 h-4 text-red-500" />
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">色调</span>
        </div>
        
        <div className="grid grid-cols-2 gap-2">
          {colorSchemeOptions.map((option, index) => {
            const isSelected = value === option.value
            const IconComponent = colorSchemeIcons[option.value]
            
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
                <ColorPalette scheme={option} className="w-8 h-6 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1 mb-1">
                    <IconComponent className="w-3 h-3 text-red-500" />
                    <div className="text-sm font-medium truncate">{option.label}</div>
                  </div>
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

  // ==================== 卡片布局渲染 ====================
  
  if (variant === 'card') {
    return (
      <div className={cn('space-y-4', className)}>
        <div className="flex items-center gap-2">
          <Palette className="w-5 h-5 text-red-500" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            色调方案
          </h3>
        </div>
        
        <div className="space-y-3">
          {colorSchemeOptions.map((option, index) => renderColorSchemeOption(option, index))}
        </div>
      </div>
    )
  }

  // ==================== 默认调色板布局渲染 ====================
  
  return (
    <div className={cn('space-y-4', className)}>
      {/* 标题区域 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Palette className="w-5 h-5 text-red-500" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            色调方案
          </h3>
        </div>
        
        <Badge variant="outline" className="text-xs">
          {colorSchemeOptions.length} 种配色
        </Badge>
      </div>

      {/* 网格布局 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {colorSchemeOptions.map((option, index) => renderColorSchemeOption(option, index))}
      </div>

      {/* 色彩理论提示 */}
      <div className="mt-4 p-3 bg-purple-50 dark:bg-purple-950/30 rounded-lg border border-purple-200 dark:border-purple-800">
        <div className="flex items-start gap-2">
          <Palette className="w-4 h-4 text-purple-500 mt-0.5" />
          <div className="flex-1">
            <h4 className="text-sm font-medium text-purple-900 dark:text-purple-100 mb-1">
              色彩搭配建议
            </h4>
            <p className="text-xs text-purple-700 dark:text-purple-300">
              红金配色最经典喜庆，暖色调温馨和谐，冷色调现代清新，单色调简约大气。选择与春联主题和个人喜好相符的色彩方案。
            </p>
          </div>
        </div>
      </div>

      {/* 快速预设 */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => onChange('classic-red-gold')}
          className="px-3 py-1.5 text-xs bg-gradient-to-r from-red-500 to-amber-500 text-white rounded-full hover:shadow-md transition-all duration-200"
        >
          经典红金
        </button>
        <button
          onClick={() => onChange('warm-tone')}
          className="px-3 py-1.5 text-xs bg-gradient-to-r from-orange-400 to-red-400 text-white rounded-full hover:shadow-md transition-all duration-200"
        >
          温暖色调
        </button>
        <button
          onClick={() => onChange('elegant-dark')}
          className="px-3 py-1.5 text-xs bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-full hover:shadow-md transition-all duration-200"
        >
          优雅深色
        </button>
      </div>
    </div>
  )
}

// ==================== 导出 ====================

export default ColorSchemeSelector