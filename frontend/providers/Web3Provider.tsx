"use client";

import { WagmiProvider, createConfig, http } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ConnectKitProvider, getDefaultConfig } from "connectkit";
import { defineChain } from "viem";

export const hashkeyChain = defineChain({
    id: 133,
    name: "HashKey Chain Testnet",
    nativeCurrency: {
        decimals: 18,
        name: "HSK",
        symbol: "HSK",
    },
    rpcUrls: {
        default: { http: ["https://testnet.hsk.xyz"] },
    },
    blockExplorers: {
        default: {
            name: "testnet-explorer",
            url: "https://testnet-explorer.hsk.xyz",
        },
    },
    testnet: true,
});

const config = createConfig(
    getDefaultConfig({
        // Your dApps chains
        chains: [hashkeyChain],
        transports: {
            // RPC URL for each chain
            [hashkeyChain.id]: http(`https://testnet.hsk.xyz`),
        },

        // Required API Keys
        walletConnectProjectId:
            process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID!,

        // Required App Info
        appName: "FuAI",
    })
);

const queryClient = new QueryClient();

export const Web3Provider = ({ children }: { children: React.ReactNode }) => {
    return (
        <WagmiProvider config={config}>
            <QueryClientProvider client={queryClient}>
                <ConnectKitProvider>{children}</ConnectKitProvider>
            </QueryClientProvider>
        </WagmiProvider>
    );
};

// 导出config供其他模块使用
export { config };

// https://docs.family.co/connectkit/getting-started#getting-started-section-3-implementation
