import React, { useState } from 'react'
import { HelpCircle } from 'lucide-react'

interface TooltipProps {
  term: string
  definition: string
  children?: React.ReactNode
  showIcon?: boolean
}

export const Tooltip = ({ term, definition, children, showIcon = false }: TooltipProps) => {
  const [isVisible, setIsVisible] = useState(false)

  return (
    <div className="relative inline-block">
      <span
        className="underline decoration-dotted cursor-help hover:text-blue-600 transition"
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
      >
        {children || term}
        {showIcon && <HelpCircle size={14} className="inline ml-1" />}
      </span>
      {isVisible && (
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-slate-900 text-white text-sm rounded-lg whitespace-nowrap z-50 pointer-events-none">
          <div className="font-semibold">{term}</div>
          <div className="text-xs text-slate-200 mt-1">{definition}</div>
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full border-4 border-transparent border-t-slate-900"></div>
        </div>
      )}
    </div>
  )
}

// Tooltip Definitions Dictionary
export const TOOLTIP_DEFINITIONS: Record<string, string> = {
  DA: 'Domain Authority - A score (1-100) predicting how well a website will rank on search engines',
  PA: 'Page Authority - A score (1-100) predicting how well a specific page will rank',
  'Domain Authority': 'A score (1-100) predicting how well a website will rank on search engines',
  'Page Authority': 'A score (1-100) predicting how well a specific page will rank',
  CTR: 'Click-Through Rate - The percentage of people who click on your link when it appears in search results',
  'Click-Through Rate': 'The percentage of people who click on your link when it appears in search results',
  SERP: 'Search Engine Results Page - The page Google shows after someone searches for a keyword',
  'Search Engine Results Page': 'The page Google shows after someone searches for a keyword',
  Backlinks: 'Links from other websites pointing to your page. More backlinks = higher authority',
  'Backlink': 'A link from another website pointing to your page',
  'Spam Score': "A metric (0-100) indicating how likely a page is to be penalized by Google. Lower is better.",
  'Keyword Difficulty': 'How hard it is to rank for a keyword (0-100). Higher = more competition',
  'Entry Difficulty': 'How challenging it will be to rank for this keyword. Considers domain authority and competition.',
  ROI: 'Return on Investment - The financial return you get from ranking for this keyword',
  'Return on Investment': 'The financial return you get from ranking for this keyword',
  'Traffic Potential': 'Estimated monthly visitors you could get if you rank at different positions',
  'Competitive Gaps': 'The difference between your site and competitors in authority, backlinks, and page speed',
  'Market Saturation': 'How many special SERP features (ads, snippets, etc.) are taking clicks away from organic results',
  'Opportunity Matrix': 'A framework showing which keywords are easiest to win and bring the most traffic',
  'ROI Potential': 'Estimated revenue you could earn if you rank #1 for this keyword',
  'Trend Analysis': 'Whether search volume for this keyword is growing, stable, or declining',
  'Position Breakdown': 'How many visitors you would get for each ranking position (#1, #2, etc.)',
  'Featured Snippet': 'A highlighted answer box at the top of Google search results',
  'People Also Ask': 'A section showing common related questions with answers from search results',
  'Knowledge Panel': 'An information box showing facts about a person, place, or thing on Google',
  'Local Pack': "Google's map and business listings showing local results for location-based searches",
  'Conversion Rate': 'The percentage of visitors who take a desired action (sign up, purchase, etc.)',
}

// Helper component for common metrics with tooltips
export const MetricWithTooltip = ({ label, value, unit, tooltipKey }: { 
  label: React.ReactNode 
  value: string | number
  unit?: string
  tooltipKey?: string
}) => {
  const definition = tooltipKey && TOOLTIP_DEFINITIONS[tooltipKey] ? TOOLTIP_DEFINITIONS[tooltipKey] : undefined

  return (
    <div>
      <p className="text-sm text-slate-600 mb-1">
        {typeof label === 'string' && definition ? (
          <Tooltip term={tooltipKey || label} definition={definition}>
            {label}
          </Tooltip>
        ) : (
          label
        )}
      </p>
    </div>
  )
}
