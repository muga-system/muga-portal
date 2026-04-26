import Link from 'next/link'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface PaginationProps {
  currentPage: number
  totalPages: number
  baseUrl: string
  additionalParams?: Record<string, string>
}

export function Pagination({ currentPage, totalPages, baseUrl, additionalParams = {} }: PaginationProps) {
  if (totalPages <= 1) return null

  const buildHref = (page: number) => {
    const params = new URLSearchParams({
      page: String(page),
      ...additionalParams,
    })
    return `${baseUrl}?${params.toString()}`
  }

  const maxVisiblePages = 5
  const half = Math.floor(maxVisiblePages / 2)
  
  let startPage = Math.max(1, currentPage - half)
  let endPage = Math.min(totalPages, currentPage + half)
  
  if (endPage - startPage < maxVisiblePages - 1) {
    if (startPage === 1) {
      endPage = Math.min(totalPages, startPage + maxVisiblePages - 1)
    } else {
      startPage = Math.max(1, endPage - maxVisiblePages + 1)
    }
  }

  const pages = []
  for (let i = startPage; i <= endPage; i++) {
    pages.push(i)
  }

  return (
    <div className="flex items-center justify-center gap-1 py-4">
      {currentPage > 1 ? (
        <Link
          href={buildHref(currentPage - 1)}
          className="flex h-8 w-8 items-center justify-center border border-white/20 text-xs text-white hover:border-white/40"
        >
          <ChevronLeft className="h-4 w-4" />
        </Link>
      ) : (
        <span className="flex h-8 w-8 items-center justify-center border border-white/10 text-xs text-white/30">
          <ChevronLeft className="h-4 w-4" />
        </span>
      )}

      {startPage > 1 && (
        <>
          <Link
            href={buildHref(1)}
            className="flex h-8 w-8 items-center justify-center border border-white/20 text-xs text-white hover:border-white/40"
          >
            1
          </Link>
          {startPage > 2 && <span className="px-2 text-xs text-white/30">...</span>}
        </>
      )}

      {pages.map((page) => (
        <Link
          key={page}
          href={buildHref(page)}
          className={`flex h-8 w-8 items-center justify-center border text-xs font-semibold ${
            page === currentPage
              ? 'border-primary bg-primary text-black'
              : 'border-white/20 text-white hover:border-white/40'
          }`}
        >
          {page}
        </Link>
      ))}

      {endPage < totalPages && (
        <>
          {endPage < totalPages - 1 && <span className="px-2 text-xs text-white/30">...</span>}
          <Link
            href={buildHref(totalPages)}
            className="flex h-8 w-8 items-center justify-center border border-white/20 text-xs text-white hover:border-white/40"
          >
            {totalPages}
          </Link>
        </>
      )}

      {currentPage < totalPages ? (
        <Link
          href={buildHref(currentPage + 1)}
          className="flex h-8 w-8 items-center justify-center border border-white/20 text-xs text-white hover:border-white/40"
        >
          <ChevronRight className="h-4 w-4" />
        </Link>
      ) : (
        <span className="flex h-8 w-8 items-center justify-center border border-white/10 text-xs text-white/30">
          <ChevronRight className="h-4 w-4" />
        </span>
      )}
    </div>
  )
}