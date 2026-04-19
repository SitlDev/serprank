import React, { useState } from 'react'
import { Search, TrendingUp, Zap, AlertCircle, LogOut, Loader, ChevronDown } from 'lucide-react'
import { Button } from '../components/Button'
import { Input } from '../components/Input'
import { Alert } from '../components/Alert'
import { KeywordService } from '../services/keywords'
import { AuthService } from '../services/auth'
import { useNavigate } from 'react-router-dom'

export default function Dashboard() {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [analysis, setAnalysis] = useState<any | null>(null)
  const [expandedResult, setExpandedResult] = useState<number | null>(null)

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

        {/* Results */}
        {analysis && (
          <div className="space-y-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* KeywordScore Card */}
              <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
                <p className="text-slate-600 text-sm font-semibold mb-3">KeywordScore</p>
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
                <p className="text-slate-600 text-sm font-semibold mb-3">Opportunity</p>
                <div className={`px-4 py-3 rounded-lg border ${getOpportunityColor(analysis.analysis.opportunityLevel)}`}>
                  <p className="text-lg font-bold">
                    {getOpportunityEmoji(analysis.analysis.opportunityLevel)} {analysis.analysis.opportunityLevel.charAt(0).toUpperCase() + analysis.analysis.opportunityLevel.slice(1)}
                  </p>
                </div>
              </div>

              {/* Traffic Estimate */}
              <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
                <p className="text-slate-600 text-sm font-semibold mb-3">Est. Traffic</p>
                <p className="text-3xl font-bold text-green-600">{analysis.analysis.estimatedTraffic.toLocaleString()}</p>
                <p className="text-xs text-slate-600 mt-2">Monthly visits if rank #1</p>
              </div>

              {/* Avg Domain Score */}
              <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
                <p className="text-slate-600 text-sm font-semibold mb-3">Avg DA</p>
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
                  <p className="text-sm text-slate-600 mb-2">Keyword Difficulty</p>
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
                  <p className="text-sm text-slate-600 mb-2">SERP Weaknesses</p>
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
                  <p className="text-sm text-slate-600 mb-2">Competition</p>
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
                          <p className="text-xs text-slate-600 mb-1">Domain Authority</p>
                          <p className="text-lg font-bold text-slate-900">{result.metrics.domainScore}</p>
                        </div>
                        <div>
                          <p className="text-xs text-slate-600 mb-1">Page Authority</p>
                          <p className="text-lg font-bold text-slate-900">{result.metrics.pageScore}</p>
                        </div>
                        <div>
                          <p className="text-xs text-slate-600 mb-1">Page Speed</p>
                          <p className="text-lg font-bold text-slate-900">{result.metrics.pageSpeed.toFixed(2)}s</p>
                        </div>
                        <div>
                          <p className="text-xs text-slate-600 mb-1">Spam Score</p>
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
                                      {weakness.weaknessType.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Top Navigation */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl gradient-brand flex items-center justify-center text-white font-bold">
              SR
            </div>
            <span className="text-xl font-bold text-slate-900">SERPRank</span>
          </div>
          <div className="flex items-center space-x-4">
            <div className="px-4 py-2 bg-brand-100 text-brand-700 rounded-lg text-sm font-semibold">
              📊 1,000 credits
            </div>
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

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="heading-lg mb-2">Keyword Intelligence</h1>
          <p className="text-slate-600">Discover opportunities competitors missed and track your ranking potential</p>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 mb-8 border-b border-slate-200">
          {tabs.map((tab) => {
            const Icon = tab.icon
            const isActive = activeTab === tab.id
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-4 py-3 border-b-2 transition-colors ${
                  isActive
                    ? 'border-brand-500 text-brand-600 font-semibold'
                    : 'border-transparent text-slate-600 hover:text-slate-900'
                }`}
              >
                <Icon size={20} />
                <span>{tab.label}</span>
              </button>
            )
          })}
        </div>

        {/* Main Content */}
        <div className="space-y-6">
          {/* Alerts */}
          {error && <Alert type="error" message={error} onClose={() => setError(null)} />}

          {/* Search & Filters */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              <input
                type="text"
                placeholder="Enter keyword to analyze..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAnalyze()}
                className="w-full pl-12 pr-4 py-3 bg-white border border-slate-300 rounded-xl focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-200"
              />
            </div>
            <button className="px-6 py-3 bg-white border border-slate-300 rounded-xl hover:bg-slate-50 transition flex items-center justify-center space-x-2">
              <Filter size={20} />
              <span>Filters</span>
            </button>
            <Button onClick={handleAnalyze} isLoading={isLoading}>
              <Plus size={20} className="mr-1" />
              Analyze
            </Button>
          </div>

          {/* Analysis Results */}
          {analysis && (
            <div className="space-y-6">
              {/* Keyword Score Card */}
              <div className="card border border-slate-200">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h3 className="heading-sm mb-2">{analysis.keyword}</h3>
                    <p className="text-slate-600">{analysis.recommendation}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-4xl font-bold text-gradient mb-2">{analysis.keywordScore}</div>
                    <p className="text-sm text-slate-600">Opportunity Score</p>
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  <div className="p-4 bg-brand-50 rounded-lg border border-brand-200">
                    <p className="text-xs text-slate-600 mb-1">Avg Domain Score</p>
                    <p className="text-2xl font-bold text-brand-600">{analysis.avgDomainScore}</p>
                  </div>
                  <div className="p-4 bg-accent-50 rounded-lg border border-accent-200">
                    <p className="text-xs text-slate-600 mb-1">Total Weaknesses Found</p>
                    <p className="text-2xl font-bold text-accent-600">{analysis.totalWeaknesses}</p>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                    <p className="text-xs text-slate-600 mb-1">Ranking Difficulty</p>
                    <p className="text-2xl font-bold text-slate-600">Medium</p>
                  </div>
                </div>
              </div>

              {/* SERP Results */}
              <div className="card border border-slate-200">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="heading-sm">Top 10 Results</h3>
                  <button className="flex items-center space-x-2 text-slate-600 hover:text-slate-900 transition">
                    <Download size={20} />
                    <span className="text-sm">Export</span>
                  </button>
                </div>

                <div className="space-y-3">
                  {analysis.results.map((result, i) => (
                    <SerpResultCard
                      key={i}
                      position={result.position}
                      domain={result.domain}
                      url={result.url}
                      domainScore={result.domainScore}
                      pageScore={result.pageScore}
                      weaknessCount={result.weaknessCount}
                      weaknesses={result.weaknesses}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Historical Keywords */}
          {!analysis && (
            <div className="card border border-slate-200">
              <div className="flex justify-between items-center mb-6">
                <h3 className="heading-sm">Recent Keywords</h3>
                <button className="flex items-center space-x-2 text-slate-600 hover:text-slate-900 transition">
                  <Download size={20} />
                  <span className="text-sm">Export</span>
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-200">
                      <th className="text-left py-4 px-4 font-semibold text-slate-700">Keyword</th>
                      <th className="text-right py-4 px-4 font-semibold text-slate-700">Volume</th>
                      <th className="text-right py-4 px-4 font-semibold text-slate-700">Score</th>
                      <th className="text-right py-4 px-4 font-semibold text-slate-700">Difficulty</th>
                      <th className="text-center py-4 px-4 font-semibold text-slate-700">Trend</th>
                      <th className="text-right py-4 px-4 font-semibold text-slate-700">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mockKeywords.map((kw, i) => (
                      <tr key={i} className="border-b border-slate-100 hover:bg-slate-50 transition">
                        <td className="py-4 px-4 font-medium text-slate-900">{kw.keyword}</td>
                        <td className="py-4 px-4 text-right text-slate-700">{kw.volume.toLocaleString()}</td>
                        <td className="py-4 px-4 text-right">
                          <div className="flex items-center justify-end space-x-2">
                            <div className="w-32 bg-slate-200 rounded-full h-2">
                              <div className="gradient-brand h-2 rounded-full" style={{ width: `${kw.score}%` }}></div>
                            </div>
                            <span className="text-sm font-semibold text-slate-900">{kw.score}</span>
                          </div>
                        </td>
                        <td className="py-4 px-4 text-right text-slate-700">{kw.difficulty}</td>
                        <td className="py-4 px-4 text-center">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            kw.trend === 'up' ? 'bg-brand-100 text-brand-700' : 'bg-slate-100 text-slate-700'
                          }`}>
                            {kw.trend === 'up' ? '📈 Up' : '↔️ Stable'}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-right">
                          <button className="text-brand-600 hover:text-brand-700 font-semibold text-sm">
                            Analyze →
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="mt-6 flex justify-between items-center pt-6 border-t border-slate-200">
                <p className="text-sm text-slate-600">Showing 3 of 2,485 keywords</p>
                <div className="flex space-x-2">
                  <button className="px-3 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 transition text-sm">←</button>
                  <button className="px-3 py-2 border border-slate-300 rounded-lg bg-brand-50 text-brand-600 font-semibold text-sm">1</button>
                  <button className="px-3 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 transition text-sm">2</button>
                  <button className="px-3 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 transition text-sm">→</button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
