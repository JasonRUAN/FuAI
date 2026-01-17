/**
 * FuAICoupletNFT 合约配置
 */

// 合约地址
export const FU_AI_COUPLET_NFT_ADDRESS = "0x7E312092a48E9f4AF17b3c8e384ba36D0F88E5ce" as const;

// 合约 ABI（只包含需要的函数）
export const FU_AI_COUPLET_NFT_ABI = [
    {
        "inputs": [
            { "internalType": "string", "name": "upperLine", "type": "string" },
            { "internalType": "string", "name": "lowerLine", "type": "string" },
            { "internalType": "string", "name": "horizontalScroll", "type": "string" },
            { "internalType": "string", "name": "zodiac", "type": "string" },
            { "internalType": "uint8", "name": "wordCount", "type": "uint8" },
            { "internalType": "string", "name": "style", "type": "string" },
            { "internalType": "string", "name": "theme", "type": "string" },
            { "internalType": "string", "name": "mood", "type": "string" },
            { "internalType": "string", "name": "hiddenName", "type": "string" },
            { "internalType": "string", "name": "explanation", "type": "string" },
            { "internalType": "string", "name": "imageUrl", "type": "string" },
            { "internalType": "string", "name": "artStyle", "type": "string" },
            { "internalType": "string", "name": "layout", "type": "string" },
            { "internalType": "string", "name": "colorScheme", "type": "string" },
            { "internalType": "string", "name": "decorationStyle", "type": "string" },
            { "internalType": "string", "name": "backgroundStyle", "type": "string" }
        ],
        "name": "mintCouplet",
        "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
        "stateMutability": "payable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "mintFee",
        "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
        "stateMutability": "view",
        "type": "function"
    }
] as const;

// 合约配置对象
export const fuAICoupletNFTContractConfig = {
    address: FU_AI_COUPLET_NFT_ADDRESS,
    abi: FU_AI_COUPLET_NFT_ABI,
} as const;
