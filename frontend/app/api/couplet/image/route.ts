import { NextRequest, NextResponse } from "next/server";

/**
 * POST /api/couplet/image
 *
 * 根据春联内容生成图片 API - 增强版
 * 使用阿里云 DashScope 的 qwen-image-max 模型
 *
 * 请求体：
 * {
 *   upper: string;           // 上联
 *   lower: string;           // 下联
 *   horizontal: string;      // 横批
 *
 *   // 基础配置（兼容旧版）
 *   zodiac?: string;         // 生肖年份（可选）
 *   style?: string;          // 创作风格（可选）
 *   theme?: string;          // 祝福主题（可选）
 *   tone?: string;           // 预期氛围（可选）
 *
 *   // 新增高级配置
 *   artStyle?: string;       // 艺术画风（traditional-ink/modern-illustration等）
 *   layout?: string;         // 构图布局（horizontal/vertical/square等）
 *   colorScheme?: string;    // 色调方案（classic-red-gold/warm-tone等）
 *   decoration?: string;     // 装饰风格（rich-ornate/simple-elegant等）
 *   background?: string;     // 背景风格（gradient/texture-paper等）
 *
 *   // 高级参数
 *   advanced?: {
 *     customPrompt?: string;    // 自定义提示词
 *     negativePrompt?: string;  // 负向提示词
 *     seed?: number;            // 随机种子
 *     steps?: number;           // 生成步数
 *     guidance?: number;        // 引导强度
 *   }
 * }
 *
 * 响应：
 * {
 *   success: boolean;
 *   data?: {
 *     imageUrl: string;
 *     config?: object;     // 实际使用的配置
 *     metadata?: object;   // 生成元数据
 *   };
 *   error?: string;
 * }
 */
