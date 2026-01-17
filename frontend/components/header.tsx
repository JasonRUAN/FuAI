"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useWallet } from "@/components/providers/wallet-provider"
import { Button } from "@/components/ui/button"
import { Wallet, LogOut, Sparkles } from "lucide-react"

export function Header() {
  const { address, isConnected, isConnecting, connect, disconnect } = useWallet()
  const pathname = usePathname()

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`
  }

  const navLinks = [
    { href: "/", label: "首页" },
    { href: "/create", label: "创作中心" },
    { href: "/gallery", label: "作品展示" },
  ]

  return (
    <header className="sticky top-0 z-50 w-full bg-gradient-to-r from-red-900 via-red-800 to-red-900 shadow-lg">
      <div className="h-1 w-full bg-gradient-to-r from-yellow-600 via-yellow-400 to-yellow-600" />

      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative">
            {/* 外圈装饰 */}
            <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-400 opacity-75 blur-sm group-hover:opacity-100 transition-opacity animate-pulse" />
            {/* 福字圆形 */}
            <div className="relative flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-red-600 to-red-700 border-2 border-yellow-400 shadow-lg">
              <span className="text-2xl font-bold text-yellow-300 font-brush animate-float">福</span>
            </div>
          </div>
          <div className="flex flex-col">
            <span className="text-4xl font-bold text-shimmer tracking-wide">CoupletFuAI</span>
            <span className="text-base text-yellow-200/80 tracking-wider">春节祝福AI助手</span>
          </div>
          {/* 装饰灯笼 */}
          <div className="hidden lg:flex items-center gap-1 ml-2">
            <span className="text-lg animate-float" style={{ animationDelay: "0s" }}>
              🏮
            </span>
            <span className="text-lg animate-float" style={{ animationDelay: "0.5s" }}>
              🧧
            </span>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => {
            const isActive = pathname === link.href
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`relative px-4 py-2 text-lg font-medium rounded-lg transition-all duration-300 ${
                  isActive
                    ? "text-yellow-300 bg-red-700/50"
                    : "text-yellow-100/80 hover:text-yellow-300 hover:bg-red-700/30"
                }`}
              >
                {/* 活跃状态底部金条 */}
                {isActive && (
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-gradient-to-r from-transparent via-yellow-400 to-transparent" />
                )}
                <span className="relative z-10">{link.label}</span>
              </Link>
            )
          })}
        </nav>

        <div className="flex items-center gap-2">
          {isConnected ? (
            <div className="flex items-center gap-2">
              <div className="hidden sm:flex items-center gap-2 rounded-full bg-red-700/50 border border-yellow-500/30 px-3 py-1.5">
                <div className="h-2 w-2 rounded-full bg-green-400 animate-pulse shadow-lg shadow-green-400/50" />
                <span className="text-sm font-medium text-yellow-200">{formatAddress(address!)}</span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={disconnect}
                className="gap-2 bg-transparent border-yellow-500/50 text-yellow-200 hover:bg-red-700/50 hover:text-yellow-300 hover:border-yellow-400"
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">断开</span>
              </Button>
            </div>
          ) : (
            <Button
              onClick={connect}
              disabled={isConnecting}
              className="gap-2 bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-400 hover:to-yellow-500 text-red-900 font-semibold shadow-lg shadow-yellow-500/30 border-0"
            >
              {isConnecting ? (
                <>
                  <Sparkles className="h-4 w-4 animate-spin" />
                  <span>连接中...</span>
                </>
              ) : (
                <>
                  <Wallet className="h-4 w-4" />
                  <span>连接钱包</span>
                </>
              )}
            </Button>
          )}
        </div>
      </div>

      <div className="h-0.5 w-full bg-gradient-to-r from-yellow-600/50 via-yellow-400 to-yellow-600/50" />
    </header>
  )
}
