"use client"

import { useState, useEffect } from "react"
import { useAccount } from "wagmi"
import { readContract } from 'wagmi/actions'
import { config } from '@/providers/Web3Provider'
import { contractConfig } from '@/constants/contractConfig'

export default function SimpleGalleryPage() {
  const [totalSupply, setTotalSupply] = useState<number | null>(null)
  const [nfts, setNfts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { address, isConnected } = useAccount()

  useEffect(() => {
    loadNFTs()
  }, [])

  const loadNFTs = async () => {
    setLoading(true)
    setError(null)
    
    try {
      console.log('开始加载NFT数据...')
      
      // 1. 获取总数量
      const totalResult = await readContract(config, {
        address: contractConfig.address as `0x${string}`,
        abi: contractConfig.abi,
        functionName: 'totalSupply'
      })
      
      const total = Number(totalResult)
      setTotalSupply(total)
      console.log('NFT总数:', total)
      
      if (total === 0) {
        setNfts([])
        return
      }
      
      // 2. 获取前几个NFT的ID
      const nftList = []
      const maxToLoad = Math.min(total, 10) // 最多加载10个
      
      for (let i = 0; i < maxToLoad; i++) {
        try {
          console.log(`获取第${i}个NFT...`)
          
          // 获取tokenId
          const tokenId = await readContract(config, {
            address: contractConfig.address as `0x${string}`,
            abi: contractConfig.abi,
            functionName: 'tokenByIndex',
            args: [BigInt(i)]
          })
          
          console.log(`Token ID: ${tokenId}`)
          
          // 获取所有者
          const owner = await readContract(config, {
            address: contractConfig.address as `0x${string}`,
            abi: contractConfig.abi,
            functionName: 'ownerOf',
            args: [tokenId]
          })
          
          // 获取内容
          const content = await readContract(config, {
            address: contractConfig.address as `0x${string}`,
            abi: contractConfig.abi,
            functionName: 'getCoupletContent',
            args: [tokenId]
          }) as any[]
          
          // 获取点赞数
          const likeCount = await readContract(config, {
            address: contractConfig.address as `0x${string}`,
            abi: contractConfig.abi,
            functionName: 'getLikeCount',
            args: [tokenId]
          })
          
          // 转换IPFS URL
          const convertIpfsUrl = (ipfsUrl: string): string => {
            if (!ipfsUrl) return '';
            if (ipfsUrl.startsWith('http://') || ipfsUrl.startsWith('https://')) {
              return ipfsUrl;
            }
            if (ipfsUrl.startsWith('ipfs://')) {
              const hash = ipfsUrl.replace('ipfs://', '');
              return `https://ipfs.io/ipfs/${hash}`;
            }
            if (ipfsUrl.match(/^Qm[1-9A-HJ-NP-Za-km-z]{44}$/)) {
              return `https://ipfs.io/ipfs/${ipfsUrl}`;
            }
            return ipfsUrl;
          };
          
          const nft = {
            tokenId: tokenId.toString(),
            owner: owner as string,
            upperLine: content[0] || '',
            lowerLine: content[1] || '',
            horizontalScroll: content[2] || '',
            imageUrl: convertIpfsUrl(content[3] || ''),
            mintTime: content[4] || 0n,
            likeCount: Number(likeCount)
          }
          
          console.log('NFT数据:', nft)
          nftList.push(nft)
          
        } catch (err) {
          console.error(`获取第${i}个NFT失败:`, err)
        }
      }
      
      setNfts(nftList)
      console.log('加载完成，共', nftList.length, '个NFT')
      
    } catch (err: any) {
      console.error('加载NFT失败:', err)
      setError(err.message || '加载失败')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-4">简化版画廊</h1>
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500 mx-auto"></div>
          <p className="mt-2">加载中...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-4">简化版画廊</h1>
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p><strong>错误:</strong> {error}</p>
          <button 
            onClick={loadNFTs}
            className="mt-2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            重试
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">简化版画廊</h1>
      
      <div className="mb-4">
        <p><strong>钱包状态:</strong> {isConnected ? '已连接' : '未连接'}</p>
        <p><strong>钱包地址:</strong> {address || '无'}</p>
        <p><strong>NFT总数:</strong> {totalSupply}</p>
        <p><strong>已加载:</strong> {nfts.length} 个</p>
      </div>
      
      {nfts.length === 0 ? (
        <div className="text-center py-8">
          <p>暂无NFT数据</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {nfts.map((nft, index) => (
            <div key={nft.tokenId} className="border rounded-lg p-4 bg-white shadow">
              <h3 className="font-bold mb-2">NFT #{nft.tokenId}</h3>
              <div className="space-y-2 text-sm">
                <p><strong>上联:</strong> {nft.upperLine}</p>
                <p><strong>下联:</strong> {nft.lowerLine}</p>
                <p><strong>横批:</strong> {nft.horizontalScroll}</p>
                <p><strong>所有者:</strong> {nft.owner.slice(0, 6)}...{nft.owner.slice(-4)}</p>
                <p><strong>点赞数:</strong> {nft.likeCount}</p>
                {nft.imageUrl && (
                  <div>
                    <p><strong>图片:</strong></p>
                    <img 
                      src={nft.imageUrl} 
                      alt={`NFT ${nft.tokenId}`}
                      className="w-full h-32 object-cover rounded mt-1"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none'
                      }}
                    />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
      
      <div className="mt-8">
        <button 
          onClick={loadNFTs}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          刷新数据
        </button>
      </div>
    </div>
  )
}