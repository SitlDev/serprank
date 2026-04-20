import React, { useState, useEffect } from 'react'
import { Search, TrendingUp, Zap, AlertCircle, LogOut, Loader, ChevronDown, Settings } from 'lucide-react'
import { Button } from '../components/Button'
import { Input } from '../components/Input'
import { Alert } from '../components/Alert'
import { Tooltip, TOOLTIP_DEFINITIONS } from '../components/Tooltip'
import { KeywordService } from '../services/keywords'
import { AuthService } from '../services/auth'
import { SettingsService, UserSettings } from '../services/settings'
import { 
  TrafficBreakdown,
  CompetitiveGaps,
  EntryDifficulty,
  RoiPotential,
  TrendAnalysis
} from '../components/MetricCards'
import {
  SearchVolumeChart,
  RankingProgressChart,
  TrafficChart,
  DifficultyTrendChart,
  CompetitionIntensityChart
} from '../components/Charts'
import { ResizableChart } from '../components/ResizableChart'
import { RecentSearches } from '../components/RecentSearches'
import { SearchHistoryService, SearchHistoryItem } from '../services/searchHistory'
import { useNavigate } from 'react-router-dom'

export default function Dashboard() {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [analysis, setAnalysis] = useState<any | null>(null)
  const [expandedResult, setExpandedResult] = useState<number | null>(null)
  const [settings, setSettings] = useState<UserSettings | null>(null)
  const [recentSearches, setRecentSearches] = useState<SearchHistoryItem[]>([])
  const [loadingSearches, setLoadingSearches] = useState(false)

  // Load user settings and recent searches on mount
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const userSettings = await SettingsService.getSettings()
        setSettings(userSettings)
      } catch (err) {
        console.error('Failed to load settings:', err)
        // Set default settings if load fails
        setSettings({
          id: '',
          userId: '',
          showTrafficPotential: true,
          showPositionBreakdown: true,
          showCompetitiveGaps: true,
          showEntryDifficulty: true,
          showMarketSaturation: false,
          showSerpFeatures: false,
          showRoiPotential: true,
          showTrendAnalysis: true,
          showKeywordClusters: false,
          showOpportunityMatrix: false,
          showSearchVolumeTrend: false,
          showRankingProgress: false,
          showTrafficChart: false,
          showDifficultyTrend: false,
          showCompetitionIntensity: false,
          createdAt: '',
          updatedAt: ''
        })
      }
    }

    loadSettings()
  }, [])

  // Load recent searches
  useEffect(() => {
    const loadRecentSearches = async () => {
      try {
        setLoadingSearches(true)
        const searches = await SearchHistoryService.getRecentSearches(5)
        setRecentSearches(searches)
      } catch (err) {
        console.error('Failed to load recent searches:', err)
      } finally {
        setLoadingSearches(false)
      }
    }

    loadRecentSearches()
  }, [])

  const handleAnalyze = async () => {
    if (!searchQuery.trim()) {
      setError('Please enter a keyword to analyze')
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const result = await KeywordService.analyzeKeyword(searchQuery)
      setAnalysis(result)
      
      // Add to search history
      try {
        await SearchHistoryService.addSearch(searchQuery)
        // Reload recent searches
        const searches = await SearchHistoryService.getRecentSearches(5)
        setRecentSearches(searches)
      } catch (err) {
        console.error('Failed to save search history:', err)
      }
    } catch (err: any) {
      setError(err.message || 'Error analyzing keyword')
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogout = () => {
    AuthService.logout()
    navigate('/')
  }

  const handleSearchFromHistory = (keyword: string) => {
    setSearchQuery(keyword)
    // Trigger analyze after setting query
    setTimeout(() => {
      const newSearchQuery = keyword
      if (newSearchQuery.trim()) {
        setIsLoading(true)
        setError(null)
        KeywordService.analyzeKeyword(newSearchQuery)
          .then((result) => {
            setAnalysis(result)
            // Add to search history
            SearchHistoryService.addSearch(newSearchQuery)
              .then(async () => {
                const searches = await SearchHistoryService.getRecentSearches(5)
                setRecentSearches(searches)
              })
              .catch((err) => console.error('Failed to save search history:', err))
          })
          .catch((err: any) => setError(err.message || 'Error analyzing keyword'))
          .finally(() => setIsLoading(false))
      }
    }, 0)
  }

  const handleDeleteSearch = async (searchId: string) => {
    try {
      await SearchHistoryService.deleteSearch(searchId)
      setRecentSearches(recentSearches.filter((s) => s.id !== searchId))
    } catch (err) {
      console.error('Failed to delete search:', err)
    }
  }

  const handleClearHistory = async () => {
    if (window.confirm('Are you sure you want to clear your search history?')) {
      try {
        await SearchHistoryService.clearHistory()
        setRecentSearches([])
      } catch (err) {
        console.error('Failed to clear history:', err)
      }
    }
  }

  const getOpportunityColor = (level: string) => {
    switch (level) {
      case 'exceptional':
        return 'bg-green-100 text-green-800 border-green-300'
      case 'strong':
        return 'bg-blue-100 text-blue-800 border-blue-300'
      case 'moderate':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300'
      case 'challenging':
        return 'bg-red-100 text-red-800 border-red-300'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getOpportunityEmoji = (level: string) => {
    switch (level) {
      case 'exceptional':
        return '🌟'
      case 'strong':
        return '✅'
      case 'moderate':
        return '⚠️'
      case 'challenging':
        return '❌'
      default:
        return '❓'
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'bg-red-100 text-red-700'
      case 'high':
        return 'bg-orange-100 text-orange-700'
      case 'medium':
        return 'bg-yellow-100 text-yellow-700'
      case 'low':
        return 'bg-blue-100 text-blue-700'
      default:
        return 'bg-gray-100 text-gray-700'
    }
  }

  // Generate mock time-series data for charts (90 days = 3 quarters for analysis)
  const generateMockChartData = (baseValue: number, trend: 'up' | 'down' | 'stable' = 'stable', days: number = 90) => {
    const data = []
    const today = new Date()
    
    for (let i = days; i >= 0; i--) {
      const date = new Date(today)
      date.setDate(date.getDate() - i)
      
      let value = baseValue
      
      // Add trend
      if (trend === 'up') {
        value = baseValue + (baseValue * (i / days) * 0.3)
      } else if (trend === 'down') {
        value = baseValue - (baseValue * (i / days) * 0.2)
      }
      
      // Add some random variation
      value = value + (Math.random() - 0.5) * (baseValue * 0.1)
      
      // Add quarterly markers in data
      const quarterDay = Math.floor(days / 4)
      const isQuarterStart = i % quarterDay === 0
      
      data.push({
        date: date.toISOString().split('T')[0],
        value: Math.max(0, Math.round(value)),
        isQuarterStart
      })
    }
    
    return data
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Top Navigation */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold">
              SR
            </div>
            <span className="text-xl font-bold text-slate-900">SERPRank</span>
          </div>
          <div className="flex items-center space-x-4">
            <div className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg text-sm font-semibold">
              📊 1,000 credits
            </div>
            <button
              onClick={() => navigate('/trending')}
              className="p-2 hover:bg-slate-100 rounded-lg transition flex items-center space-x-2 text-slate-600"
              title="Trending Searches"
            >
              <TrendingUp size={20} />
            </button>
            <button
              onClick={() => navigate('/settings')}
              className="p-2 hover:bg-slate-100 rounded-lg transition flex items-center space-x-2 text-slate-600"
              title="Settings"
            >
              <Settings size={20} />
            </button>
            <button
              onClick={handleLogout}
              className="p-2 hover:bg-slate-100 rounded-lg transition flex items-center space-x-2 text-slate-600"
            >
              <LogOut size={20} />
              <span className="text-sm">Sign Out</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2 text-slate-900">Keyword Intelligence</h1>
          <p className="text-slate-600">Discover opportunities competitors missed and track your ranking potential</p>
        </div>

        {/* Search Section */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-8">
          <div className="flex space-x-3">
            <Input
              type="text"
              placeholder="Enter a keyword to analyze (e.g., 'best headphones')"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAnalyze()}
              disabled={isLoading}
              className="flex-1"
            />
            <Button
              onClick={handleAnalyze}
              disabled={isLoading}
              className="px-6"
            >
              {isLoading ? (
                <>
                  <Loader size={18} className="animate-spin mr-2" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Search size={18} className="mr-2" />
                  Analyze
                </>
              )}
            </Button>
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

        {/* Recent Searches */}
        {!analysis && (
          <RecentSearches
            searches={recentSearches}
            isLoading={loadingSearches}
            onSearchClick={handleSearchFromHistory}
            onDeleteSearch={handleDeleteSearch}
            onClearHistory={handleClearHistory}
          />
        )}

        {/* Results */}
        {analysis && (
          <div className="space-y-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* KeywordScore Card */}
              <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
                <p className="text-slate-600 text-sm font-semibold mb-3">
                  <Tooltip term="Keyword Difficulty" definition="Our proprietary score (0-100) combining search volume, keyword difficulty, SERP weaknesses, and competition level">KeywordScore</Tooltip>
                </p>
                <div className="flex items-center space-x-3">
                  <div className="text-4xl font-bold text-blue-600">{analysis.analysis.keywordScore}</div>
                  <div className="flex-1">
                    <div className="w-full bg-slate-200 rounded-full h-2 mb-2">
                      <div
                        className="bg-gradient-to-r from-blue-400 to-blue-600 h-2 rounded-full transition-all"
                        style={{ width: `${analysis.analysis.keywordScore}%` }}
                      />
                    </div>
                    <p className="text-xs text-slate-600">Out of 100</p>
                  </div>
                </div>
              </div>

              {/* Opportunity Level */}
              <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
                <p className="text-slate-600 text-sm font-semibold mb-3">
                  <Tooltip term="Opportunity" definition="The potential for this keyword based on our comprehensive analysis algorithm">Opportunity</Tooltip>
                </p>
                <div className={`px-4 py-3 rounded-lg border ${getOpportunityColor(analysis.analysis.opportunityLevel)}`}>
                  <p className="text-lg font-bold">
                    {getOpportunityEmoji(analysis.analysis.opportunityLevel)} {analysis.analysis.opportunityLevel.charAt(0).toUpperCase() + analysis.analysis.opportunityLevel.slice(1)}
                  </p>
                </div>
              </div>

              {/* Traffic Estimate */}
              <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
                <p className="text-slate-600 text-sm font-semibold mb-3">
                  <Tooltip term="Traffic Potential" definition={TOOLTIP_DEFINITIONS['Traffic Potential']}>Est. Traffic</Tooltip>
                </p>
                <p className="text-3xl font-bold text-green-600">{analysis.analysis.estimatedTraffic.toLocaleString()}</p>
                <p className="text-xs text-slate-600 mt-2">Monthly visits if rank #1</p>
              </div>

              {/* Avg Domain Score */}
              <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
                <p className="text-slate-600 text-sm font-semibold mb-3">
                  <Tooltip term="Domain Authority" definition={TOOLTIP_DEFINITIONS['Domain Authority']}>Avg DA</Tooltip>
                </p>
                <p className="text-3xl font-bold text-purple-600">{analysis.analysis.avgDomainScore}</p>
                <p className="text-xs text-slate-600 mt-2">In top 10 results</p>
              </div>
            </div>

            {/* Scoring Breakdown */}
            <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
              <h3 className="text-lg font-bold text-slate-900 mb-4">Scoring Breakdown</h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="border border-slate-200 rounded-lg p-4">
                  <p className="text-sm text-slate-600 mb-2">Search Volume</p>
                  <div className="flex items-center space-x-2">
                    <div className="flex-1 bg-slate-200 rounded-full h-3">
                      <div
                        className="bg-blue-500 h-3 rounded-full"
                        style={{ width: `${analysis.scoringBreakdown.volumeScore}%` }}
                      />
                    </div>
                    <span className="font-bold text-slate-900">{analysis.scoringBreakdown.volumeScore}</span>
                  </div>
                </div>
                <div className="border border-slate-200 rounded-lg p-4">
                  <p className="text-sm text-slate-600 mb-2"><Tooltip term="Keyword Difficulty" definition={TOOLTIP_DEFINITIONS['Keyword Difficulty']}>Keyword Difficulty</Tooltip></p>
                  <div className="flex items-center space-x-2">
                    <div className="flex-1 bg-slate-200 rounded-full h-3">
                      <div
                        className="bg-green-500 h-3 rounded-full"
                        style={{ width: `${analysis.scoringBreakdown.difficultyScore}%` }}
                      />
                    </div>
                    <span className="font-bold text-slate-900">{analysis.scoringBreakdown.difficultyScore}</span>
                  </div>
                </div>
                <div className="border border-slate-200 rounded-lg p-4">
                  <p className="text-sm text-slate-600 mb-2"><Tooltip term="SERP" definition={TOOLTIP_DEFINITIONS['SERP']}>SERP</Tooltip> Weaknesses</p>
                  <div className="flex items-center space-x-2">
                    <div className="flex-1 bg-slate-200 rounded-full h-3">
                      <div
                        className="bg-orange-500 h-3 rounded-full"
                        style={{ width: `${analysis.scoringBreakdown.weaknessOpportunityScore}%` }}
                      />
                    </div>
                    <span className="font-bold text-slate-900">{analysis.scoringBreakdown.weaknessOpportunityScore}</span>
                  </div>
                </div>
                <div className="border border-slate-200 rounded-lg p-4">
                  <p className="text-sm text-slate-600 mb-2"><Tooltip term="Competitive Gaps" definition="How your domain compares to competitors in the SERP results">Competition</Tooltip></p>
                  <div className="flex items-center space-x-2">
                    <div className="flex-1 bg-slate-200 rounded-full h-3">
                      <div
                        className="bg-purple-500 h-3 rounded-full"
                        style={{ width: `${analysis.scoringBreakdown.competitionScore}%` }}
                      />
                    </div>
                    <span className="font-bold text-slate-900">{analysis.scoringBreakdown.competitionScore}</span>
                  </div>
                </div>
              </div>
              {analysis.scoringBreakdown.explanation && (
                <p className="text-sm text-slate-600 mt-4 p-3 bg-slate-50 rounded border border-slate-200">
                  {analysis.scoringBreakdown.explanation}
                </p>
              )}
            </div>

            {/* Advanced Metrics - Conditionally Rendered */}
            {analysis.advancedMetrics && settings && (
              <div className="space-y-6">
                <h3 className="text-lg font-bold text-slate-900">Advanced Analysis</h3>

                {/* Traffic Potential */}
                {settings.showTrafficPotential && (
                  <TrafficBreakdown data={analysis.advancedMetrics.trafficBreakdown} />
                )}

                {/* Competitive Gaps */}
                {settings.showCompetitiveGaps && (
                  <CompetitiveGaps data={analysis.advancedMetrics.competitiveGaps} />
                )}

                {/* Entry Difficulty */}
                {settings.showEntryDifficulty && (
                  <EntryDifficulty data={analysis.advancedMetrics.entryDifficulty} />
                )}

                {/* ROI Potential */}
                {settings.showRoiPotential && (
                  <RoiPotential data={analysis.advancedMetrics.roiPotential} />
                )}

                {/* Trend Analysis */}
                {settings.showTrendAnalysis && (
                  <TrendAnalysis data={analysis.advancedMetrics.trendAnalysis} />
                )}

                {/* Customize Settings Hint */}
                {!settings.showTrafficPotential && 
                 !settings.showCompetitiveGaps && 
                 !settings.showEntryDifficulty && 
                 !settings.showRoiPotential && 
                 !settings.showTrendAnalysis && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
                    <p className="text-blue-900">
                      📊 Advanced metrics disabled. Visit <button onClick={() => navigate('/settings')} className="underline font-semibold">settings</button> to enable them.
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* SERP Results */}
            <div className="space-y-3">
              <h3 className="text-lg font-bold text-slate-900">Performance Charts (Last 3 Quarters)</h3>

              {/* Charts Section - Resizable Grid */}
              {analysis && settings && (
                <div className="flex flex-wrap gap-6 items-start">
                  {/* Search Volume Trend */}
                  {settings.showSearchVolumeTrend && (
                    <ResizableChart title="Search Volume Trend" defaultWidth="lg:w-1/2">
                      <SearchVolumeChart
                        data={generateMockChartData(analysis.analysis.searchVolume, 'up').map((d: any) => ({
                          date: d.date,
                          volume: d.value
                        }))}
                        title=""
                        height="320px"
                      />
                    </ResizableChart>
                  )}

                  {/* Ranking Progress */}
                  {settings.showRankingProgress && (
                    <ResizableChart title="Ranking Progress" defaultWidth="lg:w-1/2">
                      <RankingProgressChart
                        data={generateMockChartData(15, 'up', 90).map((d: any) => ({
                          date: d.date,
                          position: Math.min(100, Math.max(1, Math.round(d.value / 10)))
                        }))}
                        title=""
                        height="320px"
                      />
                    </ResizableChart>
                  )}

                  {/* Estimated Traffic */}
                  {settings.showTrafficChart && (
                    <ResizableChart title="Estimated Monthly Traffic" defaultWidth="lg:w-1/2">
                      <TrafficChart
                        data={generateMockChartData(analysis.analysis.estimatedTraffic, 'up', 90).map((d: any) => ({
                          date: d.date,
                          traffic: d.value
                        }))}
                        title=""
                        height="320px"
                      />
                    </ResizableChart>
                  )}

                  {/* Difficulty Trend */}
                  {settings.showDifficultyTrend && (
                    <ResizableChart title="Keyword Difficulty Trend" defaultWidth="lg:w-1/2">
                      <DifficultyTrendChart
                        data={generateMockChartData(50, 'down', 90).map((d: any) => ({
                          date: d.date,
                          difficulty: Math.max(1, d.value / 10)
                        }))}
                        title=""
                        height="320px"
                      />
                    </ResizableChart>
                  )}

                  {/* Competition Intensity */}
                  {settings.showCompetitionIntensity && (
                    <ResizableChart title="Competition Intensity" defaultWidth="lg:w-1/2">
                      <CompetitionIntensityChart
                        data={generateMockChartData(65, 'stable', 90).map((d: any) => ({
                          date: d.date,
                          intensity: Math.min(100, Math.max(1, d.value / 10))
                        }))}
                        title=""
                        height="320px"
                      />
                    </ResizableChart>
                  )}
                </div>
              )}

              {/* No Charts Enabled Message */}
              {analysis && settings && 
               !settings.showSearchVolumeTrend &&
               !settings.showRankingProgress &&
               !settings.showTrafficChart &&
               !settings.showDifficultyTrend &&
               !settings.showCompetitionIntensity && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
                  <p className="text-blue-900">
                    📈 Performance charts disabled. Visit <button onClick={() => navigate('/settings')} className="underline font-semibold">settings</button> to enable them.
                  </p>
                </div>
              )}
            </div>

            {/* SERP Results */}
            <div className="space-y-3">
              <h3 className="text-lg font-bold text-slate-900">Top 10 Results</h3>
              {analysis.serpResults.map((result: any, index: number) => (
                <div
                  key={index}
                  className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden"
                >
                  <button
                    onClick={() => setExpandedResult(expandedResult === index ? null : index)}
                    className="w-full p-4 text-left hover:bg-slate-50 transition"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <span className="text-sm font-bold text-slate-900 bg-slate-100 px-3 py-1 rounded-full">
                            #{result.position}
                          </span>
                          <span className="text-sm font-semibold text-slate-600">{result.domain}</span>
                        </div>
                        <p className="text-slate-900 font-semibold truncate">{result.title}</p>
                        <p className="text-sm text-slate-500 truncate">{result.url}</p>
                      </div>
                      <ChevronDown
                        size={20}
                        className={`text-slate-400 transition-transform ${
                          expandedResult === index ? 'transform rotate-180' : ''
                        }`}
                      />
                    </div>
                  </button>

                  {/* Expanded Details */}
                  {expandedResult === index && (
                    <div className="border-t border-slate-200 bg-slate-50 p-4">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                        <div>
                          <p className="text-xs text-slate-600 mb-1"><Tooltip term="Domain Authority" definition={TOOLTIP_DEFINITIONS['Domain Authority']}>Domain Authority</Tooltip></p>
                          <p className="text-lg font-bold text-slate-900">{result.metrics.domainScore}</p>
                        </div>
                        <div>
                          <p className="text-xs text-slate-600 mb-1"><Tooltip term="Page Authority" definition={TOOLTIP_DEFINITIONS['Page Authority']}>Page Authority</Tooltip></p>
                          <p className="text-lg font-bold text-slate-900">{result.metrics.pageScore}</p>
                        </div>
                        <div>
                          <p className="text-xs text-slate-600 mb-1">Page Speed</p>
                          <p className="text-lg font-bold text-slate-900">{result.metrics.pageSpeed.toFixed(2)}s</p>
                        </div>
                        <div>
                          <p className="text-xs text-slate-600 mb-1"><Tooltip term="Spam Score" definition={TOOLTIP_DEFINITIONS['Spam Score']}>Spam Score</Tooltip></p>
                          <p className="text-lg font-bold text-slate-900">{result.metrics.spamScore}</p>
                        </div>
                      </div>

                      {/* Weaknesses */}
                      <div>
                        <p className="text-sm font-semibold text-slate-900 mb-2">
                          Detected Weaknesses ({result.weaknesses.length})
                        </p>
                        <div className="space-y-2">
                          {result.weaknesses.length > 0 ? (
                            result.weaknesses.map((weakness: any, wIdx: number) => (
                              <div key={wIdx} className="bg-white rounded p-2 border border-slate-200">
                                <div className="flex items-start space-x-2">
                                  <span className={`px-2 py-1 rounded text-xs font-semibold whitespace-nowrap ${getSeverityColor(weakness.severity)}`}>
                                    {weakness.severity.toUpperCase()}
                                  </span>
                                  <div className="flex-1">
                                    <p className="text-sm font-semibold text-slate-900">
                                      {weakness.weaknessType.split('_').map((w: string) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                                    </p>
                                    <p className="text-xs text-slate-600">{weakness.description}</p>
                                  </div>
                                </div>
                              </div>
                            ))
                          ) : (
                            <p className="text-sm text-slate-600 italic">No significant weaknesses detected</p>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {!analysis && !isLoading && (
          <div className="text-center py-12">
            <Search size={48} className="mx-auto text-slate-400 mb-4" />
            <h3 className="text-lg font-semibold text-slate-900 mb-2">No analysis yet</h3>
            <p className="text-slate-600">Enter a keyword above to get started with SERP analysis</p>
          </div>
        )}
      </div>
    </div>
  )
}
