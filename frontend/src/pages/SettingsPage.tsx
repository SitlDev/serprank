import React, { useEffect, useState } from 'react'
import { ArrowLeft, Settings as SettingsIcon, Check } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { SettingsService, UserSettings } from '../services/settings'
import { Alert } from '../components/Alert'

export default function SettingsPage() {
  const navigate = useNavigate()
  const [settings, setSettings] = useState<UserSettings | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [savingKey, setSavingKey] = useState<string | null>(null)

  useEffect(() => {
    loadSettings()
  }, [])

  const loadSettings = async () => {
    try {
      setLoading(true)
      const data = await SettingsService.getSettings()
      console.log('Settings loaded:', data)
      console.log('Data type:', typeof data)
      console.log('Data keys:', Object.keys(data))
      console.log('Checking all properties:')
      const allKeys: (keyof UserSettings)[] = [
        'id', 'userId', 'showTrafficPotential', 'showPositionBreakdown', 'showCompetitiveGaps',
        'showEntryDifficulty', 'showMarketSaturation', 'showSerpFeatures', 'showRoiPotential',
        'showTrendAnalysis', 'showKeywordClusters', 'showOpportunityMatrix', 'showSearchVolumeTrend',
        'showRankingProgress', 'showTrafficChart', 'showDifficultyTrend', 'showCompetitionIntensity',
        'createdAt', 'updatedAt'
      ]
      
      for (const key of allKeys) {
        const value = data[key]
        console.log(`  ${key}: ${value} (${typeof value})`)
      }
      
      setSettings(data)
    } catch (err: any) {
      console.error('Error loading settings:', err)
      setError(err.response?.data?.error || 'Failed to load settings')
    } finally {
      setLoading(false)
    }
  }

  const handleToggle = async (key: keyof UserSettings) => {
    if (!settings) return

    // Validate the property exists and is a boolean
    const currentValue = settings[key]
    if (typeof currentValue !== 'boolean') {
      console.error(`Property ${key} is not a boolean, it's ${typeof currentValue}:`, currentValue)
      setError(`Cannot toggle ${key}: property is not a boolean`)
      return
    }

    setSavingKey(key)
    setError(null)
    setSuccess(null)

    try {
      console.log('Updating setting:', key, 'from:', currentValue, 'to:', !currentValue)
      const updated = await SettingsService.updateSettings({
        [key]: !currentValue,
      })
      console.log('Settings update response:', updated)
      setSettings(updated)
      setSuccess('Settings updated!')
      setTimeout(() => setSuccess(null), 2000)
    } catch (err: any) {
      console.error('Failed to update settings:', err)
      const errorMsg = err.response?.data?.error || err.message || 'Failed to save settings'
      setError(errorMsg)
    } finally {
      setSavingKey(null)
    }
  }

  const Toggle = ({ 
    label, 
    description, 
    settingKey 
  }: { 
    label: string; 
    description: string; 
    settingKey: keyof UserSettings 
  }) => {
    if (!settings) return null
    const isEnabled = settings[settingKey]
    const isSaving = savingKey === settingKey

    return (
      <div className="flex items-start justify-between p-4 hover:bg-slate-50 transition">
        <div className="flex-1">
          <h4 className="font-semibold text-slate-900">{label}</h4>
          <p className="text-sm text-slate-600 mt-1">{description}</p>
        </div>
        <button
          onClick={() => handleToggle(settingKey)}
          disabled={isSaving}
          className={`ml-4 px-4 py-2 rounded-lg font-medium transition flex items-center justify-center whitespace-nowrap min-w-[80px] ${
            isEnabled
              ? 'bg-blue-100 text-blue-700 hover:bg-blue-200'
              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
          } ${isSaving ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {isSaving ? (
            <span className="inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
          ) : (
            isEnabled ? '✓ On' : 'Off'
          )}
        </button>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <p className="text-slate-600">Loading settings...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center space-x-4">
          <button
            onClick={() => navigate('/dashboard')}
            className="p-2 hover:bg-slate-100 rounded-lg transition"
          >
            <ArrowLeft size={20} className="text-slate-600" />
          </button>
          <div className="flex items-center space-x-3">
            <SettingsIcon size={24} className="text-blue-600" />
            <h1 className="text-2xl font-bold text-slate-900">Dashboard Settings</h1>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8">
        {error && <Alert type="error" message={error} onClose={() => setError(null)} />}
        {success && <Alert type="success" message={success} />}

        {/* Traffic Analysis Section */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 mb-6">
          <div className="px-6 py-4 border-b border-slate-200 bg-gradient-to-r from-blue-50 to-blue-100">
            <h2 className="text-lg font-bold text-slate-900">📊 Traffic & Opportunity Analysis</h2>
            <p className="text-sm text-slate-600 mt-1">Control which traffic and opportunity metrics appear on your dashboard</p>
          </div>
          <div className="divide-y divide-slate-200">
            <Toggle
              label="Traffic Potential"
              description="Show estimated monthly visitors for each ranking position"
              settingKey="showTrafficPotential"
            />
            <Toggle
              label="Position Breakdown"
              description="Display detailed traffic estimates by rank position (#1, #2, #3, etc.)"
              settingKey="showPositionBreakdown"
            />
            <Toggle
              label="Opportunity Matrix"
              description="Visual matrix showing volume vs difficulty sweet spots"
              settingKey="showOpportunityMatrix"
            />
          </div>
        </div>

        {/* Competition Analysis Section */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 mb-6">
          <div className="px-6 py-4 border-b border-slate-200 bg-gradient-to-r from-orange-50 to-orange-100">
            <h2 className="text-lg font-bold text-slate-900">⚔️ Competition Analysis</h2>
            <p className="text-sm text-slate-600 mt-1">Understand how competitive keywords are and what gaps exist</p>
          </div>
          <div className="divide-y divide-slate-200">
            <Toggle
              label="Competitive Gaps"
              description="Identify exploitable weaknesses in top competitor content"
              settingKey="showCompetitiveGaps"
            />
            <Toggle
              label="Entry Difficulty"
              description="See how long it might take your domain to rank for this keyword"
              settingKey="showEntryDifficulty"
            />
            <Toggle
              label="Market Saturation"
              description="Check for featured snippets, ads, and other SERP features reducing CTR"
              settingKey="showMarketSaturation"
            />
            <Toggle
              label="SERP Features"
              description="Detailed breakdown of which rich results appear in the SERP"
              settingKey="showSerpFeatures"
            />
          </div>
        </div>

        {/* Advanced Metrics Section */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 mb-6">
          <div className="px-6 py-4 border-b border-slate-200 bg-gradient-to-r from-purple-50 to-purple-100">
            <h2 className="text-lg font-bold text-slate-900">🚀 Advanced Metrics</h2>
            <p className="text-sm text-slate-600 mt-1">Advanced analysis features for power users (may require additional data)</p>
          </div>
          <div className="divide-y divide-slate-200">
            <Toggle
              label="ROI Potential"
              description="Estimate potential revenue based on traffic and conversion assumptions"
              settingKey="showRoiPotential"
            />
            <Toggle
              label="Trend Analysis"
              description="Track if search volume is growing, declining, or stable over time"
              settingKey="showTrendAnalysis"
            />
            <Toggle
              label="Keyword Clusters"
              description="Group related keywords to create comprehensive content strategies"
              settingKey="showKeywordClusters"
            />
          </div>
        </div>

        {/* Info Box */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="font-semibold text-blue-900 mb-2">💡 Tip</h3>
          <p className="text-sm text-blue-800">
            You can always come back here to customize what data appears on your dashboard. This helps you focus on the metrics that matter most to your strategy.
          </p>
        </div>

        {/* Time-Series Charts Section */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 mb-6">
          <div className="px-6 py-4 border-b border-slate-200 bg-gradient-to-r from-cyan-50 to-cyan-100">
            <h2 className="text-lg font-bold text-slate-900">📈 Time-Series Charts</h2>
            <p className="text-sm text-slate-600 mt-1">Track how keyword metrics change over time with adjustable date ranges</p>
          </div>
          <div className="divide-y divide-slate-200">
            <Toggle
              label="Search Volume Trend"
              description="Visualize how search interest for this keyword evolves (7-365 days)"
              settingKey="showSearchVolumeTrend"
            />
            <Toggle
              label="Ranking Progress"
              description="Track your ranking position improvements over time"
              settingKey="showRankingProgress"
            />
            <Toggle
              label="Traffic Estimate Chart"
              description="See estimated traffic changes as your ranking improves"
              settingKey="showTrafficChart"
            />
            <Toggle
              label="Keyword Difficulty Trend"
              description="Monitor competition level changes over time"
              settingKey="showDifficultyTrend"
            />
            <Toggle
              label="Competition Intensity"
              description="Track average domain authority and backlinks of top competitors"
              settingKey="showCompetitionIntensity"
            />
          </div>
        </div>

        {/* Info Box */}
      </div>
    </div>
  )
}
