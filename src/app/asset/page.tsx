'use client'

import React, { useState, useEffect, useRef } from 'react'

// GSAP 타입 선언
declare global {
  interface Window {
    gsap: any
  }
}

// Asset 타입 정의
interface AssetItem {
  id: string
  title: string
  category: string
  rating: number
  downloads: number
  thumbnail: string
  isPro?: boolean
}

// GSAP 텍스트 에디터 컴포넌트
const GSAPTextEditor = () => {
  const [text, setText] = useState('안녕하세요!')
  const [position, setPosition] = useState('center')
  const [delay, setDelay] = useState(0.8)
  const [effect, setEffect] = useState('pop')
  const [constrainAnimation, setConstrainAnimation] = useState(false)
  const [bounds, setBounds] = useState({
    top: 15,
    bottom: 15,
    left: 10,
    right: 10,
  })
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const [textPosition, setTextPosition] = useState({ x: 0, y: 0 })
  const demoTextRef = useRef<HTMLDivElement>(null)
  const previewAreaRef = useRef<HTMLDivElement>(null)

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

      return () => {
        if (document.head.contains(script)) {
          document.head.removeChild(script)
        }
      }
    }
  }, [])

  // 드래그 이벤트 핸들러들
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!demoTextRef.current) return

    setIsDragging(true)
    const rect = demoTextRef.current.getBoundingClientRect()
    setDragStart({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    })

    // 드래그 중에는 텍스트 선택 방지
    e.preventDefault()
  }

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging || !demoTextRef.current || !previewAreaRef.current) return

    const previewRect = previewAreaRef.current.getBoundingClientRect()
    const newX = e.clientX - previewRect.left - dragStart.x
    const newY = e.clientY - previewRect.top - dragStart.y

    // 프리뷰 영역 경계 내에서만 이동하도록 제한
    const textRect = demoTextRef.current.getBoundingClientRect()
    const maxX = previewRect.width - textRect.width
    const maxY = previewRect.height - textRect.height

    const clampedX = Math.max(0, Math.min(newX, maxX))
    const clampedY = Math.max(0, Math.min(newY, maxY))

    setTextPosition({ x: clampedX, y: clampedY })

    // 실제 DOM 위치 업데이트
    demoTextRef.current.style.left = `${clampedX}px`
    demoTextRef.current.style.top = `${clampedY}px`
    demoTextRef.current.style.transform = 'none'
    demoTextRef.current.style.position = 'absolute'
    demoTextRef.current.style.width = 'auto'
    demoTextRef.current.style.right = 'auto'
    demoTextRef.current.style.bottom = 'auto'
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  // 드래그 이벤트 리스너 등록/해제
  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)

      return () => {
        document.removeEventListener('mousemove', handleMouseMove)
        document.removeEventListener('mouseup', handleMouseUp)
      }
    }
  }, [isDragging, dragStart])

  const splitTextIntoWords = (element: HTMLElement, text: string) => {
    if (!element) return

    element.innerHTML = ''
    // 기존 클래스들 유지하고 기본 클래스만 초기화
    const currentClasses = element.className.split(' ')
    const positionClass = currentClasses.find((cls) =>
      cls.startsWith('position-')
    )
    element.className = positionClass
      ? `demo-text ${positionClass}`
      : 'demo-text'

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

  const updateTextPosition = () => {
    const demoText = demoTextRef.current
    if (!demoText) return

    // 기존 위치 클래스 제거
    demoText.classList.remove(
      'position-top',
      'position-center',
      'position-bottom'
    )

    // 새 위치 클래스 추가
    demoText.classList.add(`position-${position}`)

    // 디버깅용 로그
    console.log(
      'Position updated to:',
      position,
      'Classes:',
      demoText.className
    )
  }

  const createPhysicsBall = (x: number, y: number) => {
    if (typeof window === 'undefined' || !window.gsap) return

    const ball = document.createElement('div')
    ball.className = 'physics-ball'
    document.body.appendChild(ball)

    const size = Math.random() * 12 + 8

    window.gsap.set(ball, {
      width: size,
      height: size,
      left: x,
      top: y,
      scale: 0,
      position: 'fixed',
      borderRadius: '50%',
      background:
        'radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.9), rgba(138, 43, 226, 0.8), rgba(255, 20, 147, 0.9))',
      boxShadow:
        '0 0 20px rgba(138, 43, 226, 0.6), inset -5px -5px 10px rgba(0, 0, 0, 0.3), inset 5px 5px 10px rgba(255, 255, 255, 0.2)',
      pointerEvents: 'none',
      zIndex: 1000,
    })

    window.gsap
      .timeline({
        onComplete: () => {
          if (ball.parentNode) {
            ball.parentNode.removeChild(ball)
          }
        },
      })
      .to(ball, {
        scale: 1,
        duration: 0.2,
        ease: 'back.out(2)',
      })
      .to(
        ball,
        {
          y: `+=${Math.random() * 200 + 100}`,
          x: `+=${Math.random() * 160 - 80}`,
          rotation: Math.random() * 360,
          opacity: 0,
          duration: 1.5,
          ease: 'power2.out',
        },
        '<0.1'
      )
  }

  const posterEffect = (words: NodeListOf<Element>) => {
    if (!window.gsap || !demoTextRef.current) return

    words.forEach((word, index) => {
      window.gsap.set(word, {
        scale: 0,
        rotation: 360,
        transformOrigin: 'center center',
      })

      window.gsap.to(word, {
        scale: 1,
        rotation: 0,
        duration: 1.2,
        delay: index * delay,
        ease: 'back.out(1.7)',
      })
    })
  }

  const popEffect = (words: NodeListOf<Element>) => {
    if (!window.gsap || !demoTextRef.current) return

    words.forEach((word, index) => {
      window.gsap.set(word, {
        scale: 0,
        y: 50,
        transformOrigin: 'center center',
      })

      window.gsap.to(word, {
        scale: 1,
        y: 0,
        duration: 0.6,
        delay: index * delay,
        ease: 'back.out(2)',
        onComplete: function () {
          const chars = word.querySelectorAll('.char')
          chars.forEach((char: Element, charIndex: number) => {
            setTimeout(() => {
              const rect = char.getBoundingClientRect()
              const centerX = rect.left + rect.width / 2
              const centerY = rect.top + rect.height / 2

              for (let i = 0; i < 5; i++) {
                setTimeout(() => {
                  createPhysicsBall(
                    centerX + Math.random() * 10 - 5,
                    centerY + Math.random() * 10 - 5
                  )
                }, i * 15)
              }
            }, charIndex * 20)
          })
        },
      })
    })
  }

  const bounceEffect = (words: NodeListOf<Element>) => {
    if (!window.gsap || !demoTextRef.current) return

    demoTextRef.current.classList.add('bounce-text')

    words.forEach((word, index) => {
      window.gsap.set(word, {
        scale: 0,
        y: -100,
        transformOrigin: 'center center',
      })

      window.gsap.to(word, {
        scale: 1,
        y: 0,
        duration: 1,
        delay: index * delay,
        ease: 'bounce.out',
        onComplete: function () {
          const chars = word.querySelectorAll('.char')
          chars.forEach((char: Element, charIndex: number) => {
            ;(char as HTMLElement).style.animationDelay = `${charIndex * 0.1}s`
          })
        },
      })
    })
  }

  const applyEffect = () => {
    if (typeof window === 'undefined' || !window.gsap || !demoTextRef.current)
      return

    const demoText = demoTextRef.current

    // 기존 애니메이션 정리
    window.gsap.killTweensOf('*')

    // 기존 구슬들 제거
    document.querySelectorAll('.physics-ball').forEach((ball) => {
      if (ball.parentNode) {
        ball.parentNode.removeChild(ball)
      }
    })

    // 기존 클래스 초기화 (위치 클래스는 유지)
    demoText.className = 'demo-text'

    // 텍스트를 단어별로 분리
    splitTextIntoWords(demoText, text)

    // 위치 재적용 (애니메이션 후에도 올바른 위치 유지)
    if (!isDragging) {
      const currentTop =
        position === 'top' ? '25%' : position === 'center' ? '50%' : 'auto'
      const currentBottom = position === 'bottom' ? '25%' : 'auto'

      demoText.style.position = 'absolute'
      demoText.style.width = '90%'
      demoText.style.left = '5%'
      demoText.style.right = '5%'
      demoText.style.top = currentTop
      demoText.style.bottom = currentBottom
      demoText.style.transform = 'translateY(-50%)'
      demoText.style.textAlign = 'center'
    }

    const words = demoText.querySelectorAll('.word')

    // 애니메이션 적용
    window.gsap.set(demoText, { opacity: 1 })

    if (words.length > 0) {
      switch (effect) {
        case 'poster':
          posterEffect(words)
          break
        case 'pop':
          popEffect(words)
          break
        case 'bounce':
          bounceEffect(words)
          break
        default:
          popEffect(words)
      }
    }
  }

  const handleAddToCart = () => {
    console.log('담기 버튼 클릭됨')
    // 담기 기능 구현
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      applyEffect()
    }
  }

  // 위치 변경 시 즉시 반영
  useEffect(() => {
    updateTextPosition()
  }, [position])

  // 컴포넌트 마운트 후 초기 위치 설정
  useEffect(() => {
    setTimeout(() => {
      updateTextPosition()
    }, 100)
  }, [])

  // 초기 효과 적용
  useEffect(() => {
    const timer = setTimeout(() => {
      applyEffect()
    }, 500)

    return () => clearTimeout(timer)
  }, [text, effect])

  return (
    <div
      className="gsap-editor"
      style={{
        fontFamily: 'Arial, sans-serif',
        background: '#1a1a1a',
        backgroundImage: `
        radial-gradient(circle at 25% 25%, rgba(138, 43, 226, 0.1) 0%, transparent 50%),
        radial-gradient(circle at 75% 75%, rgba(255, 20, 147, 0.1) 0%, transparent 50%)
      `,
        minHeight: '70vh',
        color: '#e0e0e0',
        padding: '20px',
      }}
    >
      <div
        style={{
          background: 'rgba(40, 40, 40, 0.9)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '20px',
          padding: '40px',
          boxShadow:
            '0 20px 40px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
          display: 'grid',
          gridTemplateColumns: '2fr 1fr',
          gap: '40px',
          alignItems: 'flex-start',
        }}
      >
        {/* 프리뷰 영역 */}
        <div
          ref={previewAreaRef}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '400px',
            height: '60vh',
            background: 'rgba(20, 20, 20, 0.8)',
            borderRadius: '15px',
            border: '2px solid rgba(138, 43, 226, 0.3)',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <div
            ref={demoTextRef}
            key={`demo-text-${position}`}
            className="demo-text position-center"
            onMouseDown={handleMouseDown}
            style={{
              fontSize: '3rem',
              fontWeight: 'bold',
              color: '#fff',
              textAlign: 'center',
              opacity: 1,
              lineHeight: 1.2,
              position: 'absolute',
              width: '90%',
              left: '5%',
              right: '5%',
              top:
                position === 'top'
                  ? '25%'
                  : position === 'center'
                    ? '50%'
                    : 'auto',
              bottom: position === 'bottom' ? '25%' : 'auto',
              transform: 'translateY(-50%)',
              transition: isDragging ? 'none' : 'all 0.3s ease',
              cursor: 'move',
              userSelect: 'none',
            }}
          >
            {text}
          </div>

          {/* 애니메이션 범위 경계선 */}
          {constrainAnimation && (
            <div
              className="animation-boundary visible"
              style={{
                position: 'absolute',
                top: `${bounds.top}%`,
                left: `${bounds.left}%`,
                right: `${bounds.right}%`,
                bottom: `${bounds.bottom}%`,
                border: '2px dashed rgba(255, 20, 147, 0.8)',
                borderRadius: '8px',
                background: 'rgba(255, 20, 147, 0.08)',
                pointerEvents: 'none',
              }}
            />
          )}
        </div>

        {/* 컨트롤 영역 */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '25px',
            maxHeight: '60vh',
            overflowY: 'auto',
            paddingRight: '10px',
          }}
        >
          {/* 텍스트 입력 */}
          <div className="input-group">
            <label
              style={{
                color: '#e0e0e0',
                fontSize: '1.1rem',
                fontWeight: '500',
                marginBottom: '8px',
                display: 'block',
              }}
            >
              텍스트 입력:
            </label>
            <input
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="예: 안녕하세요!"
              maxLength={50}
              style={{
                padding: '15px',
                border: '1px solid rgba(138, 43, 226, 0.3)',
                borderRadius: '10px',
                fontSize: '1.1rem',
                background: 'rgba(30, 30, 30, 0.9)',
                color: '#fff',
                width: '100%',
                boxShadow: '0 5px 15px rgba(0, 0, 0, 0.2)',
                transition: 'all 0.3s ease',
              }}
            />
          </div>

          {/* 애니메이션 범위 제한 */}
          <div className="control-section">
            <div
              className="checkbox-container"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '12px',
                background: 'rgba(30, 30, 30, 0.6)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '10px',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
              }}
            >
              <input
                type="checkbox"
                checked={constrainAnimation}
                onChange={(e) => setConstrainAnimation(e.target.checked)}
                style={{
                  width: '18px',
                  height: '18px',
                  accentColor: '#8a2be2',
                  cursor: 'pointer',
                }}
              />
              <label style={{ cursor: 'pointer', margin: 0, fontSize: '1rem' }}>
                애니메이션 범위 제한
              </label>
            </div>

            {constrainAnimation && (
              <div
                className="range-controls"
                style={{
                  marginTop: '15px',
                  padding: '20px',
                  background: 'rgba(20, 20, 20, 0.8)',
                  borderRadius: '12px',
                  border: '1px solid rgba(255, 20, 147, 0.3)',
                  transition: 'all 0.3s ease',
                }}
              >
                <label
                  style={{
                    color: '#e0e0e0',
                    fontSize: '1rem',
                    marginBottom: '15px',
                    display: 'block',
                  }}
                >
                  범위 조정 (여백):
                </label>
                <div
                  className="range-sliders"
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '10px 15px',
                  }}
                >
                  {['top', 'bottom', 'left', 'right'].map((direction) => (
                    <div
                      key={direction}
                      className="range-item"
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        minWidth: 0,
                      }}
                    >
                      <label
                        style={{
                          fontSize: '0.85rem',
                          minWidth: '45px',
                          margin: 0,
                          color: '#ff1493',
                          flexShrink: 0,
                        }}
                      >
                        {direction === 'top'
                          ? '위쪽:'
                          : direction === 'bottom'
                            ? '아래쪽:'
                            : direction === 'left'
                              ? '왼쪽:'
                              : '오른쪽:'}
                      </label>
                      <input
                        type="range"
                        min="0"
                        max="40"
                        value={bounds[direction as keyof typeof bounds]}
                        onChange={(e) =>
                          setBounds((prev) => ({
                            ...prev,
                            [direction]: parseInt(e.target.value),
                          }))
                        }
                        style={{ flex: 1, height: '5px', minWidth: 0 }}
                      />
                      <span
                        style={{
                          color: '#ff1493',
                          fontSize: '0.8rem',
                          fontWeight: 'bold',
                          minWidth: '35px',
                          flexShrink: 0,
                          textAlign: 'right',
                        }}
                      >
                        {bounds[direction as keyof typeof bounds]}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* 효과 선택 */}
          <div className="control-section">
            <label
              style={{
                color: '#e0e0e0',
                fontSize: '1rem',
                fontWeight: '500',
                marginBottom: '5px',
                display: 'block',
              }}
            >
              애니메이션 효과:
            </label>
            <div
              className="effects-list"
              style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}
            >
              {[
                { value: 'poster', label: 'Poster Randomizer (글자 회전)' },
                { value: 'pop', label: 'Pop Effect (구슬)' },
                { value: 'bounce', label: 'Bounce Effect (바운스)' },
              ].map(({ value, label }) => (
                <div
                  key={value}
                  className="effect-selector"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '12px',
                    background: 'rgba(30, 30, 30, 0.6)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '8px',
                    transition: 'all 0.3s ease',
                    cursor: 'pointer',
                  }}
                >
                  <input
                    type="radio"
                    name="effect"
                    value={value}
                    checked={effect === value}
                    onChange={(e) => setEffect(e.target.value)}
                    style={{
                      width: '16px',
                      height: '16px',
                      margin: 0,
                      accentColor: '#8a2be2',
                      cursor: 'pointer',
                    }}
                  />
                  <label
                    style={{
                      margin: 0,
                      cursor: 'pointer',
                      flex: 1,
                      fontSize: '0.95rem',
                      color: effect === value ? '#8a2be2' : '#e0e0e0',
                      transition: 'color 0.3s ease',
                    }}
                  >
                    {label}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* 담기 버튼 */}
          <button
            onClick={handleAddToCart}
            className="add-to-cart-btn"
            style={{
              padding: '16px 32px',
              background: 'linear-gradient(135deg, #8a2be2 0%, #ff1493 100%)',
              border: 'none',
              borderRadius: '10px',
              color: 'white',
              fontSize: '1.2rem',
              fontWeight: 'bold',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              boxShadow:
                '0 10px 20px rgba(138, 43, 226, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
              textTransform: 'uppercase',
              letterSpacing: '1px',
            }}
          >
            담기
          </button>
        </div>
      </div>

      <style jsx>{`
        .demo-text.position-top {
          top: 20% !important;
          transform: translateY(-50%) !important;
        }
        .demo-text.position-center {
          top: 50% !important;
          transform: translateY(-50%) !important;
        }
        .demo-text.position-bottom {
          bottom: 20% !important;
          transform: translateY(50%) !important;
        }
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
        .bounce-text .char {
          animation: bounce-char 2s ease-in-out infinite;
        }
        @keyframes bounce-char {
          0%,
          20%,
          50%,
          80%,
          100% {
            transform: translateY(0);
          }
          40% {
            transform: translateY(-20px);
          }
          60% {
            transform: translateY(-10px);
          }
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

// 모달 컴포넌트
const Modal = ({
  isOpen,
  onClose,
  title,
  children,
}: {
  isOpen: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
}) => {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative bg-gray-800 rounded-lg max-w-7xl max-h-[95vh] w-full mx-4 overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <h2 className="text-xl font-semibold text-white">{title}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white text-2xl font-bold"
          >
            ×
          </button>
        </div>
        <div className="overflow-y-auto max-h-[85vh]">{children}</div>
      </div>
    </div>
  )
}

// 사이드바 컴포넌트
const AssetSidebar = () => {
  const [selectedCategory, setSelectedCategory] = useState('Classic')
  const categories = ['Classic', 'Animated', 'Dynamic']

  return (
    <aside className="w-64 bg-gray-800 min-h-screen p-6">
      <div className="mb-6">
        <h3 className="text-white text-lg font-semibold mb-4">Categories</h3>
        <div className="space-y-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                selectedCategory === category
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-300 hover:bg-gray-700'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>
    </aside>
  )
}

// 에셋 카드 컴포넌트
const AssetCard = ({
  asset,
  onCardClick,
}: {
  asset: AssetItem
  onCardClick: (asset: AssetItem) => void
}) => {
  return (
    <div className="group cursor-pointer" onClick={() => onCardClick(asset)}>
      <div className="relative">
        <div className="aspect-square rounded-lg bg-gray-700 relative overflow-hidden">
          {asset.thumbnail !== '/placeholder-thumb.jpg' ? (
            <img
              src={asset.thumbnail}
              alt={asset.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="h-full flex items-center justify-center text-gray-400">
              <div className="text-center">
                <div className="text-4xl mb-2">📄</div>
                <div className="text-sm">Sample Asset</div>
              </div>
            </div>
          )}

          <button
            className="absolute top-3 right-3 text-white hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={(e) => e.stopPropagation()}
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                clipRule="evenodd"
              />
            </svg>
          </button>

          <div className="absolute bottom-3 right-3 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              className="bg-black bg-opacity-50 hover:bg-opacity-70 text-white p-2 rounded transition-colors"
              onClick={(e) => e.stopPropagation()}
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                <path
                  fillRule="evenodd"
                  d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
            <button
              className="bg-black bg-opacity-50 hover:bg-opacity-70 text-white p-2 rounded transition-colors"
              onClick={(e) => e.stopPropagation()}
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>
        </div>

        <div className="mt-3">
          <h3 className="text-white font-medium mb-2 truncate">
            {asset.title}
          </h3>
          <div className="flex items-center space-x-2 mb-2">
            <span className="bg-gray-600 text-white px-2 py-1 rounded text-xs">
              {asset.category}
            </span>
            {asset.isPro && (
              <span className="bg-blue-600 text-white px-2 py-1 rounded text-xs">
                PRO
              </span>
            )}
          </div>
          <div className="flex items-center text-sm text-gray-400">
            <div className="flex items-center mr-4">
              <span className="text-yellow-400 mr-1">★</span>
              <span>{asset.rating}</span>
            </div>
            <span>{asset.downloads} downloads</span>
          </div>
        </div>
      </div>
    </div>
  )
}

// 메인 Asset 페이지
export default function AssetPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedAsset, setSelectedAsset] = useState<AssetItem | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const [assets] = useState<AssetItem[]>([
    {
      id: '1',
      title: 'Modern Subtitle Template',
      category: 'Template',
      rating: 5,
      downloads: 1243,
      thumbnail: '/assets/hello.png',
      isPro: false,
    },
    {
      id: '2',
      title: 'Animated Text Effects',
      category: 'Animation',
      rating: 4,
      downloads: 856,
      thumbnail: '/placeholder-thumb.jpg',
      isPro: false,
    },
    {
      id: '3',
      title: 'Professional Pack',
      category: 'Bundle',
      rating: 5,
      downloads: 2341,
      thumbnail: '/placeholder-thumb.jpg',
      isPro: true,
    },
    {
      id: '4',
      title: 'Simple Clean Style',
      category: 'Template',
      rating: 4,
      downloads: 567,
      thumbnail: '/placeholder-thumb.jpg',
      isPro: false,
    },
    {
      id: '5',
      title: 'Corporate Presentation',
      category: 'Business',
      rating: 5,
      downloads: 1089,
      thumbnail: '/placeholder-thumb.jpg',
      isPro: false,
    },
    {
      id: '6',
      title: 'Creative Typography',
      category: 'Design',
      rating: 4,
      downloads: 724,
      thumbnail: '/placeholder-thumb.jpg',
      isPro: true,
    },
  ])

  const handleCardClick = (asset: AssetItem) => {
    if (asset.id === '1') {
      setSelectedAsset(asset)
      setIsModalOpen(true)
    }
  }

  const filteredAssets = assets.filter((asset) => {
    return asset.title.toLowerCase().includes(searchTerm.toLowerCase())
  })

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="flex">
        <AssetSidebar />

        <main className="flex-1 p-6">
          <div className="flex justify-between mb-8">
            <h1 className="text-3xl font-bold">Asset Store</h1>

            <div className="flex items-center space-x-4">
              <input
                type="text"
                placeholder="Search assets"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-80 px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
              />
              <button
                onClick={() => alert('Upload functionality coming soon!')}
                className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg transition-colors"
              >
                Upload Asset
              </button>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-6">
            {filteredAssets.map((asset) => (
              <AssetCard
                key={asset.id}
                asset={asset}
                onCardClick={handleCardClick}
              />
            ))}
          </div>

          {filteredAssets.length === 0 && (
            <div className="text-center py-12">
              <div className="text-4xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold mb-2">No assets found</h3>
              <p className="text-gray-400">Try different keywords</p>
            </div>
          )}
        </main>
      </div>

      {/* GSAP 텍스트 에디터 모달 */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={selectedAsset?.title || ''}
      >
        <GSAPTextEditor />
      </Modal>
    </div>
  )
}
