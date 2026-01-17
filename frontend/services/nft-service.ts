/**
 * NFT数据获取服务
 * 处理智能合约交互、数据转换和缓存管理
 */

import { readContract, readContracts, writeContract, waitForTransactionReceipt } from 'wagmi/actions';
import { config } from '@/providers/Web3Provider';
import { contractConfig } from '@/constants/contractConfig';
import { 
  NFTData, 
  CoupletContent, 
  PaginatedNFTResult, 
  PaginationParams, 
  TransferParams,
  BatchQueryResult,
  NFTError,
  NFTErrorType,
  NFTMetadata
} from '@/types/nft';
import { cacheService } from './cache-service';

class NFTService {
  private readonly BATCH_SIZE = 20; // 批量查询大小
  private readonly MAX_RETRIES = 3; // 最大重试次数

  /**
   * 获取总NFT数量
   */
  async getTotalSupply(): Promise<number> {
    try {
      console.log('NFTService: 开始获取totalSupply...');
      console.log('NFTService: 合约地址:', contractConfig.address);
      
      const result = await readContract(config, {
        address: contractConfig.address as `0x${string}`,
        abi: contractConfig.abi,
        functionName: 'totalSupply'
      });
      
      console.log('NFTService: totalSupply结果:', result);
      const total = Number(result);
      console.log('NFTService: 转换后的数量:', total);
      
      return total;
    } catch (error) {
      console.error('NFTService: 获取totalSupply失败:', error);
      throw this.createError(NFTErrorType.CONTRACT_ERROR, 'Failed to get total supply', error as Error);
    }
  }

  /**
   * 获取下一个TokenID
   */
  async getNextTokenId(): Promise<number> {
    try {
      const result = await readContract(config, {
        address: contractConfig.address as `0x${string}`,
        abi: contractConfig.abi,
        functionName: 'getNextTokenId'
      });
      return Number(result);
    } catch (error) {
      console.error('Failed to get next token ID:', error);
      throw this.createError(NFTErrorType.CONTRACT_ERROR, 'Failed to get next token ID', error as Error);
    }
  }

  /**
   * 分页获取NFT列表
   */
  async getNFTsPaginated(params: PaginationParams, userAddress?: string): Promise<PaginatedNFTResult> {
    try {
      console.log('NFTService: 开始分页获取NFT列表...', params);
      console.log('NFTService: 用户地址:', userAddress);
      
      const totalSupply = await this.getTotalSupply();
      console.log('NFTService: 获取到totalSupply:', totalSupply);
      
      if (totalSupply === 0) {
        console.log('NFTService: totalSupply为0，返回空结果');
        return {
          data: [],
          pagination: {
            page: params.page,
            limit: params.limit,
            total: 0,
            totalPages: 0,
            hasNext: false,
            hasPrev: false
          }
        };
      }

      // 计算分页参数
      const totalPages = Math.ceil(totalSupply / params.limit);
      const startIndex = (params.page - 1) * params.limit;
      const endIndex = Math.min(startIndex + params.limit, totalSupply);

      console.log('NFTService: 分页参数 - startIndex:', startIndex, 'endIndex:', endIndex);

      // 获取TokenID列表
      const tokenIds: string[] = [];
      for (let i = startIndex; i < endIndex; i++) {
        try {
          console.log('NFTService: 获取索引', i, '的tokenId...');
          const tokenId = await readContract(config, {
            address: contractConfig.address as `0x${string}`,
            abi: contractConfig.abi,
            functionName: 'tokenByIndex',
            args: [BigInt(i)]
          });
          console.log('NFTService: 索引', i, '的tokenId:', tokenId);
          tokenIds.push(tokenId.toString());
        } catch (error) {
          console.warn(`NFTService: 获取索引 ${i} 的token失败:`, error);
        }
      }

      console.log('NFTService: 获取到的tokenIds:', tokenIds);

      // 批量获取NFT数据
      const nftData = await this.getNFTsBatch(tokenIds, userAddress);
      console.log('NFTService: 批量获取结果:', nftData);

      // 排序
      let sortedData = nftData.success;
      if (params.sortBy) {
        sortedData = this.sortNFTs(sortedData, params.sortBy);
      }

      // 过滤
      if (params.filterBy) {
        sortedData = this.filterNFTs(sortedData, params.filterBy);
      }

      const result = {
        data: sortedData,
        pagination: {
          page: params.page,
          limit: params.limit,
          total: totalSupply,
          totalPages,
          hasNext: params.page < totalPages,
          hasPrev: params.page > 1
        }
      };

      console.log('NFTService: 最终返回结果:', result);
      return result;
    } catch (error) {
      console.error('NFTService: 分页获取NFT失败:', error);
      throw this.createError(NFTErrorType.CONTRACT_ERROR, 'Failed to get NFT list', error as Error);
    }
  }

