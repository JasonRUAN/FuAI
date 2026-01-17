/**
 * NFT转移弹窗组件
 */

"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { 
  Send, 
  AlertTriangle, 
  CheckCircle, 
  Loader2,
  ExternalLink,
  Copy,
  User,
  Wallet
} from "lucide-react"
import { NFTData } from "@/types/nft"
import { useTransferNFT } from "@/hooks/use-nft-data"
import { useAccount } from "wagmi"
import { toast } from "sonner"
import { isAddress } from "viem"

interface TransferModalProps {
  isOpen: boolean
  onClose: () => void
  nft: NFTData | null
}

export function TransferModal({ isOpen, onClose, nft }: TransferModalProps) {
  const { address: userAddress } = useAccount()
  const [recipientAddress, setRecipientAddress] = useState("")
  const [step, setStep] = useState<'input' | 'confirm' | 'processing' | 'success'>('input')
  const [txHash, setTxHash] = useState("")

  const { mutate: transferNFT, isPending } = useTransferNFT()

  // 重置状态
  const resetModal = () => {
    setRecipientAddress("")
    setStep('input')
    setTxHash("")
  }

  // 关闭弹窗
  const handleClose = () => {
    if (!isPending) {
      resetModal()
      onClose()
    }
  }

  // 验证地址
  const isValidAddress = (address: string): boolean => {
    return isAddress(address)
  }

  // 处理地址输入
  const handleAddressChange = (value: string) => {
    setRecipientAddress(value.trim())
  }

  // 继续到确认步骤
  const handleContinue = () => {
    if (!isValidAddress(recipientAddress)) {
      toast.error('请输入有效的以太坊地址')
      return
    }

    if (recipientAddress.toLowerCase() === userAddress?.toLowerCase()) {
      toast.error('不能转移给自己')
      return
    }

    if (recipientAddress.toLowerCase() === nft?.owner.toLowerCase()) {
      toast.error('该NFT已经属于此地址')
      return
    }

    setStep('confirm')
  }

  // 执行转移
  const handleTransfer = () => {
    if (!nft) return

    setStep('processing')
    
    transferNFT(
      {
        tokenId: nft.tokenId,
        to: recipientAddress
      },
      {
        onSuccess: (hash) => {
          setTxHash(hash)
          setStep('success')
          toast.success('NFT转移成功！')
        },
        onError: (error) => {
          console.error('Transfer failed:', error)
          toast.error(`转移失败: ${error.message}`)
          setStep('confirm')
        }
      }
    )
  }

  // 复制地址
  const copyAddress = async (address: string) => {
    try {
      await navigator.clipboard.writeText(address)
      toast.success('地址已复制')
    } catch (error) {
      toast.error('复制失败')
    }
  }

  // 复制交易哈希
  const copyTxHash = async () => {
    try {
      await navigator.clipboard.writeText(txHash)
      toast.success('交易哈希已复制')
    } catch (error) {
      toast.error('复制失败')
    }
  }

  // 查看交易
  const viewTransaction = () => {
    if (txHash) {
      window.open(`https://sepolia.etherscan.io/tx/${txHash}`, '_blank')
    }
  }

  // 格式化地址显示
  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  if (!nft) return null

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md bg-slate-900 border-slate-700">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-slate-200">
            <Send className="h-5 w-5 text-purple-400" />
            转移NFT
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* NFT信息 */}
          <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 rounded-lg overflow-hidden bg-slate-700">
                <img
                  src={nft.content.imageUrl}
                  alt={nft.content.horizontalScroll}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <div className="font-medium text-slate-200">
                  {nft.content.horizontalScroll}
                </div>
                <Badge variant="outline" className="text-xs border-purple-500/50 text-purple-300">
                  #{nft.tokenId}
                </Badge>
              </div>
            </div>
            <div className="text-sm text-slate-400 space-y-1">
              <div>上联：{nft.content.upperLine}</div>
              <div>下联：{nft.content.lowerLine}</div>
            </div>
          </div>

          {/* 输入步骤 */}
          {step === 'input' && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="recipient" className="text-slate-300">
                  接收者地址
                </Label>
                <div className="mt-2">
                  <Input
                    id="recipient"
                    placeholder="0x..."
                    value={recipientAddress}
                    onChange={(e) => handleAddressChange(e.target.value)}
                    className="bg-slate-800 border-slate-700 text-slate-200 placeholder:text-slate-500"
                  />
                </div>
                {recipientAddress && !isValidAddress(recipientAddress) && (
                  <p className="text-red-400 text-sm mt-1">请输入有效的以太坊地址</p>
                )}
              </div>

              <Alert className="border-amber-500/50 bg-amber-500/10">
                <AlertTriangle className="h-4 w-4 text-amber-400" />
                <AlertDescription className="text-amber-300">
                  请确认接收者地址正确，NFT转移后无法撤销
                </AlertDescription>
              </Alert>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={handleClose}
                  className="flex-1 border-slate-700 text-slate-300 hover:bg-slate-800"
                >
                  取消
                </Button>
                <Button
                  onClick={handleContinue}
                  disabled={!recipientAddress || !isValidAddress(recipientAddress)}
                  className="flex-1 bg-purple-600 hover:bg-purple-700"
                >
                  继续
                </Button>
              </div>
            </div>
          )}

          {/* 确认步骤 */}
          {step === 'confirm' && (
            <div className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between py-2 border-b border-slate-700">
                  <span className="text-slate-400">从</span>
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-slate-400" />
                    <span className="text-slate-200 font-mono">
                      {formatAddress(nft.owner)}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyAddress(nft.owner)}
                      className="h-6 w-6 p-0 text-slate-400 hover:text-slate-200"
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                </div>

                <div className="flex items-center justify-between py-2 border-b border-slate-700">
                  <span className="text-slate-400">到</span>
                  <div className="flex items-center gap-2">
                    <Wallet className="h-4 w-4 text-slate-400" />
                    <span className="text-slate-200 font-mono">
                      {formatAddress(recipientAddress)}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyAddress(recipientAddress)}
                      className="h-6 w-6 p-0 text-slate-400 hover:text-slate-200"
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                </div>

                <div className="flex items-center justify-between py-2">
                  <span className="text-slate-400">Gas费用</span>
                  <span className="text-slate-200">由发送者承担</span>
                </div>
              </div>

              <Alert className="border-red-500/50 bg-red-500/10">
                <AlertTriangle className="h-4 w-4 text-red-400" />
                <AlertDescription className="text-red-300">
                  确认转移后，NFT的所有权将立即转移给接收者，此操作不可撤销
                </AlertDescription>
              </Alert>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => setStep('input')}
                  className="flex-1 border-slate-700 text-slate-300 hover:bg-slate-800"
                >
                  返回
                </Button>
                <Button
                  onClick={handleTransfer}
                  className="flex-1 bg-red-600 hover:bg-red-700"
                >
                  确认转移
                </Button>
              </div>
            </div>
          )}

          {/* 处理步骤 */}
          {step === 'processing' && (
            <div className="text-center space-y-4">
              <div className="flex justify-center">
                <Loader2 className="h-12 w-12 animate-spin text-purple-400" />
              </div>
              <div>
                <h3 className="text-lg font-medium text-slate-200 mb-2">
                  正在处理转移...
                </h3>
                <p className="text-slate-400 text-sm">
                  请在钱包中确认交易，这可能需要几分钟时间
                </p>
              </div>
            </div>
          )}

          {/* 成功步骤 */}
          {step === 'success' && (
            <div className="text-center space-y-4">
              <div className="flex justify-center">
                <CheckCircle className="h-12 w-12 text-green-400" />
              </div>
              <div>
                <h3 className="text-lg font-medium text-slate-200 mb-2">
                  转移成功！
                </h3>
                <p className="text-slate-400 text-sm mb-4">
                  NFT已成功转移到目标地址
                </p>
                
                {txHash && (
                  <div className="bg-slate-800/50 rounded-lg p-3 border border-slate-700">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400 text-sm">交易哈希</span>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={copyTxHash}
                          className="h-6 w-6 p-0 text-slate-400 hover:text-slate-200"
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={viewTransaction}
                          className="h-6 w-6 p-0 text-slate-400 hover:text-slate-200"
                        >
                          <ExternalLink className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                    <div className="text-slate-200 font-mono text-sm mt-1">
                      {formatAddress(txHash)}
                    </div>
                  </div>
                )}
              </div>

              <Button
                onClick={handleClose}
                className="w-full bg-purple-600 hover:bg-purple-700"
              >
                完成
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}