import React from 'react'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'
import { Tooltip, TOOLTIP_DEFINITIONS } from './Tooltip'

interface TrafficBreakdownProps {
  data: Array<{
    position: number
    ctr: number
    estimatedMonthlyVisitors: number
  }>
}

export const TrafficBreakdown = ({ data }: TrafficBreakdownProps) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
      <h3 className="font-semibold text-slate-900 mb-4">📊 <Tooltip term="Traffic Potential" definition={TOOLTIP_DEFINITIONS['Traffic Potential']}>Traffic Potential by Position</Tooltip></h3>
      <div className="space-y-3">
        {data.slice(0, 5).map((item) => (
          <div key={item.position} className="flex items-center justify-between pb-3 border-b border-slate-100 last:border-b-0">
            <div>
              <p className="font-semibold text-slate-900">Position #{item.position}</p>
              <p className="text-sm text-slate-600"><Tooltip term="CTR" definition={TOOLTIP_DEFINITIONS['CTR']}>{item.ctr}% CTR</Tooltip></p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-blue-600">{item.estimatedMonthlyVisitors}</p>
              <p className="text-xs text-slate-600">visitors/month</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

interface CompetitiveGapsProps {
  data: {
    domainAuthorityGap: number
    backlinkGap: number
    pageSpeedGap: number
    summary: string
  }
}

export const CompetitiveGaps = ({ data }: CompetitiveGapsProps) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
      <h3 className="font-semibold text-slate-900 mb-4">⚔️ <Tooltip term="Competitive Gaps" definition={TOOLTIP_DEFINITIONS['Competitive Gaps']}>Competitive Gaps</Tooltip></h3>
      <div className="grid md:grid-cols-3 gap-4 mb-4">
        <div className="bg-red-50 p-4 rounded-lg border border-red-200">
          <p className="text-sm text-slate-600 mb-1"><Tooltip term="Domain Authority" definition={TOOLTIP_DEFINITIONS['Domain Authority']}>Domain Authority</Tooltip></p>
          <p className="text-2xl font-bold text-red-600">+{data.domainAuthorityGap}</p>
          <p className="text-xs text-slate-600 mt-1">DA to match competitors</p>
        </div>
        <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
          <p className="text-sm text-slate-600 mb-1"><Tooltip term="Backlinks" definition={TOOLTIP_DEFINITIONS['Backlinks']}>Backlinks Needed</Tooltip></p>
          <p className="text-2xl font-bold text-orange-600">+{data.backlinkGap}</p>
          <p className="text-xs text-slate-600 mt-1">Referring domains</p>
        </div>
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <p className="text-sm text-slate-600 mb-1">Page Speed</p>
          <p className="text-2xl font-bold text-blue-600">{data.pageSpeedGap}s</p>
          <p className="text-xs text-slate-600 mt-1">Faster loading</p>
        </div>
      </div>
      <p className="text-sm text-slate-700 bg-blue-50 p-3 rounded border border-blue-200">{data.summary}</p>
    </div>
  )
}

interface EntryDifficultyProps {
  data: {
    difficulty: 'Easy' | 'Medium' | 'Hard' | 'Very Hard'
    estimatedMonthsToRank: {
      position10: number
      position5: number
      position1: number
    }
    recommendation: string
  }
}

export const EntryDifficulty = ({ data }: EntryDifficultyProps) => {
  const difficultyColors = {
    'Easy': 'bg-green-100 text-green-800 border-green-300',
    'Medium': 'bg-yellow-100 text-yellow-800 border-yellow-300',
    'Hard': 'bg-orange-100 text-orange-800 border-orange-300',
    'Very Hard': 'bg-red-100 text-red-800 border-red-300'
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
      <h3 className="font-semibold text-slate-900 mb-4">📈 <Tooltip term="Entry Difficulty" definition={TOOLTIP_DEFINITIONS['Entry Difficulty']}>Entry Difficulty</Tooltip></h3>
      <div className={`inline-block px-4 py-2 rounded-lg font-semibold mb-4 border ${difficultyColors[data.difficulty]}`}>
        {data.difficulty}
      </div>
      
      <div className="grid md:grid-cols-3 gap-4 mb-4">
        <div className="bg-slate-50 p-4 rounded-lg">
          <p className="text-sm text-slate-600 mb-2">Position #10</p>
          <p className="text-3xl font-bold text-slate-900">{data.estimatedMonthsToRank.position10}</p>
          <p className="text-xs text-slate-600">months</p>
        </div>
        <div className="bg-slate-50 p-4 rounded-lg">
          <p className="text-sm text-slate-600 mb-2">Position #5</p>
          <p className="text-3xl font-bold text-slate-900">{data.estimatedMonthsToRank.position5}</p>
          <p className="text-xs text-slate-600">months</p>
        </div>
        <div className="bg-slate-50 p-4 rounded-lg">
          <p className="text-sm text-slate-600 mb-2">Position #1</p>
          <p className="text-3xl font-bold text-slate-900">{data.estimatedMonthsToRank.position1}</p>
          <p className="text-xs text-slate-600">months</p>
        </div>
      </div>
      <p className="text-sm text-slate-700 bg-blue-50 p-3 rounded border border-blue-200">{data.recommendation}</p>
    </div>
  )
}

interface RoiPotentialProps {
  data: {
    estimatedMonthlyVisitors: number
    assumedConversionRate: number
    estimatedMonthlyLeads: number
    assumedLeadValue: number
    estimatedMonthlyRevenue: number
  }
}

export const RoiPotential = ({ data }: RoiPotentialProps) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
      <h3 className="font-semibold text-slate-900 mb-4">💰 <Tooltip term="ROI Potential" definition={TOOLTIP_DEFINITIONS['ROI Potential']}>ROI Potential</Tooltip> (at Position #1)</h3>
      <div className="space-y-3">
        <div className="flex justify-between p-3 bg-slate-50 rounded">
          <span className="text-slate-700">Monthly Visitors</span>
          <span className="font-semibold text-slate-900">{data.estimatedMonthlyVisitors.toLocaleString()}</span>
        </div>
        <div className="flex justify-between p-3 bg-slate-50 rounded">
          <span className="text-slate-700"><Tooltip term="Conversion Rate" definition={TOOLTIP_DEFINITIONS['Conversion Rate']}>Conversion Rate</Tooltip></span>
          <span className="font-semibold text-slate-900">{(data.assumedConversionRate * 100).toFixed(1)}%</span>
        </div>
        <div className="flex justify-between p-3 bg-blue-50 rounded border border-blue-200">
          <span className="text-slate-700">Estimated Leads/Month</span>
          <span className="font-semibold text-blue-900">{data.estimatedMonthlyLeads}</span>
        </div>
        <div className="flex justify-between p-3 bg-blue-50 rounded border border-blue-200">
          <span className="text-slate-700">Lead Value (avg)</span>
          <span className="font-semibold text-blue-900">${data.assumedLeadValue.toLocaleString()}</span>
        </div>
        <div className="flex justify-between p-3 bg-green-50 rounded border border-green-300">
          <span className="font-semibold text-slate-900">Estimated Monthly Revenue</span>
          <span className="text-xl font-bold text-green-600">${data.estimatedMonthlyRevenue.toLocaleString()}</span>
        </div>
      </div>
      <p className="text-xs text-slate-600 mt-4">Assumptions: 2% conversion rate, $500 avg lead value. Customize in settings.</p>
    </div>
  )
}

