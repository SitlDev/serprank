import React, { useState, useEffect } from 'react'
import { TrendingUp, ArrowUp, ArrowDown, TrendingUpIcon, LogOut, Home, Settings } from 'lucide-react'
import { Button } from '../components/Button'
import { Alert } from '../components/Alert'
import { TrendingService, TrendingKeyword, TrendingCategory, TrendingSource, TrendingSourceType } from '../services/trending'
import { KeywordService } from '../services/keywords'
import { AuthService } from '../services/auth'
import { useNavigate } from 'react-router-dom'

type ViewType = 'trending' | 'growth' | 'spiking' | 'categories'
type PeriodType = 'day' | 'week' | 'month'

export default function TrendingPage() {
  const navigate = useNavigate()
  const [activeView, setActiveView] = useState<ViewType>('trending')
  const [activePeriod, setActivePeriod] = useState<PeriodType>('week')
  const [activeSource, setActiveSource] = useState<TrendingSourceType>('google')
  const [keywords, setKeywords] = useState<TrendingKeyword[]>([])
  const [categories, setCategories] = useState<TrendingCategory[]>([])
  const [sources, setSources] = useState<TrendingSource[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedKeyword, setSelectedKeyword] = useState<string | null>(null)
  const [analyzing, setAnalyzing] = useState<Set<string>>(new Set())

  // Load available sources on mount
  useEffect(() => {
    const loadSources = async () => {
      try {
        const availableSources = await TrendingService.getTrendingSources()
        setSources(availableSources)
      } catch (err) {
        console.error('Failed to load trending sources:', err)
      }
    }
    loadSources()
  }, [])

  // Load trending data on mount and when view/period/source changes
  useEffect(() => {
    loadTrendingData()
  }, [activeView, activePeriod, activeSource])

  const loadTrendingData = async () => {
    setIsLoading(true)
    setError(null)
    
    try {
      if (activeView === 'categories') {
        const data = await TrendingService.getTrendingByCategory(activeSource, 15, activePeriod)
        setCategories(data)
        setKeywords([])
      } else if (activeView === 'growth') {
        const data = await TrendingService.getTrendingWithGrowth(activeSource, 20, activePeriod as 'week' | 'month')
        setKeywords(data)
        setCategories([])
      } else if (activeView === 'spiking') {
        const data = await TrendingService.getSpikingKeywords(activeSource, 20)
        setKeywords(data)
        setCategories([])
      } else {
        const data = await TrendingService.getTrendingKeywords(activeSource, 20, activePeriod)
        setKeywords(data)
        setCategories([])
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load trending keywords')
    } finally {
      setIsLoading(false)
    }
  }

  const handleAnalyzeKeyword = async (keyword: string) => {
    if (analyzing.has(keyword)) return

    setAnalyzing(prev => new Set(prev).add(keyword))
    setSelectedKeyword(keyword)

    try {
      await KeywordService.analyzeKeyword(keyword)
      navigate('/dashboard', { state: { analyzedKeyword: keyword } })
    } catch (err: any) {
      setError(err.message || 'Failed to analyze keyword')
      setAnalyzing(prev => {
        const next = new Set(prev)
        next.delete(keyword)
        return next
      })
    }
  }

  const handleLogout = () => {
    AuthService.logout()
    navigate('/')
  }

  const getTrendIcon = (trend: string, percentage: number) => {
    if (trend === 'up') {
      return (
        <div className="flex items-center space-x-1">
          <ArrowUp size={16} className="text-green-600" />
          <span className="text-green-600 font-semibold">{percentage > 0 ? '+' : ''}{percentage}%</span>
        </div>
      )
    } else if (trend === 'down') {
      return (
        <div className="flex items-center space-x-1">
          <ArrowDown size={16} className="text-red-600" />
          <span className="text-red-600 font-semibold">{percentage}%</span>
        </div>
      )
    } else {
      return (
        <div className="flex items-center space-x-1">
          <span className="text-gray-600 font-semibold">→ Stable</span>
        </div>
      )
    }
  }

  const getDifficultyColor = (difficulty: number) => {
    if (difficulty < 20) return 'bg-green-50 text-green-700 border-green-200'
    if (difficulty < 40) return 'bg-yellow-50 text-yellow-700 border-yellow-200'
    if (difficulty < 60) return 'bg-orange-50 text-orange-700 border-orange-200'
    return 'bg-red-50 text-red-700 border-red-200'
  }

  const getDifficultyLabel = (difficulty: number) => {
    if (difficulty < 20) return 'Very Easy'
    if (difficulty < 40) return 'Easy'
    if (difficulty < 60) return 'Moderate'
    if (difficulty < 80) return 'Hard'
    return 'Very Hard'
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <TrendingUp className="text-blue-600" size={32} />
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Trending Keywords</h1>
              <p className="text-xs text-slate-500">Most popular searches on SERPRank</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => navigate('/dashboard')}
              className="p-2 hover:bg-slate-100 rounded-lg transition flex items-center space-x-2 text-slate-600"
              title="Back to Dashboard"
            >
              <Home size={20} />
            </button>
            <button
              onClick={() => navigate('/settings')}
              className="p-2 hover:bg-slate-100 rounded-lg transition flex items-center space-x-2 text-slate-600"
              title="Settings"
            >
              <Settings size={20} />
            </button>
            <Button
              onClick={handleLogout}
              className="flex items-center space-x-2 bg-slate-100 text-slate-700 hover:bg-slate-200"
            >
              <LogOut size={18} />
              <span>Logout</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* View and Source Selector */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-8">
          <div className="flex flex-col lg:flex-row justify-between gap-8">
            {/* View Selector */}
            <div className="flex-1">
              <h2 className="text-lg font-semibold text-slate-900 mb-4">View</h2>
              <div className="flex flex-wrap gap-2">
                {[
                  { id: 'trending' as ViewType, label: '📊 Most Searched' },
                  { id: 'growth' as ViewType, label: '📈 Fastest Growing' },
                  { id: 'spiking' as ViewType, label: '⚡ Spiking Now' },
                  { id: 'categories' as ViewType, label: '🏷️ By Category' }
                ].map(view => (
                  <button
                    key={view.id}
                    onClick={() => setActiveView(view.id)}
                    className={`px-4 py-2 rounded-lg font-medium transition-all ${
                      activeView === view.id
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {view.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Source Selector */}
            <div className="flex-1 lg:flex-none lg:min-w-96">
              <h2 className="text-lg font-semibold text-slate-900 mb-4">Source</h2>
              <div className="space-y-3">
                {/* Search Engines */}
                {sources.filter(s => s.category === 'search-engine').length > 0 && (
                  <div>
                    <p className="text-xs font-semibold text-slate-600 mb-2 uppercase tracking-wide">Search Engines</p>
                    <div className="flex flex-wrap gap-2">
                      {sources.filter(s => s.category === 'search-engine').map(source => (
                        <button
                          key={source.id}
                          onClick={() => setActiveSource(source.id as TrendingSourceType)}
                          disabled={source.comingSoon}
                          title={source.description}
                          className={`px-3 py-2 rounded-lg font-medium text-sm transition-all ${
                            activeSource === source.id
                              ? 'bg-purple-600 text-white'
                              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                          } ${source.comingSoon ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                          {source.icon} {source.name}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Social Media & Commerce */}
                {sources.filter(s => ['social', 'social-commerce', 'short-video', 'community', 'video'].includes(s.category!)).length > 0 && (
                  <div>
                    <p className="text-xs font-semibold text-slate-600 mb-2 uppercase tracking-wide">Social & Commerce</p>
                    <div className="flex flex-wrap gap-2">
                      {sources.filter(s => ['social', 'social-commerce', 'short-video', 'community', 'video'].includes(s.category!)).map(source => (
                        <button
                          key={source.id}
                          onClick={() => setActiveSource(source.id as TrendingSourceType)}
                          disabled={source.comingSoon}
                          title={source.description}
                          className={`px-3 py-2 rounded-lg font-medium text-sm transition-all ${
                            activeSource === source.id
                              ? 'bg-purple-600 text-white'
                              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                          } ${source.comingSoon ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                          {source.icon} {source.name}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Time Period */}
            {activeView !== 'spiking' && (
              <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-4">Time Period</h3>
                <div className="flex gap-2">
                  {['day', 'week', 'month'].map(period => (
                    <button
                      key={period}
                      onClick={() => setActivePeriod(period as PeriodType)}
                      className={`px-4 py-2 rounded-lg font-medium transition-all capitalize ${
                        activePeriod === period
                          ? 'bg-blue-600 text-white'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      Last {period}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <Alert
            type="error"
            title="Error"
            message={error}
            onClose={() => setError(null)}
          />
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        )}

        {/* Trending Keywords View */}
        {!isLoading && activeView !== 'categories' && keywords.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {keywords.map((keyword, idx) => (
              <div
                key={keyword.keyword}
                className="bg-white rounded-lg shadow-sm border border-slate-200 p-5 hover:shadow-md transition-all hover:border-blue-300"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2 py-1 rounded">
                        #{idx + 1}
                      </span>
                      <span className="text-xs font-semibold text-slate-500 bg-blue-50 text-blue-700 px-2 py-1 rounded">
                        {keyword.searches} searches
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 break-words">{keyword.keyword}</h3>
                  </div>
                </div>

                {/* Trend Indicator */}
                <div className="mb-4">
                  {getTrendIcon(keyword.trending, keyword.trend_percentage)}
                </div>

                {/* Metrics */}
                <div className="grid grid-cols-2 gap-2 mb-4">
                  <div className="bg-slate-50 rounded p-2">
                    <p className="text-xs text-slate-600 font-medium">Volume</p>
                    <p className="text-sm font-bold text-slate-900">{keyword.volume.toLocaleString()}</p>
                  </div>
                  <div className={`rounded p-2 border ${getDifficultyColor(keyword.difficulty)}`}>
                    <p className="text-xs font-medium">Difficulty</p>
                    <p className="text-sm font-bold">{getDifficultyLabel(keyword.difficulty)}</p>
                  </div>
                </div>

                {/* Analyze Button */}
                <Button
                  onClick={() => handleAnalyzeKeyword(keyword.keyword)}
                  disabled={analyzing.has(keyword.keyword)}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                >
                  {analyzing.has(keyword.keyword) ? 'Analyzing...' : 'Analyze'}
                </Button>
              </div>
            ))}
          </div>
        )}

        {/* Categories View */}
        {!isLoading && activeView === 'categories' && categories.length > 0 && (
          <div className="space-y-6">
            {categories.map(category => (
              <div key={category.category} className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
                <h3 className="text-xl font-bold text-slate-900 mb-4">{category.category}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {category.keywords.map((keyword, idx) => (
                    <div
                      key={keyword.keyword}
                      className="border border-slate-200 rounded-lg p-4 hover:shadow-md transition-all hover:border-blue-300"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <h4 className="font-semibold text-slate-900">{keyword.keyword}</h4>
                          <p className="text-xs text-slate-500 mt-1">{keyword.searches} searches</p>
                        </div>
                        <span className="text-xs font-bold text-slate-600 bg-slate-100 px-2 py-1 rounded">
                          #{idx + 1}
                        </span>
                      </div>
                      <div className="flex items-center justify-between mb-3">
                        <span className={`text-xs px-2 py-1 rounded border font-medium ${getDifficultyColor(keyword.difficulty)}`}>
                          {getDifficultyLabel(keyword.difficulty)}
                        </span>
                        <span className="text-xs font-semibold text-slate-600">Vol: {keyword.volume.toLocaleString()}</span>
                      </div>
                      <Button
                        onClick={() => handleAnalyzeKeyword(keyword.keyword)}
                        disabled={analyzing.has(keyword.keyword)}
                        className="w-full text-sm bg-blue-600 hover:bg-blue-700 text-white py-1"
                      >
                        {analyzing.has(keyword.keyword) ? 'Analyzing...' : 'Analyze'}
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && keywords.length === 0 && categories.length === 0 && (
          <div className="text-center py-12">
            <TrendingUpIcon size={48} className="mx-auto text-slate-300 mb-4" />
            <h3 className="text-lg font-semibold text-slate-600 mb-2">No trending keywords yet</h3>
            <p className="text-slate-500">Trending data will appear as users perform keyword searches on SERPRank</p>
          </div>
        )}
      </div>
    </div>
  )
}