  /**
   * 批量获取NFT数据
   */
  async getNFTsBatch(tokenIds: string[], userAddress?: string): Promise<BatchQueryResult> {
    console.log('NFTService: 开始批量获取NFT数据...', tokenIds);
    
    const success: NFTData[] = [];
    const failed: string[] = [];

    // 暂时禁用缓存，直接从链上获取
    console.log('NFTService: 直接从链上获取数据（缓存已禁用）');
    const batchResults = await this.fetchNFTsBatch(tokenIds, userAddress);
    success.push(...batchResults.success);
    failed.push(...batchResults.failed);

    console.log('NFTService: 批量获取完成 - 成功:', success.length, '失败:', failed.length);
    return { success, failed };
  }

  /**
   * 获取单个NFT数据
   */
  async getNFT(tokenId: string, userAddress?: string): Promise<NFTData> {
    // 1. 检查缓存
    const cached = await cacheService.get(tokenId);
    if (cached) {
      return cached;
    }

    // 2. 从链上获取
    const nftData = await this.fetchSingleNFT(tokenId, userAddress);
    
    // 3. 缓存数据
    await cacheService.set(tokenId, nftData);
    
    return nftData;
  }

  /**
   * 转移NFT
   */
  async transferNFT(params: TransferParams, fromAddress: string): Promise<string> {
    try {
      // 验证地址格式
      if (!this.isValidAddress(params.to)) {
        throw this.createError(NFTErrorType.INVALID_TOKEN_ID, 'Invalid recipient address');
      }

      // 执行转移
      const hash = await writeContract(config, {
        address: contractConfig.address as `0x${string}`,
        abi: contractConfig.abi,
        functionName: 'safeTransferFrom',
        args: [fromAddress as `0x${string}`, params.to as `0x${string}`, BigInt(params.tokenId)]
      });

      // 等待交易确认
      await waitForTransactionReceipt(config, { hash });

      // 清除相关缓存
      await this.invalidateCache(params.tokenId);

      return hash;
    } catch (error) {
      console.error('Failed to transfer NFT:', error);
      throw this.createError(NFTErrorType.CONTRACT_ERROR, 'Failed to transfer NFT', error as Error);
    }
  }

  /**
   * 点赞NFT
   */
  async likeNFT(tokenId: string): Promise<string> {
    try {
      const hash = await writeContract(config, {
        address: contractConfig.address as `0x${string}`,
        abi: contractConfig.abi,
        functionName: 'likeCouplet',
        args: [BigInt(tokenId)]
      });

      await waitForTransactionReceipt(config, { hash });
      await this.invalidateCache(tokenId);

      return hash;
    } catch (error) {
      console.error('Failed to like NFT:', error);
      throw this.createError(NFTErrorType.CONTRACT_ERROR, 'Failed to like NFT', error as Error);
    }
  }

