/**
 * 春联图片生成配置选项数据
 *
 * 定义所有可选的画风、构图、色调等配置选项的具体数据
 */

import {
  ArtStyleOption,
  LayoutOption,
  ColorSchemeOption,
  DecorationOption,
  BackgroundOption,
  ConfigPreset,
  ImageGenerationConfig,
} from "../types/image-generation";

// ==================== 画风配置选项 ====================

export const artStyleOptions: ArtStyleOption[] = [
  {
    value: "traditional-ink",
    label: "传统水墨",
    description: "中国传统水墨画风格，意境深远，墨韵生动",
    icon: "🎨",
    tags: ["传统", "水墨", "意境", "古典"],
  },
  {
    value: "traditional-gongbi",
    label: "工笔画",
    description: "精细工笔画风格，线条工整，色彩丰富",
    icon: "🖌️",
    tags: ["传统", "工笔", "精细", "华丽"],
  },
  {
    value: "modern-illustration",
    label: "现代插画",
    description: "现代插画风格，色彩明快，构图新颖",
    icon: "✨",
    tags: ["现代", "插画", "时尚", "创意"],
  },
  {
    value: "cartoon-style",
    label: "卡通风格",
    description: "可爱卡通风格，生动有趣，老少皆宜",
    icon: "🎭",
    tags: ["卡通", "可爱", "趣味", "活泼"],
  },
  {
    value: "paper-cut",
    label: "剪纸艺术",
    description: "传统剪纸艺术风格，层次分明，寓意吉祥",
    icon: "✂️",
    tags: ["剪纸", "民俗", "吉祥", "传统"],
  },
  {
    value: "calligraphy",
    label: "书法艺术",
    description: "书法艺术风格，笔墨飞扬，文化底蕴深厚",
    icon: "📜",
    tags: ["书法", "文化", "艺术", "典雅"],
  },
  {
    value: "3d-render",
    label: "3D渲染",
    description: "现代3D渲染风格，立体感强，视觉冲击力强",
    icon: "🎯",
    tags: ["3D", "现代", "立体", "科技"],
  },
  {
    value: "minimalist",
    label: "极简风格",
    description: "极简主义风格，简约而不简单，突出核心元素",
    icon: "⚪",
    tags: ["极简", "简约", "现代", "纯净"],
  },
];

// ==================== 构图布局选项 ====================

export const layoutOptions: LayoutOption[] = [
  {
    value: "horizontal",
    label: "横版布局",
    description: "16:9横版布局，适合横屏显示和社交分享",
    icon: "📱",
    aspectRatio: "16:9",
    dimensions: { width: 1664, height: 936 },
  },
  {
    value: "vertical",
    label: "竖版布局",
    description: "9:16竖版布局，适合手机壁纸和竖屏展示",
    icon: "📲",
    aspectRatio: "9:16",
    dimensions: { width: 936, height: 1664 },
  },
  {
    value: "square",
    label: "方形布局",
    description: "1:1方形布局，适合社交媒体头像和印刷",
    icon: "⬜",
    aspectRatio: "1:1",
    dimensions: { width: 1024, height: 1024 },
  },
  {
    value: "golden-ratio",
    label: "黄金比例",
    description: "16:10黄金比例，视觉效果最佳的经典比例",
    icon: "🔶",
    aspectRatio: "16:10",
    dimensions: { width: 1600, height: 1000 },
  },
  {
    value: "traditional-scroll",
    label: "传统卷轴",
    description: "3:4传统卷轴比例，符合中国传统绘画习惯",
    icon: "📜",
    aspectRatio: "3:4",
    dimensions: { width: 1200, height: 1600 },
  },
];

// ==================== 色调方案选项 ====================

