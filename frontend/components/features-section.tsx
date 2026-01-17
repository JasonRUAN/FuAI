import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Sparkles, Palette, Type, Heart, Briefcase, GraduationCap, Coins, ImageIcon, LinkIcon } from "lucide-react"

const features = [
  {
    icon: Type,
    title: "多字数选择",
    description: "支持五言、七言、九言等多种字数格式，满足不同场景需求",
  },
  {
    icon: Sparkles,
    title: "藏头春联",
    description: "支持姓名藏头功能，将祝福与名字巧妙融合，打造专属春联",
  },
  {
    icon: Palette,
    title: "风格多样",
    description: "传统典雅、现代简约、幽默搞笑等多种创作风格任您选择",
  },
  {
    icon: ImageIcon,
    title: "AI生成图片",
    description: "基于春联内容智能生成精美祝福图，视觉与文字完美结合",
  },
  {
    icon: LinkIcon,
    title: "NFT铸造",
    description: "一键将作品铸造成NFT，永久存证于区块链，独一无二",
  },
  {
    icon: Coins,
    title: "生肖主题",
    description: "支持十二生肖年份选择，契合每年新春主题",
  },
]

const themes = [
  { icon: Briefcase, label: "事业顺利", color: "text-blue-500" },
  { icon: Coins, label: "财源广进", color: "text-yellow-500" },
  { icon: Heart, label: "健康长寿", color: "text-red-500" },
  { icon: GraduationCap, label: "学业有成", color: "text-green-500" },
  { icon: Heart, label: "爱情美满", color: "text-pink-500" },
  { icon: Sparkles, label: "万事如意", color: "text-purple-500" },
]

export function FeaturesSection() {
  return (
    <section id="features" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-4">功能特色</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            汇聚AI智能与传统文化精髓，为您提供全方位的春节祝福创作体验
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {features.map((feature, index) => (
            <Card key={index} className="border-border/50 hover:border-primary/50 transition-colors hover:shadow-lg">
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-lg">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-muted-foreground">{feature.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* 主题展示 */}
        <div className="text-center">
          <h3 className="text-xl font-semibold mb-6">涵盖生活各个方面</h3>
          <div className="flex flex-wrap justify-center gap-4">
            {themes.map((theme, index) => (
              <div
                key={index}
                className="flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 hover:border-primary/50 transition-colors cursor-pointer"
              >
                <theme.icon className={`h-4 w-4 ${theme.color}`} />
                <span className="text-sm font-medium">{theme.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