  /**
   * 取消点赞NFT
   */
  async unlikeNFT(tokenId: string): Promise<string> {
    try {
      const hash = await writeContract(config, {
        address: contractConfig.address as `0x${string}`,
        abi: contractConfig.abi,
        functionName: 'unlikeCouplet',
        args: [BigInt(tokenId)]
      });

      await waitForTransactionReceipt(config, { hash });
      await this.invalidateCache(tokenId);

      return hash;
    } catch (error) {
      console.error('Failed to unlike NFT:', error);
      throw this.createError(NFTErrorType.CONTRACT_ERROR, 'Failed to unlike NFT', error as Error);
    }
  }

  /**
   * 预加载下一页数据
   */
  async preloadNextPage(currentPage: number, limit: number, userAddress?: string): Promise<void> {
    const nextPage = currentPage + 1;
    const params: PaginationParams = { page: nextPage, limit };
    
    try {
      // 在后台预加载，不阻塞当前操作
      setTimeout(async () => {
        await this.getNFTsPaginated(params, userAddress);
      }, 100);
    } catch (error) {
      // 预加载失败不影响主流程
      console.warn('Failed to preload next page:', error);
    }
  }

  // ========== 私有方法 ==========

  /**
   * 从链上批量获取NFT数据
   */
  private async fetchNFTsBatch(tokenIds: string[], userAddress?: string): Promise<BatchQueryResult> {
    console.log('NFTService: fetchNFTsBatch开始...', tokenIds);
    
    const success: NFTData[] = [];
    const failed: string[] = [];

    // 分批处理，避免单次请求过大
    const batches = this.chunkArray(tokenIds, this.BATCH_SIZE);
    console.log('NFTService: 分为', batches.length, '个批次处理');

    for (let batchIndex = 0; batchIndex < batches.length; batchIndex++) {
      const batch = batches[batchIndex];
      console.log('NFTService: 处理第', batchIndex + 1, '批次:', batch);
      
      try {
        const batchResult = await this.processBatch(batch, userAddress);
        console.log('NFTService: 第', batchIndex + 1, '批次结果 - 成功:', batchResult.success.length, '失败:', batchResult.failed.length);
        success.push(...batchResult.success);
        failed.push(...batchResult.failed);
      } catch (error) {
        console.error('NFTService: 第', batchIndex + 1, '批次处理失败:', error);
        failed.push(...batch);
      }
    }

    console.log('NFTService: fetchNFTsBatch完成 - 总成功:', success.length, '总失败:', failed.length);
    return { success, failed };
  }

  /**
   * 处理单个批次
   */
  private async processBatch(tokenIds: string[], userAddress?: string): Promise<BatchQueryResult> {
    console.log('NFTService: processBatch开始处理批次...', tokenIds);
    
    const success: NFTData[] = [];
    const failed: string[] = [];

    // 改为逐个获取，避免批量调用的问题
    for (const tokenId of tokenIds) {
      try {
        console.log('NFTService: 处理单个NFT:', tokenId);
        
        const nftData = await this.fetchSingleNFT(tokenId, userAddress);
        console.log('NFTService: 单个NFT获取成功:', nftData);
        
        success.push(nftData);
      } catch (error) {
        console.error(`NFTService: 获取NFT ${tokenId} 失败:`, error);
        failed.push(tokenId);
      }
    }

    console.log('NFTService: processBatch完成 - 成功:', success.length, '失败:', failed.length);
    return { success, failed };
  }

