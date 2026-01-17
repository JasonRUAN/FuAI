import { Heart } from "lucide-react"

export function Footer() {
  return (
    <footer id="about" className="border-t border-border bg-muted/30 py-12">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-bold">
                福
              </div>
              <span className="text-lg font-bold text-primary">CoupletFuAI</span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              基于大语言模型的智能春节文化内容生成区块链Dapp， 传统文化与现代AI技术的完美融合。
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-4">功能</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>AI春联生成</li>
              <li>藏头春联定制</li>
              <li>祝福图片生成</li>
              <li>NFT铸造</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">链接</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <a href="#" className="hover:text-primary transition-colors">
                  GitHub
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition-colors">
                  文档
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition-colors">
                  社区
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition-colors">
                  联系我们
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border pt-8 text-center">
          <p className="text-sm text-muted-foreground flex items-center justify-center gap-1">
            Made with <Heart className="h-4 w-4 text-primary fill-primary" /> by CoupletFuAI Team
          </p>
          <p className="text-xs text-muted-foreground mt-2">© 2026 CoupletFuAI. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
