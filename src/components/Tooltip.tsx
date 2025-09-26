import React from 'react'

interface TooltipProps {
  title: string
  position?: ['top' | 'bottom', 'left' | 'right']
  children: React.ReactNode
}

/**
 * Tooltip component that displays a title when hovered over.
 * @param title - The text to display as the tooltip.
 * @param position - The position of the tooltip relative to the child element.
 * @param children - The content inside the tooltip wrapper.
 */
const Tooltip: React.FC<TooltipProps> = ({
  title,
  position = ['top', 'left'],
  children,
}) => {
  const verticalPositionClasses = {
    top: 'bottom-full mb-2',
    bottom: 'top-full mt-2',
  }

  const horizontalPositionClasses = {
    left: 'left-0',
    right: 'right-0',
  }

  const [vertical, horizontal] = position

  return (
    <div className="relative group inline-block">
      {children}
      <div
        className={`absolute hidden group-hover:block bg-gray-800 text-white text-sm rounded py-1 px-2 break-words text-center ${verticalPositionClasses[vertical]} ${horizontalPositionClasses[horizontal]}`}
      >
        {title}
      </div>
    </div>
  )
}

export default Tooltip
