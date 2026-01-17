import { useMutation } from "@tanstack/react-query";
import { useAccount, useWriteContract } from "wagmi";
import { contractConfig } from "@/constants/contractConfig";
import { CONSTANTS } from "@/constants/backend";
import type { 
    ArtStyle, 
    LayoutType, 
    ColorScheme, 
    DecorationStyle, 
    BackgroundStyle 
} from "@/types/image-generation";

/**
 * 春联铸造信息接口
 */
export interface MintCoupletInfo {
    // 春联内容（必填）
    upperLine: string;              // 上联
    lowerLine: string;              // 下联
    horizontalScroll: string;       // 横批
    
    // 创作配置（必填）
    zodiac: string;                 // 生肖（如：🐍 蛇年）
    wordCount: 5 | 7 | 9;           // 字数
    style: string;                  // 风格（传统典雅/现代简约等）
    theme: string;                  // 主题（事业顺利/财源广进等）
    mood: string;                   // 预期氛围（庄重/活泼等）
    
    // 可选配置
    hiddenName?: string;            // 藏头名字
    explanation: string;            // AI 创作解释
    imageUrl: string;               // 生成的图片 URL（将上传到 IPFS）
    
    // 图片生成配置（必填）
    artStyle: ArtStyle;             // 画风类型
    layout: LayoutType;             // 构图布局
    colorScheme: ColorScheme;       // 色调方案
    decorationStyle: DecorationStyle; // 装饰元素
    backgroundStyle: BackgroundStyle; // 背景风格
}

/**
 * 铸造结果
 */
export interface MintCoupletResult {
    transactionHash: string;
    tokenId?: string;
}

/**
 * 铸造春联 NFT 的 Hook
 * 
 * @example
 * ```tsx
 * const { mutate: mintCouplet, isPending } = useMintCouplet();
 * 
 * const handleMint = () => {
 *   mintCouplet({
 *     upperLine: "春回大地百花艳",
 *     lowerLine: "福满人间万象新",
 *     horizontalScroll: "春满人间",
 *     zodiac: "🐍 蛇年",
 *     wordCount: 7,
 *     style: "传统典雅",
 *     theme: "万事如意",
 *     mood: "庄重",
 *     explanation: "这是一副...",
 *     imageUrl: "https://...",
 *     artStyle: "traditional-ink",
 *     layout: "vertical",
 *     colorScheme: "classic-red-gold",
 *     decorationStyle: "rich-ornate",
 *     backgroundStyle: "pattern-clouds"
 *   });
 * };
 * ```
 */
export function useMintCouplet() {
    const { address } = useAccount();
    const { writeContractAsync } = useWriteContract();

    return useMutation({
        mutationFn: async (info: MintCoupletInfo): Promise<MintCoupletResult> => {
            // 1. 验证用户已连接钱包
            if (!address) {
                throw new Error("请先连接钱包！");
            }

            // 2. 验证必填字段
            if (!info.upperLine || !info.lowerLine || !info.horizontalScroll) {
                throw new Error("春联内容不能为空！");
            }

            if (![5, 7, 9].includes(info.wordCount)) {
                throw new Error("字数必须为 5、7 或 9！");
            }

            if (!info.imageUrl) {
                throw new Error("请先生成春联图片！");
            }

            // 3. 上传图片到 IPFS（通过后端服务）
            console.log("开始上传图片到 IPFS...");
            let ipfsUrl: string;
            
            try {
                // 从 imageUrl 获取图片数据
                const imageResponse = await fetch(info.imageUrl);
                if (!imageResponse.ok) {
                    throw new Error("获取图片失败");
                }
                
                const imageBlob = await imageResponse.blob();
                
                // 使用 FormData 上传文件到后端 Pinata 服务
                const formData = new FormData();
                formData.append("image", imageBlob, `couplet_${Date.now()}.jpg`);

                const response = await fetch(`${CONSTANTS.BACKEND_URL}/pinata/upload`, {
                    method: "POST",
                    body: formData,
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.error || "Upload failed");
                }

                const result = await response.json();
                const ipfsHash = result.ipfsHash;
                
                // 构建 IPFS URL
                ipfsUrl = `ipfs://${ipfsHash}`;
                console.log(`图片已上传到 IPFS: ${ipfsUrl}`);
                
            } catch (error) {
                console.error("上传图片到 IPFS 失败:", error);
                throw new Error("图片上传到 IPFS 失败，请稍后重试");
            }

            // 4. 准备合约调用参数（根据最新合约只需要 4 个参数）
            const args = [
                info.upperLine,
                info.lowerLine,
                info.horizontalScroll,
                ipfsUrl,  // 使用 IPFS URL
            ] as const;

            // 5. 调用合约铸造 NFT
            // 注意：需要支付 mintFee，这里使用固定值 0 ether（当前合约默认免费）
            const mintFee = BigInt("0"); // 免费铸造

            const transactionHash = await writeContractAsync({
                address: contractConfig.address as `0x${string}`,
                abi: contractConfig.abi,
                functionName: "mintCouplet",
                args,
                value: mintFee,
            });

            return {
                transactionHash,
            };
        },
        onError: (error) => {
            console.error("铸造春联 NFT 失败:", error);
            
            // 处理常见错误
            if (error.message.includes("Insufficient mint fee")) {
                throw new Error("铸造费用不足！");
            } else if (error.message.includes("User rejected")) {
                throw new Error("用户取消了交易");
            } else {
                throw error;
            }
        },
        onSuccess: (data) => {
            console.log("成功铸造春联 NFT:", data);
        },
    });
}

/**
 * 查询铸造费用的 Hook（可选实现）
 * 
 * @example
 * ```tsx
 * const { data: mintFee } = useReadContract({
 *   address: contractConfig.address as `0x${string}`,
 *   abi: contractConfig.abi,
 *   functionName: "mintFee",
 * });
 * ```
 */
