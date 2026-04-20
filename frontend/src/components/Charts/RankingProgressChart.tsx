// Chart component

interface RankingDataPoint {
  date: string
  position: number
}

interface RankingProgressChartProps {
  data: RankingDataPoint[]
  title?: string
  height?: string
}

export function RankingProgressChart({ data, title = 'Ranking Progress', height = '300px' }: RankingProgressChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className={`bg-white rounded-lg shadow p-6`} style={{ height }}>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
        <div className="flex items-center justify-center h-full text-gray-500">
          No data available
        </div>
      </div>
    )
  }

  // Calculate max position for scaling (lower position is better, so we invert)
  const maxPosition = Math.max(...data.map(d => d.position))
  const minPosition = Math.min(...data.map(d => d.position))
  const range = maxPosition - minPosition || 1

  // Create SVG path for line chart
  const width = Math.max(400, data.length * 30)
  const chartHeight = 200
  const padding = 40

  const points = data.map((d, i) => {
    const x = padding + (i / (data.length - 1 || 1)) * (width - padding * 2)
    // Invert Y position (lower rank = higher on chart)
    const y = padding + ((d.position - minPosition) / range) * chartHeight
    return { x, y, ...d }
  })

  const pathD = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ')

  // Determine trend
  const trend = data[data.length - 1].position < data[0].position ? 'up' : 'down'
  const improvement = Math.abs(data[data.length - 1].position - data[0].position)

  return (
    <div className="bg-white rounded-lg shadow p-6" style={{ height }}>
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
      <div className="overflow-x-auto">
        <svg width={width} height={chartHeight + padding * 2} className="mx-auto">
          {/* Grid lines */}
          {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => (
            <line
              key={i}
              x1={padding}
              y1={padding + ratio * chartHeight}
              x2={width - padding}
              y2={padding + ratio * chartHeight}
              stroke="#e5e7eb"
              strokeDasharray="4"
            />
          ))}

          {/* Y-axis labels */}
          {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => (
            <text
              key={`y-${i}`}
              x={padding - 10}
              y={padding + ratio * chartHeight + 4}
              textAnchor="end"
              className="text-xs fill-gray-500"
            >
              #{Math.round(minPosition + ratio * range)}
            </text>
          ))}

          {/* X-axis */}
          <line x1={padding} y1={padding + chartHeight} x2={width - padding} y2={padding + chartHeight} stroke="#d1d5db" strokeWidth="2" />
          {/* Y-axis */}
          <line x1={padding} y1={padding} x2={padding} y2={padding + chartHeight} stroke="#d1d5db" strokeWidth="2" />

          {/* Data points and labels */}
          {points.map((p, i) => (
            <g key={i}>
              {/* Date labels */}
              {i % Math.ceil(data.length / 6) === 0 && (
                <text
                  x={p.x}
                  y={padding + chartHeight + 20}
                  textAnchor="middle"
                  className="text-xs fill-gray-500"
                >
                  {new Date(p.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </text>
              )}
              {/* Data point circle */}
              <circle cx={p.x} cy={p.y} r="3" fill={trend === 'up' ? '#10b981' : '#ef4444'} />
            </g>
          ))}

          {/* Line path */}
          <path d={pathD} fill="none" stroke={trend === 'up' ? '#10b981' : '#ef4444'} strokeWidth="2" />

          {/* Area under curve */}
          <path
            d={`${pathD} L ${points[points.length - 1].x} ${padding + chartHeight} L ${points[0].x} ${padding + chartHeight} Z`}
            fill={trend === 'up' ? '#10b981' : '#ef4444'}
            fillOpacity="0.1"
          />
        </svg>
      </div>
      <div className="mt-4 grid grid-cols-3 gap-4 text-sm">
        <div>
          <span className="text-gray-600">Current:</span>
          <span className="font-semibold text-gray-900 ml-2">#{data[data.length - 1].position}</span>
        </div>
        <div>
          <span className="text-gray-600">Best:</span>
          <span className="font-semibold text-gray-900 ml-2">#{minPosition}</span>
        </div>
        <div>
          <span className={`text-gray-600`}>Trend:</span>
          <span className={`font-semibold ml-2 ${trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
            {trend === 'up' ? '↑' : '↓'} {improvement} positions
          </span>
        </div>
      </div>
    </div>
  )
}
