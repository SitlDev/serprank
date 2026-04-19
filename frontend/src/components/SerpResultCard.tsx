import React from 'react'
import { AlertCircle, TrendingUp, AlertTriangle } from 'lucide-react'

interface SerpResultCardProps {
  position: number
  domain: string
  url: string
  domainScore: number
  pageScore: number
  weaknessCount: number
  weaknesses: Array<{ type: string; severity: 'critical' | 'high' | 'medium' | 'low' }>
  onClick?: () => void
}

export const SerpResultCard = ({
  position,
  domain,
  url,
  domainScore,
  pageScore,
  weaknessCount,
  weaknesses,
  onClick,
}: SerpResultCardProps) => {
  const severityColors = {
    critical: 'text-red-600 bg-red-50',
    high: 'text-orange-600 bg-orange-50',
    medium: 'text-yellow-600 bg-yellow-50',
    low: 'text-green-600 bg-green-50',
  }

  const criticalCount = weaknesses.filter((w) => w.severity === 'critical').length
  const highCount = weaknesses.filter((w) => w.severity === 'high').length

  return (
    <div
      onClick={onClick}
      className="card cursor-pointer hover:shadow-xl transition-all duration-300 hover:border-brand-200 border border-slate-100"
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="flex items-baseline gap-2 mb-2">
            <span className="text-2xl font-bold text-brand-600">#{position}</span>
            <a href={url} target="_blank" rel="noopener noreferrer" className="text-sm text-slate-500 hover:text-slate-700">
              {domain}
            </a>
          </div>
          <p className="text-xs text-slate-500 truncate max-w-sm">{url}</p>
        </div>
        {weaknessCount > 0 && (
          <div className="flex items-center gap-1 px-3 py-1 bg-red-50 text-red-600 rounded-lg whitespace-nowrap">
            <AlertTriangle size={16} />
            <span className="text-sm font-semibold">{weaknessCount}</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <p className="text-xs text-slate-500 mb-1">Domain Score</p>
          <div className="flex items-end gap-2">
            <span className="text-2xl font-bold text-slate-900">{domainScore}</span>
            <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden mb-1">
              <div
                className="gradient-brand h-full rounded-full"
                style={{ width: `${domainScore}%` }}
              ></div>
            </div>
          </div>
        </div>
        <div>
          <p className="text-xs text-slate-500 mb-1">Page Score</p>
          <div className="flex items-end gap-2">
            <span className="text-2xl font-bold text-slate-900">{pageScore}</span>
            <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden mb-1">
              <div
                className="gradient-accent h-full rounded-full"
                style={{ width: `${pageScore}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {weaknessCount > 0 && (
        <div className="flex flex-wrap gap-2">
          {criticalCount > 0 && (
            <span className="text-xs px-2 py-1 bg-red-50 text-red-600 rounded-full font-semibold">
              {criticalCount} Critical
            </span>
          )}
          {highCount > 0 && (
            <span className="text-xs px-2 py-1 bg-orange-50 text-orange-600 rounded-full font-semibold">
              {highCount} High
            </span>
          )}
        </div>
      )}
    </div>
  )
}
