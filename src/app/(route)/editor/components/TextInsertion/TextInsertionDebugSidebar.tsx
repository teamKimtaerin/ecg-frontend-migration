'use client'

import React from 'react'
import type { InsertedText } from '../../types/textInsertion'
import type { RendererConfigV2 } from '@/app/shared/motiontext'

interface TextInsertionDebugSidebarProps {
  currentTime: number
  activeTexts: InsertedText[]
  insertedTexts: InsertedText[]
  selectedTextId: string | null
  isScenarioMode: boolean
  currentScenario: RendererConfigV2 | null
  renderer: unknown
}

export default function TextInsertionDebugSidebar({
  currentTime,
  activeTexts,
  insertedTexts,
  selectedTextId,
  isScenarioMode,
  currentScenario,
  renderer,
}: TextInsertionDebugSidebarProps) {
  return (
    <div className="w-80 bg-gray-900 text-white p-4 overflow-y-auto h-full border-l border-gray-700">
      <div className="text-lg font-bold mb-4 text-blue-400">
        📊 텍스트 렌더링 디버거
      </div>

      {/* 기본 정보 */}
      <div className="bg-gray-800 rounded-lg p-3 mb-4">
        <div className="font-semibold mb-2 text-green-400">⚙️ 시스템 상태</div>
        <div className="text-sm space-y-1">
          <div>
            Mode: {isScenarioMode ? '🎬 Unified Scenario' : '✏️ Individual'}
          </div>
          <div>
            Current Time:{' '}
            <span className="font-mono text-yellow-400">
              {currentTime.toFixed(2)}s
            </span>
          </div>
          <div>
            Active Texts:{' '}
            <span className="text-blue-300">{activeTexts.length}</span>
          </div>
          <div>
            Total Texts:{' '}
            <span className="text-purple-300">{insertedTexts.length}</span>
          </div>
          <div>
            Selected:{' '}
            <span className="text-orange-300">{selectedTextId || 'None'}</span>
          </div>
          <div>Scenario: {currentScenario ? '✅' : '❌'}</div>
          <div>Renderer: {renderer ? '✅' : '❌'}</div>
        </div>
      </div>

      {/* 활성 텍스트 */}
      {activeTexts.length > 0 && (
        <div className="bg-gray-800 rounded-lg p-3 mb-4">
          <div className="font-semibold mb-2 text-green-400">
            🎯 활성 텍스트 ({activeTexts.length})
          </div>
          <div className="space-y-3 max-h-60 overflow-y-auto">
            {activeTexts.map((text, idx) => {
              const isInTimeRange =
                currentTime >= text.startTime && currentTime <= text.endTime
              return (
                <div key={text.id} className="bg-gray-700 rounded p-2 text-xs">
                  <div className="font-mono text-blue-300">#{idx + 1}</div>
                  <div className="font-semibold text-white mb-1">
                    &quot;{text.content.substring(0, 20)}
                    {text.content.length > 20 ? '...' : ''}&quot;
                  </div>
                  <div className="space-y-1 text-gray-300">
                    <div>
                      ⏰ {text.startTime.toFixed(1)}s -{' '}
                      {text.endTime.toFixed(1)}s
                    </div>
                    <div>
                      📍 ({text.position.x}%, {text.position.y}%)
                    </div>
                    <div>
                      {text.isSelected ? (
                        <span className="text-blue-400">🔵 Selected</span>
                      ) : (
                        <span className="text-gray-400">⚪ Normal</span>
                      )}
                    </div>
                    <div>
                      {isInTimeRange ? (
                        <span className="text-green-400">✅ Should Show</span>
                      ) : (
                        <span className="text-red-400">❌ Should Hide</span>
                      )}
                    </div>
                    <div className="font-mono text-xs text-gray-500">
                      ID: {text.id.substring(text.id.length - 8)}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* 전체 텍스트 */}
      {insertedTexts.length > 0 && (
        <div className="bg-gray-800 rounded-lg p-3 mb-4">
          <div className="font-semibold mb-2 text-purple-400">
            📝 전체 텍스트 ({insertedTexts.length})
          </div>
          <div className="space-y-2 max-h-80 overflow-y-auto">
            {insertedTexts.map((text, idx) => {
              const isActive = activeTexts.some(
                (activeText) => activeText.id === text.id
              )
              const isInTimeRange =
                currentTime >= text.startTime && currentTime <= text.endTime
              return (
                <div
                  key={text.id}
                  className="bg-gray-700 rounded p-2 text-xs opacity-90"
                >
                  <div className="font-mono text-purple-300">#{idx + 1}</div>
                  <div className="text-white mb-1">
                    &quot;{text.content.substring(0, 15)}
                    {text.content.length > 15 ? '...' : ''}&quot;
                  </div>
                  <div className="space-y-1 text-gray-300">
                    <div>
                      ⏰ {text.startTime.toFixed(1)}s -{' '}
                      {text.endTime.toFixed(1)}s
                    </div>
                    <div className="flex items-center gap-2">
                      {isActive ? (
                        <span className="text-green-400">🟢 Active</span>
                      ) : (
                        <span className="text-red-400">🔴 Inactive</span>
                      )}
                      <span>|</span>
                      {isInTimeRange ? (
                        <span className="text-green-400">✅ InTime</span>
                      ) : (
                        <span className="text-red-400">❌ OutTime</span>
                      )}
                    </div>
                    <div className="font-mono text-xs text-gray-500">
                      ID: {text.id.substring(text.id.length - 8)}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* 요약 정보 */}
      <div className="bg-gray-800 rounded-lg p-3">
        <div className="font-semibold mb-2 text-yellow-400">📈 요약</div>
        <div className="text-sm space-y-1">
          {insertedTexts.length > activeTexts.length && (
            <div className="text-gray-300">
              ⏸️ {insertedTexts.length - activeTexts.length}개 텍스트가 현재
              시간에 비활성화됨
            </div>
          )}
          {activeTexts.length === 0 && insertedTexts.length > 0 && (
            <div className="text-yellow-300">
              ⚠️ 텍스트가 있지만 현재 시간에 활성화된 것이 없습니다
            </div>
          )}
          {insertedTexts.length === 0 && (
            <div className="text-gray-400">📝 삽입된 텍스트가 없습니다</div>
          )}
        </div>
      </div>
    </div>
  )
}
