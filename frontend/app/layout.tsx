import type React from "react"
import type { Metadata } from "next"
import { ZCOOL_KuaiLe, ZCOOL_XiaoWei, Ma_Shan_Zheng } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import { WalletProvider } from "@/components/providers/wallet-provider"
import { Header } from "@/components/header"
import { Toaster } from "@/components/ui/sonner"

const zcoolKuaiLe = ZCOOL_KuaiLe({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-cute",
})

const zcoolXiaoWei = ZCOOL_XiaoWei({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-xiaowei",
})

const maShanZheng = Ma_Shan_Zheng({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-mashan",
})

export const metadata: Metadata = {
  title: "FuAI - 春节祝福AI助手",
  description: "基于大语言模型的智能春节文化内容生成区块链Dapp，传统文化与现代AI技术的完美融合",
  icons: {
    icon: [
      {
        url: "/icon-light-32x32.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/icon-dark-32x32.png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/icon.svg",
        type: "image/svg+xml",
      },
    ],
    apple: "/apple-icon.png",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="zh-CN">
      <body
        className={`${zcoolKuaiLe.variable} ${zcoolXiaoWei.variable} ${maShanZheng.variable} font-cute antialiased`}
      >
        <WalletProvider>
          <Header />
          {children}
          <Toaster />
        </WalletProvider>
        <Analytics />
      </body>
    </html>
  )
}
