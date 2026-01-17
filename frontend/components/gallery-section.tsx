"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const galleryItems = [
  {
    id: 1,
    upper: "龙腾虎跃新春到",
    lower: "燕舞莺歌吉祥来",
    horizontal: "春满乾坤",
    author: "0x1234...5678",
    tokenId: "#1001",
    style: "传统典雅",
  },
  {
    id: 2,
    upper: "财源滚滚达三江",
    lower: "生意兴隆通四海",
    horizontal: "招财进宝",
    author: "0xabcd...efgh",
    tokenId: "#1002",
    style: "财运主题",
  },
  {
    id: 3,
    upper: "鹏程万里展宏图",
    lower: "骏业千秋创伟业",
    horizontal: "前程似锦",
    author: "0x9876...5432",
    tokenId: "#1003",
    style: "事业有成",
  },
  {
    id: 4,
    upper: "春风送暖入屠苏",
    lower: "爆竹声中一岁除",
    horizontal: "新春快乐",
    author: "0xfedc...ba98",
    tokenId: "#1004",
    style: "文艺清新",
  },
]

export function GallerySection() {
  return (
    <section id="gallery" className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-4">作品展示</h2>
          <p className="text-muted-foreground">精选用户创作的春联NFT作品</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {galleryItems.map((item) => (
            <Card
              key={item.id}
              className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden"
            >
              <CardContent className="p-0">
                {/* 春联展示区 */}
                <div className="bg-gradient-to-b from-primary/20 to-primary/10 p-6">
                  <div className="flex flex-col items-center">
                    {/* 横批 */}
                    <div className="mb-4 px-4 py-1 bg-primary text-primary-foreground rounded text-sm font-bold">
                      {item.horizontal}
                    </div>

                    {/* 上下联 */}
                    <div className="flex gap-6">
                      <div className="bg-primary/90 text-primary-foreground rounded px-2 py-1">
                        {item.upper.split("").map((char, i) => (
                          <div key={i} className="w-6 h-6 flex items-center justify-center text-sm">
                            {char}
                          </div>
                        ))}
                      </div>
                      <div className="bg-primary/90 text-primary-foreground rounded px-2 py-1">
                        {item.lower.split("").map((char, i) => (
                          <div key={i} className="w-6 h-6 flex items-center justify-center text-sm">
                            {char}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* 信息区 */}
                <div className="p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary" className="text-xs">
                      {item.style}
                    </Badge>
                    <span className="text-xs font-mono text-muted-foreground">{item.tokenId}</span>
                  </div>
                  <div className="text-xs text-muted-foreground">创作者: {item.author}</div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
