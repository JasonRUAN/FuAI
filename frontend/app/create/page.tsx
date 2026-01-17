"use client"

import { useState, useMemo, useRef, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Sparkles, RefreshCw, ImageIcon, Coins, Download, Shuffle, Star } from "lucide-react"
import { useWallet } from "@/components/providers/wallet-provider"

const zodiacYears = [
  { value: "rat", label: "🐀 鼠年", emoji: "🐀" },
  { value: "ox", label: "🐂 牛年", emoji: "🐂" },
  { value: "tiger", label: "🐅 虎年", emoji: "🐅" },
  { value: "rabbit", label: "🐇 兔年", emoji: "🐇" },
  { value: "dragon", label: "🐉 龙年", emoji: "🐉" },
  { value: "snake", label: "🐍 蛇年", emoji: "🐍" },
  { value: "horse", label: "🐎 马年", emoji: "🐎" },
  { value: "goat", label: "🐐 羊年", emoji: "🐐" },
  { value: "monkey", label: "🐒 猴年", emoji: "🐒" },
  { value: "rooster", label: "🐓 鸡年", emoji: "🐓" },
  { value: "dog", label: "🐕 狗年", emoji: "🐕" },
  { value: "pig", label: "🐖 猪年", emoji: "🐖" },
]

const wordCounts = [
  { value: "5", label: "五言", icon: "5️⃣" },
  { value: "7", label: "七言", icon: "7️⃣" },
  { value: "9", label: "九言", icon: "9️⃣" },
]

const styles = [
  { value: "traditional", label: "传统典雅", icon: "🏛️", desc: "古风韵味，庄重大气" },
  { value: "modern", label: "现代简约", icon: "✨", desc: "时尚前沿，清新明快" },
  { value: "humorous", label: "幽默搞笑", icon: "😄", desc: "诙谐有趣，欢乐满满" },
  { value: "literary", label: "文艺清新", icon: "🌸", desc: "诗意盎然，唯美雅致" },
]

const themes = [
  { value: "career", label: "事业顺利", icon: "💼" },
  { value: "wealth", label: "财源广进", icon: "💰" },
  { value: "health", label: "健康长寿", icon: "💪" },
  { value: "study", label: "学业有成", icon: "📚" },
  { value: "love", label: "爱情美满", icon: "💕" },
  { value: "family", label: "阖家幸福", icon: "👨‍👩‍👧‍👦" },
  { value: "peace", label: "平安顺遂", icon: "🕊️" },
  { value: "general", label: "万事如意", icon: "🎊" },
]

const tones = [
  { value: "solemn", label: "庄重", icon: "🎩", color: "from-slate-500 to-slate-700" },
  { value: "lively", label: "活泼", icon: "🎉", color: "from-orange-400 to-pink-500" },
  { value: "warm", label: "温馨", icon: "🌸", color: "from-rose-400 to-amber-400" },
  { value: "bold", label: "霸气", icon: "🔥", color: "from-red-500 to-orange-600" },
]

const mockCouplets: Record<string, { upper: string; lower: string; horizontal: string }> = {
  "traditional-career-5": {
    upper: "鹏程万里展",
    lower: "骏业千秋兴",
    horizontal: "前程似锦",
  },
  "traditional-career-7": {
    upper: "龙腾虎跃鹏程远",
    lower: "凤舞莺歌骏业新",
    horizontal: "宏图大展",
  },
  "traditional-wealth-7": {
    upper: "财源滚滚达三江",
    lower: "生意兴隆通四海",
    horizontal: "招财进宝",
  },
  "modern-general-7": {
    upper: "新年新气象万里",
    lower: "好运好前程千秋",
    horizontal: "万象更新",
  },
  "humorous-general-7": {
    upper: "钱多事少离家近",
    lower: "位高权重责任轻",
    horizontal: "心想事成",
  },
  default: {
    upper: "春回大地千山秀",
    lower: "日暖神州万物荣",
    horizontal: "春满人间",
  },
}

