/**
 * 春联图片生成配置类型定义
 * 
 * 提供完整的生图配置选项类型系统，支持画风、构图、色调等个性化定制
 */

// ==================== 基础配置选项 ====================

/**
 * 画风类型 - 定义图片的艺术风格
 */
export type ArtStyle = 
  | 'traditional-ink'      // 传统水墨画
  | 'traditional-gongbi'   // 传统工笔画
  | 'modern-illustration'  // 现代插画
  | 'cartoon-style'        // 卡通风格
  | 'paper-cut'           // 剪纸风格
  | 'calligraphy'         // 书法风格
  | '3d-render'           // 3D渲染风格
  | 'minimalist'          // 极简风格

/**
 * 构图布局类型 - 定义图片的整体布局
 */
export type LayoutType = 
  | 'horizontal'          // 横版布局 (16:9)
  | 'vertical'            // 竖版布局 (9:16)
  | 'square'              // 方形布局 (1:1)
  | 'golden-ratio'        // 黄金比例 (16:10)
  | 'traditional-scroll'  // 传统卷轴 (3:4)

/**
 * 色调方案类型 - 定义图片的色彩基调
 */
export type ColorScheme = 
  | 'classic-red-gold'    // 经典红金配色
  | 'warm-tone'           // 暖色调
  | 'cool-tone'           // 冷色调
  | 'monochrome'          // 单色调
  | 'vibrant'             // 鲜艳色彩
  | 'elegant-dark'        // 优雅深色
  | 'fresh-light'         // 清新浅色
  | 'gradient-sunset'     // 渐变夕阳色

/**
 * 装饰元素类型 - 定义图片中的装饰元素
 */
export type DecorationStyle = 
  | 'rich-ornate'         // 丰富华丽
  | 'simple-elegant'      // 简约优雅
  | 'traditional-folk'    // 传统民俗
  | 'modern-geometric'    // 现代几何
  | 'nature-organic'      // 自然有机
  | 'minimal-clean'       // 极简干净

/**
 * 背景风格类型 - 定义图片背景样式
 */
export type BackgroundStyle = 
  | 'solid-color'         // 纯色背景
  | 'gradient'            // 渐变背景
  | 'texture-paper'       // 纸质纹理
  | 'texture-silk'        // 丝绸纹理
  | 'pattern-clouds'      // 祥云图案
  | 'pattern-flowers'     // 花卉图案
  | 'scene-interior'      // 室内场景
  | 'scene-landscape'     // 风景场景

// ==================== 配置选项数据结构 ====================

/**
 * 画风配置选项
 */
export interface ArtStyleOption {
  value: ArtStyle
  label: string
  description: string
  icon: string
  preview?: string  // 预览图片URL
  tags: string[]    // 标签，用于分类和搜索
}

/**
 * 构图配置选项
 */
export interface LayoutOption {
  value: LayoutType
  label: string
  description: string
  icon: string
  aspectRatio: string  // 宽高比，如 "16:9"
  dimensions: {        // 推荐尺寸
    width: number
    height: number
  }
}

/**
 * 色调配置选项
 */
export interface ColorSchemeOption {
  value: ColorScheme
  label: string
  description: string
  colors: string[]     // 主要颜色列表
  gradient?: string    // CSS渐变样式
  preview: string      // 预览色块样式
}

/**
 * 装饰元素配置选项
 */
export interface DecorationOption {
  value: DecorationStyle
  label: string
  description: string
  icon: string
  elements: string[]   // 包含的装饰元素
}

/**
 * 背景风格配置选项
 */
export interface BackgroundOption {
  value: BackgroundStyle
  label: string
  description: string
  icon: string
  preview?: string     // 预览图片URL
}

// ==================== 完整配置接口 ====================

/**
 * 图片生成配置接口 - 扩展现有配置
 */
export interface ImageGenerationConfig {
  // 继承现有配置
  zodiac: string        // 生肖年份
  style: string         // 创作风格（传统典雅/现代简约等）
  theme: string         // 祝福主题
  tone: string          // 预期氛围
  
  // 新增画风配置
  artStyle: ArtStyle                    // 画风类型
  layout: LayoutType                    // 构图布局
  colorScheme: ColorScheme              // 色调方案
  decoration: DecorationStyle           // 装饰元素
  background: BackgroundStyle           // 背景风格
  
  // 高级配置选项
  advanced?: {
    customPrompt?: string               // 自定义提示词
    negativePrompt?: string             // 负向提示词
    seed?: number                       // 随机种子
    steps?: number                      // 生成步数
    guidance?: number                   // 引导强度
  }
}

/**
 * 图片生成请求接口 - API调用参数
 */