export async function POST(request: NextRequest) {
  try {
    // 解析请求体
    const body = await request.json();

    // 验证必填字段
    const requiredFields = ["upper", "lower", "horizontal"];
    const missingFields = requiredFields.filter((field) => !body[field]);

    if (missingFields.length > 0) {
      return NextResponse.json(
        {
          success: false,
          error: `缺少必填字段: ${missingFields.join(", ")}`,
        },
        { status: 400 }
      );
    }

    const {
      upper,
      lower,
      horizontal,
      zodiac,
      style,
      theme,
      tone,
      // 新增配置选项
      artStyle,
      layout,
      colorScheme,
      decoration,
      background,
      advanced,
    } = body;

    // 从环境变量获取 DashScope API Key
    const apiKey = process.env.DASHSCOPE_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        {
          success: false,
          error: "服务器配置错误：未设置 DASHSCOPE_API_KEY",
        },
        { status: 500 }
      );
    }

    // 根据用户选项构建个性化的图像生成提示词

    // ==================== 新增高级配置映射 ====================

    // 1. 艺术画风映射（增强版 - 添加详细视觉特征）
    const artStyleMapping: Record<
      string,
      { 
        technique: string; 
        style: string; 
        quality: string;
        visualFeatures: string; // 新增：具体视觉特征
        examples: string; // 新增：参考案例
      }
    > = {
      "traditional-ink": {
        technique: "中国传统水墨画技法，使用毛笔蘸墨，通过墨色浓淡干湿变化营造意境",
        style: "水墨画风格 (Chinese Ink Wash Painting Style)，黑白灰为主调，讲究留白和意境",
        quality: "水墨晕染效果，墨色层次分明，有明显的笔触和墨迹流动感",
        visualFeatures: "黑色墨迹、水墨晕染、飞白效果、浓淡干湿变化、笔触可见、宣纸质感、水渍痕迹",
        examples: "参考齐白石、吴冠中的水墨风格，画面以黑白灰为主，局部可加淡雅色彩点缀"
      },
      "traditional-gongbi": {
        technique: "工笔画精细技法，用细腻的笔触勾勒线条，层层渲染设色",
        style: "工笔画风格 (Chinese Gongbi Painting Style)，线条精致，色彩鲜艳，装饰性强",
        quality: "工笔细腻笔触，轮廓线条清晰工整，色彩饱满浓郁，细节精细入微",
        visualFeatures: "精细线描、均匀平涂、色彩浓郁、金色勾边、装饰纹样、对称构图、富丽堂皇",
        examples: "参考故宫年画、敦煌壁画风格，颜色鲜艳，装饰华美，线条工整"
      },
      "modern-illustration": {
        technique: "现代数字插画技法，使用扁平化设计和矢量图形",
        style: "现代插画风格 (Modern Illustration Style)，色彩明快，构图简洁，设计感强",
        quality: "插画质感，色块分明，渐变柔和，视觉冲击力强",
        visualFeatures: "扁平化色块、简洁线条、几何图形、渐变色彩、现代构图、明亮色调、设计感强",
        examples: "参考现代海报设计风格，色彩鲜明，构图新颖，具有时尚感"
      },
      "cartoon-style": {
        technique: "卡通漫画技法，造型夸张可爱，色彩明亮活泼",
        style: "卡通风格 (Cartoon Style)，Q版造型，圆润线条，童趣盎然",
        quality: "卡通渲染效果，轮廓线明显，色彩鲜艳，造型可爱夸张",
        visualFeatures: "Q版造型、大眼睛、圆润轮廓、夸张表情、明亮色彩、简化细节、可爱元素",
        examples: "参考迪士尼、皮克斯动画风格，造型可爱，色彩鲜艳，充满童趣"
      },
      "paper-cut": {
        technique: "剪纸艺术技法，通过剪刻镂空形成图案，层叠产生立体感",
        style: "剪纸艺术风格 (Paper-Cut Art Style)，镂空图案，对称构图，民俗特色",
        quality: "剪纸效果，轮廓锐利清晰，层次叠加，阴影明显，纸质肌理",
        visualFeatures: "镂空轮廓、对称图案、层叠效果、锯齿边缘、纸张质感、阴影投射、民俗纹样",
        examples: "参考中国传统窗花、陕西剪纸风格，红纸镂空，层次丰富，民俗味浓"
      },
      calligraphy: {
        technique: "书法艺术技法，毛笔书写，笔画遒劲有力，墨色饱满",
        style: "书法艺术风格 (Calligraphy Art Style)，以书法为主要视觉元素，文化气息浓厚",
        quality: "书法质感，笔画粗细有致，墨色浓淡变化，飞白效果，笔力遒劲",
        visualFeatures: "毛笔笔触、飞白效果、墨色变化、笔画顿挫、行云流水、书法结构、印章点缀",
        examples: "参考王羲之、颜真卿书法风格，笔力遒劲，墨韵飞扬，文化底蕴深厚"
      },
      "3d-render": {
        technique: "3D建模渲染技术，使用计算机图形学创造立体效果",
        style: "3D渲染风格 (3D Render Style)，立体造型，光影逼真，材质细腻",
        quality: "3D渲染质感，光照真实，反射高光，景深效果，材质逼真",
        visualFeatures: "立体造型、真实光影、材质反射、景深虚化、体积感、高光反射、环境光遮蔽",
        examples: "参考皮克斯3D动画风格，立体感强，光影真实，材质细腻，视觉震撼"
      },
      minimalist: {
        technique: "极简主义设计技法，删繁就简，突出核心要素",
        style: "极简风格 (Minimalist Style)，留白艺术，简约线条，重点突出",
        quality: "极简质感，画面简洁，色彩纯净，构图平衡，留白充足",
        visualFeatures: "大面积留白、简洁线条、纯色色块、几何形状、对比强烈、焦点突出、负空间",
        examples: "参考无印良品MUJI设计风格，简约而不简单，留白得当，重点突出"
      },
    };

    // 2. 构图布局映射
    const layoutMapping: Record<
      string,
      { composition: string; ratio: string; arrangement: string }
    > = {
      horizontal: {
        composition: "横版构图，适合宽屏展示",
        ratio: "16:9宽屏比例",
        arrangement: "春联采用传统竖向书写方式，从上往下排列。右侧为上联，左侧为下联，顶部中央为横批。文字必须竖向排列（每个字独立一行，从上到下），左右完全对称",
      },
      vertical: {
        composition: "竖版构图，适合竖屏显示",
        ratio: "9:16竖屏比例",
        arrangement: "春联采用传统竖向书写方式，从上往下排列。上联和下联纵向并列，横批在顶部。所有文字必须竖向排列（每个字独立一行，从上到下），上下呼应",
      },
      square: {
        composition: "方形构图，均衡稳定",
        ratio: "1:1方形比例",
        arrangement: "春联采用传统竖向书写方式，居中排列。右侧为上联，左侧为下联，顶部为横批。文字必须竖向排列（每个字独立一行，从上到下），左右对称平衡",
      },
      "golden-ratio": {
        composition: "黄金比例构图，视觉效果最佳",
        ratio: "16:10黄金比例",
        arrangement: "春联采用传统竖向书写方式，按黄金分割点排列。右侧为上联，左侧为下联。文字必须竖向排列（每个字独立一行，从上到下），和谐美观",
      },
      "traditional-scroll": {
        composition: "传统卷轴构图，符合中国文化习惯",
        ratio: "3:4传统比例",
        arrangement: "春联采用传统竖向书写方式，仿古卷轴纵向布局。上联和下联纵向排列，横批在顶部。所有文字必须竖向排列（每个字独立一行，从上到下），仿古卷轴风格",
      },
    };

    // 3. 色调方案映射
    const colorSchemeMapping: Record<
      string,
      { palette: string; mood: string; harmony: string }
    > = {
      "classic-red-gold": {
        palette: "经典红金配色，大红、金黄、深红的层次搭配",
        mood: "喜庆热烈，传统吉祥",
        harmony: "红金色彩和谐统一，富贵大气",
      },
      "warm-tone": {
        palette: "温暖色调，橙红、暖黄、桃红的渐变组合",
        mood: "温馨和谐，亲切温暖",
        harmony: "暖色系和谐搭配，营造温馨氛围",
      },
      "cool-tone": {
        palette: "冷色调，蓝绿、青色、紫色的清新组合",
        mood: "清新宁静，现代简约",
        harmony: "冷色系清新搭配，宁静致远",
      },
      monochrome: {
        palette: "单色调，黑白灰的经典搭配",
        mood: "简约大气，永恒经典",
        harmony: "黑白灰层次分明，简约而不简单",
      },
      vibrant: {
        palette: "鲜艳色彩，高饱和度的多彩组合",
        mood: "活力四射，青春洋溢",
        harmony: "鲜艳色彩对比强烈，充满活力",
      },
      "elegant-dark": {
        palette: "优雅深色，深蓝、深紫、墨绿的高贵组合",
        mood: "神秘高贵，优雅深邃",
        harmony: "深色系优雅搭配，神秘而高贵",
      },
      "fresh-light": {
        palette: "清新浅色，淡粉、浅绿、米白的柔和组合",
        mood: "清新淡雅，治愈温柔",
        harmony: "浅色系柔和搭配，清新脱俗",
      },
      "gradient-sunset": {
        palette: "渐变夕阳色，橙红到粉紫的浪漫渐变",
        mood: "浪漫温馨，层次丰富",
        harmony: "渐变色彩层次丰富，浪漫而温馨",
      },
    };

    // 4. 装饰风格映射
    const decorationMapping: Record<string, string> = {
      "rich-ornate":
        "华丽繁复的装饰元素，金色花纹、祥云、凤凰、牡丹、如意、宝鼎等富贵装饰",
      "simple-elegant":
        "简约优雅的装饰，淡雅祥云、梅花、竹叶、水波纹等恰到好处的点缀",
      "traditional-folk":
        "传统民俗装饰元素，红灯笼、中国结、窗花、年画、福字、鞭炮等喜庆装饰",
      "modern-geometric":
        "现代几何图案装饰，简洁线条、抽象图案、渐变色块等时尚元素",
      "nature-organic":
        "自然有机装饰元素，花草藤蔓、树枝、叶子、花朵、蝴蝶、鸟儿等生机装饰",
      "minimal-clean":
        "极简主义装饰，简单线条、点缀元素、留白空间，突出主体内容",
    };

    // 5. 背景风格映射
    const backgroundMapping: Record<string, string> = {
      "solid-color": "纯色背景，简洁统一的色彩背景",
      gradient: "渐变背景，优美的色彩渐变过渡",
      "texture-paper": "纸质纹理背景，传统宣纸或古籍纸张质感",
      "texture-silk": "丝绸纹理背景，华贵的丝绸质感和光泽",
      "pattern-clouds": "祥云图案背景，传统祥云纹样装饰",
      "pattern-flowers": "花卉图案背景，精美的花卉纹样装饰",
      "scene-interior": "室内场景背景，温馨的居家环境",
      "scene-landscape": "风景场景背景，优美的自然风光",
    };

    // ==================== 原有配置映射（保持兼容性） ====================

    // 1. 生肖元素映射
    const zodiacElements: Record<string, string> = {
      "🐀 鼠年": "可爱的老鼠剪纸装饰",
      "🐂 牛年": "憨厚的牛造型装饰",
      "🐅 虎年": "威武的老虎剪纸",
      "🐇 兔年": "灵动的兔子造型",
      "🐉 龙年": "金色的祥龙盘旋",
      "🐍 蛇年": "灵巧的蛇形纹样",
      "🐎 马年": "奔腾的骏马装饰",
      "🐐 羊年": "温顺的羊造型",
      "🐒 猴年": "活泼的猴子剪纸",
      "🐓 鸡年": "报晓的公鸡造型",
      "🐕 狗年": "忠诚的狗装饰",
      "🐖 猪年": "福气的猪造型",
    };

    // 2. 风格映射
    const styleMapping: Record<
      string,
      { scene: string; decoration: string; color: string }
    > = {
      传统典雅: {
        scene: "典雅庄重的古典厅堂，实木家具，青花瓷摆件，古色古香",
        decoration: "红色灯笼、梅花、祥云、金色花纹、中国结、回纹装饰",
        color: "以红色和金色为主，色彩鲜艳饱满，富贵大气",
      },
      现代简约: {
        scene: "现代简约的明亮客厅，简洁线条，时尚家居，清爽空间",
        decoration: "简约灯笼、抽象梅花、几何纹样、现代装饰画",
        color: "以红色和白色为主，色彩清新明快，简洁时尚",
      },
      幽默搞笑: {
        scene: "温馨活泼的居家场景，卡通元素，趣味摆设，轻松氛围",
        decoration: "可爱卡通灯笼、Q版福字、趣味装饰、俏皮元素",
        color: "色彩明亮活泼，充满童趣和欢乐感",
      },
      文艺清新: {
        scene: "文艺清新的雅致空间，植物装饰，书画作品，诗意环境",
        decoration: "水墨风格装饰、兰花、竹子、淡雅花纹、书法作品",
        color: "以淡雅色调为主，红色点缀，清新脱俗",
      },
    };

    // 3. 主题装饰映射
    const themeDecoration: Record<string, string> = {
      事业顺利: "办公桌、书籍、笔墨、印章、梯子向上的寓意装饰",
      财源广进: "金元宝、铜钱、聚宝盆、财神装饰、金币纹样",
      健康长寿: "仙鹤、松树、寿桃、长寿结、灵芝装饰",
      学业有成: "书籍、文房四宝、状元帽、竹简、智慧树装饰",
      爱情美满: "鸳鸯、喜鹊、并蒂莲、同心结、玫瑰花",
      阖家幸福: "全家福照片、温馨家居、儿童玩具、家庭装饰",
      平安顺遂: "平安结、护身符、佛手、祥云、如意装饰",
      万事如意: "如意、福袋、吉祥结、喜庆装饰、综合吉祥物",
    };

    // 4. 氛围映射
    const toneMapping: Record<string, string> = {
      庄重: "气氛肃穆庄严，光线稳重，构图端正对称，给人以隆重感",
      活泼: "气氛欢快热闹，光线明亮温暖，色彩跳跃，充满生机活力",
      温馨: "气氛温暖柔和，光线柔美，色调温暖，营造家的温馨感",
      霸气: "气氛宏大震撼，光线强烈，色彩浓烈，气势磅礴",
    };

    // 获取用户选项，使用默认值
    const selectedZodiac = zodiac || "🐎 马年";
    const selectedStyle = style || "传统典雅";
    const selectedTheme = theme || "万事如意";
    const selectedTone = tone || "活泼";

    // 新增配置选项（优先使用新配置，回退到旧配置映射）
    const selectedArtStyle =
      artStyle || mapLegacyStyleToArtStyle(selectedStyle);
    const selectedLayout = layout || "horizontal";
    const selectedColorScheme =
      colorScheme || mapToneToColorScheme(selectedTone);
    const selectedDecoration = decoration || "rich-ornate";
    const selectedBackground = background || "texture-paper";

    // 获取对应的装饰元素
    const zodiacElement = zodiacElements[selectedZodiac] || "生肖装饰";
    const styleConfig = styleMapping[selectedStyle] || styleMapping["传统典雅"];
    const themeDecorationText =
      themeDecoration[selectedTheme] || "各种吉祥装饰";
    const toneDescription = toneMapping[selectedTone] || toneMapping["活泼"];

    // 获取新配置对应的元素
    const artStyleConfig =
      artStyleMapping[selectedArtStyle] ||
      artStyleMapping["traditional-gongbi"];
    const layoutConfig =
      layoutMapping[selectedLayout] || layoutMapping["horizontal"];
    const colorSchemeConfig =
      colorSchemeMapping[selectedColorScheme] ||
      colorSchemeMapping["classic-red-gold"];
    const decorationText =
      decorationMapping[selectedDecoration] || decorationMapping["rich-ornate"];
    const backgroundText =
      backgroundMapping[selectedBackground] ||
      backgroundMapping["texture-paper"];

    // 构图尺寸映射
    const layoutSizes: Record<string, string> = {
      horizontal: "1664*936",
      vertical: "936*1664",
      square: "1024*1024",
      "golden-ratio": "1600*1000",
      "traditional-scroll": "1200*1600",
    };
    const imageSize = layoutSizes[selectedLayout] || "1664*928";

    // 辅助函数：映射旧配置到新配置
    function mapLegacyStyleToArtStyle(legacyStyle: string): string {
      const mapping: Record<string, string> = {
        传统典雅: "traditional-gongbi",
        现代简约: "minimalist",
        幽默搞笑: "cartoon-style",
        文艺清新: "traditional-ink",
      };
      return mapping[legacyStyle] || "traditional-gongbi";
    }

    function mapToneToColorScheme(tone: string): string {
      const mapping: Record<string, string> = {
        庄重: "elegant-dark",
        活泼: "vibrant",
        温馨: "warm-tone",
        霸气: "classic-red-gold",
      };
      return mapping[tone] || "classic-red-gold";
    }

    // 构建增强的个性化提示词
    const basePrompt =
      advanced?.customPrompt ||
      `
请创作一幅春节对联艺术作品，严格遵循以下要求：

【核心画风要求 - 最高优先级】
艺术风格：${artStyleConfig.style}
绘画技法：${artStyleConfig.technique}
必须包含的视觉特征：${artStyleConfig.visualFeatures}
质感表现：${artStyleConfig.quality}
风格参考：${artStyleConfig.examples}

❗重要：整幅作品的每一个视觉元素（春联文字呈现、装饰图案、背景纹理、色彩处理）都必须完全符合上述艺术风格的典型视觉特征。不能混杂其他风格。

【春联书写规范 - 极其重要】
❗❗❗必须遵循中国传统春联书写习惯：
1. 文字方向：所有文字必须**从上到下竖向书写**，绝对不能横向书写
2. 春联布局：采用传统左右对称的竖向布局
   - 左侧（观看者视角的左边）：上联"${upper}" - 从上往下竖着写每一个字
   - 右侧（观看者视角的右边）：下联"${lower}" - 从上往下竖着写每一个字
   - 顶部中央：横批"${horizontal}" - 可以横着写，从右往左或从左往右
3. 文字排列：每个字独立一行，纵向排列，字与字之间垂直对齐
4. 对称性：左右春联完全对称，高度一致，宽度相同

❗错误示例（绝对禁止）：横向书写春联文字
✅正确示例：
   上联文字排列：第一个字在最上方，最后一个字在最下方，每个字独立一行，从上到下纵向排列
   下联文字排列：第一个字在最上方，最后一个字在最下方，每个字独立一行，从上到下纵向排列

文字处理：按照${artStyleConfig.style}的特点来处理文字，使文字风格与整体画风协调统一。金色或红色，笔画清晰。每个字都清晰可见，纵向排列。

【色彩体系】
主色调：${colorSchemeConfig.palette}
色彩情感：${colorSchemeConfig.mood}
色彩搭配：${colorSchemeConfig.harmony}

【构图布局】
${layoutConfig.composition}
春联排列方式：${layoutConfig.arrangement}，注意：春联文字必须竖向书写（从上往下），不能横向书写
画面比例：${layoutConfig.ratio}
对称要求：左右春联完全对称，高度一致，每个字垂直排列

【场景与背景】
场景设定：${styleConfig.scene}
背景处理：${backgroundText}（需符合${artStyleConfig.style}的视觉特征）
整体氛围：${toneDescription}

【装饰元素】
1. 生肖特色（${selectedZodiac}）：${zodiacElement}，以${artStyleConfig.style}的方式呈现
2. 主题装饰（${selectedTheme}）：${themeDecorationText}，符合画风特征
3. 装饰风格：${decorationText}
4. 节庆元素：${styleConfig.decoration}

【技术标准】
- 分辨率：4K超高清
- 细节表现：丰富细腻
- 色彩饱和度：饱满鲜艳
- 画风一致性：从笔触、质感、色彩处理等各方面严格统一风格
- 文字书写：所有春联文字必须竖向书写（从上到下），每个字独立一行，垂直对齐
- 布局对称性：左右春联完全对称，高度一致
- 整体效果：强烈的中国传统新年喜庆氛围，${selectedZodiac}年特色鲜明

【最终检查】
确认整幅作品完全符合【${artStyleConfig.style}】的所有典型视觉特征：
${artStyleConfig.visualFeatures}
`.trim();

    // 根据画风生成针对性的负向提示词
    const styleSpecificNegatives: Record<string, string> = {
      "traditional-ink": "彩色照片，油画质感，3D效果，过于鲜艳的色彩，工笔画线条，卡通造型",
      "traditional-gongbi": "水墨晕染，模糊笔触，素描效果，现代插画，卡通风格，3D渲染",
      "modern-illustration": "传统水墨，工笔细描，写实照片，古旧质感，过于复杂的细节",
      "cartoon-style": "写实风格，严肃画风，复杂细节，水墨晕染，工笔线描",
      "paper-cut": "模糊边缘，渐变效果，写实质感，3D立体，水墨晕染",
      "calligraphy": "卡通字体，印刷体，电脑字体，彩色装饰，过多图案",
      "3d-render": "平面效果，手绘质感，水墨风格，剪纸风格，模糊质感",
      "minimalist": "繁复装饰，过多细节，复杂纹样，华丽元素，杂乱构图"
    };

    const negativePrompt =
      advanced?.negativePrompt ||
      `低分辨率，低画质，模糊不清，构图混乱，文字扭曲，文字模糊，错别字，比例失调，透视错误。
      画风混杂，风格不统一，${styleSpecificNegatives[selectedArtStyle] || ''}。
      肢体畸形，手指畸形，蜡像感，过度光滑，AI痕迹明显。
      横向书写的春联文字（严重错误），文字排列不垂直，春联左右不对称，文字方向错误。`.trim();

    console.log("[图片生成] 开始生成春联图片", {
      upper,
      lower,
      horizontal,
      // 基础配置
      zodiac: selectedZodiac,
      style: selectedStyle,
      theme: selectedTheme,
      tone: selectedTone,
      // 新增配置
      artStyle: selectedArtStyle,
      layout: selectedLayout,
      colorScheme: selectedColorScheme,
      decoration: selectedDecoration,
      background: selectedBackground,
      imageSize,
    });

    console.log("[图片生成] 画风详细配置", {
      artStyleValue: selectedArtStyle,
      artStyleConfig: artStyleConfig,
      promptLength: basePrompt.length,
      negativePromptLength: negativePrompt.length,
    });

    console.log("[图片生成] 完整提示词", {
      basePrompt,
      negativePrompt,
    });

    // 调用 DashScope API 生成图片（使用 multimodal-generation API）
    const response = await fetch(
      "https://dashscope.aliyuncs.com/api/v1/services/aigc/multimodal-generation/generation",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "qwen-image-max",
          input: {
            messages: [
              {
                role: "user",
                content: [
                  {
                    text: basePrompt,
                  },
                ],
              },
            ],
          },
          parameters: {
            negative_prompt: negativePrompt,
            prompt_extend: true,
            watermark: false,
            size: imageSize,
            ...(advanced?.seed && { seed: advanced.seed }),
            ...(advanced?.steps && { steps: advanced.steps }),
            ...(advanced?.guidance && { guidance_scale: advanced.guidance }),
          },
        }),
        signal: AbortSignal.timeout(60000), // 60秒超时
      }
    );

    // 解析响应
    const responseData = await response.json();

    // 检查是否有错误
    if (responseData.code || !response.ok) {
      console.error("[图片生成] API 返回错误", responseData);
      return NextResponse.json(
        {
          success: false,
          error: responseData.message || "图片生成失败",
        },
        { status: response.status }
      );
    }

    // 处理成功响应
    if (responseData && responseData.output) {
      console.log("[图片生成] 生成成功");

      // 提取图片 URL (multimodal-generation API 返回结构)
      if (
        responseData.output.choices &&
        responseData.output.choices.length > 0 &&
        responseData.output.choices[0].message &&
        responseData.output.choices[0].message.content &&
        responseData.output.choices[0].message.content.length > 0
      ) {
        const imageUrl =
          responseData.output.choices[0].message.content[0].image;

        if (imageUrl) {
          return NextResponse.json({
            success: true,
            data: {
              imageUrl,
              config: {
                // 基础配置
                zodiac: selectedZodiac,
                style: selectedStyle,
                theme: selectedTheme,
                tone: selectedTone,
                // 新增配置
                artStyle: selectedArtStyle,
                layout: selectedLayout,
                colorScheme: selectedColorScheme,
                decoration: selectedDecoration,
                background: selectedBackground,
              },
              metadata: {
                model: "qwen-image-max",
                timestamp: Date.now(),
                imageSize,
                processingTime: Date.now(), // 可以在开始时记录时间来计算实际处理时间
                ...(advanced?.seed && { seed: advanced.seed }),
              },
            },
          });
        }
      }

      console.error("[图片生成] 响应数据中未找到图片 URL", responseData);
      return NextResponse.json(
        {
          success: false,
          error: "生成失败：未找到图片 URL",
        },
        { status: 500 }
      );
    } else {
      console.error("[图片生成] 响应数据异常", responseData);
      return NextResponse.json(
        {
          success: false,
          error: "生成失败：响应数据异常",
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("[图片生成] 生成春联图片失败", error);

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "生成失败，请稍后重试",
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/couplet/image
 *
 * 获取 API 使用说明
 */
export async function GET() {
  return NextResponse.json({
    name: "春联图片生成 API",
    version: "3.0.0",
    description:
      "基于阿里云 DashScope qwen-image-max 模型的春联图片生成接口，支持高级个性化定制",
    method: "POST",
    endpoint: "/api/couplet/image",
    requestBody: {
      required: {
        upper: "上联内容",
        lower: "下联内容",
        horizontal: "横批内容",
      },
      optional: {
        // 基础配置（兼容旧版）
        zodiac: "生肖年份（如：🐎 马年）",
        style: "创作风格（传统典雅/现代简约/幽默搞笑/文艺清新）",
        theme:
          "祝福主题（事业顺利/财源广进/健康长寿/学业有成/爱情美满/阖家幸福/平安顺遂/万事如意）",
        tone: "预期氛围（庄重/活泼/温馨/霸气）",

        // 新增高级配置
        artStyle:
          "艺术画风（traditional-ink/traditional-gongbi/modern-illustration/cartoon-style/paper-cut/calligraphy/3d-render/minimalist）",
        layout:
          "构图布局（horizontal/vertical/square/golden-ratio/traditional-scroll）",
        colorScheme:
          "色调方案（classic-red-gold/warm-tone/cool-tone/monochrome/vibrant/elegant-dark/fresh-light/gradient-sunset）",
        decoration:
          "装饰风格（rich-ornate/simple-elegant/traditional-folk/modern-geometric/nature-organic/minimal-clean）",
        background:
          "背景风格（solid-color/gradient/texture-paper/texture-silk/pattern-clouds/pattern-flowers/scene-interior/scene-landscape）",

        // 高级参数
        advanced: {
          customPrompt: "自定义提示词",
          negativePrompt: "负向提示词",
          seed: "随机种子（数字）",
          steps: "生成步数（数字）",
          guidance: "引导强度（数字）",
        },
      },
    },
    response: {
      success: "是否成功",
      data: {
        imageUrl: "生成的图片 URL",
        config: "实际使用的配置参数",
        metadata: "生成元数据（模型、时间戳、尺寸等）",
      },
      error: "错误信息（失败时）",
    },
    example: {
      request: {
        upper: "门迎旭日财源广",
        lower: "户纳春风吉庆多",
        horizontal: "四季平安",
        zodiac: "🐉 龙年",
        style: "传统典雅",
        theme: "财源广进",
        tone: "活泼",
        artStyle: "traditional-gongbi",
        layout: "horizontal",
        colorScheme: "classic-red-gold",
        decoration: "rich-ornate",
        background: "texture-paper",
      },
      response: {
        success: true,
        data: {
          imageUrl: "https://dashscope.aliyuncs.com/...",
          config: {
            zodiac: "🐉 龙年",
            artStyle: "traditional-gongbi",
            layout: "horizontal",
            colorScheme: "classic-red-gold",
          },
          metadata: {
            model: "qwen-image-max",
            timestamp: 1640995200000,
            imageSize: "1664*936",
          },
        },
      },
    },
    features: {
      personalization: "根据用户选择的生肖、风格、主题、氛围生成定制化春联图片",
      artStyles:
        "支持8种不同艺术风格：水墨、工笔、插画、卡通、剪纸、书法、3D、极简",
      layouts: "支持5种构图布局：横版、竖版、方形、黄金比例、传统卷轴",
      colorSchemes:
        "支持8种色调方案：经典红金、暖色调、冷色调、单色调、鲜艳、优雅深色、清新浅色、渐变夕阳",
      decorations: "支持6种装饰风格：华丽、简约、民俗、几何、自然、极简",
      backgrounds:
        "支持8种背景风格：纯色、渐变、纸质、丝绸、祥云、花卉、室内、风景",
      advancedOptions: "支持自定义提示词、负向提示词、随机种子等高级参数",
      dynamicSizing: "根据布局自动调整图片尺寸",
      legacyCompatibility: "完全兼容旧版API参数",
    },
    requirements: {
      environment: "需要设置 DASHSCOPE_API_KEY 环境变量",
      model: "qwen-image-max",
      timeout: "60秒",
      supportedSizes: {
        horizontal: "1664*936",
        vertical: "936*1664",
        square: "1024*1024",
        "golden-ratio": "1600*1000",
        "traditional-scroll": "1200*1600",
      },
    },
  });
}