export const colorSchemeOptions: ColorSchemeOption[] = [
  {
    value: "classic-red-gold",
    label: "经典红金",
    description: "传统春节红金配色，喜庆热烈，寓意吉祥",
    colors: ["#DC2626", "#F59E0B", "#FEF3C7"],
    gradient: "linear-gradient(135deg, #DC2626 0%, #F59E0B 100%)",
    preview: "bg-gradient-to-r from-red-600 to-amber-500",
  },
  {
    value: "warm-tone",
    label: "温暖色调",
    description: "温暖的橙红色系，营造温馨和谐的氛围",
    colors: ["#EA580C", "#F97316", "#FED7AA"],
    gradient: "linear-gradient(135deg, #EA580C 0%, #F97316 100%)",
    preview: "bg-gradient-to-r from-orange-600 to-orange-500",
  },
  {
    value: "cool-tone",
    label: "冷色调",
    description: "清新的蓝绿色系，现代简约，宁静致远",
    colors: ["#0369A1", "#0891B2", "#A7F3D0"],
    gradient: "linear-gradient(135deg, #0369A1 0%, #0891B2 100%)",
    preview: "bg-gradient-to-r from-blue-700 to-cyan-600",
  },
  {
    value: "monochrome",
    label: "单色调",
    description: "经典黑白灰单色调，简约大气，永不过时",
    colors: ["#1F2937", "#6B7280", "#F3F4F6"],
    gradient: "linear-gradient(135deg, #1F2937 0%, #6B7280 100%)",
    preview: "bg-gradient-to-r from-gray-800 to-gray-500",
  },
  {
    value: "vibrant",
    label: "鲜艳色彩",
    description: "高饱和度鲜艳色彩，活力四射，青春洋溢",
    colors: ["#DC2626", "#7C3AED", "#059669"],
    gradient: "linear-gradient(135deg, #DC2626 0%, #7C3AED 50%, #059669 100%)",
    preview: "bg-gradient-to-r from-red-600 via-purple-600 to-emerald-600",
  },
  {
    value: "elegant-dark",
    label: "优雅深色",
    description: "深色系优雅配色，神秘高贵，质感十足",
    colors: ["#1E1B4B", "#312E81", "#6366F1"],
    gradient: "linear-gradient(135deg, #1E1B4B 0%, #312E81 100%)",
    preview: "bg-gradient-to-r from-indigo-900 to-indigo-700",
  },
  {
    value: "fresh-light",
    label: "清新浅色",
    description: "清新淡雅的浅色系，温柔舒适，治愈系风格",
    colors: ["#FEF3C7", "#FDE68A", "#F59E0B"],
    gradient: "linear-gradient(135deg, #FEF3C7 0%, #FDE68A 100%)",
    preview: "bg-gradient-to-r from-amber-100 to-amber-300",
  },
  {
    value: "gradient-sunset",
    label: "渐变夕阳",
    description: "夕阳渐变色彩，浪漫温馨，层次丰富",
    colors: ["#F97316", "#EF4444", "#EC4899"],
    gradient: "linear-gradient(135deg, #F97316 0%, #EF4444 50%, #EC4899 100%)",
    preview: "bg-gradient-to-r from-orange-500 via-red-500 to-pink-500",
  },
];

// ==================== 装饰元素选项 ====================

export const decorationOptions: DecorationOption[] = [
  {
    value: "rich-ornate",
    label: "丰富华丽",
    description: "华丽繁复的装饰元素，富贵大气，层次丰富",
    icon: "👑",
    elements: ["金色花纹", "祥云", "凤凰", "牡丹", "如意", "宝鼎"],
  },
  {
    value: "simple-elegant",
    label: "简约优雅",
    description: "简约而优雅的装饰，恰到好处，不喧宾夺主",
    icon: "🌸",
    elements: ["简约花纹", "淡雅祥云", "梅花", "竹叶", "水波纹"],
  },
  {
    value: "traditional-folk",
    label: "传统民俗",
    description: "传统民俗装饰元素，文化底蕴深厚，寓意吉祥",
    icon: "🏮",
    elements: ["红灯笼", "中国结", "窗花", "年画", "福字", "鞭炮"],
  },
  {
    value: "modern-geometric",
    label: "现代几何",
    description: "现代几何图案装饰，简洁时尚，富有设计感",
    icon: "🔷",
    elements: ["几何图形", "线条装饰", "抽象图案", "渐变色块"],
  },
  {
    value: "nature-organic",
    label: "自然有机",
    description: "自然有机的装饰元素，生机盎然，和谐自然",
    icon: "🌿",
    elements: ["花草藤蔓", "树枝", "叶子", "花朵", "蝴蝶", "鸟儿"],
  },
  {
    value: "minimal-clean",
    label: "极简干净",
    description: "极简主义装饰，干净利落，突出主体内容",
    icon: "⚪",
    elements: ["简单线条", "点缀元素", "留白空间"],
  },
];

// ==================== 背景风格选项 ====================

export const backgroundOptions: BackgroundOption[] = [
  {
    value: "solid-color",
    label: "纯色背景",
    description: "简洁的纯色背景，突出春联内容",
    icon: "🎨",
  },
  {
    value: "gradient",
    label: "渐变背景",
    description: "优美的渐变色背景，层次丰富",
    icon: "🌈",
  },
  {
    value: "texture-paper",
    label: "纸质纹理",
    description: "传统纸质纹理背景，古朴自然",
    icon: "📄",
  },
  {
    value: "texture-silk",
    label: "丝绸纹理",
    description: "丝绸质感背景，华贵典雅",
    icon: "🧵",
  },
  {
    value: "pattern-clouds",
    label: "祥云图案",
    description: "传统祥云图案背景，吉祥如意",
    icon: "☁️",
  },
  {
    value: "pattern-flowers",
    label: "花卉图案",
    description: "精美花卉图案背景，生机盎然",
    icon: "🌺",
  },
  {
    value: "scene-interior",
    label: "室内场景",
    description: "温馨的室内场景背景，生活气息浓厚",
    icon: "🏠",
  },
  {
    value: "scene-landscape",
    label: "风景场景",
    description: "美丽的风景场景背景，意境深远",
    icon: "🏔️",
  },
];

