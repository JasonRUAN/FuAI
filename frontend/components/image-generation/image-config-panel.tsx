/**
 * 图片生成配置面板
 * 
 * 整合所有配置选择器，提供完整的图片生成配置界面
 */

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Settings, 
  Palette, 
  Layout, 
  Droplets, 
  Sparkles, 
  RefreshCw,
  ChevronDown,
  ChevronUp,
  Wand2
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { Badge } from '@/components/ui/badge'
import { 
  ImageGenerationConfig,
  ArtStyle,
  LayoutType,
  ColorScheme,
  DecorationStyle,
  BackgroundStyle
} from '../../types/image-generation'
import { useImageConfig } from '../../hooks/use-image-config'
import ArtStyleSelector from './art-style-selector'
import LayoutSelector from './layout-selector'
import ColorSchemeSelector from './color-scheme-selector'
import PreviewPanel from './preview-panel'

// ==================== 组件Props ====================

export interface ImageConfigPanelProps {
  config: ImageGenerationConfig
  onConfigChange: (config: Partial<ImageGenerationConfig>) => void
  coupletContent?: {
    upper: string
    lower: string
    horizontal: string
  }
  onGenerate?: () => void
  isGenerating?: boolean
  className?: string
  variant?: 'full' | 'compact' | 'tabs'
  showPreview?: boolean
}

// ==================== 主组件 ====================

