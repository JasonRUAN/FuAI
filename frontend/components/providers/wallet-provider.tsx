// "use client"

// import { WagmiProvider, createConfig, http } from "wagmi"
// import { monadTestnet } from "wagmi/chains"
// import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
// import { ConnectKitProvider, getDefaultConfig } from "connectkit"

// const config = createConfig(
//   getDefaultConfig({
//     // Your dApps chains
//     chains: [monadTestnet],
//     transports: {
//       // RPC URL for each chain
//       [monadTestnet.id]: http(`https://testnet-rpc.monad.xyz/`),
//     },

//     // Required API Keys
//     walletConnectProjectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID!,

//     // Required App Info
//     appName: "FuAI",
//     appDescription: "基于大语言模型的智能春节文化内容生成区块链Dapp",
//     appUrl: "https://fuai.app",
//     appIcon: "https://fuai.app/icon.svg",
//   })
// )

// const queryClient = new QueryClient()

// export function WalletProvider({ children }: { children: React.ReactNode }) {
//   return (
//     <WagmiProvider config={config}>
//       <QueryClientProvider client={queryClient}>
//         <ConnectKitProvider>{children}</ConnectKitProvider>
//       </QueryClientProvider>
//     </WagmiProvider>
//   )
// }

// // 导出config供其他模块使用
// export { config }
