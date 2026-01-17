"use client"

import Link from "next/link"
import { useWallet } from "@/components/providers/wallet-provider"
import { Button } from "@/components/ui/button"
import { ArrowRight, Sparkles } from "lucide-react"

export function HeroSection() {
  const { isConnected, connect, isConnecting } = useWallet()

  return (
    <section className="relative overflow-hidden py-20 md:py-32">
      {/* 背景装饰 */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-20 left-10 text-8xl opacity-10 animate-float">福</div>
        <div className="absolute top-40 right-20 text-6xl opacity-10 animate-float" style={{ animationDelay: "1s" }}>
          春
        </div>
        <div
          className="absolute bottom-20 left-1/4 text-7xl opacity-10 animate-float"
          style={{ animationDelay: "0.5s" }}
        >
          喜
        </div>
        <div
          className="absolute bottom-40 right-1/3 text-5xl opacity-10 animate-float"
          style={{ animationDelay: "1.5s" }}
        >
          乐
        </div>
      </div>

      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-4xl text-center">
          {/* 标签 */}
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5">
            <Sparkles className="h-4 w-4 text-secondary" />
            <span className="text-sm font-medium text-primary">AI驱动 · 区块链存证 · NFT铸造</span>
          </div>

          {/* 主标题 */}
          <h1 className="mb-6 text-4xl font-bold tracking-tight text-foreground md:text-6xl lg:text-7xl">
            <span className="text-primary">春节祝福</span>
            <br />
            <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
              AI智能创作
            </span>
          </h1>

          {/* 副标题 */}
          <p className="mb-8 text-lg text-muted-foreground md:text-xl leading-relaxed max-w-2xl mx-auto">
            融合传统文化与现代AI技术，为您生成独一无二的春联、横批与祝福图， 并将其铸造成专属NFT，永久存证于区块链
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            {isConnected ? (
              <Button size="lg" asChild className="gap-2 bg-primary hover:bg-primary/90 text-lg px-8 py-6">
                <Link href="/create">
                  <span>开始创作</span>
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </Button>
            ) : (
              <Button
                size="lg"
                onClick={connect}
                disabled={isConnecting}
                className="gap-2 bg-primary hover:bg-primary/90 text-lg px-8 py-6"
              >
                {isConnecting ? (
                  <>
                    <Sparkles className="h-5 w-5 animate-spin" />
                    <span>连接中...</span>
                  </>
                ) : (
                  <>
                    <span>连接钱包开始</span>
                    <ArrowRight className="h-5 w-5" />
                  </>
                )}
              </Button>
            )}
            <Button variant="outline" size="lg" className="text-lg px-8 py-6 bg-transparent">
              了解更多
            </Button>
          </div>

          {/* 统计数据 */}
          <div className="mt-16 grid grid-cols-3 gap-8 max-w-lg mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">10,000+</div>
              <div className="text-sm text-muted-foreground">已创作春联</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-secondary">5,000+</div>
              <div className="text-sm text-muted-foreground">铸造NFT</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">2,000+</div>
              <div className="text-sm text-muted-foreground">活跃用户</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
