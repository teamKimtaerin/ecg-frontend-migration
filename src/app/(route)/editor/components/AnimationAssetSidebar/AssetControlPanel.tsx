'use client'

import React from 'react'
import { IoSettings, IoRefresh, IoCheckmark, IoClose } from 'react-icons/io5'
import { AssetSettings } from './types'

interface AssetControlPanelProps {
  assetName: string
  onClose: () => void
  onSettingsChange?: (settings: AssetSettings) => void
}

const AssetControlPanel: React.FC<AssetControlPanelProps> = ({
  assetName,
  onClose,
  onSettingsChange,
}) => {
  // 임시 플레이스홀더 설정들
  const [speed, setSpeed] = React.useState(1.5)
  const [intensity, setIntensity] = React.useState(80)
  const [duration, setDuration] = React.useState(2.0)

  const handleReset = () => {
    setSpeed(1.0)
    setIntensity(100)
    setDuration(1.5)
  }

  const handleApply = () => {
    const settings: AssetSettings = { speed, intensity, duration }
    onSettingsChange?.(settings)
  }

  return (
    <div className="bg-slate-800/90 rounded-lg border border-slate-600/40 p-4 mt-3 transition-all duration-300 ease-in-out">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <IoSettings size={16} className="text-blue-400" />
          <h3 className="text-sm font-medium text-white">
            {assetName} 세부 조정
          </h3>
        </div>
        <button
          onClick={onClose}
          className="w-6 h-6 flex items-center justify-center rounded-md hover:bg-slate-700/50 transition-colors"
        >
          <IoClose size={14} className="text-slate-400" />
        </button>
      </div>

      {/* Controls */}
      <div className="space-y-4">
        {/* Speed Control */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-medium text-slate-300">
              🎛️ 속도
            </label>
            <span className="text-xs text-slate-400">{speed.toFixed(1)}x</span>
          </div>
          <input
            type="range"
            min="0.5"
            max="3"
            step="0.1"
            value={speed}
            onChange={(e) => setSpeed(parseFloat(e.target.value))}
            className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer slider"
          />
        </div>

        {/* Intensity Control */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-medium text-slate-300">
              💪 강도
            </label>
            <span className="text-xs text-slate-400">{intensity}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="200"
            step="10"
            value={intensity}
            onChange={(e) => setIntensity(parseInt(e.target.value))}
            className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer slider"
          />
        </div>

        {/* Duration Control */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-medium text-slate-300">
              ⏱️ 지속시간
            </label>
            <span className="text-xs text-slate-400">
              {duration.toFixed(1)}s
            </span>
          </div>
          <input
            type="range"
            min="0.5"
            max="5"
            step="0.1"
            value={duration}
            onChange={(e) => setDuration(parseFloat(e.target.value))}
            className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer slider"
          />
        </div>

        {/* Asset-specific controls placeholder */}
        <div className="pt-2 border-t border-slate-700/50">
          <p className="text-xs text-slate-500 italic">
            에셋별 세부 옵션은 추후 추가 예정
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2 mt-6">
        <button
          onClick={handleReset}
          className="flex-1 px-3 py-2 text-xs font-medium text-slate-300 bg-slate-700/50 hover:bg-slate-600/50 rounded-md transition-colors flex items-center justify-center gap-2"
        >
          <IoRefresh size={12} />
          초기화
        </button>
        <button
          onClick={handleApply}
          className="flex-1 px-3 py-2 text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors flex items-center justify-center gap-2"
        >
          <IoCheckmark size={12} />
          적용
        </button>
      </div>

      {/* Custom Slider Styles */}
      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          width: 18px;
          height: 18px;
          background: #3b82f6;
          border-radius: 50%;
          cursor: pointer;
          border: 2px solid #1e293b;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
        }

        .slider::-webkit-slider-thumb:hover {
          background: #2563eb;
          transform: scale(1.1);
        }

        .slider::-webkit-slider-track {
          background: #475569;
          border-radius: 4px;
          height: 8px;
        }

        .slider::-moz-range-thumb {
          width: 18px;
          height: 18px;
          background: #3b82f6;
          border-radius: 50%;
          cursor: pointer;
          border: 2px solid #1e293b;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
        }

        .slider::-moz-range-track {
          background: #475569;
          border-radius: 4px;
          height: 8px;
        }
      `}</style>
    </div>
  )
}

export default AssetControlPanel
