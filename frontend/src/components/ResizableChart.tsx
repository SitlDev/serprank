import React, { useState } from 'react'
import { GripHorizontal } from 'lucide-react'

interface ResizableChartProps {
  children: React.ReactNode
  title: string
  defaultWidth?: string
}

export const ResizableChart: React.FC<ResizableChartProps> = ({
  children,
  title,
  defaultWidth = 'w-full'
}) => {
  const [isResizing, setIsResizing] = useState(false)
  const [width, setWidth] = useState<number | null>(null)

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsResizing(true)
    const startX = e.clientX
    const startWidth = width || (e.currentTarget.parentElement?.clientWidth || 500)

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const diff = moveEvent.clientX - startX
      const newWidth = Math.max(300, startWidth + diff)
      setWidth(newWidth)
    }

    const handleMouseUp = () => {
      setIsResizing(false)
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
  }

  return (
    <div
      style={width ? { width: `${width}px` } : undefined}
      className={`bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden transition-all ${
        isResizing ? 'cursor-col-resize opacity-90' : ''
      } ${!width ? defaultWidth : ''}`}
    >
      <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
        <h3 className="font-semibold text-slate-900">{title}</h3>
        <button
          onMouseDown={handleMouseDown}
          className="p-1 hover:bg-slate-200 rounded transition cursor-col-resize"
          title="Drag to resize"
        >
          <GripHorizontal size={16} className="text-slate-500" />
        </button>
      </div>
      <div className="p-4">
        {children}
      </div>
    </div>
  )
}
