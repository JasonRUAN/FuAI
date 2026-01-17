/**
 * NFT数据获取相关的React Hooks
 */

import { useQuery, useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAccount } from 'wagmi';
import { nftService } from '@/services/nft-service';
import { 
  PaginationParams, 
  NFTData, 
  TransferParams,
  PaginatedNFTResult 
} from '@/types/nft';

// 查询键工厂
const queryKeys = {
  all: ['nft'] as const,
  lists: () => [...queryKeys.all, 'list'] as const,
  list: (params: PaginationParams) => [...queryKeys.lists(), params] as const,
  details: () => [...queryKeys.all, 'detail'] as const,
  detail: (tokenId: string) => [...queryKeys.details(), tokenId] as const,
  totalSupply: () => [...queryKeys.all, 'totalSupply'] as const,
};

/**
 * 获取NFT总数量
 */
export function useTotalSupply() {
  return useQuery({
    queryKey: queryKeys.totalSupply(),
    queryFn: async () => {
      console.log('Hook: 开始获取totalSupply...');
      const result = await nftService.getTotalSupply();
      console.log('Hook: totalSupply结果:', result);
      return result;
    },
    staleTime: 5 * 60 * 1000, // 5分钟内不重新获取
    gcTime: 10 * 60 * 1000,   // 10分钟后清理缓存
  });
}

/**
 * 分页获取NFT列表
 */
export function useNFTList(params: PaginationParams) {
  const { address } = useAccount();
  
  const query = useQuery({
    queryKey: queryKeys.list(params),
    queryFn: async () => {
      console.log('Hook: 开始分页获取NFT列表...', params);
      console.log('Hook: 用户地址:', address);
      const result = await nftService.getNFTsPaginated(params, address);
      console.log('Hook: 分页获取结果:', result);
      return result;
    },
    staleTime: 2 * 60 * 1000, // 2分钟内不重新获取
    gcTime: 5 * 60 * 1000,    // 5分钟后清理缓存
    enabled: true,
    retry: 1, // 减少重试次数
    refetchOnWindowFocus: false, // 禁用窗口焦点重新获取
  });

  // 添加查询状态调试
  console.log('Hook: useNFTList状态 - isLoading:', query.isLoading, 'isFetching:', query.isFetching, 'isSuccess:', query.isSuccess, 'data:', !!query.data);

  return query;
}

/**
 * 无限滚动获取NFT列表
 */
export function useInfiniteNFTList(baseParams: Omit<PaginationParams, 'page'>) {
  const { address } = useAccount();
  
  return useInfiniteQuery({
    queryKey: [...queryKeys.lists(), 'infinite', baseParams],
    queryFn: ({ pageParam = 1 }) => {
      const params: PaginationParams = { ...baseParams, page: pageParam };
      return nftService.getNFTsPaginated(params, address);
    },
    getNextPageParam: (lastPage: PaginatedNFTResult) => {
      return lastPage.pagination.hasNext ? lastPage.pagination.page + 1 : undefined;
    },
    initialPageParam: 1,
    staleTime: 2 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
  });
}

/**
 * 获取单个NFT详情
 */
export function useNFTDetail(tokenId: string | undefined) {
  const { address } = useAccount();
  
  return useQuery({
    queryKey: queryKeys.detail(tokenId || ''),
    queryFn: () => nftService.getNFT(tokenId!, address),
    enabled: !!tokenId,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}

/**
 * 批量获取NFT数据
 */
export function useNFTBatch(tokenIds: string[]) {
  const { address } = useAccount();
  
  return useQuery({
    queryKey: [...queryKeys.details(), 'batch', tokenIds.sort()],
    queryFn: () => nftService.getNFTsBatch(tokenIds, address),
    enabled: tokenIds.length > 0,
    staleTime: 2 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
  });
}

/**
 * NFT转移
 */
export function useTransferNFT() {
  const queryClient = useQueryClient();
  const { address } = useAccount();
  
  return useMutation({
    mutationFn: (params: TransferParams) => {
      if (!address) {
        throw new Error('Wallet not connected');
      }
      return nftService.transferNFT(params, address);
    },
    onSuccess: (_, variables) => {
      // 清除相关缓存
      queryClient.invalidateQueries({ queryKey: queryKeys.detail(variables.tokenId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.lists() });
    },
  });
}

/**
 * NFT点赞
 */
export function useLikeNFT() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (tokenId: string) => nftService.likeNFT(tokenId),
    onSuccess: (_, tokenId) => {
      // 更新缓存中的点赞状态
      queryClient.invalidateQueries({ queryKey: queryKeys.detail(tokenId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.lists() });
    },
  });
}

/**
 * NFT取消点赞
 */
export function useUnlikeNFT() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (tokenId: string) => nftService.unlikeNFT(tokenId),
    onSuccess: (_, tokenId) => {
      // 更新缓存中的点赞状态
      queryClient.invalidateQueries({ queryKey: queryKeys.detail(tokenId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.lists() });
    },
  });
}

/**
 * 预加载下一页数据
 */
export function usePreloadNextPage() {
  const { address } = useAccount();
  const queryClient = useQueryClient();
  
  return (currentPage: number, limit: number) => {
    const nextPage = currentPage + 1;
    const params: PaginationParams = { page: nextPage, limit };
    
    // 检查是否已经缓存
    const queryKey = queryKeys.list(params);
    const existingData = queryClient.getQueryData(queryKey);
    
    if (!existingData) {
      // 预取下一页数据
      queryClient.prefetchQuery({
        queryKey,
        queryFn: () => nftService.getNFTsPaginated(params, address),
        staleTime: 2 * 60 * 1000,
      });
    }
  };
}

/**
 * NFT数据刷新
 */
export function useRefreshNFTData() {
  const queryClient = useQueryClient();
  
  return {
    refreshAll: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.all });
    },
    refreshList: (params?: PaginationParams) => {
      if (params) {
        queryClient.invalidateQueries({ queryKey: queryKeys.list(params) });
      } else {
        queryClient.invalidateQueries({ queryKey: queryKeys.lists() });
      }
    },
    refreshDetail: (tokenId: string) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.detail(tokenId) });
    },
    refreshTotalSupply: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.totalSupply() });
    }
  };
}

/**
 * 缓存统计信息
 */
export function useCacheStats() {
  return useQuery({
    queryKey: ['cache', 'stats'],
    queryFn: async () => {
      const { cacheService } = await import('@/services/cache-service');
      return cacheService.getStats();
    },
    refetchInterval: 30 * 1000, // 每30秒更新一次
  });
}

/**
 * 清理缓存
 */
export function useClearCache() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async () => {
      const { cacheService } = await import('@/services/cache-service');
      await cacheService.clear();
      queryClient.clear();
    },
  });
}

/**
 * 自动清理过期缓存
 */
export function useAutoClearExpiredCache() {
  return useQuery({
    queryKey: ['cache', 'cleanup'],
    queryFn: async () => {
      const { cacheService } = await import('@/services/cache-service');
      await cacheService.clearExpired();
      return Date.now();
    },
    refetchInterval: 10 * 60 * 1000, // 每10分钟清理一次
    enabled: typeof window !== 'undefined',
  });
}