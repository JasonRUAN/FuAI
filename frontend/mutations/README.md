# Mutations 使用文档

## mint_couplet.ts - 铸造春联 NFT

### 基本用法

```tsx
import { useMintCouplet } from "@/mutations/mint_couplet";

function CoupletMintButton() {
  const { mutate: mintCouplet, isPending, isSuccess, error } = useMintCouplet();

  const handleMint = () => {
    mintCouplet({
      // 春联内容
      upperLine: "春回大地百花艳",
      lowerLine: "福满人间万象新",
      horizontalScroll: "春满人间",
      
      // 创作配置
      zodiac: "🐍 蛇年",
      wordCount: 7,
      style: "传统典雅",
      theme: "万事如意",
      mood: "庄重",
      
      // AI 解释和图片
      explanation: "这是一副传统风格的春联...",
      imageUrl: "https://example.com/couplet.jpg",
      
      // 图片生成配置
      artStyle: "traditional-ink",
      layout: "vertical",
      colorScheme: "classic-red-gold",
      decorationStyle: "rich-ornate",
      backgroundStyle: "pattern-clouds",
    });
  };

  return (
    <button onClick={handleMint} disabled={isPending}>
      {isPending ? "铸造中..." : "铸造为 NFT"}
    </button>
  );
}
```

### 完整示例（带错误处理和成功提示）

```tsx
import { useMintCouplet } from "@/mutations/mint_couplet";
import { toast } from "sonner";

function CoupletCreator() {
  const { mutate: mintCouplet, isPending } = useMintCouplet();

  const handleMint = async () => {
    try {
      const result = await mintCouplet({
        upperLine: "龙腾瑞气迎新岁",
        lowerLine: "蛇舞祥云贺太平",
        horizontalScroll: "吉祥如意",
        zodiac: "🐍 蛇年",
        wordCount: 7,
        style: "传统典雅",
        theme: "万事如意",
        mood: "庄重",
        hiddenName: "张三",
        explanation: "这是一副迎接蛇年的吉祥春联...",
        imageUrl: "https://example.com/image.jpg",
        artStyle: "traditional-gongbi",
        layout: "vertical",
        colorScheme: "classic-red-gold",
        decorationStyle: "rich-ornate",
        backgroundStyle: "pattern-clouds",
      });

      toast.success(`铸造成功！交易哈希: ${result.transactionHash}`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "铸造失败");
    }
  };

  return (
    <button 
      onClick={handleMint} 
      disabled={isPending}
      className="bg-red-600 text-white px-6 py-2 rounded"
    >
      {isPending ? "铸造中..." : "铸造为 NFT 🪙"}
    </button>
  );
}
```

### 在 create/page.tsx 中集成

```tsx
import { useMintCouplet } from "@/mutations/mint_couplet";

function CreatePage() {
  // ... 其他状态
  const [generatedCouplet, setGeneratedCouplet] = useState(null);
  const [imageUrl, setImageUrl] = useState("");
  const [selectedConfig, setSelectedConfig] = useState({
    zodiac: "🐍 蛇年",
    wordCount: 7,
    style: "traditional",
    theme: "general",
    tone: "solemn",
    artStyle: "traditional-ink",
    layout: "vertical",
    colorScheme: "classic-red-gold",
    decoration: "rich-ornate",
    background: "pattern-clouds",
  });

  const { mutate: mintCouplet, isPending: isMinting } = useMintCouplet();

  const handleMint = () => {
    if (!generatedCouplet || !imageUrl) {
      toast.error("请先生成春联和图片！");
      return;
    }

    mintCouplet({
      upperLine: generatedCouplet.upper,
      lowerLine: generatedCouplet.lower,
      horizontalScroll: generatedCouplet.horizontal,
      zodiac: selectedConfig.zodiac,
      wordCount: selectedConfig.wordCount,
      style: getStyleLabel(selectedConfig.style),
      theme: getThemeLabel(selectedConfig.theme),
      mood: getToneLabel(selectedConfig.tone),
      explanation: generatedCouplet.explanation,
      imageUrl: imageUrl,
      artStyle: selectedConfig.artStyle,
      layout: selectedConfig.layout,
      colorScheme: selectedConfig.colorScheme,
      decorationStyle: selectedConfig.decoration,
      backgroundStyle: selectedConfig.background,
    });
  };

  return (
    <div>
      {/* ... 其他 UI */}
      
      {generatedCouplet && imageUrl && (
        <Button
          onClick={handleMint}
          disabled={isMinting}
          className="w-full"
        >
          <Coins className="mr-2 h-4 w-4" />
          {isMinting ? "铸造中..." : "铸造为 NFT"}
        </Button>
      )}
    </div>
  );
}
```

### 类型定义

```typescript
interface MintCoupletInfo {
  // 春联内容（必填）
  upperLine: string;
  lowerLine: string;
  horizontalScroll: string;
  
  // 创作配置（必填）
  zodiac: string;
  wordCount: 5 | 7 | 9;
  style: string;
  theme: string;
  mood: string;
  
  // 可选配置
  hiddenName?: string;
  explanation: string;
  imageUrl: string;
  
  // 图片生成配置（必填）
  artStyle: ArtStyle;
  layout: LayoutType;
  colorScheme: ColorScheme;
  decorationStyle: DecorationStyle;
  backgroundStyle: BackgroundStyle;
}

interface MintCoupletResult {
  transactionHash: string;
  tokenId?: string;
}
```

### 合约配置

合约地址和 ABI 已在 `@/constants/contract.ts` 中配置：

```typescript
export const FU_AI_COUPLET_NFT_ADDRESS = "0x383bedCBA3f9BdDB7C5c8f4CE0346AE4e0bB9923";
export const fuAICoupletNFTContractConfig = {
  address: FU_AI_COUPLET_NFT_ADDRESS,
  abi: FU_AI_COUPLET_NFT_ABI,
};
```

### 注意事项

1. **铸造费用**：当前默认使用 0.001 ether 作为铸造费用，如需动态查询，可以使用：
   ```tsx
   import { useReadContract } from "wagmi";
   
   const { data: mintFee } = useReadContract({
     address: fuAICoupletNFTContractConfig.address,
     abi: fuAICoupletNFTContractConfig.abi,
     functionName: "mintFee",
   });
   ```

2. **钱包连接**：确保用户已连接钱包，可以使用：
   ```tsx
   import { useAccount } from "wagmi";
   
   const { address, isConnected } = useAccount();
   
   if (!isConnected) {
     return <ConnectButton />;
   }
   ```

3. **交易确认**：铸造交易需要用户在钱包中确认，用户可能会取消交易。

4. **错误处理**：常见错误包括：
   - "请先连接钱包！" - 用户未连接钱包
   - "春联内容不能为空！" - 必填字段缺失
   - "请先生成春联图片！" - imageUrl 为空
   - "铸造费用不足！" - 合约返回的错误
   - "用户取消了交易" - 用户在钱包中拒绝交易

### 下一步

铸造成功后，可以：
1. 跳转到 NFT 详情页
2. 分享到社交媒体
3. 下载 NFT 图片
4. 查看用户的 NFT 收藏