// ==================== 预设配置模板 ====================

export const configPresets: ConfigPreset[] = [
  {
    id: "classic-traditional",
    name: "经典传统",
    description: "传统中国风格，红金配色，华丽装饰",
    config: {
      artStyle: "traditional-gongbi",
      layout: "traditional-scroll",
      colorScheme: "classic-red-gold",
      decoration: "rich-ornate",
      background: "texture-paper",
    },
    tags: ["传统", "经典", "华丽", "正式"],
    isDefault: true,
  },
  {
    id: "modern-minimalist",
    name: "现代简约",
    description: "现代简约风格，清新配色，简洁装饰",
    config: {
      artStyle: "minimalist",
      layout: "horizontal",
      colorScheme: "fresh-light",
      decoration: "minimal-clean",
      background: "gradient",
    },
    tags: ["现代", "简约", "清新", "时尚"],
  },
  {
    id: "ink-painting",
    name: "水墨丹青",
    description: "传统水墨画风格，意境深远，文人雅致",
    config: {
      artStyle: "traditional-ink",
      layout: "vertical",
      colorScheme: "monochrome",
      decoration: "simple-elegant",
      background: "texture-paper",
    },
    tags: ["水墨", "文艺", "意境", "雅致"],
  },
  {
    id: "cartoon-fun",
    name: "卡通趣味",
    description: "可爱卡通风格，鲜艳色彩，适合年轻人",
    config: {
      artStyle: "cartoon-style",
      layout: "square",
      colorScheme: "vibrant",
      decoration: "traditional-folk",
      background: "pattern-flowers",
    },
    tags: ["卡通", "可爱", "趣味", "年轻"],
  },
  {
    id: "paper-cut-folk",
    name: "剪纸民俗",
    description: "传统剪纸艺术，民俗元素，喜庆热闹",
    config: {
      artStyle: "paper-cut",
      layout: "horizontal",
      colorScheme: "classic-red-gold",
      decoration: "traditional-folk",
      background: "solid-color",
    },
    tags: ["剪纸", "民俗", "喜庆", "传统"],
  },
  {
    id: "elegant-dark",
    name: "优雅深邃",
    description: "深色优雅风格，神秘高贵，现代感强",
    config: {
      artStyle: "modern-illustration",
      layout: "golden-ratio",
      colorScheme: "elegant-dark",
      decoration: "modern-geometric",
      background: "gradient",
    },
    tags: ["优雅", "深色", "现代", "高贵"],
  },
];

// ==================== 默认配置 ====================

/**
 * 默认图片生成配置
 */
export const defaultImageConfig: ImageGenerationConfig = {
  // 继承现有配置
  zodiac: "� 马年",
  style: "传统典雅",
  theme: "万事如意",
  tone: "活泼",

  // 新增默认配置
  artStyle: "traditional-gongbi",
  layout: "horizontal",
  colorScheme: "classic-red-gold",
  decoration: "rich-ornate",
  background: "texture-paper",

  // 高级配置
  advanced: {
    steps: 30,
    guidance: 7.5,
  },
};

// ==================== 配置映射函数 ====================

/**
 * 根据现有风格映射到新的画风类型
 */
export function mapLegacyStyleToArtStyle(legacyStyle: string): ArtStyleOption {
  const mapping: Record<string, ArtStyleOption> = {
    传统典雅: artStyleOptions.find(
      (opt) => opt.value === "traditional-gongbi"
    )!,
    现代简约: artStyleOptions.find((opt) => opt.value === "minimalist")!,
    幽默搞笑: artStyleOptions.find((opt) => opt.value === "cartoon-style")!,
    文艺清新: artStyleOptions.find((opt) => opt.value === "traditional-ink")!,
  };

  return mapping[legacyStyle] || artStyleOptions[0];
}

/**
 * 根据氛围映射到色调方案
 */
export function mapToneToColorScheme(tone: string): ColorSchemeOption {
  const mapping: Record<string, ColorSchemeOption> = {
    庄重: colorSchemeOptions.find((opt) => opt.value === "elegant-dark")!,
    活泼: colorSchemeOptions.find((opt) => opt.value === "vibrant")!,
    温馨: colorSchemeOptions.find((opt) => opt.value === "warm-tone")!,
    霸气: colorSchemeOptions.find((opt) => opt.value === "classic-red-gold")!,
  };

  return mapping[tone] || colorSchemeOptions[0];
}

/**
 * 获取配置选项的显示标签
 */
export function getConfigLabel(type: string, value: string): string {
  const optionMaps = {
    artStyle: artStyleOptions,
    layout: layoutOptions,
    colorScheme: colorSchemeOptions,
    decoration: decorationOptions,
    background: backgroundOptions,
  };

  const options = optionMaps[type as keyof typeof optionMaps];
  return options?.find((opt) => opt.value === value)?.label || value;
}