export interface ImageGenerationRequest {
  // 春联内容（必填）
  upper: string
  lower: string
  horizontal: string
  
  // 基础配置（继承现有）
  zodiac?: string
  style?: string
  theme?: string
  tone?: string
  
  // 新增配置选项
  artStyle?: ArtStyle
  layout?: LayoutType
  colorScheme?: ColorScheme
  decoration?: DecorationStyle
  background?: BackgroundStyle
  
  // 高级选项
  advanced?: ImageGenerationConfig['advanced']
}

/**
 * 图片生成响应接口
 */
export interface ImageGenerationResponse {
  success: boolean
  data?: {
    imageUrl: string
    config?: ImageGenerationConfig  // 返回实际使用的配置
    metadata?: {                    // 生成元数据
      model: string
      timestamp: number
      processingTime: number
      seed?: number
    }
  }
  error?: string
}

// ==================== 预设配置 ====================

/**
 * 预设配置模板
 */
export interface ConfigPreset {
  id: string
  name: string
  description: string
  thumbnail?: string
  config: Partial<ImageGenerationConfig>
  tags: string[]
  isDefault?: boolean
}

/**
 * 配置历史记录
 */
export interface ConfigHistory {
  id: string
  timestamp: number
  config: ImageGenerationConfig
  imageUrl?: string
  isBookmarked?: boolean
}

// ==================== 用户偏好设置 ====================

/**
 * 用户偏好配置
 */
export interface UserPreferences {
  // 默认配置
  defaultConfig: Partial<ImageGenerationConfig>
  
  // 收藏的预设
  favoritePresets: string[]
  
  // 最近使用的配置
  recentConfigs: ConfigHistory[]
  
  // 个性化设置
  preferences: {
    autoSave: boolean           // 自动保存配置
    showPreview: boolean        // 显示实时预览
    quickGenerate: boolean      // 快速生成模式
    saveHistory: boolean        // 保存历史记录
  }
}

// ==================== 组件Props接口 ====================

/**
 * 配置选择器组件通用Props
 */
export interface ConfigSelectorProps<T> {
  value: T
  onChange: (value: T) => void
  options: Array<{
    value: T
    label: string
    description?: string
    icon?: string
    disabled?: boolean
  }>
  disabled?: boolean
  className?: string
  size?: 'sm' | 'md' | 'lg'
  variant?: 'card' | 'button' | 'dropdown'
}

/**
 * 预览面板Props
 */
export interface PreviewPanelProps {
  config: ImageGenerationConfig
  coupletContent?: {
    upper: string
    lower: string
    horizontal: string
  }
  isLoading?: boolean
  onConfigChange?: (config: Partial<ImageGenerationConfig>) => void
  className?: string
}

// ==================== 工具类型 ====================

/**
 * 配置验证结果
 */
export interface ConfigValidationResult {
  isValid: boolean
  errors: Array<{
    field: keyof ImageGenerationConfig
    message: string
  }>
  warnings?: Array<{
    field: keyof ImageGenerationConfig
    message: string
  }>
}

/**
 * 配置比较结果
 */
export interface ConfigDiff {
  changed: Array<{
    field: keyof ImageGenerationConfig
    oldValue: any
    newValue: any
  }>
  added: Array<{
    field: keyof ImageGenerationConfig
    value: any
  }>
  removed: Array<{
    field: keyof ImageGenerationConfig
    value: any
  }>
}

// ==================== 导出类型守卫 ====================

/**
 * 类型守卫：检查是否为有效的画风类型
 */
export function isValidArtStyle(value: string): value is ArtStyle {
  const validStyles: ArtStyle[] = [
    'traditional-ink', 'traditional-gongbi', 'modern-illustration',
    'cartoon-style', 'paper-cut', 'calligraphy', '3d-render', 'minimalist'
  ]
  return validStyles.includes(value as ArtStyle)
}

/**
 * 类型守卫：检查是否为有效的布局类型
 */
export function isValidLayoutType(value: string): value is LayoutType {
  const validLayouts: LayoutType[] = [
    'horizontal', 'vertical', 'square', 'golden-ratio', 'traditional-scroll'
  ]
  return validLayouts.includes(value as LayoutType)
}

/**
 * 类型守卫：检查是否为有效的色调方案
 */
export function isValidColorScheme(value: string): value is ColorScheme {
  const validSchemes: ColorScheme[] = [
    'classic-red-gold', 'warm-tone', 'cool-tone', 'monochrome',
    'vibrant', 'elegant-dark', 'fresh-light', 'gradient-sunset'
  ]
  return validSchemes.includes(value as ColorScheme)
}