import React from 'react'
import { Clock, X, Trash2 } from 'lucide-react'

interface SearchHistoryItem {
  id: string
  keyword: string
  lastSearched: string
  searchCount: number
}

interface RecentSearchesProps {
  searches: SearchHistoryItem[]
  onSearchClick: (keyword: string) => void
  onDeleteSearch: (searchId: string) => void
  onClearHistory: () => void
  isLoading?: boolean
}

export const RecentSearches = ({
  searches,
  onSearchClick,
  onDeleteSearch,
  onClearHistory,
  isLoading = false,
}) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 1) return 'Just now'
    if (diffMins < 60) return `${diffMins}m ago`
    if (diffHours < 24) return `${diffHours}h ago`
    if (diffDays < 7) return `${diffDays}d ago`
    
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }

  if (searches.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 text-center">
        <Clock size={24} className="mx-auto text-slate-400 mb-3" />
        <p className="text-slate-600">No recent searches yet</p>
        <p className="text-sm text-slate-500 mt-1">Your search history will appear here</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
      <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Clock size={18} className="text-slate-600" />
          <h3 className="font-semibold text-slate-900">Last Searches</h3>
          {searches.length > 0 && (
            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
              {searches.length}
            </span>
          )}
        </div>
        {searches.length > 0 && (
          <button
            onClick={onClearHistory}
            disabled={isLoading}
            className="text-xs text-slate-500 hover:text-red-600 transition disabled:opacity-50"
            title="Clear all history"
          >
            <Trash2 size={16} />
          </button>
        )}
      </div>

      <div className="divide-y divide-slate-200 max-h-64 overflow-y-auto">
        {searches.map((search) => (
          <button
            key={search.id}
            onClick={() => onSearchClick(search.keyword)}
            disabled={isLoading}
            className="w-full text-left px-4 py-3 hover:bg-blue-50 transition disabled:opacity-50 flex items-center justify-between group"
          >
            <div className="flex-1">
              <p className="text-sm font-medium text-slate-900 group-hover:text-blue-600 transition truncate">
                {search.keyword}
              </p>
              <p className="text-xs text-slate-500 mt-1">
                {formatDate(search.lastSearched)}
                {search.searchCount > 1 && ` • Searched ${search.searchCount}x`}
              </p>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation()
                onDeleteSearch(search.id)
              }}
              className="ml-2 p-1 text-slate-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition"
              title="Remove from history"
            >
              <X size={16} />
            </button>
          </button>
        ))}
      </div>
    </div>
  )
}