  /**
   * 从链上获取单个NFT数据
   */
  private async fetchSingleNFT(tokenId: string, userAddress?: string): Promise<NFTData> {
    console.log('NFTService: fetchSingleNFT开始...', tokenId, userAddress);
    
    let retries = 0;
    
    while (retries < this.MAX_RETRIES) {
      try {
        console.log('NFTService: 尝试获取NFT数据，重试次数:', retries);
        
        // 逐个调用，避免Promise.all可能的问题
        console.log('NFTService: 获取owner...');
        const owner = await readContract(config, {
          address: contractConfig.address as `0x${string}`,
          abi: contractConfig.abi,
          functionName: 'ownerOf',
          args: [BigInt(tokenId)]
        });
        console.log('NFTService: owner获取成功:', owner);

        console.log('NFTService: 获取content...');
        const content = await readContract(config, {
          address: contractConfig.address as `0x${string}`,
          abi: contractConfig.abi,
          functionName: 'getCoupletContent',
          args: [BigInt(tokenId)]
        });
        console.log('NFTService: content获取成功:', content);

        console.log('NFTService: 获取likeCount...');
        const likeCount = await readContract(config, {
          address: contractConfig.address as `0x${string}`,
          abi: contractConfig.abi,
          functionName: 'getLikeCount',
          args: [BigInt(tokenId)]
        });
        console.log('NFTService: likeCount获取成功:', likeCount);

        let isLiked = false;
        if (userAddress) {
          console.log('NFTService: 获取isLiked...');
          isLiked = await readContract(config, {
            address: contractConfig.address as `0x${string}`,
            abi: contractConfig.abi,
            functionName: 'hasUserLiked',
            args: [BigInt(tokenId), userAddress as `0x${string}`]
          }) as boolean;
          console.log('NFTService: isLiked获取成功:', isLiked);
        }

        const nftData = {
          tokenId,
          owner: owner as string,
          content: this.parseContentResult(content as any),
          likeCount: Number(likeCount),
          isLikedByUser: Boolean(isLiked)
        };

        console.log('NFTService: NFT数据组装完成:', nftData);
        return nftData;
      } catch (error) {
        retries++;
        console.error(`NFTService: 获取NFT ${tokenId} 失败，重试 ${retries}/${this.MAX_RETRIES}:`, error);
        
        if (retries >= this.MAX_RETRIES) {
          throw this.createError(NFTErrorType.CONTRACT_ERROR, `Failed to fetch NFT ${tokenId}`, error as Error);
        }
        
        // 指数退避
        const delay = Math.pow(2, retries) * 1000;
        console.log('NFTService: 等待', delay, 'ms后重试...');
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }

    throw this.createError(NFTErrorType.CONTRACT_ERROR, `Failed to fetch NFT ${tokenId}`);
  }

  /**
   * 解析合约返回的春联内容
   */
  private parseContentResult(result: any): CoupletContent {
    console.log('NFTService: parseContentResult 开始解析:', result);
    console.log('NFTService: result类型:', typeof result, Array.isArray(result) ? '是数组' : '不是数组');
    
    // 判断是对象格式还是数组格式
    const isObjectFormat = !Array.isArray(result) && typeof result === 'object';
    
    if (isObjectFormat) {
      // 对象格式：直接使用属性名访问
      console.log('NFTService: 使用对象格式解析');
      const rawImageUrl = result.imageUrl || '';
      const imageUrl = this.convertIpfsUrl(rawImageUrl);
      
      const parsed = {
        upperLine: result.upperLine || '',
        lowerLine: result.lowerLine || '',
        horizontalScroll: result.horizontalScroll || '',
        imageUrl: imageUrl,
        mintTime: BigInt(result.mintTime || 0)
      };
      
      console.log('NFTService: 解析完成的content:', parsed);
      return parsed;
    } else {
      // 数组格式：使用索引访问
      console.log('NFTService: 使用数组格式解析');
      const rawImageUrl = result[3] || '';
      const imageUrl = this.convertIpfsUrl(rawImageUrl);
      
      const parsed = {
        upperLine: result[0] || '',
        lowerLine: result[1] || '',
        horizontalScroll: result[2] || '',
        imageUrl: imageUrl,
        mintTime: BigInt(result[4] || 0)
      };
      
      console.log('NFTService: 解析完成的content:', parsed);
      return parsed;
    }
  }

  /**
   * 转换IPFS URL为HTTP网关URL
   * 使用Pinata网关以获得更好的性能和稳定性
   */
  private convertIpfsUrl(ipfsUrl: string): string {
    if (!ipfsUrl) return '';
    
    console.log('NFTService: 转换IPFS URL:', ipfsUrl);
    
    // 从环境变量获取Pinata网关URL，如果未配置则使用默认值
    const PINATA_GATEWAY = process.env.NEXT_PUBLIC_PINATA_GATEWAY || 'https://lime-fair-whippet-113.mypinata.cloud/ipfs';
    
    // 如果已经是HTTP URL，直接返回
    if (ipfsUrl.startsWith('http://') || ipfsUrl.startsWith('https://')) {
      console.log('NFTService: 已经是HTTP URL，直接返回');
      return ipfsUrl;
    }
    
    // 如果是IPFS协议URL，转换为Pinata网关URL
    if (ipfsUrl.startsWith('ipfs://')) {
      const hash = ipfsUrl.replace('ipfs://', '');
      const gatewayUrl = `${PINATA_GATEWAY}/${hash}`;
      console.log('NFTService: IPFS协议URL转换为:', gatewayUrl);
      return gatewayUrl;
    }
    
    // 如果只是IPFS hash（CIDv0: Qm... 或 CIDv1: bafy...），添加网关前缀
    if (ipfsUrl.match(/^(Qm[1-9A-HJ-NP-Za-km-z]{44}|bafy[a-z0-9]{52,})$/)) {
      const gatewayUrl = `${PINATA_GATEWAY}/${ipfsUrl}`;
      console.log('NFTService: IPFS hash转换为:', gatewayUrl);
      return gatewayUrl;
    }
    
    console.log('NFTService: 无法识别的URL格式，原样返回');
    return ipfsUrl;
  }

  /**
   * 解析NFT元数据
   */
  private async parseMetadata(tokenURI: string): Promise<NFTMetadata | undefined> {
    try {
      if (tokenURI.startsWith('data:application/json;base64,')) {
        const base64Data = tokenURI.replace('data:application/json;base64,', '');
        const jsonString = atob(base64Data);
        return JSON.parse(jsonString);
      }
      
      if (tokenURI.startsWith('http')) {
        const response = await fetch(tokenURI);
        return await response.json();
      }
    } catch (error) {
      console.warn('Failed to parse metadata:', error);
    }
    
    return undefined;
  }

  /**
   * 排序NFT数据
   */
  private sortNFTs(nfts: NFTData[], sortBy: NonNullable<PaginationParams['sortBy']>): NFTData[] {
    return [...nfts].sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return Number(b.content.mintTime - a.content.mintTime);
        case 'oldest':
          return Number(a.content.mintTime - b.content.mintTime);
        case 'mostLiked':
          return b.likeCount - a.likeCount;
        default:
          return 0;
      }
    });
  }

  /**
   * 过滤NFT数据
   */
  private filterNFTs(nfts: NFTData[], filterBy: NonNullable<PaginationParams['filterBy']>): NFTData[] {
    return nfts.filter(nft => {
      if (filterBy.owner && nft.owner.toLowerCase() !== filterBy.owner.toLowerCase()) {
        return false;
      }
      // 可以根据需要添加更多过滤条件
      return true;
    });
  }

  /**
   * 数组分块
   */
  private chunkArray<T>(array: T[], size: number): T[][] {
    const chunks: T[][] = [];
    for (let i = 0; i < array.length; i += size) {
      chunks.push(array.slice(i, i + size));
    }
    return chunks;
  }

  /**
   * 验证以太坊地址格式
   */
  private isValidAddress(address: string): boolean {
    return /^0x[a-fA-F0-9]{40}$/.test(address);
  }

  /**
   * 清除缓存
   */
  private async invalidateCache(tokenId: string): Promise<void> {
    // 这里可以实现更精细的缓存失效策略
    // 暂时简单清除指定tokenId的缓存
    await cacheService.clear();
  }

  /**
   * 创建错误对象
   */
  private createError(type: NFTErrorType, message: string, originalError?: Error, tokenId?: string): NFTError {
    return {
      type,
      message,
      tokenId,
      originalError
    };
  }
}

// 导出单例实例
export const nftService = new NFTService();
export default nftService;