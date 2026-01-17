/**
 * 分页组件
 */

"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { 
  ChevronLeft, 
  ChevronRight, 
  ChevronsLeft, 
  ChevronsRight,
  MoreHorizontal
} from "lucide-react"
import { useState } from "react"

interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  showQuickJumper?: boolean
  showSizeChanger?: boolean
  pageSize?: number
  onPageSizeChange?: (size: number) => void
  className?: string
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  showQuickJumper = false,
  showSizeChanger = false,
  pageSize = 20,
  onPageSizeChange,
  className = ""
}: PaginationProps) {
  const [jumpPage, setJumpPage] = useState("")

  // 生成页码数组
  const generatePageNumbers = () => {
    const pages: (number | string)[] = []
    const delta = 2 // 当前页前后显示的页数

    if (totalPages <= 7) {
      // 总页数少于等于7页，显示所有页码
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      // 总页数大于7页，使用省略号
      if (currentPage <= 4) {
        // 当前页在前面
        for (let i = 1; i <= 5; i++) {
          pages.push(i)
        }
        pages.push('...')
        pages.push(totalPages)
      } else if (currentPage >= totalPages - 3) {
        // 当前页在后面
        pages.push(1)
        pages.push('...')
        for (let i = totalPages - 4; i <= totalPages; i++) {
          pages.push(i)
        }
      } else {
        // 当前页在中间
        pages.push(1)
        pages.push('...')
        for (let i = currentPage - delta; i <= currentPage + delta; i++) {
          pages.push(i)
        }
        pages.push('...')
        pages.push(totalPages)
      }
    }

    return pages
  }

  const handleJumpToPage = () => {
    const page = parseInt(jumpPage)
    if (page >= 1 && page <= totalPages) {
      onPageChange(page)
      setJumpPage("")
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleJumpToPage()
    }
  }

  if (totalPages <= 1) return null

  const pageNumbers = generatePageNumbers()

  return (
    <div className={`flex items-center justify-center gap-2 ${className}`}>
      {/* 第一页按钮 */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(1)}
        disabled={currentPage === 1}
        className="border-slate-700 text-slate-200 hover:bg-slate-800"
      >
        <ChevronsLeft className="h-4 w-4" />
      </Button>

      {/* 上一页按钮 */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="border-slate-700 text-slate-200 hover:bg-slate-800"
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>

      {/* 页码按钮 */}
      <div className="flex items-center gap-1">
        {pageNumbers.map((page, index) => {
          if (page === '...') {
            return (
              <div key={`ellipsis-${index}`} className="px-2">
                <MoreHorizontal className="h-4 w-4 text-slate-400" />
              </div>
            )
          }

          const pageNum = page as number
          const isActive = pageNum === currentPage

          return (
            <Button
              key={pageNum}
              variant={isActive ? "default" : "outline"}
              size="sm"
              onClick={() => onPageChange(pageNum)}
              className={
                isActive
                  ? "bg-purple-600 hover:bg-purple-700 text-white"
                  : "border-slate-700 text-slate-200 hover:bg-slate-800"
              }
            >
              {pageNum}
            </Button>
          )
        })}
      </div>

      {/* 下一页按钮 */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="border-slate-700 text-slate-200 hover:bg-slate-800"
      >
        <ChevronRight className="h-4 w-4" />
      </Button>

      {/* 最后一页按钮 */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(totalPages)}
        disabled={currentPage === totalPages}
        className="border-slate-700 text-slate-200 hover:bg-slate-800"
      >
        <ChevronsRight className="h-4 w-4" />
      </Button>

      {/* 快速跳转 */}
      {showQuickJumper && (
        <div className="flex items-center gap-2 ml-4">
          <span className="text-sm text-slate-400">跳转到</span>
          <Input
            type="number"
            min={1}
            max={totalPages}
            value={jumpPage}
            onChange={(e) => setJumpPage(e.target.value)}
            onKeyPress={handleKeyPress}
            className="w-16 h-8 text-center bg-slate-800 border-slate-700 text-slate-200"
            placeholder={currentPage.toString()}
          />
          <Button
            size="sm"
            onClick={handleJumpToPage}
            disabled={!jumpPage || parseInt(jumpPage) < 1 || parseInt(jumpPage) > totalPages}
            className="h-8"
          >
            跳转
          </Button>
        </div>
      )}

      {/* 页面大小选择器 */}
      {showSizeChanger && onPageSizeChange && (
        <div className="flex items-center gap-2 ml-4">
          <span className="text-sm text-slate-400">每页</span>
          <select
            value={pageSize}
            onChange={(e) => onPageSizeChange(parseInt(e.target.value))}
            className="h-8 px-2 bg-slate-800 border border-slate-700 rounded text-slate-200 text-sm"
          >
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
          <span className="text-sm text-slate-400">条</span>
        </div>
      )}

      {/* 页面信息 */}
      <div className="ml-4 text-sm text-slate-400">
        第 {currentPage} 页，共 {totalPages} 页
      </div>
    </div>
  )
}

/**
 * 简单分页组件
 */
export function SimplePagination({
  currentPage,
  totalPages,
  onPageChange,
  className = ""
}: Pick<PaginationProps, 'currentPage' | 'totalPages' | 'onPageChange' | 'className'>) {
  if (totalPages <= 1) return null

  return (
    <div className={`flex items-center justify-center gap-2 ${className}`}>
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="border-slate-700 text-slate-200 hover:bg-slate-800"
      >
        <ChevronLeft className="h-4 w-4 mr-1" />
        上一页
      </Button>

      <div className="flex items-center gap-2 px-4">
        <span className="text-sm text-slate-400">
          {currentPage} / {totalPages}
        </span>
      </div>

      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="border-slate-700 text-slate-200 hover:bg-slate-800"
      >
        下一页
        <ChevronRight className="h-4 w-4 ml-1" />
      </Button>
    </div>
  )
}