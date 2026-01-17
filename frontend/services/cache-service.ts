/**
 * NFT数据缓存服务
 * 实现多级缓存策略：内存缓存 + IndexedDB持久化
 */

import { NFTData, CachedNFTData, PaginatedNFTResult } from '@/types/nft';

// 缓存配置
const CACHE_CONFIG = {
  MEMORY_TTL: 5 * 60 * 1000,      // 内存缓存5分钟
  INDEXEDDB_TTL: 24 * 60 * 60 * 1000, // IndexedDB缓存24小时
  MAX_MEMORY_SIZE: 100,            // 内存最大缓存数量
  DB_NAME: 'NFTGalleryCache',
  DB_VERSION: 1,
  STORE_NAME: 'nft_data'
};

class CacheService {
  private memoryCache = new Map<string, CachedNFTData>();
  private db: IDBDatabase | null = null;
  private dbPromise: Promise<IDBDatabase> | null = null;

  constructor() {
    this.initIndexedDB();
  }

  /**
   * 初始化IndexedDB
   */
  private async initIndexedDB(): Promise<void> {
    if (typeof window === 'undefined') return;

    this.dbPromise = new Promise((resolve, reject) => {
      const request = indexedDB.open(CACHE_CONFIG.DB_NAME, CACHE_CONFIG.DB_VERSION);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve(request.result);
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains(CACHE_CONFIG.STORE_NAME)) {
          const store = db.createObjectStore(CACHE_CONFIG.STORE_NAME, { keyPath: 'tokenId' });
          store.createIndex('timestamp', 'timestamp', { unique: false });
        }
      };
    });

    try {
      await this.dbPromise;
    } catch (error) {
      console.error('Failed to initialize IndexedDB:', error);
    }
  }

  /**
   * 获取缓存的NFT数据
   */
  async get(tokenId: string): Promise<NFTData | null> {
    // 1. 先检查内存缓存
    const memoryData = this.getFromMemory(tokenId);
    if (memoryData) {
      return memoryData;
    }

    // 2. 检查IndexedDB缓存
    const dbData = await this.getFromIndexedDB(tokenId);
    if (dbData) {
      // 将数据加载到内存缓存
      this.setToMemory(tokenId, dbData);
      return dbData;
    }

    return null;
  }

  /**
   * 设置NFT数据缓存
   */
  async set(tokenId: string, data: NFTData): Promise<void> {
    const now = Date.now();
    const cachedData: CachedNFTData = {
      data,
      timestamp: now,
      expiry: now + CACHE_CONFIG.INDEXEDDB_TTL
    };

    // 设置内存缓存
    this.setToMemory(tokenId, data);

    // 设置IndexedDB缓存
    await this.setToIndexedDB(tokenId, cachedData);
  }

  /**
   * 批量获取缓存数据
   */
  async getBatch(tokenIds: string[]): Promise<Map<string, NFTData>> {
    const result = new Map<string, NFTData>();
    const missingIds: string[] = [];

    // 1. 检查内存缓存
    for (const tokenId of tokenIds) {
      const memoryData = this.getFromMemory(tokenId);
      if (memoryData) {
        result.set(tokenId, memoryData);
      } else {
        missingIds.push(tokenId);
      }
    }

    // 2. 检查IndexedDB缓存
    if (missingIds.length > 0) {
      const dbResults = await this.getBatchFromIndexedDB(missingIds);
      for (const [tokenId, data] of dbResults) {
        result.set(tokenId, data);
        this.setToMemory(tokenId, data);
      }
    }

    return result;
  }

  /**
   * 批量设置缓存数据
   */
  async setBatch(dataMap: Map<string, NFTData>): Promise<void> {
    const now = Date.now();
    const promises: Promise<void>[] = [];

    for (const [tokenId, data] of dataMap) {
      // 设置内存缓存
      this.setToMemory(tokenId, data);

      // 设置IndexedDB缓存
      const cachedData: CachedNFTData = {
        data,
        timestamp: now,
        expiry: now + CACHE_CONFIG.INDEXEDDB_TTL
      };
      promises.push(this.setToIndexedDB(tokenId, cachedData));
    }

    await Promise.allSettled(promises);
  }

  /**
   * 清除过期缓存
   */
  async clearExpired(): Promise<void> {
    const now = Date.now();

    // 清理内存缓存
    for (const [key, cachedData] of this.memoryCache) {
      if (now - cachedData.timestamp > CACHE_CONFIG.MEMORY_TTL) {
        this.memoryCache.delete(key);
      }
    }

    // 清理IndexedDB缓存
    await this.clearExpiredFromIndexedDB();
  }

  /**
   * 清除所有缓存
   */
  async clear(): Promise<void> {
    this.memoryCache.clear();
    await this.clearIndexedDB();
  }

  /**
   * 获取缓存统计信息
   */
  getStats() {
    return {
      memorySize: this.memoryCache.size,
      maxMemorySize: CACHE_CONFIG.MAX_MEMORY_SIZE,
      memoryUsage: (this.memoryCache.size / CACHE_CONFIG.MAX_MEMORY_SIZE) * 100
    };
  }

  // ========== 私有方法 ==========

  /**
   * 从内存缓存获取数据
   */
  private getFromMemory(tokenId: string): NFTData | null {
    const cached = this.memoryCache.get(tokenId);
    if (!cached) return null;

    const now = Date.now();
    if (now - cached.timestamp > CACHE_CONFIG.MEMORY_TTL) {
      this.memoryCache.delete(tokenId);
      return null;
    }

    return cached.data;
  }

  /**
   * 设置内存缓存
   */
  private setToMemory(tokenId: string, data: NFTData): void {
    // 如果缓存已满，删除最旧的数据
    if (this.memoryCache.size >= CACHE_CONFIG.MAX_MEMORY_SIZE) {
      const oldestKey = this.memoryCache.keys().next().value;
      if (oldestKey) {
        this.memoryCache.delete(oldestKey);
      }
    }

    const now = Date.now();
    this.memoryCache.set(tokenId, {
      data,
      timestamp: now,
      expiry: now + CACHE_CONFIG.MEMORY_TTL
    });
  }

  /**
   * 从IndexedDB获取数据
   */
  private async getFromIndexedDB(tokenId: string): Promise<NFTData | null> {
    if (!this.db && this.dbPromise) {
      try {
        await this.dbPromise;
      } catch (error) {
        console.error('IndexedDB not available:', error);
        return null;
      }
    }

    if (!this.db) return null;

    return new Promise((resolve) => {
      const transaction = this.db!.transaction([CACHE_CONFIG.STORE_NAME], 'readonly');
      const store = transaction.objectStore(CACHE_CONFIG.STORE_NAME);
      const request = store.get(tokenId);

      request.onsuccess = () => {
        const result = request.result as CachedNFTData & { tokenId: string };
        if (!result) {
          resolve(null);
          return;
        }

        const now = Date.now();
        if (now > result.expiry) {
          // 数据已过期，删除并返回null
          store.delete(tokenId);
          resolve(null);
          return;
        }

        resolve(result.data);
      };

      request.onerror = () => {
        console.error('Failed to get from IndexedDB:', request.error);
        resolve(null);
      };
    });
  }

  /**
   * 设置IndexedDB缓存
   */
  private async setToIndexedDB(tokenId: string, cachedData: CachedNFTData): Promise<void> {
    if (!this.db && this.dbPromise) {
      try {
        await this.dbPromise;
      } catch (error) {
        console.error('IndexedDB not available:', error);
        return;
      }
    }

    if (!this.db) return;

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([CACHE_CONFIG.STORE_NAME], 'readwrite');
      const store = transaction.objectStore(CACHE_CONFIG.STORE_NAME);
      const request = store.put({ ...cachedData, tokenId });

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * 批量从IndexedDB获取数据
   */
  private async getBatchFromIndexedDB(tokenIds: string[]): Promise<Map<string, NFTData>> {
    if (!this.db && this.dbPromise) {
      try {
        await this.dbPromise;
      } catch (error) {
        console.error('IndexedDB not available:', error);
        return new Map();
      }
    }

    if (!this.db) return new Map();

    return new Promise((resolve) => {
      const result = new Map<string, NFTData>();
      const transaction = this.db!.transaction([CACHE_CONFIG.STORE_NAME], 'readonly');
      const store = transaction.objectStore(CACHE_CONFIG.STORE_NAME);
      let completed = 0;
      const now = Date.now();

      for (const tokenId of tokenIds) {
        const request = store.get(tokenId);
        
        request.onsuccess = () => {
          const data = request.result as CachedNFTData & { tokenId: string };
          if (data && now <= data.expiry) {
            result.set(tokenId, data.data);
          }
          
          completed++;
          if (completed === tokenIds.length) {
            resolve(result);
          }
        };

        request.onerror = () => {
          completed++;
          if (completed === tokenIds.length) {
            resolve(result);
          }
        };
      }

      if (tokenIds.length === 0) {
        resolve(result);
      }
    });
  }

  /**
   * 清除IndexedDB中的过期数据
   */
  private async clearExpiredFromIndexedDB(): Promise<void> {
    if (!this.db) return;

    return new Promise((resolve) => {
      const transaction = this.db!.transaction([CACHE_CONFIG.STORE_NAME], 'readwrite');
      const store = transaction.objectStore(CACHE_CONFIG.STORE_NAME);
      const index = store.index('timestamp');
      const now = Date.now();

      const request = index.openCursor();
      request.onsuccess = (event) => {
        const cursor = (event.target as IDBRequest).result;
        if (cursor) {
          const data = cursor.value as CachedNFTData & { tokenId: string };
          if (now > data.expiry) {
            cursor.delete();
          }
          cursor.continue();
        } else {
          resolve();
        }
      };

      request.onerror = () => resolve();
    });
  }

  /**
   * 清除所有IndexedDB数据
   */
  private async clearIndexedDB(): Promise<void> {
    if (!this.db) return;

    return new Promise((resolve) => {
      const transaction = this.db!.transaction([CACHE_CONFIG.STORE_NAME], 'readwrite');
      const store = transaction.objectStore(CACHE_CONFIG.STORE_NAME);
      const request = store.clear();

      request.onsuccess = () => resolve();
      request.onerror = () => resolve();
    });
  }
}

// 导出单例实例
export const cacheService = new CacheService();
export default cacheService;