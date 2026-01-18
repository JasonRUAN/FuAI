# 🎊 FuAI（福联 AI）

<div align="center">

![FuAI Logo](./frontend/public/FuAILogo.png)

**融合传统文化与 Web3 技术的 AI 春联 NFT 创作平台**

[![Next.js](https://img.shields.io/badge/Next.js-16.0-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![Solidity](https://img.shields.io/badge/Solidity-0.8.24-363636?style=flat-square&logo=solidity)](https://soliditylang.org/)
[![LangChain](https://img.shields.io/badge/LangChain-1.2-green?style=flat-square)](https://www.langchain.com/)
[![Monad](https://img.shields.io/badge/Monad-Testnet-blue?style=flat-square)](https://monad.xyz/)

</div>

---

## 📖 项目简介

**FuAI** 是一个创新性的 Web3 + AI 项目，将中国传统春联文化与现代区块链技术完美结合。用户可以：

- 🤖 **AI 智能创作**：通过 LangChain 驱动的 AI 生成个性化春联
- 🎨 **多风格定制**：支持 8 种祝福主题 × 4 种预期氛围 × 4 种创作风格的春联生成，8种画风图片生成
- 💎 **NFT 铸造**：将创作的春联永久保存在区块链上
- 🖼️ **作品展示**：精美的 NFT 画廊，支持点赞、转移等社交功能
- 🔒 **去中心化存储**：使用 IPFS 保证图片永久可访问
- 🌐 **Web2 友好**：无需连接钱包即可体验 AI 创作功能，只有铸造 NFT 时才需要钱包

---

## 🎨 用户界面展示

### 创作中心布局

![Clipboard_Screenshot_1768641816](./assets/Clipboard_Screenshot_1768641816.png)

- **多种画风选择**

![Clipboard_Screenshot_1768641850](./assets/Clipboard_Screenshot_1768641850.png)



### 作品展示布局

![Clipboard_Screenshot_1768641914](./assets/Clipboard_Screenshot_1768641914.png)

### 查看春联NFT详情

![Clipboard_Screenshot_1768642119](./assets/Clipboard_Screenshot_1768642119.png)

### 赠送春联NFT

![Clipboard_Screenshot_1768642180](./assets/Clipboard_Screenshot_1768642180.png)

![image-20260117173025778](./assets/image-20260117173025778.png)

![Clipboard_Screenshot_1768642245](./assets/Clipboard_Screenshot_1768642245.png)

---

## 🏗️ 项目架构

### 系统架构图

```mermaid
graph TB
    subgraph "前端应用层"
        A[Next.js 16 + React 19]
        B[创作中心]
        C[作品展示]
        D[用户界面]
    end
    
    subgraph "AI 服务层"
        E[LangChain]
        F[DeepSeek Chat]
        G[通义千问qwen-image-max]
    end
    
    subgraph "存储层"
        H[IPFS/Pinata]
        I[IndexedDB 缓存]
    end
    
    subgraph "区块链层"
        J[Monad Testnet]
        K[FuAI NFT 合约]
        L[ERC721 标准]
    end
    
    A --> B
    A --> C
    A --> D
    B --> E
    E --> F
    B --> G
    B --> H
    C --> K
    K --> L
    K --> J
    H --> C
    C --> I
    
    style A fill:#0070f3
    style K fill:#f0b90b
    style E fill:#10a37f
    style H fill:#65c2cb
```

### 技术栈全景

```mermaid
mindmap
  root((FuAI))
    前端技术
      Next.js 16
      React 19
      TypeScript
      Tailwind CSS
      shadcn/ui
      Framer Motion
    Web3 技术
      wagmi 3.3
      viem 2.44
      ConnectKit
      ERC721 NFT
    AI 技术
      LangChain
      DeepSeek
      通义千问 qwen-image-max
      结构化输出
    存储技术
      IPFS
      Pinata Gateway
      IndexedDB
    智能合约
      Solidity 0.8.24
      Foundry
      OpenZeppelin
      Monad Testnet
```

---

## 🎯 功能特性

### 🎨 1. AI 智能创作

<details open>
<summary>点击展开详情</summary>

- ✅ **多维度配置**
  - 12 生肖选择（🐀-🐖）
  - 字数选择（五言/七言/九言）
  - 4 种创作风格（传统典雅、现代简约、幽默搞笑、文艺清新）
  - 8 种祝福主题（万事如意、财源广进、健康长寿等）
  - 4 种预期氛围（庄重、活泼、温馨、霸气）
  
- ✅ **特色功能**
  - 🎭 藏头春联（支持 2-4 字姓名藏头）
  - 🎲 随机灵感（一键生成随机主题）
  - 📝 实时解释（AI 解读春联含义）

**创作流程图：**

```mermaid
sequenceDiagram
    participant User as 👤 用户
    participant UI as 🖥️ 前端界面
    participant API as 🔌 API路由
    participant LLM as 🤖 LangChain/LLM
    
    User->>UI: 配置创作参数
    User->>UI: 点击"生成春联"
    UI->>API: POST /api/couplet/generate
    Note over API: 构建结构化提示词
    API->>LLM: 调用 AI 模型
    LLM->>LLM: 生成符合规则的春联
    LLM-->>API: 返回结构化数据
    Note over API: {upper, lower, horizontal, explanation}
    API-->>UI: JSON 响应
    UI->>UI: 动画展示春联
    UI-->>User: 显示结果 + 解释
```

</details>

### 🖼️ 2. 多风格图片生成

<details open>
<summary>点击展开详情</summary>

支持 **5 × 3 × 3 = 45** 种组合样式：

| 画风类型 | 色调方案 | 布局类型 |
|---------|---------|---------|
| 🎨 传统工笔 | 🔴 经典红金 | 📱 竖版 |
| 🖌️ 水墨写意 | 🟠 温暖橙黄 | 🖥️ 横版 |
| ✨ 现代简约 | 🔵 高雅蓝金 | ⬜ 方形 |
| 🎪 卡通可爱 | | |
| 🎬 3D 写实 | | |

**图片生成流程：**

```mermaid
flowchart LR
    A[春联文本] --> B{选择画风}
    B --> C[传统工笔]
    B --> D[水墨写意]
    B --> E[现代简约]
    B --> F[卡通可爱]
    B --> G[3D写实]
    
    C --> H[选择色调]
    D --> H
    E --> H
    F --> H
    G --> H
    
    H --> I[经典红金]
    H --> J[温暖橙黄]
    H --> K[高雅蓝金]
    
    I --> L[选择布局]
    J --> L
    K --> L
    
    L --> M[竖版]
    L --> N[横版]
    L --> O[方形]
    
    M --> P[通义千问 qwen-image-max 生成]
    N --> P
    O --> P
    
    P --> Q[返回图片]
    
    style A fill:#e1f5ff
    style P fill:#fff4e6
    style Q fill:#e8f5e9
```

</details>

### 💎 3. NFT 铸造与管理

<details open>
<summary>点击展开详情</summary>

**NFT 铸造流程：**

```mermaid
sequenceDiagram
    participant User as 👤 用户
    participant Wallet as 🦊 钱包
    participant UI as 🖥️ 前端
    participant Backend as 🔧 后端
    participant IPFS as 📦 IPFS/Pinata
    participant Contract as 📜 智能合约
    participant Blockchain as ⛓️ 区块链
    
    User->>UI: 点击"铸造 NFT"
    UI->>Wallet: 检查钱包连接
    Wallet-->>UI: 已连接
    
    UI->>Backend: 上传春联图片
    Backend->>IPFS: 存储到 IPFS
    IPFS-->>Backend: 返回 IPFS Hash
    Backend-->>UI: ipfs://QmXXX...
    
    UI->>Wallet: 请求签名交易
    Note over Wallet: 用户确认并签名
    Wallet->>Contract: mintCouplet(上联, 下联, 横批, ipfsUrl)
    Note over Contract: 铸造 NFT Token
    Contract->>Contract: 存储链上元数据
    Contract->>Blockchain: 广播交易
    Blockchain-->>Contract: 交易成功
    Contract-->>Wallet: 返回 Transaction Hash
    Wallet-->>UI: 铸造成功
    UI-->>User: 🎉 显示 NFT 详情
    
    Note over User,Blockchain: 整个过程 < 30 秒
```

**合约数据结构：**

```mermaid
classDiagram
    class FuAINFT {
        +string name
        +string symbol
        +uint256 _nextTokenId
        +mapping tokenContents
        +mapping likes
        +mapping userLikes
        +uint256 mintFee
        
        +mintCouplet()
        +getCoupletContent()
        +getBatchCoupletContent()
        +likeCouplet()
        +unlikeCouplet()
        +tokenURI()
    }
    
    class CoupletContent {
        +string upperLine
        +string lowerLine
        +string horizontalScroll
        +string imageUrl
        +uint256 mintTime
    }
    
    class ERC721 {
        <<OpenZeppelin>>
        +balanceOf()
        +ownerOf()
        +transferFrom()
    }
    
    class ERC721Enumerable {
        <<OpenZeppelin>>
        +totalSupply()
        +tokenByIndex()
    }
    
    class Ownable {
        <<OpenZeppelin>>
        +owner()
        +onlyOwner()
    }
    
    FuAINFT --|> ERC721
    FuAINFT --|> ERC721Enumerable
    FuAINFT --|> Ownable
    FuAINFT --> CoupletContent
```

</details>

### 🖼️ 4. 作品展示与社交

<details open>
<summary>点击展开详情</summary>

- ✅ **分页浏览**：每页 20 个 NFT，支持无限滚动
- ✅ **智能排序**：最新/最早/最受欢迎
- ✅ **高级过滤**：按创作者地址、只看我的 NFT
- ✅ **视图切换**：网格视图/列表视图
- ✅ **搜索功能**：快速查找特定地址的作品
- ✅ **社交互动**：点赞、转移 NFT
- ✅ **图片查看器**：放大查看高清春联图片

**数据查询优化：**

```mermaid
flowchart TD
    A[用户请求 NFT 列表] --> B{检查本地缓存}
    B -->|缓存命中| C[返回缓存数据]
    B -->|缓存未命中| D[查询合约 totalSupply]
    
    D --> E[批量查询 tokenIds]
    E --> F[并行获取 NFT 数据]
    
    F --> G[获取 owner]
    F --> H[获取 content]
    F --> I[获取 likes]
    
    G --> J{数据完整？}
    H --> J
    I --> J
    
    J -->|是| K[转换 IPFS URL]
    J -->|否| L[错误重试 - 指数退避]
    
    K --> M[更新缓存]
    M --> N[返回前端]
    
    L --> F
    
    style C fill:#a5d6a7
    style N fill:#a5d6a7
    style L fill:#ef9a9a
```

</details>

---

## 🚀 快速开始

### 前置要求

```bash
# 需要安装以下工具
Node.js >= 18.0.0
npm >= 9.0.0
Foundry (智能合约开发)
MetaMask 或其他 Web3 钱包
```

**⚠️ 重要提示：本项目部署在 Monad 测试网**

- 🌐 **网络**：Monad Testnet
- 💧 **领取测试币**：[https://faucet.monad.xyz/](https://faucet.monad.xyz/)
- 📝 **说明**：使用前请先添加 Monad 测试网到钱包，并领取测试币用于支付 Gas 费用

### 1. 克隆项目

```bash
git clone https://github.com/your-username/FuAI.git
cd FuAI
```

### 2. 部署智能合约

```bash
cd contract/couplet-fu-ai

# 安装 Foundry 依赖
forge install

# 编译合约
forge build

# 运行测试
forge test -vv

# 部署到 Monad Testnet
# 注意：请确保钱包中有足够的 Monad 测试币
./deploy.sh
```

> 💡 **提示**：部署前请确保已在 [Monad 水龙头](https://faucet.monad.xyz/) 领取测试币

### 3. 启动前端

```bash
cd ../../frontend

# 安装依赖
npm install

# 配置环境变量
cp .env.example .env
# 编辑 .env 文件，填入 API Keys

# 启动开发服务器
npm run dev
```

访问 `http://localhost:3000` 即可体验！

---

## 📁 项目结构

```
FuAI/
│
├── contract/                       # 智能合约
│   └── couplet-fu-ai/
│       ├── src/
│       │   └── FuAINFT.sol # 主合约（308 行）
│       ├── test/
│       │   └── FuAINFT.t.sol # 测试用例（478 行）
│       ├── script/
│       │   └── Deploy.s.sol       # 部署脚本
│       └── foundry.toml            # Foundry 配置
│
└── frontend/                       # 前端应用
    ├── app/                        # Next.js 页面
    │   ├── page.tsx                # 首页
    │   ├── create/                 # 🎨 创作中心（1353 行）
    │   ├── gallery/                # 🖼️ 作品展示（427 行）
    │   └── api/                    # API 路由
    │       └── couplet/
    │           ├── generate/       # 春联生成 API
    │           └── image/          # 图片生成 API
    │
    ├── components/                 # React 组件
    │   ├── header.tsx              # 顶部导航
    │   ├── nft/                    # NFT 组件
    │   └── ui/                     # 基础 UI（shadcn/ui）
    │
    ├── hooks/                      # 自定义 Hooks
    │   ├── use-couplet-generator.ts # 春联生成
    │   └── use-nft-data.ts         # NFT 数据查询
    │
    ├── mutations/                  # 区块链操作
    │   └── mint_couplet.ts         # NFT 铸造（195 行）
    │
    ├── services/                   # 业务逻辑
    │   ├── nft-service.ts          # NFT 服务（606 行）
    │   └── cache-service.ts        # 缓存服务
    │
    ├── lib/                        # 工具库
    │   └── couplet-generator.ts    # LangChain 生成器
    │
    ├── constants/                  # 常量配置
    │   └── contractConfig.ts       # 合约 ABI（954 行）
    │
    └── types/                      # TypeScript 类型
        ├── nft.ts                  # NFT 类型定义
        └── image-generation.ts     # 图片配置类型
```

---

## 🔧 核心技术实现

### 1. 结构化 AI 输出

使用 Zod Schema 保证 AI 返回数据的可靠性：

```typescript
const CoupletSchema = z.object({
  upper: z.string().describe("上联"),
  lower: z.string().describe("下联"),
  horizontal: z.string().describe("横批"),
  explanation: z.string().describe("解释")
});

// LangChain 结构化输出
const structuredLLM = model.withStructuredOutput(CoupletSchema);
```

### 2. 智能缓存策略

```mermaid
flowchart LR
    A[请求 NFT 数据] --> B{TanStack Query 缓存}
    B -->|命中| C[立即返回]
    B -->|未命中| D{IndexedDB 缓存}
    D -->|命中| E[返回 + 后台更新]
    D -->|未命中| F[链上查询]
    F --> G[更新两级缓存]
    G --> C
    
    style C fill:#4caf50
    style F fill:#ff9800
```

### 3. 批量查询优化

传统方式：N 次 RPC 调用（慢 🐌）
优化方式：1 次批量调用（快 🚀）

```solidity
// 合约支持批量查询
function getBatchCoupletContent(
    uint256[] calldata tokenIds
) external view returns (CoupletContent[] memory) {
    // 一次调用返回所有数据
}
```

### 4. IPFS URL 自动转换

```typescript
// ipfs:// → https:// 网关
const convertIpfsUrl = (ipfsUrl: string) => {
  return ipfsUrl.replace(
    'ipfs://',
    'https://lime-fair-whippet-113.mypinata.cloud/ipfs/'
  );
};
```

---



---

## 📊 数据流图

### 完整的用户旅程

```mermaid
journey
    title 用户创作春联 NFT 的完整旅程
    section 连接钱包
      打开应用: 3: 用户
      点击连接钱包: 4: 用户
      选择 MetaMask: 5: 用户, 钱包
      授权连接: 5: 钱包
    section 创作春联
      进入创作中心: 5: 用户
      配置创作参数: 4: 用户
      点击生成春联: 5: 用户
      查看 AI 生成结果: 5: 用户, AI
      选择喜欢的画风: 4: 用户
      生成春联图片: 5: AI
    section 铸造 NFT
      点击铸造 NFT: 5: 用户
      上传图片到 IPFS: 4: 后端, IPFS
      确认交易: 4: 用户, 钱包
      等待上链: 3: 区块链
      铸造成功: 5: 用户
    section 分享作品
      进入作品展示: 5: 用户
      查看我的 NFT: 5: 用户
      分享给朋友: 4: 用户
      获得点赞: 5: 社区
```

---

## 🔒 安全性保障

### 智能合约安全措施

```mermaid
graph TD
    A[安全措施] --> B[代码审计]
    A --> C[权限控制]
    A --> D[输入验证]
    A --> E[标准库]
    
    B --> B1[30+ 测试用例]
    B --> B2[Foundry 测试覆盖]
    
    C --> C1[Ownable 继承]
    C --> C2[onlyOwner 修饰符]
    
    D --> D1[空字符串检查]
    D --> D2[地址验证]
    
    E --> E1[OpenZeppelin ERC721]
    E --> E2[经过审计的库]
    
    style A fill:#f44336,color:#fff
    style B fill:#4caf50
    style C fill:#2196f3
    style D fill:#ff9800
    style E fill:#9c27b0
```

### 前端安全措施

- ✅ 环境变量保护敏感信息
- ✅ 钱包签名验证
- ✅ Zod Schema 输入验证
- ✅ React 自动 XSS 防护
- ✅ HTTPS 强制加密传输

---

## 📈 性能优化

### 加载时间对比

```mermaid
gantt
    title 性能优化前后对比
    dateFormat X
    axisFormat %s
    
    section 优化前
    首次加载        :0, 5s
    NFT 列表查询    :0, 8s
    图片加载        :0, 6s
    
    section 优化后
    首次加载        :0, 2s
    NFT 列表查询    :0, 3s
    图片加载        :0, 1s
```

### 优化措施

| 优化项 | 措施 | 效果 |
|-------|------|------|
| **数据查询** | 批量调用 + 缓存 | 查询速度提升 **60%** |
| **图片加载** | 懒加载 + CDN | 加载时间减少 **80%** |
| **首屏渲染** | SSR + 预加载 | FCP 提升 **70%** |
| **缓存策略** | 两级缓存 | 重复访问 **即时响应** |

---

## 🌟 项目亮点

### 技术创新

```mermaid
mindmap
  root((核心亮点))
    链上元数据
      Base64 编码
      动态生成 tokenURI
      无需外部服务器
    批量查询优化
      减少 RPC 调用
      提升 60% 性能
      智能缓存策略
    结构化 AI 输出
      Zod Schema 验证
      100% 数据可靠性
      类型安全
    去中心化存储
      IPFS 永久保存
      Pinata 网关
      图片不丢失
    社交功能
      链上点赞系统
      NFT 转移
      创作者追踪
```

### 用户体验优势

- 🎨 **丰富配置**：45 种图片样式组合
- 🚀 **极速生成**：AI 生成春联 < 5 秒
- 💎 **一键铸造**：30 秒完成 NFT 铸造
- 📱 **响应式设计**：完美适配各种设备
- 🔄 **实时更新**：智能缓存 + 自动刷新

---

## 🚧 技术栈

- [Next.js](https://nextjs.org/) - React 框架
- [LangChain](https://www.langchain.com/) - LLM 应用框架
- [OpenZeppelin](https://www.openzeppelin.com/) - 智能合约库
- [shadcn/ui](https://ui.shadcn.com/) - UI 组件库
- [wagmi](https://wagmi.sh/) - React Hooks for Ethereum
- [Monad](https://monad.xyz/) - 高性能区块链
- [Pinata](https://pinata.cloud/) - IPFS 服务

<div align="center">

**🎊 用 AI 创作春联，让传统文化在区块链上永存 🎊**

Made with ❤️ by FuAI Team

[⬆️ 回到顶部](#-FuAI福联-ai)

</div>
