/**
 * 图片生成服务
 * 
 * 提供完整的图片生成API调用和配置管理功能
 */

import { 
  ImageGenerationConfig,
  ImageGenerationRequest,
  ImageGenerationResponse 
} from '../types/image-generation'

// ==================== API调用服务 ====================

/**
 * 调用图片生成API
 */
export async function generateCoupletImage(
  coupletContent: {
    upper: string
    lower: string
    horizontal: string
  },
  config: ImageGenerationConfig
): Promise<ImageGenerationResponse> {
  try {
    // 构建请求参数
    const requestBody: ImageGenerationRequest = {
      // 春联内容
      upper: coupletContent.upper,
      lower: coupletContent.lower,
      horizontal: coupletContent.horizontal,
      
      // 基础配置（保持兼容性）
      zodiac: config.zodiac,
      style: config.style,
      theme: config.theme,
      tone: config.tone,
      
      // 新增高级配置
      artStyle: config.artStyle,
      layout: config.layout,
      colorScheme: config.colorScheme,
      decoration: config.decoration,
      background: config.background,
      
      // 高级参数
      advanced: config.advanced,
    }

    console.log('[图片生成服务] 发起请求', {
      coupletContent,
      config: requestBody
    })

    // 调用API
    const response = await fetch('/api/couplet/image', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    })

    const data = await response.json()

    if (!response.ok || !data.success) {
      throw new Error(data.error || '图片生成失败')
    }

    console.log('[图片生成服务] 生成成功', data)

    return {
      success: true,
      data: data.data,
    }
  } catch (error) {
    console.error('[图片生成服务] 生成失败', error)
    
    return {
      success: false,
      error: error instanceof Error ? error.message : '图片生成失败，请稍后重试',
    }
  }
}

// ==================== 配置验证服务 ====================

/**
 * 验证图片生成配置
 */
export function validateImageConfig(config: ImageGenerationConfig): {
  isValid: boolean
  errors: string[]
  warnings: string[]
} {
  const errors: string[] = []
  const warnings: string[] = []

  // 必填字段验证
  if (!config.artStyle) {
    errors.push('请选择艺术画风')
  }
  
  if (!config.layout) {
    errors.push('请选择构图布局')
  }
  
  if (!config.colorScheme) {
    errors.push('请选择色调方案')
  }

  // 兼容性警告
  if (config.artStyle === 'traditional-ink' && config.colorScheme === 'vibrant') {
    warnings.push('传统水墨画风格建议使用单色调或优雅色彩')
  }
  
  if (config.layout === 'vertical' && config.artStyle === '3d-render') {
    warnings.push('3D渲染风格在竖版布局中可能效果不佳')
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  }
}

// ==================== 配置优化服务 ====================

/**
 * 根据春联内容优化配置
 */
export function optimizeConfigForCouplet(
  coupletContent: {
    upper: string
    lower: string
    horizontal: string
  },
  baseConfig: ImageGenerationConfig
): Partial<ImageGenerationConfig> {
  const optimizations: Partial<ImageGenerationConfig> = {}

  // 根据春联长度优化布局
  const maxLength = Math.max(coupletContent.upper.length, coupletContent.lower.length)
  
  if (maxLength <= 5) {
    // 短春联适合方形或横版
    if (baseConfig.layout === 'vertical') {
      optimizations.layout = 'square'
    }
  } else if (maxLength >= 9) {
    // 长春联适合竖版或传统卷轴
    if (baseConfig.layout === 'square') {
      optimizations.layout = 'traditional-scroll'
    }
  }

  // 根据春联内容情感优化色调
  const content = coupletContent.upper + coupletContent.lower + coupletContent.horizontal
  
  if (content.includes('福') || content.includes('喜') || content.includes('庆')) {
    if (baseConfig.colorScheme === 'cool-tone') {
      optimizations.colorScheme = 'classic-red-gold'
    }
  }
  
  if (content.includes('雅') || content.includes('静') || content.includes('淡')) {
    if (baseConfig.colorScheme === 'vibrant') {
      optimizations.colorScheme = 'fresh-light'
    }
  }

  return optimizations
}

// ==================== 预设配置服务 ====================

/**
 * 获取推荐配置预设
 */
