"use client"

import { useState, useEffect } from "react"
import { useAccount } from "wagmi"
import { readContract } from 'wagmi/actions'
import { config } from '@/providers/Web3Provider'
import { contractConfig } from '@/constants/contractConfig'

export default function DebugPage() {
  const [totalSupply, setTotalSupply] = useState<number | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const { address, isConnected } = useAccount()

  const testContract = async () => {
    setLoading(true)
    setError(null)
    
    try {
      console.log('Testing contract connection...')
      console.log('Contract address:', contractConfig.address)
      console.log('User address:', address)
      console.log('Is connected:', isConnected)
      
      // 测试 totalSupply
      const result = await readContract(config, {
        address: contractConfig.address as `0x${string}`,
        abi: contractConfig.abi,
        functionName: 'totalSupply'
      })
      
      console.log('Total supply result:', result)
      setTotalSupply(Number(result))
      
      // 如果有NFT，测试获取第一个
      if (Number(result) > 0) {
        const tokenId = await readContract(config, {
          address: contractConfig.address as `0x${string}`,
          abi: contractConfig.abi,
          functionName: 'tokenByIndex',
          args: [BigInt(0)]
        })
        
        console.log('First token ID:', tokenId)
        
        // 获取NFT内容
        const content = await readContract(config, {
          address: contractConfig.address as `0x${string}`,
          abi: contractConfig.abi,
          functionName: 'getCoupletContent',
          args: [tokenId]
        })
        
        console.log('NFT content:', content)
      }
      
    } catch (err: any) {
      console.error('Contract test error:', err)
      setError(err.message || 'Unknown error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">合约调试页面</h1>
      
      <div className="space-y-4">
        <div>
          <p><strong>钱包连接状态:</strong> {isConnected ? '已连接' : '未连接'}</p>
          <p><strong>钱包地址:</strong> {address || '无'}</p>
          <p><strong>合约地址:</strong> {contractConfig.address}</p>
        </div>
        
        <button 
          onClick={testContract}
          disabled={loading}
          className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
        >
          {loading ? '测试中...' : '测试合约连接'}
        </button>
        
        {totalSupply !== null && (
          <div className="p-4 bg-green-100 rounded">
            <p><strong>NFT总数:</strong> {totalSupply}</p>
          </div>
        )}
        
        {error && (
          <div className="p-4 bg-red-100 rounded">
            <p><strong>错误:</strong> {error}</p>
          </div>
        )}
      </div>
    </div>
  )
}