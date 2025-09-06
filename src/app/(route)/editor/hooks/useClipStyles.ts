import { ClipStyleState } from '../types'
import { SEMANTIC_COLORS } from '@/lib/utils/colors'

export function useClipStyles({
  isSelected,
  isChecked,
  isMultiSelected,
  isHovered,
  isDragging = false,
}: ClipStyleState) {
  const getContainerClassName = () => {
    const baseClasses = 'bg-gray-200 rounded-lg transition-all cursor-pointer'

    const stateClasses = []

    if (isMultiSelected || isChecked) {
      stateClasses.push('ring-2 ring-green-500 bg-green-50')
    } else if (isSelected) {
      stateClasses.push('ring-2 ring-gray-400')
    } else if (!isDragging) {
      stateClasses.push('hover:bg-gray-300')
    }

    return `${baseClasses} ${stateClasses.join(' ')}`
  }

  const getSidebarClassName = () => {
    return 'w-16 flex items-center justify-center bg-gray-300 rounded-l-lg border-r border-gray-400 relative'
  }

  const getContentClassName = () => {
    return 'flex-1 flex flex-col'
  }

  return {
    containerClassName: getContainerClassName(),
    sidebarClassName: getSidebarClassName(),
    contentClassName: getContentClassName(),
  }
}