interface TrendAnalysisProps {
  data: {
    trend: 'growing' | 'stable' | 'declining'
    percentageChange: number
    quarterChange: number
    recommendation: string
  }
}

export const TrendAnalysis = ({ data }: TrendAnalysisProps) => {
  const TrendIcon = data.trend === 'growing' ? TrendingUp : data.trend === 'declining' ? TrendingDown : Minus

  const trendColors = {
    'growing': 'text-green-600',
    'declining': 'text-red-600',
    'stable': 'text-slate-600'
  }

  const bgColors = {
    'growing': 'bg-green-50 border-green-200',
    'declining': 'bg-red-50 border-red-200',
    'stable': 'bg-slate-50 border-slate-200'
  }

  return (
    <div className={`bg-white rounded-lg shadow-sm border border-slate-200 p-6`}>
      <h3 className="font-semibold text-slate-900 mb-4">📊 <Tooltip term="Trend Analysis" definition={TOOLTIP_DEFINITIONS['Trend Analysis']}>Search Volume Trend</Tooltip></h3>
      <div className={`p-4 rounded-lg border ${bgColors[data.trend]} mb-4`}>
        <div className="flex items-center justify-between mb-3">
          <span className="text-slate-700 font-semibold">Trend</span>
          <div className="flex items-center space-x-2">
            <TrendIcon size={24} className={trendColors[data.trend]} />
            <span className="text-lg font-bold capitalize">{data.trend}</span>
          </div>
        </div>
        <div className="text-2xl font-bold">{data.percentageChange > 0 ? '+' : ''}{data.quarterChange}%</div>
        <p className="text-sm text-slate-600 mt-1">per quarter</p>
      </div>
      <p className="text-sm text-slate-700 bg-blue-50 p-3 rounded border border-blue-200">{data.recommendation}</p>
    </div>
  )
}
