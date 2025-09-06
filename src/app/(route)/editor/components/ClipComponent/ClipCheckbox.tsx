import React from 'react'

interface ClipCheckboxProps {
  clipId: string
  isChecked: boolean
  isVisible?: boolean // Made optional since we'll always show it
  onCheck?: (clipId: string, checked: boolean) => void
}

export default function ClipCheckbox({
  clipId,
  isChecked,
  onCheck,
}: ClipCheckboxProps) {
  if (!onCheck) return null

  return (
    <input
      type="checkbox"
      checked={isChecked}
      onChange={(e) => {
        e.stopPropagation()
        onCheck(clipId, e.target.checked)
      }}
      onClick={(e) => e.stopPropagation()} // Prevent clip selection when clicking checkbox
      className="w-5 h-5 text-green-600 bg-gray-100 border-gray-300 rounded focus:ring-green-500 focus:ring-2 cursor-pointer"
    />
  )
}