export function ImageConfigPanel({
  config,
  onConfigChange,
  coupletContent,
  onGenerate,
  isGenerating = false,
  className,
  variant = 'full',
  showPreview = true,
}: ImageConfigPanelProps) {
  // ==================== 状态管理 ====================
  
  const [expandedSections, setExpandedSections] = useState({
    artStyle: true,
    layout: true,
    colorScheme: true,
    advanced: false,
  })
  
  const [activeTab, setActiveTab] = useState<'style' | 'layout' | 'color' | 'preview'>('style')

  // ==================== 工具函数 ====================
  
  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }))
  }

  const randomizeConfig = () => {
    const artStyles: ArtStyle[] = ['traditional-ink', 'traditional-gongbi', 'modern-illustration', 'cartoon-style']
    const layouts: LayoutType[] = ['horizontal', 'vertical', 'square', 'golden-ratio']
    const colorSchemes: ColorScheme[] = ['classic-red-gold', 'warm-tone', 'cool-tone', 'vibrant']
    
    const randomConfig: Partial<ImageGenerationConfig> = {
      artStyle: artStyles[Math.floor(Math.random() * artStyles.length)],
      layout: layouts[Math.floor(Math.random() * layouts.length)],
      colorScheme: colorSchemes[Math.floor(Math.random() * colorSchemes.length)],
    }
    
    onConfigChange(randomConfig)
  }

  // ==================== 标签页渲染 ====================
  
  if (variant === 'tabs') {
    const tabs = [
      { id: 'style', label: '画风', icon: Palette },
      { id: 'layout', label: '构图', icon: Layout },
      { id: 'color', label: '色调', icon: Droplets },
      { id: 'preview', label: '预览', icon: Sparkles },
    ] as const

    return (
      <Card className={cn('w-full', className)}>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5 text-red-500" />
            图片配置
          </CardTitle>
          
          {/* 标签页导航 */}
          <div className="flex gap-1 p-1 bg-gray-100 dark:bg-gray-800 rounded-lg">
            {tabs.map((tab) => {
              const IconComponent = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    'flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200',
                    activeTab === tab.id
                      ? 'bg-white dark:bg-gray-700 text-red-600 shadow-sm'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                  )}
                >
                  <IconComponent className="w-4 h-4" />
                  {tab.label}
                </button>
              )
            })}
          </div>
        </CardHeader>

        <CardContent>
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === 'style' && (
              <ArtStyleSelector
                value={config.artStyle}
                onChange={(value) => onConfigChange({ artStyle: value })}
                variant="grid"
                size="md"
              />
            )}
            
            {activeTab === 'layout' && (
              <LayoutSelector
                value={config.layout}
                onChange={(value) => onConfigChange({ layout: value })}
                variant="visual"
                size="md"
              />
            )}
            
            {activeTab === 'color' && (
              <ColorSchemeSelector
                value={config.colorScheme}
                onChange={(value) => onConfigChange({ colorScheme: value })}
                variant="palette"
                size="md"
              />
            )}
            
            {activeTab === 'preview' && showPreview && (
              <PreviewPanel
                config={config}
                coupletContent={coupletContent}
                isLoading={isGenerating}
                onGenerate={onGenerate}
                variant="full"
                showControls={true}
                showConfigSummary={true}
              />
            )}
          </motion.div>
        </CardContent>
      </Card>
    )
  }

  // ==================== 紧凑版本渲染 ====================
  
  if (variant === 'compact') {
    return (
      <div className={cn('space-y-4', className)}>
        {/* 快速配置 */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Settings className="w-5 h-5 text-red-500" />
                图片配置
              </CardTitle>
              
              <Button
                variant="outline"
                size="sm"
                onClick={randomizeConfig}
                className="gap-2"
              >
                <Wand2 className="w-4 h-4" />
                随机配置
              </Button>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <ArtStyleSelector
                value={config.artStyle}
                onChange={(value) => onConfigChange({ artStyle: value })}
                variant="compact"
                size="sm"
              />
              
              <LayoutSelector
                value={config.layout}
                onChange={(value) => onConfigChange({ layout: value })}
                variant="compact"
                size="sm"
              />
              
              <ColorSchemeSelector
                value={config.colorScheme}
                onChange={(value) => onConfigChange({ colorScheme: value })}
                variant="compact"
                size="sm"
              />
            </div>
          </CardContent>
        </Card>

        {/* 预览面板 */}
        {showPreview && (
          <PreviewPanel
            config={config}
            coupletContent={coupletContent}
            isLoading={isGenerating}
            onGenerate={onGenerate}
            variant="compact"
          />
        )}
      </div>
    )
  }

  // ==================== 完整版本渲染 ====================
  
  return (
    <div className={cn('space-y-6', className)}>
      {/* 配置面板 */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Settings className="w-6 h-6 text-red-500" />
              图片生成配置
              <Badge variant="secondary" className="ml-2">
                高级定制
              </Badge>
            </CardTitle>
            
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={randomizeConfig}
                className="gap-2"
              >
                <Wand2 className="w-4 h-4" />
                随机灵感
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* 画风选择 */}
          <Collapsible
            open={expandedSections.artStyle}
            onOpenChange={() => toggleSection('artStyle')}
          >
            <CollapsibleTrigger asChild>
              <Button
                variant="ghost"
                className="w-full justify-between p-0 h-auto"
              >
                <div className="flex items-center gap-2">
                  <Palette className="w-5 h-5 text-red-500" />
                  <span className="text-lg font-semibold">艺术画风</span>
                </div>
                {expandedSections.artStyle ? (
                  <ChevronUp className="w-4 h-4" />
                ) : (
                  <ChevronDown className="w-4 h-4" />
                )}
              </Button>
            </CollapsibleTrigger>
            
            <CollapsibleContent className="mt-4">
              <ArtStyleSelector
                value={config.artStyle}
                onChange={(value) => onConfigChange({ artStyle: value })}
                variant="card"
                size="md"
                showDescription={true}
                showTags={true}
              />
            </CollapsibleContent>
          </Collapsible>

          <Separator />

          {/* 构图布局 */}
          <Collapsible
            open={expandedSections.layout}
            onOpenChange={() => toggleSection('layout')}
          >
            <CollapsibleTrigger asChild>
              <Button
                variant="ghost"
                className="w-full justify-between p-0 h-auto"
              >
                <div className="flex items-center gap-2">
                  <Layout className="w-5 h-5 text-blue-500" />
                  <span className="text-lg font-semibold">构图布局</span>
                </div>
                {expandedSections.layout ? (
                  <ChevronUp className="w-4 h-4" />
                ) : (
                  <ChevronDown className="w-4 h-4" />
                )}
              </Button>
            </CollapsibleTrigger>
            
            <CollapsibleContent className="mt-4">
              <LayoutSelector
                value={config.layout}
                onChange={(value) => onConfigChange({ layout: value })}
                variant="visual"
                size="md"
                showDimensions={true}
                showAspectRatio={true}
              />
            </CollapsibleContent>
          </Collapsible>

          <Separator />

          {/* 色调方案 */}
          <Collapsible
            open={expandedSections.colorScheme}
            onOpenChange={() => toggleSection('colorScheme')}
          >
            <CollapsibleTrigger asChild>
              <Button
                variant="ghost"
                className="w-full justify-between p-0 h-auto"
              >
                <div className="flex items-center gap-2">
                  <Droplets className="w-5 h-5 text-purple-500" />
                  <span className="text-lg font-semibold">色调方案</span>
                </div>
                {expandedSections.colorScheme ? (
                  <ChevronUp className="w-4 h-4" />
                ) : (
                  <ChevronDown className="w-4 h-4" />
                )}
              </Button>
            </CollapsibleTrigger>
            
            <CollapsibleContent className="mt-4">
              <ColorSchemeSelector
                value={config.colorScheme}
                onChange={(value) => onConfigChange({ colorScheme: value })}
                variant="palette"
                size="md"
                showColors={true}
                showGradient={true}
              />
            </CollapsibleContent>
          </Collapsible>
        </CardContent>
      </Card>

      {/* 预览面板 */}
      {showPreview && (
        <PreviewPanel
          config={config}
          coupletContent={coupletContent}
          isLoading={isGenerating}
          onGenerate={onGenerate}
          variant="full"
          showControls={true}
          showConfigSummary={true}
        />
      )}
    </div>
  )
}

// ==================== 导出 ====================

export default ImageConfigPanel