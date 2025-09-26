import React from 'react'

interface TooltipProps {
  title: string
  children: React.ReactNode
}

/**
 * Tooltip component that displays a title when hovered over.
 * @param title - The text to display as the tooltip.
 * @param children - The content inside the tooltip wrapper.
 */
const Tooltip: React.FC<TooltipProps> = ({ title, children }) => {
  return (
    <div className="relative group inline-block">
      {children}
      <div className="absolute bottom-full left-0 mb-2 hidden group-hover:block bg-gray-800 text-white text-sm rounded py-1 px-2 whitespace-nowrap">
        {title}
      </div>
    </div>
  )
}

export default Tooltip
