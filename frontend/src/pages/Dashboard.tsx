import React, { useState } from 'react'
import { Search, Filter, Download, Plus, TrendingUp, Zap, AlertCircle, LogOut } from 'lucide-react'
import { Button } from '../components/Button'
import { Input } from '../components/Input'
import { Alert } from '../components/Alert'
import { SerpResultCard } from '../components/SerpResultCard'
import { KeywordService, KeywordAnalysis } from '../services/keywords'
import { AuthService } from '../services/auth'
import { useNavigate } from 'react-router-dom'

export default function Dashboard() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('keywords')
  const [searchQuery, setSearchQuery] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [analysis, setAnalysis] = useState<KeywordAnalysis | null>(null)

  const tabs = [
    { id: 'keywords', label: 'Keyword Research', icon: Search },
    { id: 'analysis', label: 'SERP Analysis', icon: TrendingUp },
    { id: 'competitors', label: 'Competitors', icon: Zap },
    { id: 'gaps', label: 'Content Gaps', icon: AlertCircle },
  ]

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
      setError(err.response?.data?.error || 'Error analyzing keyword')
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogout = () => {
    AuthService.logout()
    navigate('/')
  }

  const mockKeywords = [
    { keyword: 'best coffee makers 2026', volume: 8900, score: 85, difficulty: 45, trend: 'up' },
    { keyword: 'how to make cold brew', volume: 5400, score: 78, difficulty: 32, trend: 'up' },
    { keyword: 'espresso machine brands', volume: 4200, score: 72, difficulty: 58, trend: 'stable' },
  ]

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