export default function CreatePage() {
  const { isConnected, connect, isConnecting } = useWallet()

  const [zodiac, setZodiac] = useState("snake")
  const [wordCount, setWordCount] = useState("7")
  const [style, setStyle] = useState("traditional")
  const [theme, setTheme] = useState("general")
  const [tone, setTone] = useState("lively")
  const [acrosticName, setAcrosticName] = useState("")
  const [isAcrostic, setIsAcrostic] = useState(false)
  const [showAdvanced, setShowAdvanced] = useState(false)

  const [isGenerating, setIsGenerating] = useState(false)
  const [isGeneratingImage, setIsGeneratingImage] = useState(false)
  const [isMinting, setIsMinting] = useState(false)

  // 配置预览摘要
  const configSummary = useMemo(() => {
    const zodiacItem = zodiacYears.find(z => z.value === zodiac)
    const styleItem = styles.find(s => s.value === style)
    const themeItem = themes.find(t => t.value === theme)
    const toneItem = tones.find(t => t.value === tone)
    const wordItem = wordCounts.find(w => w.value === wordCount)
    return {
      zodiac: zodiacItem,
      style: styleItem,
      theme: themeItem,
      tone: toneItem,
      wordCount: wordItem,
    }
  }, [zodiac, style, theme, tone, wordCount])

  // 随机配置
  const randomizeConfig = () => {
    const randomStyle = styles[Math.floor(Math.random() * styles.length)].value
    const randomTheme = themes[Math.floor(Math.random() * themes.length)].value
    const randomTone = tones[Math.floor(Math.random() * tones.length)].value
    const randomWord = wordCounts[Math.floor(Math.random() * wordCounts.length)].value
    setStyle(randomStyle)
    setTheme(randomTheme)
    setTone(randomTone)
    setWordCount(randomWord)
  }

  const [couplet, setCouplet] = useState<{
    upper: string
    lower: string
    horizontal: string
    explanation?: string
  } | null>(null)

  const [generatedImage, setGeneratedImage] = useState<string | null>(null)
  const [mintedNFT, setMintedNFT] = useState<{ tokenId: string; txHash: string } | null>(null)

  // 动态计算字符间距和字符大小 - 根据字数调整
  const [charGap, setCharGap] = useState(8) // 默认间距 8px
  const [charSize, setCharSize] = useState("w-9 h-9 text-lg") // 默认字符大小

  // 根据春联字数动态计算字符间距和大小
  useEffect(() => {
    if (!couplet) return

    const charCount = Math.max(couplet.upper.length, couplet.lower.length)
    
    // 根据字数设置不同的间距和大小
    // 五言(5字): 8px间距, 正常大小(36px)
    // 七言(7字): 4px间距, 正常大小(36px)
    // 九言(9字): 0px间距, 缩小字体(32px)
    let gap: number
    let size: string
    
    if (charCount <= 5) {
      gap = 8
      size = "w-9 h-9 text-lg"
    } else if (charCount <= 7) {
      gap = 4
      size = "w-9 h-9 text-lg"
    } else {
      gap = 0
      size = "w-8 h-8 text-base" // 缩小字符
    }
    
    setCharGap(gap)
    setCharSize(size)
  }, [couplet])

  const generateCouplet = async () => {
    setIsGenerating(true)
    setCouplet(null)
    setGeneratedImage(null)
    setMintedNFT(null)

    try {
      // 构建请求参数 - 映射前端配置到 API 格式
      const zodiacItem = zodiacYears.find(z => z.value === zodiac)
      const styleItem = styles.find(s => s.value === style)
      const themeItem = themes.find(t => t.value === theme)
      const toneItem = tones.find(t => t.value === tone)
      
      const requestBody = {
        zodiac: zodiacItem?.label || "🐍 蛇年",
        wordCount: wordCount === "5" ? "五言" : wordCount === "7" ? "七言" : "九言",
        style: styleItem?.label || "传统典雅",
        theme: themeItem?.label || "万事如意",
        atmosphere: toneItem?.label || "活泼",
        ...(isAcrostic && acrosticName.length >= 2 && {
          isAcrostic: true,
          acrosticText: acrosticName,
        }),
      }

      // 调用 API 生成春联
      const response = await fetch("/api/couplet/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      })

      const data = await response.json()

      if (!response.ok || !data.success) {
        throw new Error(data.error || "生成失败")
      }

      // 设置生成的春联结果（包含解释）
      setCouplet({
        upper: data.data.upper,
        lower: data.data.lower,
        horizontal: data.data.horizontal,
        explanation: data.data.explanation,
      })
    } catch (error) {
      console.error("生成春联失败：", error)
      // 显示错误提示
      alert(error instanceof Error ? error.message : "生成失败，请稍后重试")
      
      // 如果失败，使用 mock 数据作为降级方案
      const key = `${style}-${theme}-${wordCount}`
      let result = mockCouplets[key] || mockCouplets["default"]
      
      if (isAcrostic && acrosticName.length >= 2) {
        const chars = acrosticName.split("")
        result = {
          upper: chars[0] + result.upper.slice(1),
          lower: chars[1] ? chars[1] + result.lower.slice(1) : result.lower,
          horizontal: result.horizontal,
        }
      }
      
      setCouplet({
        ...result,
        explanation: "由于网络问题，这是一副示例春联。请检查网络连接后重试。"
      })
    } finally {
      setIsGenerating(false)
    }
  }

  const generateImage = async () => {
    if (!couplet) return
    setIsGeneratingImage(true)
    setGeneratedImage(null)

    try {
      // 调用图片生成 API
      const response = await fetch("/api/couplet/image", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          upper: couplet.upper,
          lower: couplet.lower,
          horizontal: couplet.horizontal,
        }),
      })

      const data = await response.json()

      if (!response.ok || !data.success) {
        throw new Error(data.error || "图片生成失败")
      }

      // 设置生成的图片URL
      setGeneratedImage(data.data.imageUrl)
    } catch (error) {
      console.error("生成春联图片失败：", error)
      // 显示错误提示
      alert(error instanceof Error ? error.message : "图片生成失败，请稍后重试")
      
      // 如果失败，使用示例图片作为降级方案
      setGeneratedImage("/chinese-new-year-blessing-couplet-red-gold-traditi.jpg")
    } finally {
      setIsGeneratingImage(false)
    }
  }

  const mintNFT = async () => {
    if (!generatedImage) return
    setIsMinting(true)

    await new Promise((resolve) => setTimeout(resolve, 2500))
    setMintedNFT({
      tokenId: Math.floor(Math.random() * 10000).toString(),
      txHash: "0x" + Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join(""),
    })
    setIsMinting(false)
  }

  if (!isConnected) {
    return (
      <main className="min-h-screen flex items-center justify-center py-20 pt-24">
        <Card className="max-w-md w-full mx-4 text-center">
          <CardContent className="pt-12 pb-8">
            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
              <span className="text-4xl">🔗</span>
            </div>
            <h3 className="text-xl font-semibold mb-2">请先连接钱包</h3>
            <p className="text-muted-foreground mb-6">连接钱包后即可开始创作您的专属春联</p>
            <Button onClick={connect} disabled={isConnecting} className="gap-2">
              {isConnecting ? (
                <>
                  <Sparkles className="h-4 w-4 animate-spin" />
                  连接中...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  连接钱包
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </main>
    )
  }

  return (
    <main className="min-h-screen py-8 pt-24 relative overflow-hidden">
      {/* 背景装饰 - 漂浮的春节元素 */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 left-10 text-4xl animate-bounce opacity-20" style={{ animationDuration: '3s' }}>🧧</div>
        <div className="absolute top-40 right-20 text-3xl animate-bounce opacity-20" style={{ animationDuration: '2.5s', animationDelay: '0.5s' }}>🏮</div>
        <div className="absolute bottom-40 left-20 text-3xl animate-bounce opacity-20" style={{ animationDuration: '3.5s', animationDelay: '1s' }}>🎆</div>
        <div className="absolute bottom-20 right-10 text-4xl animate-bounce opacity-20" style={{ animationDuration: '2.8s', animationDelay: '0.3s' }}>🎊</div>
        <div className="absolute top-1/2 left-5 text-2xl animate-pulse opacity-10" style={{ animationDuration: '2s' }}>✨</div>
        <div className="absolute top-1/3 right-5 text-2xl animate-pulse opacity-10" style={{ animationDuration: '2.2s' }}>✨</div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* 页面标题 - 更喜庆 */}
        <div className="mb-8 text-center">
          <div className="inline-flex items-center gap-3 mb-2">
            <span className="text-3xl animate-bounce" style={{ animationDuration: '1s' }}>🏮</span>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-red-500 via-amber-500 to-red-500 bg-clip-text text-transparent bg-[length:200%_auto] animate-shimmer">
              创作中心
            </h1>
            <span className="text-3xl animate-bounce" style={{ animationDuration: '1s', animationDelay: '0.5s' }}>🏮</span>
          </div>
          <p className="text-muted-foreground flex items-center justify-center gap-2">
            <span className="text-lg">✨</span>
            定制您的专属春联，AI为您智能生成
            <span className="text-lg">✨</span>
          </p>
        </div>

        <div className="grid lg:grid-cols-7 gap-6">
          {/* 左侧：配置面板 - 占2份 */}
          <Card className="lg:col-span-2 relative overflow-hidden border-0 bg-gradient-to-br from-red-50 via-amber-50/50 to-red-50 dark:from-red-950/30 dark:via-amber-950/20 dark:to-red-950/30">
            {/* 可爱喜庆边框 - 多层装饰 */}
            <div className="absolute inset-0 rounded-xl border-4 border-red-500/40 pointer-events-none" />
            <div className="absolute inset-1 rounded-lg border-2 border-dashed border-amber-400/60 pointer-events-none" />
            <div className="absolute inset-2 rounded-md border border-red-400/30 pointer-events-none" />
            
            {/* 角落装饰 - 中国结风格 */}
            <div className="absolute -top-1 -left-1 w-8 h-8 bg-gradient-to-br from-red-500 to-amber-500 rounded-br-2xl flex items-center justify-center shadow-lg">
              <span className="text-white text-xs">福</span>
            </div>
            <div className="absolute -top-1 -right-1 w-8 h-8 bg-gradient-to-bl from-red-500 to-amber-500 rounded-bl-2xl flex items-center justify-center shadow-lg">
              <span className="text-white text-xs">喜</span>
            </div>
            <div className="absolute -bottom-1 -left-1 w-8 h-8 bg-gradient-to-tr from-red-500 to-amber-500 rounded-tr-2xl flex items-center justify-center shadow-lg">
              <span className="text-white text-xs">吉</span>
            </div>
            <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-gradient-to-tl from-red-500 to-amber-500 rounded-tl-2xl flex items-center justify-center shadow-lg">
              <span className="text-white text-xs">祥</span>
            </div>
            
            {/* 顶部灯笼装饰 */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 flex gap-6">
              <div className="w-3 h-5 bg-gradient-to-b from-red-500 to-red-600 rounded-full shadow-md shadow-red-500/50" />
              <div className="w-3 h-5 bg-gradient-to-b from-red-500 to-red-600 rounded-full shadow-md shadow-red-500/50" />
            </div>

            {/* 底部装饰 - 祥云图案 - 绝对定位 */}
            <div className="absolute bottom-6 left-5 right-5 flex justify-center items-center gap-2">
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-red-400/50 to-transparent" />
              <div className="flex gap-1">
                <div className="w-1.5 h-1.5 rounded-full bg-red-400/60" />
                <div className="w-1.5 h-1.5 rounded-full bg-amber-400/60" />
                <div className="w-1.5 h-1.5 rounded-full bg-red-400/60" />
              </div>
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-red-400/50 to-transparent" />
            </div>
            
            <CardHeader className="pb-2 border-b border-red-300/40 dark:border-red-500/20 mt-2">
              <CardTitle className="flex flex-col items-center gap-1">
                <span className="bg-gradient-to-r from-red-500 via-amber-500 to-red-500 bg-clip-text text-transparent font-bold text-2xl">
                  春联配置
                </span>
                <p className="text-sm text-muted-foreground">定制您的专属春联</p>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pt-4 px-5 pb-20">
              {/* 随机灵感按钮 - 置顶显示 */}
              <Button
                variant="outline"
                size="sm"
                onClick={randomizeConfig}
                className="w-full h-11 text-sm gap-2 border-2 border-dashed border-amber-500/50 hover:bg-gradient-to-r hover:from-amber-500/10 hover:to-red-500/10 hover:border-amber-500 bg-gradient-to-r from-amber-50/50 to-red-50/50 dark:from-amber-950/30 dark:to-red-950/30 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
              >
                <Shuffle className="w-4 h-4 text-amber-500" />
                <span className="font-bold text-base bg-gradient-to-r from-amber-600 to-red-600 bg-clip-text text-transparent">随机灵感</span>
                <span className="text-sm text-muted-foreground">一键生成创意配置</span>
              </Button>

              {/* 分隔线 */}
              <div className="flex items-center gap-2">
                <div className="h-px flex-1 bg-gradient-to-r from-transparent via-red-300/50 to-transparent" />
                <span className="text-xs text-muted-foreground">自定义配置</span>
                <div className="h-px flex-1 bg-gradient-to-r from-transparent via-red-300/50 to-transparent" />
              </div>

              {/* 基础设置 */}
              <div className="space-y-4">
                {/* 生肖年份 & 字数 - 并排 */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label className="text-sm font-bold flex items-center gap-1 text-foreground">
                      <span className="text-base">🐲</span>
                      生肖
                    </Label>
                    <Select value={zodiac} onValueChange={setZodiac}>
                      <SelectTrigger className="h-10 bg-background/80 border-2 border-red-500/20 hover:border-red-500/40 rounded-lg text-sm">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {zodiacYears.map((item) => (
                          <SelectItem key={item.value} value={item.value} className="text-sm">
                            <span className="flex items-center gap-2">
                              <span>{item.emoji}</span>
                              <span>{item.label.replace(item.emoji + ' ', '')}</span>
                            </span>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* 字数 - 三个按钮 */}
                  <div className="space-y-2">
                    <Label className="text-sm font-bold flex items-center gap-1 text-foreground">
                      <span className="text-base">📝</span>
                      字数
                    </Label>
                    <div className="grid grid-cols-3 gap-1.5">
                      {wordCounts.map((item) => (
                        <button
                          key={item.value}
                          onClick={() => setWordCount(item.value)}
                          className={`py-2 text-sm font-bold rounded-lg border-2 transition-all duration-200 ${
                            wordCount === item.value
                              ? "bg-gradient-to-br from-amber-400 to-amber-600 text-white border-transparent shadow-md shadow-amber-500/30"
                              : "bg-background/50 border-primary/10 hover:border-amber-500/50"
                          }`}
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* 祝福主题 - 下拉框 */}
                <div className="space-y-2">
                  <Label className="text-sm font-bold flex items-center gap-1 text-foreground">
                    <span className="text-base">🎯</span>
                    祝福主题
                  </Label>
                  <Select value={theme} onValueChange={setTheme}>
                    <SelectTrigger className="w-full h-10 bg-background/80 border-2 border-red-500/20 hover:border-red-500/40 rounded-lg text-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {themes.map((item) => (
                        <SelectItem key={item.value} value={item.value} className="text-sm">
                          <span className="flex items-center gap-2">
                            <span>{item.icon}</span>
                            <span>{item.label}</span>
                          </span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* 预期氛围 - 下拉框 */}
                <div className="space-y-2">
                  <Label className="text-sm font-bold flex items-center gap-1 text-foreground">
                    <span className="text-base">🎭</span>
                    预期氛围
                  </Label>
                  <Select value={tone} onValueChange={setTone}>
                    <SelectTrigger className="w-full h-10 bg-background/80 border-2 border-orange-500/20 hover:border-orange-500/40 rounded-lg text-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {tones.map((item) => (
                        <SelectItem key={item.value} value={item.value} className="text-sm">
                          <span className="flex items-center gap-2">
                            <span>{item.icon}</span>
                            <span>{item.label}</span>
                          </span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* 创作风格 - 下拉列表 */}
                <div className="space-y-2">
                  <Label className="text-sm font-bold flex items-center gap-1 text-foreground">
                    <span className="text-base">🎨</span>
                    创作风格
                  </Label>
                  <Select value={style} onValueChange={setStyle}>
                    <SelectTrigger className="w-full h-10 bg-background/80 border-2 border-purple-500/20 hover:border-purple-500/40 rounded-lg text-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {styles.map((item) => (
                        <SelectItem key={item.value} value={item.value} className="text-sm">
                          <span className="flex items-center gap-2">
                            <span>{item.icon}</span>
                            <span>{item.label}</span>
                            <span className="text-xs text-muted-foreground">- {item.desc}</span>
                          </span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* 高级选项折叠区 */}
              <div className="space-y-2">
                <button
                  onClick={() => setShowAdvanced(!showAdvanced)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg border transition-all duration-300 ${
                    showAdvanced
                      ? "bg-gradient-to-r from-purple-500/10 to-pink-500/10 border-purple-500/30"
                      : "bg-background/50 border-dashed border-primary/15 hover:border-purple-500/30 hover:bg-purple-500/5"
                  }`}
                >
                  <span className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                    <Star className="w-4 h-4" />
                    高级选项
                  </span>
                  <span className={`text-sm text-muted-foreground transition-transform duration-300 ${showAdvanced ? "rotate-180" : ""}`}>
                    ▼
                  </span>
                </button>

                {showAdvanced && (
                  <div className="space-y-3 p-4 rounded-lg bg-purple-500/5 border border-purple-500/15 animate-in slide-in-from-top-2">
                    {/* 藏头春联 */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label className="text-sm font-bold flex items-center gap-1 text-foreground">
                          <span className="text-base">✨</span>
                          藏头春联
                        </Label>
                        {isAcrostic && (
                          <span className="text-xs px-2 py-0.5 rounded bg-red-500 text-white">已启用</span>
                        )}
                      </div>
                      <Input
                        placeholder="输入姓名（2-4字）"
                        value={acrosticName}
                        onChange={(e) => {
                          setAcrosticName(e.target.value)
                          setIsAcrostic(e.target.value.length >= 2)
                        }}
                        maxLength={4}
                        className="h-10 text-sm bg-background/90 border border-red-500/20 focus:border-red-500 rounded"
                      />
                      {isAcrostic && (
                        <p className="text-xs text-red-500 dark:text-red-400 font-medium">
                          🎉 藏头「{acrosticName}」将融入春联
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* 当前配置预览 */}
              <div className="p-3 rounded-lg bg-gradient-to-r from-red-500/5 via-amber-500/5 to-red-500/5 border border-red-500/10">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-sm">📋</span>
                  <span className="text-xs font-medium text-muted-foreground">当前配置</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  <span className="inline-flex items-center gap-1 px-2 py-1 rounded bg-red-500/10 text-xs">
                    {configSummary.zodiac?.emoji}
                  </span>
                  <span className="inline-flex items-center gap-1 px-2 py-1 rounded bg-amber-500/10 text-xs">
                    {configSummary.wordCount?.label}
                  </span>
                  <span className="inline-flex items-center gap-1 px-2 py-1 rounded bg-purple-500/10 text-xs">
                    {configSummary.style?.icon} {configSummary.style?.label}
                  </span>
                  <span className="inline-flex items-center gap-1 px-2 py-1 rounded bg-pink-500/10 text-xs">
                    {configSummary.theme?.icon} {configSummary.theme?.label}
                  </span>
                  <span className="inline-flex items-center gap-1 px-2 py-1 rounded bg-orange-500/10 text-xs">
                    {configSummary.tone?.icon} {configSummary.tone?.label}
                  </span>
                  {isAcrostic && (
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded bg-green-500/10 text-xs">
                      ✨ 藏「{acrosticName}」
                    </span>
                  )}
                </div>
              </div>

              {/* 生成按钮 - 绝对定位 */}
              <div className="absolute bottom-12 left-5 right-5">
                <Button
                  className="w-full gap-2 h-14 text-base font-bold bg-gradient-to-r from-red-600 via-red-500 to-amber-500 hover:from-red-700 hover:via-red-600 hover:to-amber-600 shadow-xl shadow-red-500/40 transition-all duration-300 rounded-2xl border-3 border-red-400/50 hover:scale-[1.02] active:scale-[0.98]"
                  onClick={generateCouplet}
                  disabled={isGenerating}
                >
                  {isGenerating ? (
                    <>
                      <RefreshCw className="h-5 w-5 animate-spin" />
                      AI创作中...
                    </>
                  ) : (
                    <>
                      <span className="text-xl">🚀</span>
                      生成春联
                      <Sparkles className="h-5 w-5" />
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* 中间：春联预览 - 占2份 */}
          <Card className="lg:col-span-2 relative overflow-hidden border-0 bg-gradient-to-br from-red-50 via-amber-50/50 to-red-50 dark:from-red-950/30 dark:via-amber-950/20 dark:to-red-950/30">
            {/* 可爱喜庆边框 - 多层装饰 */}
            <div className="absolute inset-0 rounded-xl border-4 border-red-500/40 pointer-events-none" />
            <div className="absolute inset-1 rounded-lg border-2 border-dashed border-amber-400/60 pointer-events-none" />
            <div className="absolute inset-2 rounded-md border border-red-400/30 pointer-events-none" />
            
            {/* 角落装饰 - 中国结风格 */}
            <div className="absolute -top-1 -left-1 w-8 h-8 bg-gradient-to-br from-red-500 to-amber-500 rounded-br-2xl flex items-center justify-center shadow-lg">
              <span className="text-white text-xs">福</span>
            </div>
            <div className="absolute -top-1 -right-1 w-8 h-8 bg-gradient-to-bl from-red-500 to-amber-500 rounded-bl-2xl flex items-center justify-center shadow-lg">
              <span className="text-white text-xs">喜</span>
            </div>
            <div className="absolute -bottom-1 -left-1 w-8 h-8 bg-gradient-to-tr from-red-500 to-amber-500 rounded-tr-2xl flex items-center justify-center shadow-lg">
              <span className="text-white text-xs">吉</span>
            </div>
            <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-gradient-to-tl from-red-500 to-amber-500 rounded-tl-2xl flex items-center justify-center shadow-lg">
              <span className="text-white text-xs">祥</span>
            </div>
            
            {/* 顶部灯笼装饰 */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 flex gap-6">
              <div className="w-3 h-5 bg-gradient-to-b from-red-500 to-red-600 rounded-full shadow-md shadow-red-500/50" />
              <div className="w-3 h-5 bg-gradient-to-b from-red-500 to-red-600 rounded-full shadow-md shadow-red-500/50" />
            </div>

            {/* 底部装饰 - 祥云图案 - 绝对定位 */}
            <div className="absolute bottom-6 left-5 right-5 flex justify-center items-center gap-2">
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-red-400/50 to-transparent" />
              <div className="flex gap-1">
                <div className="w-1.5 h-1.5 rounded-full bg-red-400/60" />
                <div className="w-1.5 h-1.5 rounded-full bg-amber-400/60" />
                <div className="w-1.5 h-1.5 rounded-full bg-red-400/60" />
              </div>
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-red-400/50 to-transparent" />
            </div>
            
            <CardHeader className="pb-2 border-b border-red-300/40 dark:border-red-500/20 mt-2">
              <CardTitle className="flex flex-col items-center gap-1">
                <span className="bg-gradient-to-r from-red-500 via-amber-500 to-red-500 bg-clip-text text-transparent font-bold text-2xl">
                  春联预览
                </span>
                <p className="text-sm text-muted-foreground">AI智能创作展示</p>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4 px-5 pb-20">
              {isGenerating ? (
                <div className="flex flex-col items-center justify-center py-16">
                  <div className="relative">
                    <div className="w-20 h-20 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
                    <span className="absolute inset-0 flex items-center justify-center text-3xl font-brush">福</span>
                  </div>
                  <p className="mt-4 text-sm text-muted-foreground">AI正在创作中...</p>
                </div>
              ) : couplet ? (
                <div className="flex flex-col items-center py-4">
                  <div className="mb-4 px-6 py-2 horizontal-scroll rounded-lg">
                    <span className="text-xl font-brush text-shimmer tracking-[0.3em]">{couplet.horizontal}</span>
                  </div>

                  <div className="flex justify-center gap-6">
                    {/* 上联 */}
                    <div className="flex flex-col items-center">
                      <div className="couplet-paper rounded-lg p-2">
                        <div className="flex flex-col" style={{ gap: `${charGap}px` }}>
                          {couplet.upper.split("").map((char, i) => (
                            <div
                              key={i}
                              className={`${charSize} flex items-center justify-center font-brush text-gold couplet-char animate-char-appear`}
                              style={{ animationDelay: `${i * 0.1}s` }}
                            >
                              {char}
                            </div>
                          ))}
                        </div>
                      </div>
                      <span className="mt-2 text-xs text-muted-foreground">上联</span>
                    </div>

                    {/* 下联 */}
                    <div className="flex flex-col items-center">
                      <div className="couplet-paper rounded-lg p-2">
                        <div className="flex flex-col" style={{ gap: `${charGap}px` }}>
                          {couplet.lower.split("").map((char, i) => (
                            <div
                              key={i}
                              className={`${charSize} flex items-center justify-center font-brush text-gold couplet-char animate-char-appear`}
                              style={{ animationDelay: `${(i + couplet.upper.length) * 0.1}s` }}
                            >
                              {char}
                            </div>
                          ))}
                        </div>
                      </div>
                      <span className="mt-2 text-xs text-muted-foreground">下联</span>
                    </div>
                  </div>

                  {/* 春联解释说明 - 悬停展开（向上弹出） */}
                  {couplet.explanation && (
                    <div className="mt-4 w-full relative group">
                      {/* 折叠状态 - 提示标识 */}
                      <div className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30 border-2 border-dashed border-amber-400/60 dark:border-amber-600/60 cursor-help transition-all duration-300 group-hover:border-solid group-hover:shadow-lg">
                        <span className="text-lg">📖</span>
                        <span className="text-sm font-medium text-amber-800 dark:text-amber-200">创作解释</span>
                        <span className="text-xs text-amber-600 dark:text-amber-400 animate-pulse">(悬停查看)</span>
                      </div>
                      
                      {/* 悬停展开的详细内容 - 向上弹出，适中宽度避免超出边框 */}
                      <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-[95%] max-w-xl opacity-0 invisible pointer-events-none group-hover:opacity-100 group-hover:visible group-hover:pointer-events-auto transition-all duration-300 z-20">
                        <div className="p-5 rounded-lg bg-white dark:bg-gray-800 border-2 border-amber-400/80 dark:border-amber-600/80 shadow-2xl">
                          <div className="flex items-start gap-3">
                            <span className="text-xl mt-0.5 flex-shrink-0">💡</span>
                            <div className="flex-1 min-w-0">
                              <h3 className="text-base font-bold text-amber-900 dark:text-amber-100 mb-3 flex items-center gap-2">
                                创作解释
                                <span className="text-xs font-normal text-muted-foreground">(详细说明)</span>
                              </h3>
                              <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">
                                {couplet.explanation}
                              </p>
                            </div>
                          </div>
                        </div>
                        {/* 向下的三角箭头指示器 */}
                        <div className="absolute left-1/2 -translate-x-1/2 -bottom-2 w-4 h-4 bg-white dark:bg-gray-800 border-r-2 border-b-2 border-amber-400/80 dark:border-amber-600/80 rotate-45"></div>
                      </div>
                    </div>
                  )}

                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mb-4">
                    <span className="text-4xl font-brush opacity-30">福</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    配置好选项后
                    <br />
                    点击"生成春联"开始创作
                  </p>
                </div>
              )}
              
              {/* 生成图片按钮 - 绝对定位 */}
              {couplet && (
                <div className="absolute bottom-12 left-5 right-5">
                  <Button
                    className="w-full gap-2 h-14 text-base font-bold bg-gradient-to-r from-red-600 via-red-500 to-amber-500 hover:from-red-700 hover:via-red-600 hover:to-amber-600 shadow-xl shadow-red-500/40 transition-all duration-300 rounded-2xl border-3 border-red-400/50 hover:scale-[1.02] active:scale-[0.98]"
                    onClick={generateImage}
                    disabled={isGeneratingImage || !!generatedImage}
                  >
                    {isGeneratingImage ? (
                      <>
                        <RefreshCw className="h-5 w-5 animate-spin" />
                        生成春联图中...
                      </>
                    ) : generatedImage ? (
                      <>
                        <span className="text-xl">✅</span>
                        已生成春联图
                        <ImageIcon className="h-5 w-5" />
                      </>
                    ) : (
                      <>
                        <span className="text-xl">🎨</span>
                        生成春联图片
                        <ImageIcon className="h-5 w-5" />
                      </>
                    )}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* 右侧：生成结果 - 占3份 */}
          <Card className="lg:col-span-3 relative overflow-hidden border-0 bg-gradient-to-br from-red-50 via-amber-50/50 to-red-50 dark:from-red-950/30 dark:via-amber-950/20 dark:to-red-950/30">
            {/* 可爱喜庆边框 - 多层装饰 */}
            <div className="absolute inset-0 rounded-xl border-4 border-red-500/40 pointer-events-none" />
            <div className="absolute inset-1 rounded-lg border-2 border-dashed border-amber-400/60 pointer-events-none" />
            <div className="absolute inset-2 rounded-md border border-red-400/30 pointer-events-none" />
            
            {/* 角落装饰 - 中国结风格 */}
            <div className="absolute -top-1 -left-1 w-8 h-8 bg-gradient-to-br from-red-500 to-amber-500 rounded-br-2xl flex items-center justify-center shadow-lg">
              <span className="text-white text-xs">福</span>
            </div>
            <div className="absolute -top-1 -right-1 w-8 h-8 bg-gradient-to-bl from-red-500 to-amber-500 rounded-bl-2xl flex items-center justify-center shadow-lg">
              <span className="text-white text-xs">喜</span>
            </div>
            <div className="absolute -bottom-1 -left-1 w-8 h-8 bg-gradient-to-tr from-red-500 to-amber-500 rounded-tr-2xl flex items-center justify-center shadow-lg">
              <span className="text-white text-xs">吉</span>
            </div>
            <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-gradient-to-tl from-red-500 to-amber-500 rounded-tl-2xl flex items-center justify-center shadow-lg">
              <span className="text-white text-xs">祥</span>
            </div>
            
            {/* 顶部灯笼装饰 */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 flex gap-6">
              <div className="w-3 h-5 bg-gradient-to-b from-red-500 to-red-600 rounded-full shadow-md shadow-red-500/50" />
              <div className="w-3 h-5 bg-gradient-to-b from-red-500 to-red-600 rounded-full shadow-md shadow-red-500/50" />
            </div>

            {/* 底部装饰 - 祥云图案 - 绝对定位 */}
            <div className="absolute bottom-6 left-5 right-5 flex justify-center items-center gap-2">
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-red-400/50 to-transparent" />
              <div className="flex gap-1">
                <div className="w-1.5 h-1.5 rounded-full bg-red-400/60" />
                <div className="w-1.5 h-1.5 rounded-full bg-amber-400/60" />
                <div className="w-1.5 h-1.5 rounded-full bg-red-400/60" />
              </div>
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-red-400/50 to-transparent" />
            </div>
            
            <CardHeader className="pb-2 border-b border-red-300/40 dark:border-red-500/20 mt-2">
              <CardTitle className="flex flex-col items-center gap-1">
                <span className="bg-gradient-to-r from-red-500 via-amber-500 to-red-500 bg-clip-text text-transparent font-bold text-2xl">
                  生成结果
                </span>
                <p className="text-sm text-muted-foreground">精美春联图片展示</p>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4 px-5 pb-20">
              {generatedImage ? (
                <div className="space-y-4">
                  {/* 生成的图片 */}
                  <div className="relative rounded-lg overflow-hidden border">
                    <img
                      src={generatedImage || "/placeholder.svg"}
                      alt="生成的春节祝福图"
                      className="w-full aspect-[4/3] object-cover"
                    />
                    <Button size="sm" variant="secondary" className="absolute bottom-2 right-2 gap-1 h-7 text-xs">
                      <Download className="h-3 w-3" />
                      下载
                    </Button>
                  </div>

                  {/* NFT信息 */}
                  {mintedNFT && (
                    <div className="p-4 rounded-lg border border-secondary/30 bg-secondary/5">
                      <div className="flex items-center gap-2 mb-3">
                        <Coins className="h-4 w-4 text-secondary" />
                        <span className="font-medium text-sm">NFT铸造成功</span>
                      </div>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Token ID</span>
                          <span className="font-mono">#{mintedNFT.tokenId}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">交易哈希</span>
                          <span className="font-mono text-xs truncate max-w-[180px]">{mintedNFT.txHash}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ) : isGeneratingImage ? (
                <div className="flex flex-col items-center justify-center py-16">
                  <div className="relative">
                    <div className="w-16 h-16 rounded-full border-4 border-secondary/20 border-t-secondary animate-spin" />
                    <ImageIcon className="absolute inset-0 m-auto h-6 w-6 text-secondary" />
                  </div>
                  <p className="mt-4 text-sm text-muted-foreground">AI正在生成春联图...</p>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                    <ImageIcon className="h-8 w-8 text-muted-foreground/30" />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    生成春联后
                    <br />
                    点击"生成春联图片"创建精美图片
                  </p>
                </div>
              )}
              
              {/* 铸造NFT按钮 - 绝对定位 */}
              {generatedImage && !mintedNFT && (
                <div className="absolute bottom-12 left-5 right-5">
                  <Button
                    className="w-full gap-2 h-14 text-base font-bold bg-gradient-to-r from-red-600 via-red-500 to-amber-500 hover:from-red-700 hover:via-red-600 hover:to-amber-600 shadow-xl shadow-red-500/40 transition-all duration-300 rounded-2xl border-3 border-red-400/50 hover:scale-[1.02] active:scale-[0.98]"
                    onClick={mintNFT}
                    disabled={isMinting}
                  >
                    {isMinting ? (
                      <>
                        <RefreshCw className="h-5 w-5 animate-spin" />
                        铸造中...
                      </>
                    ) : (
                      <>
                        <span className="text-xl">💎</span>
                        铸造为NFT
                        <Coins className="h-5 w-5" />
                      </>
                    )}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  )
}
