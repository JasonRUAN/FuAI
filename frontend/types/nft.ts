/**
 * NFT相关类型定义
 */

// 春联内容结构（与智能合约对应）
export interface CoupletContent {
  upperLine: string;       // 上联
  lowerLine: string;       // 下联
  horizontalScroll: string; // 横批
  imageUrl: string;        // IPFS图片URL
  mintTime: bigint;        // 铸造时间戳
}

// NFT完整数据结构
export interface NFTData {
  tokenId: string;
  owner: string;
  content: CoupletContent;
  likeCount: number;
  isLikedByUser: boolean;
  metadata?: NFTMetadata;
}

// NFT元数据结构
export interface NFTMetadata {
  name: string;
  description: string;
  image: string;
  attributes: Array<{
    trait_type: string;
    value: string;
    display_type?: string;
  }>;
}

// 分页查询参数
export interface PaginationParams {
  page: number;
  limit: number;
  sortBy?: 'newest' | 'oldest' | 'mostLiked';
  filterBy?: {
    owner?: string;
    style?: string;
    theme?: string;
  };
}

// 分页查询结果
export interface PaginatedNFTResult {
  data: NFTData[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

// NFT转移参数
export interface TransferParams {
  tokenId: string;
  to: string;
  from?: string;
}

// 缓存数据结构
export interface CachedNFTData {
  data: NFTData;
  timestamp: number;
  expiry: number;
}

// 批量查询结果
export interface BatchQueryResult {
  success: NFTData[];
  failed: string[];
}

// 错误类型
export enum NFTErrorType {
  NETWORK_ERROR = 'NETWORK_ERROR',
  CONTRACT_ERROR = 'CONTRACT_ERROR',
  INVALID_TOKEN_ID = 'INVALID_TOKEN_ID',
  INSUFFICIENT_PERMISSIONS = 'INSUFFICIENT_PERMISSIONS',
  CACHE_ERROR = 'CACHE_ERROR',
  UNKNOWN_ERROR = 'UNKNOWN_ERROR'
}

export interface NFTError {
  type: NFTErrorType;
  message: string;
  tokenId?: string;
  originalError?: Error;
}