export function getRecommendedPresets(
  coupletContent?: {
    upper: string
    lower: string
    horizontal: string
  }
): Array<{
  id: string
  name: string
  description: string
  config: Partial<ImageGenerationConfig>
  score: number // 推荐度评分
}> {
  const basePresets = [
    {
      id: 'classic-elegant',
      name: '经典雅致',
      description: '传统工笔画风格，经典红金配色，华丽装饰',
      config: {
        artStyle: 'traditional-gongbi' as const,
        layout: 'horizontal' as const,
        colorScheme: 'classic-red-gold' as const,
        decoration: 'rich-ornate' as const,
        background: 'texture-paper' as const,
      },
      score: 0.9,
    },
    {
      id: 'ink-artistic',
      name: '水墨意境',
      description: '传统水墨画风格，单色调配色，简约装饰',
      config: {
        artStyle: 'traditional-ink' as const,
        layout: 'traditional-scroll' as const,
        colorScheme: 'monochrome' as const,
        decoration: 'simple-elegant' as const,
        background: 'texture-paper' as const,
      },
      score: 0.8,
    },
    {
      id: 'modern-fresh',
      name: '现代清新',
      description: '现代插画风格，清新配色，几何装饰',
      config: {
        artStyle: 'modern-illustration' as const,
        layout: 'square' as const,
        colorScheme: 'fresh-light' as const,
        decoration: 'modern-geometric' as const,
        background: 'gradient' as const,
      },
      score: 0.7,
    },
    {
      id: 'cartoon-fun',
      name: '卡通趣味',
      description: '卡通风格，鲜艳配色，民俗装饰',
      config: {
        artStyle: 'cartoon-style' as const,
        layout: 'square' as const,
        colorScheme: 'vibrant' as const,
        decoration: 'traditional-folk' as const,
        background: 'pattern-flowers' as const,
      },
      score: 0.6,
    },
  ]

  // 如果有春联内容，根据内容调整推荐度
  if (coupletContent) {
    const content = coupletContent.upper + coupletContent.lower + coupletContent.horizontal
    
    basePresets.forEach(preset => {
      // 传统内容提高传统风格推荐度
      if (content.includes('福') || content.includes('寿') || content.includes('喜')) {
        if (preset.id === 'classic-elegant' || preset.id === 'ink-artistic') {
          preset.score += 0.1
        }
      }
      
      // 现代词汇提高现代风格推荐度
      if (content.includes('新') || content.includes('时代') || content.includes('科技')) {
        if (preset.id === 'modern-fresh') {
          preset.score += 0.1
        }
      }
      
      // 趣味内容提高卡通风格推荐度
      if (content.includes('乐') || content.includes('笑') || content.includes('趣')) {
        if (preset.id === 'cartoon-fun') {
          preset.score += 0.1
        }
      }
    })
  }

  return basePresets.sort((a, b) => b.score - a.score)
}

// ==================== 工具函数 ====================

/**
 * 生成随机配置
 */
export function generateRandomConfig(): Partial<ImageGenerationConfig> {
  const artStyles = ['traditional-ink', 'traditional-gongbi', 'modern-illustration', 'cartoon-style']
  const layouts = ['horizontal', 'vertical', 'square', 'golden-ratio']
  const colorSchemes = ['classic-red-gold', 'warm-tone', 'cool-tone', 'vibrant']
  const decorations = ['rich-ornate', 'simple-elegant', 'traditional-folk', 'modern-geometric']
  const backgrounds = ['gradient', 'texture-paper', 'pattern-clouds', 'solid-color']

  return {
    artStyle: artStyles[Math.floor(Math.random() * artStyles.length)] as any,
    layout: layouts[Math.floor(Math.random() * layouts.length)] as any,
    colorScheme: colorSchemes[Math.floor(Math.random() * colorSchemes.length)] as any,
    decoration: decorations[Math.floor(Math.random() * decorations.length)] as any,
    background: backgrounds[Math.floor(Math.random() * backgrounds.length)] as any,
  }
}

/**
 * 计算配置相似度
 */
export function calculateConfigSimilarity(
  config1: ImageGenerationConfig,
  config2: ImageGenerationConfig
): number {
  let similarity = 0
  let totalFields = 0

  const fields: (keyof ImageGenerationConfig)[] = [
    'artStyle', 'layout', 'colorScheme', 'decoration', 'background'
  ]

  fields.forEach(field => {
    if (config1[field] && config2[field]) {
      totalFields++
      if (config1[field] === config2[field]) {
        similarity++
      }
    }
  })

  return totalFields > 0 ? similarity / totalFields : 0
}

// ==================== 导出 ====================

export default {
  generateCoupletImage,
  validateImageConfig,
  optimizeConfigForCouplet,
  getRecommendedPresets,
  generateRandomConfig,
  calculateConfigSimilarity,
}