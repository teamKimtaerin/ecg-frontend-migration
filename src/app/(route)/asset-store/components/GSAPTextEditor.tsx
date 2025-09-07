'use client'

import {
  cn,
  logComponentWarning,
  TRANSITIONS,
  type BaseComponentProps,
} from '@/lib/utils'
import { AssetMetadata, SchemaProperty } from '@/types/asset-store'
import React, { useCallback, useEffect, useRef, useState } from 'react'

// GSAP 타입 선언
interface GSAP {
  set: (target: string | HTMLElement, vars: Record<string, unknown>) => void
  to: (target: string | HTMLElement, vars: Record<string, unknown>) => void
  killTweensOf: (target: string | HTMLElement) => void
}

declare global {
  interface Window {
    gsap: GSAP
  }
}

// GSAP 텍스트 에디터 Props 타입
interface GSAPTextEditorProps extends BaseComponentProps {
  onAddToCart?: () => void
  configFile?: string
}

// 회전 방향 타입
type RotationDirection = 'left' | 'right'

// 동적 속성 값 타입
interface PropertyValues {
  [key: string]: string | number | boolean
}

// 리사이즈 핸들 타입
type ResizeHandle = 'top-right' | 'bottom-left' | null

// GSAP 텍스트 에디터 컴포넌트
export const GSAPTextEditor: React.FC<GSAPTextEditorProps> = ({
  onAddToCart,
  configFile,
  className,
}) => {
  const [text, setText] = useState('안녕하세요!')
  const [rotationDirection, setRotationDirection] =
    useState<RotationDirection>('right')
  const [assetConfig, setAssetConfig] = useState<AssetMetadata | null>(null)
  const [propertyValues, setPropertyValues] = useState<PropertyValues>({})
  const [isDragging, setIsDragging] = useState(false)
  const [isResizing, setIsResizing] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const [resizeHandle, setResizeHandle] = useState<ResizeHandle>(null)

  // 통합된 컨테이너 상태
  const [containerPosition, setContainerPosition] = useState({ x: 150, y: 100 })
  const [containerSize, setContainerSize] = useState({
    width: 400,
    height: 120,
  })

  const containerRef = useRef<HTMLDivElement>(null)
  const textRef = useRef<HTMLDivElement>(null)
  const previewAreaRef = useRef<HTMLDivElement>(null)

  // config 파일 로드
  useEffect(() => {
    const loadConfig = async () => {
      if (!configFile) return

      try {
        const response = await fetch(configFile)
        const config: AssetMetadata = await response.json()
        setAssetConfig(config)

        // 기본값으로 propertyValues 초기화
        const defaultValues: PropertyValues = {}
        Object.entries(config.schema).forEach(([key, property]) => {
          defaultValues[key] = property.default
        })
        setPropertyValues(defaultValues)

        // rotationDirection 기본값 설정
        if (
          defaultValues.rotationDirection &&
          typeof defaultValues.rotationDirection === 'string'
        ) {
          setRotationDirection(
            defaultValues.rotationDirection as RotationDirection
          )
        }
      } catch (error) {
        console.error('Config file load error:', error)
      }
    }

    loadConfig()
  }, [configFile])

  // 검증 로직
  useEffect(() => {
    if (!text.trim()) {
      logComponentWarning('GSAPTextEditor', 'Text should not be empty')
    }
  }, [text])

  // 에디터 컨테이너 클래스
  const editorClasses = cn(
    // 기본 스타일
    'gsap-editor',
    'min-h-[70vh]',
    'p-5',

    // 배경 및 색상
    'bg-gray-900',
    'text-gray-100',

    // 폰트
    'font-sans',

    // 트랜지션
    TRANSITIONS.normal,

    className
  )

  // 메인 컨테이너 클래스
  const mainContainerClasses = cn(
    // 레이아웃
    'grid',
    'grid-cols-1',
    'lg:grid-cols-[2fr_1fr]',
    'gap-10',
    'items-start',

    // 스타일링
    'bg-gray-800/90',
    'backdrop-blur-xl',
    'border',
    'border-white/10',
    'rounded-3xl',
    'p-10',

    // 그림자
    'shadow-2xl',
    'shadow-black/30',

    // 내부 그림자
    '[box-shadow:0_20px_40px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.1)]'
  )

  // 프리뷰 영역 클래스
  const previewAreaClasses = cn(
    // 레이아웃
    'flex',
    'items-center',
    'justify-center',
    'relative',
    'overflow-hidden',

    // 크기
    'min-h-[400px]',
    'h-[60vh]',

    // 스타일링
    'bg-gray-900/80',
    'border-2',
    'border-purple-500/30',
    'rounded-2xl'
  )

  // 컨트롤 영역 클래스
  const controlAreaClasses = cn(
    // 레이아웃
    'flex',
    'flex-col',
    'gap-6',

    // 스크롤
    'max-h-[60vh]',
    'overflow-y-auto',
    'pr-2'
  )

  useEffect(() => {
    // GSAP 라이브러리 로드
    if (typeof window !== 'undefined' && !window.gsap) {
      const script = document.createElement('script')
      script.src =
        'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js'
      script.onload = () => {
        console.log('GSAP loaded')
      }
      document.head.appendChild(script)
    }
  }, [])

  // 컨테이너 드래그 핸들러
  const handleContainerMouseDown = (e: React.MouseEvent) => {
    if (isResizing) return

    setIsDragging(true)
    const previewRect = previewAreaRef.current?.getBoundingClientRect()
    if (!previewRect) return

    setDragStart({
      x: e.clientX - previewRect.left - containerPosition.x,
      y: e.clientY - previewRect.top - containerPosition.y,
    })
    e.preventDefault()
  }

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDragging || !previewAreaRef.current) return

      const previewRect = previewAreaRef.current.getBoundingClientRect()
      const newX = e.clientX - previewRect.left - dragStart.x
      const newY = e.clientY - previewRect.top - dragStart.y

      const maxX = previewRect.width - containerSize.width
      const maxY = previewRect.height - containerSize.height

      const clampedX = Math.max(0, Math.min(newX, maxX))
      const clampedY = Math.max(0, Math.min(newY, maxY))

      setContainerPosition({ x: clampedX, y: clampedY })
    },
    [isDragging, dragStart, containerSize]
  )

  const handleMouseUp = useCallback(() => {
    setIsDragging(false)
  }, [])

  // 리사이즈 핸들러
  const handleResizeStart = (
    e: React.MouseEvent,
    handle: 'top-right' | 'bottom-left'
  ) => {
    e.stopPropagation()
    e.preventDefault()
    setIsResizing(true)
    setResizeHandle(handle)
    setDragStart({ x: e.clientX, y: e.clientY })
  }

  const handleResizeMove = useCallback(
    (e: MouseEvent) => {
      if (!isResizing || !resizeHandle) return

      const deltaX = e.clientX - dragStart.x
      const deltaY = e.clientY - dragStart.y

      setContainerSize((prevSize) => {
        let newWidth = prevSize.width
        let newHeight = prevSize.height

        if (resizeHandle === 'top-right') {
          newWidth = Math.max(200, Math.min(600, prevSize.width + deltaX))
          newHeight = Math.max(80, Math.min(300, prevSize.height - deltaY))
        } else if (resizeHandle === 'bottom-left') {
          newWidth = Math.max(200, Math.min(600, prevSize.width - deltaX))
          newHeight = Math.max(80, Math.min(300, prevSize.height + deltaY))
        }

        return { width: newWidth, height: newHeight }
      })

      setDragStart({ x: e.clientX, y: e.clientY })
    },
    [isResizing, resizeHandle, dragStart]
  )

  const handleResizeEnd = useCallback(() => {
    setIsResizing(false)
    setResizeHandle(null)
  }, [])

  // 이벤트 리스너
  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
      return () => {
        document.removeEventListener('mousemove', handleMouseMove)
        document.removeEventListener('mouseup', handleMouseUp)
      }
    }
  }, [isDragging, dragStart, handleMouseMove, handleMouseUp])

  useEffect(() => {
    if (isResizing) {
      document.addEventListener('mousemove', handleResizeMove)
      document.addEventListener('mouseup', handleResizeEnd)
      return () => {
        document.removeEventListener('mousemove', handleResizeMove)
        document.removeEventListener('mouseup', handleResizeEnd)
      }
    }
  }, [isResizing, dragStart, resizeHandle, handleResizeMove, handleResizeEnd])

  // 텍스트 분리 및 애니메이션 함수들
  const splitTextIntoWords = (element: HTMLElement, text: string) => {
    if (!element) return

    element.innerHTML = ''
    element.className = 'demo-text'

    if (!text.trim()) {
      element.textContent = '안녕하세요!'
      return
    }

    const words = text.split(' ')
    words.forEach((word, wordIndex) => {
      const wordSpan = document.createElement('span')
      wordSpan.className = 'word'
      wordSpan.style.display = 'inline-block'
      wordSpan.style.marginRight = '0.3em'

      for (let i = 0; i < word.length; i++) {
        const char = word.charAt(i)
        const charSpan = document.createElement('span')
        charSpan.className = 'char'
        charSpan.textContent = char
        charSpan.style.display = 'inline-block'
        wordSpan.appendChild(charSpan)
      }

      element.appendChild(wordSpan)
      if (wordIndex < words.length - 1) {
        element.appendChild(document.createTextNode(' '))
      }
    })
  }

  const rotationEffect = useCallback(
    (words: NodeListOf<Element>) => {
      if (!window.gsap) return

      // config에서 값 가져오거나 기본값 사용
      const rotationAngle =
        typeof propertyValues.rotationAngle === 'number'
          ? propertyValues.rotationAngle
          : 180
      const speed =
        typeof propertyValues.rotationSpeed === 'number'
          ? propertyValues.rotationSpeed
          : 1
      const duration =
        (typeof propertyValues.animationDuration === 'number'
          ? propertyValues.animationDuration
          : 2) / speed
      const stagger =
        typeof propertyValues.staggerDelay === 'number'
          ? propertyValues.staggerDelay
          : 0.3
      const direction = propertyValues.rotationDirection || rotationDirection
      const enableGradient = propertyValues.enableGradient || false

      const finalAngle = direction === 'right' ? rotationAngle : -rotationAngle

      words.forEach((word, index) => {
        // 그라데이션 효과 적용
        if (enableGradient) {
          ;(word as HTMLElement).style.background =
            'linear-gradient(45deg, #ff6b6b, #4ecdc4, #45b7d1)'
          ;(word as HTMLElement).style.backgroundClip = 'text'
          ;(word as HTMLElement).style.webkitBackgroundClip = 'text'
          ;(word as HTMLElement).style.webkitTextFillColor = 'transparent'
          ;(word as HTMLElement).style.backgroundSize = '200% 200%'
        } else {
          ;(word as HTMLElement).style.background = 'none'
          ;(word as HTMLElement).style.color = '#fff'
        }

        window.gsap.set(word as HTMLElement, {
          scale: 0,
          rotation: finalAngle,
          transformOrigin: 'center center',
        })

        window.gsap.to(word as HTMLElement, {
          scale: 1,
          rotation: 0,
          duration: duration,
          delay: index * stagger,
          ease: 'power2.out',
        })

        // 그라데이션 애니메이션
        if (enableGradient) {
          window.gsap.to(word as HTMLElement, {
            backgroundPosition: '200% 200%',
            duration: duration * 2,
            delay: index * stagger,
            repeat: -1,
            yoyo: true,
            ease: 'none',
          })
        }
      })
    },
    [propertyValues, rotationDirection]
  )

  const applyEffect = useCallback(() => {
    if (typeof window === 'undefined' || !window.gsap || !textRef.current)
      return

    const textElement = textRef.current

    // 기존 애니메이션 정리
    window.gsap.killTweensOf('*')

    // 텍스트를 단어별로 분리
    splitTextIntoWords(textElement, text)

    // 안전한 DOM 요소 조회
    const words = textElement?.querySelectorAll('.word') || []
    window.gsap.set(textElement, { opacity: 1 })

    if (words.length > 0) {
      rotationEffect(words)
    }
  }, [text, rotationEffect])

  const handleAddToCart = () => {
    onAddToCart?.()
    console.log('담기 버튼 클릭됨')
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      applyEffect()
    }
  }

  // 텍스트나 속성 변경 시 애니메이션 적용
  useEffect(() => {
    const timer = setTimeout(() => {
      applyEffect()
    }, 300)
    return () => clearTimeout(timer)
  }, [text, rotationDirection, propertyValues, applyEffect])

  // 속성 값 업데이트 함수
  const updatePropertyValue = (
    key: string,
    value: string | number | boolean
  ) => {
    setPropertyValues((prev) => ({
      ...prev,
      [key]: value,
    }))

    // rotationDirection 업데이트
    if (key === 'rotationDirection' && typeof value === 'string') {
      setRotationDirection(value as RotationDirection)
    }
  }

  // 슬라이더 컴포넌트
  const renderSlider = (
    key: string,
    property: SchemaProperty,
    label: string
  ) => (
    <div key={key} className="space-y-2">
      <label className="block text-gray-200 text-sm font-medium">
        {label}:{' '}
        {typeof propertyValues[key] === 'number'
          ? (propertyValues[key] as number).toFixed(1)
          : propertyValues[key]}
      </label>
      <input
        type="range"
        min={property.min}
        max={property.max}
        step={property.step || 0.1}
        value={
          typeof propertyValues[key] === 'number'
            ? propertyValues[key]
            : typeof property.default === 'number'
              ? property.default
              : 0
        }
        onChange={(e) => updatePropertyValue(key, parseFloat(e.target.value))}
        className={cn(
          'w-full',
          'h-2',
          'bg-gray-700',
          'rounded-lg',
          'appearance-none',
          'cursor-pointer',
          '[&::-webkit-slider-thumb]:appearance-none',
          '[&::-webkit-slider-thumb]:w-5',
          '[&::-webkit-slider-thumb]:h-5',
          '[&::-webkit-slider-thumb]:rounded-full',
          '[&::-webkit-slider-thumb]:bg-purple-500',
          '[&::-webkit-slider-thumb]:cursor-pointer',
          '[&::-webkit-slider-thumb]:shadow-lg'
        )}
      />
    </div>
  )

  // 체크박스 컴포넌트
  const renderCheckbox = (
    key: string,
    property: SchemaProperty,
    label: string
  ) => (
    <div key={key} className="space-y-2">
      <label
        className={cn(
          'flex',
          'items-center',
          'gap-3',
          'p-3',
          'bg-gray-900/60',
          'border',
          'border-white/10',
          'rounded-lg',
          'cursor-pointer',
          'hover:bg-gray-900/80',
          TRANSITIONS.normal
        )}
      >
        <input
          type="checkbox"
          checked={
            typeof propertyValues[key] === 'boolean'
              ? propertyValues[key]
              : typeof property.default === 'boolean'
                ? property.default
                : false
          }
          onChange={(e) => updatePropertyValue(key, e.target.checked)}
          className="w-4 h-4 text-purple-600 cursor-pointer"
        />
        <span className="text-sm text-gray-200">{label}</span>
      </label>
    </div>
  )

  // 라디오 버튼 컴포넌트
  const renderRadio = (
    key: string,
    property: SchemaProperty,
    label: string
  ) => (
    <div key={key} className="space-y-3">
      <label className="block text-gray-200 text-sm font-medium">
        {label}:
      </label>
      <div className="space-y-2">
        {property.enum?.map((option: string) => (
          <label
            key={option}
            className={cn(
              'flex',
              'items-center',
              'gap-3',
              'p-3',
              'bg-gray-900/60',
              'border',
              'border-white/10',
              'rounded-lg',
              'cursor-pointer',
              'hover:bg-gray-900/80',
              TRANSITIONS.normal
            )}
          >
            <input
              type="radio"
              name={key}
              value={option}
              checked={propertyValues[key] === option}
              onChange={(e) => updatePropertyValue(key, e.target.value)}
              className="w-4 h-4 text-purple-600 cursor-pointer"
            />
            <span className="text-sm text-gray-200">
              {option === 'left'
                ? '왼쪽으로 회전 (반시계 방향)'
                : option === 'right'
                  ? '오른쪽으로 회전 (시계 방향)'
                  : option}
            </span>
          </label>
        ))}
      </div>
    </div>
  )

  // 동적 컨트롤 렌더링
  const renderDynamicControls = () => {
    if (!assetConfig) return null

    const locale = 'ko'
    const translations = assetConfig.i18n?.[locale] || {}

    return Object.entries(assetConfig.schema).map(([key, property]) => {
      const label = translations[key] || key

      if (property.ui?.control === 'slider') {
        return renderSlider(key, property, label)
      } else if (property.ui?.control === 'checkbox') {
        return renderCheckbox(key, property, label)
      } else if (property.ui?.control === 'radio' && property.enum) {
        return renderRadio(key, property, label)
      }

      return null
    })
  }

  // 입력 필드 클래스
  const inputClasses = cn(
    'w-full',
    'px-4',
    'py-3',
    'bg-gray-900/90',
    'border',
    'border-purple-500/30',
    'rounded-xl',
    'text-white',
    'placeholder-gray-400',
    'text-lg',
    'shadow-lg',
    'shadow-black/20',
    'focus:outline-none',
    'focus:border-purple-500',
    TRANSITIONS.normal
  )

  // 버튼 클래스
  const buttonClasses = cn(
    'w-full',
    'px-8',
    'py-4',
    'bg-gradient-to-r',
    'from-purple-600',
    'to-pink-600',
    'border-0',
    'rounded-xl',
    'text-white',
    'text-xl',
    'font-bold',
    'uppercase',
    'tracking-wider',
    'cursor-pointer',
    'shadow-lg',
    'shadow-purple-500/30',
    'hover:shadow-xl',
    'hover:shadow-purple-500/40',
    'active:scale-95',
    TRANSITIONS.normal
  )

  return (
    <div className={editorClasses}>
      <div className={mainContainerClasses}>
        {/* 프리뷰 영역 */}
        <div ref={previewAreaRef} className={previewAreaClasses}>
          {/* 통합된 텍스트-경계 컨테이너 */}
          <div
            ref={containerRef}
            style={{
              position: 'absolute',
              left: `${containerPosition.x}px`,
              top: `${containerPosition.y}px`,
              width: `${containerSize.width}px`,
              height: `${containerSize.height}px`,
              transition: isDragging || isResizing ? 'none' : 'all 0.3s ease',
            }}
          >
            {/* 핑크 점선 경계 */}
            <div
              style={{
                position: 'absolute',
                left: '0px',
                top: '0px',
                width: '100%',
                height: '100%',
                border: '2px dashed rgba(255, 20, 147, 0.8)',
                borderRadius: '8px',
                background: 'rgba(255, 20, 147, 0.08)',
                pointerEvents: 'none',
              }}
            >
              {/* 리사이즈 핸들들 */}
              <div
                style={{
                  position: 'absolute',
                  top: '-8px',
                  right: '-8px',
                  width: '16px',
                  height: '16px',
                  background: 'rgba(255, 20, 147, 0.9)',
                  border: '2px solid rgba(255, 255, 255, 0.9)',
                  borderRadius: '50%',
                  cursor: 'ne-resize',
                  pointerEvents: 'auto',
                  zIndex: 20,
                }}
                onMouseDown={(e) => handleResizeStart(e, 'top-right')}
              />

              <div
                style={{
                  position: 'absolute',
                  bottom: '-8px',
                  left: '-8px',
                  width: '16px',
                  height: '16px',
                  background: 'rgba(255, 20, 147, 0.9)',
                  border: '2px solid rgba(255, 255, 255, 0.9)',
                  borderRadius: '50%',
                  cursor: 'sw-resize',
                  pointerEvents: 'auto',
                  zIndex: 20,
                }}
                onMouseDown={(e) => handleResizeStart(e, 'bottom-left')}
              />
            </div>

            {/* 텍스트 */}
            <div
              ref={textRef}
              className="demo-text"
              onMouseDown={handleContainerMouseDown}
              style={{
                position: 'absolute',
                left: '50%',
                top: '50%',
                transform: 'translate(-50%, -50%)',
                fontSize: '2.5rem',
                fontWeight: 'bold',
                color: '#fff',
                textAlign: 'center',
                opacity: 1,
                lineHeight: 1.2,
                cursor: isDragging ? 'grabbing' : 'grab',
                zIndex: 10,
                whiteSpace: 'nowrap',
                userSelect: 'none',
              }}
            >
              {text}
            </div>
          </div>
        </div>

        {/* 컨트롤 영역 */}
        <div className={controlAreaClasses}>
          {/* 텍스트 입력 */}
          <div className="space-y-2">
            <label className="block text-gray-200 text-lg font-medium">
              텍스트 입력:
            </label>
            <input
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="예: 안녕하세요!"
              maxLength={50}
              className={inputClasses}
            />
          </div>

          {/* 동적 컨트롤 */}
          {assetConfig ? (
            <div className="space-y-4">{renderDynamicControls()}</div>
          ) : (
            /* 기본 회전 방향 선택 */
            <div className="space-y-3">
              <label className="block text-gray-200 text-base font-medium">
                회전 방향:
              </label>
              <div className="space-y-3">
                {[
                  { value: 'left', label: '왼쪽으로 회전 (반시계 방향)' },
                  { value: 'right', label: '오른쪽으로 회전 (시계 방향)' },
                ].map(({ value, label }) => (
                  <label
                    key={value}
                    className={cn(
                      'flex',
                      'items-center',
                      'gap-3',
                      'p-3',
                      'bg-gray-900/60',
                      'border',
                      'border-white/10',
                      'rounded-lg',
                      'cursor-pointer',
                      'hover:bg-gray-900/80',
                      TRANSITIONS.normal
                    )}
                  >
                    <input
                      type="radio"
                      name="rotation"
                      value={value}
                      checked={rotationDirection === value}
                      onChange={(e) =>
                        setRotationDirection(
                          e.target.value as RotationDirection
                        )
                      }
                      className="w-4 h-4 text-purple-600 cursor-pointer"
                    />
                    <span
                      className={cn(
                        'flex-1',
                        'text-sm',
                        rotationDirection === value
                          ? 'text-purple-400'
                          : 'text-gray-200',
                        TRANSITIONS.colors
                      )}
                    >
                      {label}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* 담기 버튼 */}
          <button onClick={handleAddToCart} className={buttonClasses}>
            담기
          </button>
        </div>
      </div>

      <style jsx>{`
        .demo-text .char {
          display: inline-block;
          transform: scale(1);
          opacity: 1;
          position: relative;
        }
        .demo-text .word {
          display: inline-block;
          margin-right: 0.3em;
        }
        .gsap-editor::-webkit-scrollbar {
          width: 6px;
        }
        .gsap-editor::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 3px;
        }
        .gsap-editor::-webkit-scrollbar-thumb {
          background: rgba(138, 43, 226, 0.5);
          border-radius: 3px;
        }
      `}</style>
    </div>
  )
}
