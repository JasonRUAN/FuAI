"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Heart, Share2, ExternalLink } from "lucide-react"

const galleryItems = [
  {
    id: 1,
    upper: "龙腾虎跃新春到",
    lower: "燕舞莺歌吉祥来",
    horizontal: "春满乾坤",
    author: "0x1234...5678",
    tokenId: "#1001",
    style: "传统典雅",
    theme: "新春祝福",
    likes: 128,
    image: "/chinese-new-year-dragon-blessing.jpg",
  },
  {
    id: 2,
    upper: "财源滚滚达三江",
    lower: "生意兴隆通四海",
    horizontal: "招财进宝",
    author: "0xabcd...efgh",
    tokenId: "#1002",
    style: "传统典雅",
    theme: "财运亨通",
    likes: 256,
    image: "/chinese-new-year-wealth-prosperity.jpg",
  },
  {
    id: 3,
    upper: "鹏程万里展宏图",
    lower: "骏业千秋创伟业",
    horizontal: "前程似锦",
    author: "0x9876...5432",
    tokenId: "#1003",
    style: "现代简约",
    theme: "事业有成",
    likes: 89,
    image: "/chinese-new-year-career-success.jpg",
  },
  {
    id: 4,
    upper: "春风送暖入屠苏",
    lower: "爆竹声中一岁除",
    horizontal: "新春快乐",
    author: "0xfedc...ba98",
    tokenId: "#1004",
    style: "文艺清新",
    theme: "新春祝福",
    likes: 312,
    image: "/chinese-new-year-spring-festival.jpg",
  },
  {
    id: 5,
    upper: "金蛇献瑞迎新岁",
    lower: "玉燕衔春报喜来",
    horizontal: "蛇年大吉",
    author: "0x2468...1357",
    tokenId: "#1005",
    style: "传统典雅",
    theme: "新春祝福",
    likes: 178,
    image: "/chinese-new-year-snake-zodiac.jpg",
  },
  {
    id: 6,
    upper: "身体康健福寿全",
    lower: "家庭和睦幸福长",
    horizontal: "健康平安",
    author: "0x1357...2468",
    tokenId: "#1006",
    style: "温馨祝福",
    theme: "健康长寿",
    likes: 203,
    image: "/chinese-new-year-health-blessing.jpg",
  },
  {
    id: 7,
    upper: "金榜题名登科第",
    lower: "蟾宫折桂步青云",
    horizontal: "学业有成",
    author: "0xaaaa...bbbb",
    tokenId: "#1007",
    style: "文艺清新",
    theme: "学业进步",
    likes: 145,
    image: "/chinese-new-year-study-success.jpg",
  },
  {
    id: 8,
    upper: "月老牵线缘千里",
    lower: "红娘搭桥情万年",
    horizontal: "百年好合",
    author: "0xcccc...dddd",
    tokenId: "#1008",
    style: "浪漫唯美",
    theme: "爱情美满",
    likes: 421,
    image: "/chinese-new-year-love-romance.jpg",
  },
]

export default function GalleryPage() {
  const [likedItems, setLikedItems] = useState<number[]>([])

  const toggleLike = (id: number) => {
    setLikedItems((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]))
  }

  return (
    <div className="min-h-screen bg-background pt-20 pb-12">
      <div className="container mx-auto px-4">
        {/* 简洁标题 */}
        <h1 className="text-3xl font-bold text-center text-foreground mb-8">作品展示</h1>

        {/* 作品网格 */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {galleryItems.map((item) => (
            <Card
              key={item.id}
              className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden"
            >
              <CardContent className="p-0">
                {/* NFT图片区 */}
                <div className="relative aspect-square overflow-hidden">
                  <img
                    src={item.image || "/placeholder.svg"}
                    alt={item.horizontal}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute bottom-3 left-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="flex gap-2">
                      <Button size="sm" variant="secondary" className="flex-1">
                        <ExternalLink className="h-4 w-4 mr-1" />
                        查看详情
                      </Button>
                      <Button size="sm" variant="secondary">
                        <Share2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>

                {/* 春联展示区 */}
                <div className="bg-gradient-to-b from-primary/15 to-primary/5 p-4">
                  <div className="flex flex-col items-center">
                    <div className="mb-3 px-4 py-1 bg-primary text-primary-foreground rounded text-sm font-bold">
                      {item.horizontal}
                    </div>
                    <div className="flex gap-4">
                      <div className="bg-primary/90 text-primary-foreground rounded px-2 py-1">
                        {item.upper.split("").map((char, i) => (
                          <div key={i} className="w-5 h-5 flex items-center justify-center text-xs font-brush">
                            {char}
                          </div>
                        ))}
                      </div>
                      <div className="bg-primary/90 text-primary-foreground rounded px-2 py-1">
                        {item.lower.split("").map((char, i) => (
                          <div key={i} className="w-5 h-5 flex items-center justify-center text-xs font-brush">
                            {char}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* 信息区 */}
                <div className="p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex gap-2">
                      <Badge variant="secondary" className="text-xs">
                        {item.style}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {item.theme}
                      </Badge>
                    </div>
                    <span className="text-xs font-mono text-muted-foreground">{item.tokenId}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="text-xs text-muted-foreground">创作者: {item.author}</div>
                    <button
                      onClick={() => toggleLike(item.id)}
                      className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors"
                    >
                      <Heart className={`h-4 w-4 ${likedItems.includes(item.id) ? "fill-primary text-primary" : ""}`} />
                      {item.likes + (likedItems.includes(item.id) ? 1 : 0)}
                    </button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
