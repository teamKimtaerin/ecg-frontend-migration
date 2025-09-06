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
  const [effect, setEffect] = useState('pop')
  const [isDragging, setIsDragging] = useState(false)
  const [isResizing, setIsResizing] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const [resizeHandle, setResizeHandle] = useState<
    'top-right' | 'bottom-left' | null
  >(null)

  // 통합된 컨테이너 상태
  const [containerPosition, setContainerPosition] = useState({ x: 150, y: 100 })
  const [containerSize, setContainerSize] = useState({
    width: 400,
    height: 120,
  })

  const containerRef = useRef<HTMLDivElement>(null)
  const textRef = useRef<HTMLDivElement>(null)
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

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging || !previewAreaRef.current) return

    const previewRect = previewAreaRef.current.getBoundingClientRect()
    const newX = e.clientX - previewRect.left - dragStart.x
    const newY = e.clientY - previewRect.top - dragStart.y

    const maxX = previewRect.width - containerSize.width
    const maxY = previewRect.height - containerSize.height

    const clampedX = Math.max(0, Math.min(newX, maxX))
    const clampedY = Math.max(0, Math.min(newY, maxY))

    setContainerPosition({ x: clampedX, y: clampedY })
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

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

  const handleResizeMove = (e: MouseEvent) => {
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
  }

  const handleResizeEnd = () => {
    setIsResizing(false)
    setResizeHandle(null)
  }

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
  }, [isDragging, dragStart])

  useEffect(() => {
    if (isResizing) {
      document.addEventListener('mousemove', handleResizeMove)
      document.addEventListener('mouseup', handleResizeEnd)
      return () => {
        document.removeEventListener('mousemove', handleResizeMove)
        document.removeEventListener('mouseup', handleResizeEnd)
      }
    }
  }, [isResizing, dragStart, resizeHandle])

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

  const createPhysicsBall = (x: number, y: number) => {
    if (typeof window === 'undefined' || !window.gsap || !containerRef.current)
      return

    const ball = document.createElement('div')
    ball.className = 'physics-ball'
    containerRef.current.appendChild(ball) // 컨테이너 내부에 추가

    const size = Math.random() * 8 + 4

    window.gsap.set(ball, {
      width: size,
      height: size,
      left: x,
      top: y,
      scale: 0,
      position: 'absolute',
      borderRadius: '50%',
      background:
        'radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.9), rgba(138, 43, 226, 0.8), rgba(255, 20, 147, 0.9))',
      boxShadow: '0 0 15px rgba(138, 43, 226, 0.6)',
      pointerEvents: 'none',
      zIndex: 5,
    })

    window.gsap
      .timeline({
        onComplete: () => {
          if (ball.parentNode) {
            ball.parentNode.removeChild(ball)
          }
        },
      })
      .to(ball, { scale: 1, duration: 0.2, ease: 'back.out(2)' })
      .to(
        ball,
        {
          y: `+=${Math.random() * 100 + 50}`,
          x: `+=${Math.random() * 80 - 40}`,
          rotation: Math.random() * 360,
          opacity: 0,
          duration: 1.2,
          ease: 'power2.out',
        },
        '<0.1'
      )
  }

  const posterEffect = (words: NodeListOf<Element>) => {
    if (!window.gsap) return

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
        delay: index * 0.2,
        ease: 'back.out(1.7)',
      })
    })
  }

  const popEffect = (words: NodeListOf<Element>) => {
    if (!window.gsap || !textRef.current) return

    words.forEach((word, index) => {
      window.gsap.set(word, {
        scale: 0,
        y: 30,
        transformOrigin: 'center center',
      })

      window.gsap.to(word, {
        scale: 1,
        y: 0,
        duration: 0.6,
        delay: index * 0.15,
        ease: 'back.out(2)',
        onComplete: function () {
          const chars = word.querySelectorAll('.char')
          chars.forEach((char: Element, charIndex: number) => {
            setTimeout(() => {
              const textRect = textRef.current?.getBoundingClientRect()
              const charRect = char.getBoundingClientRect()

              if (textRect) {
                // 컨테이너 기준 상대 좌표로 변환
                const relativeX =
                  charRect.left - textRect.left + charRect.width / 2
                const relativeY =
                  charRect.top - textRect.top + charRect.height / 2

                for (let i = 0; i < 3; i++) {
                  setTimeout(() => {
                    createPhysicsBall(
                      relativeX + Math.random() * 10 - 5,
                      relativeY + Math.random() * 10 - 5
                    )
                  }, i * 15)
                }
              }
            }, charIndex * 20)
          })
        },
      })
    })
  }

  const bounceEffect = (words: NodeListOf<Element>) => {
    if (!window.gsap || !textRef.current) return

    textRef.current.classList.add('bounce-text')

    words.forEach((word, index) => {
      window.gsap.set(word, {
        scale: 0,
        y: -60,
        transformOrigin: 'center center',
      })

      window.gsap.to(word, {
        scale: 1,
        y: 0,
        duration: 1,
        delay: index * 0.2,
        ease: 'bounce.out',
      })
    })
  }

  const applyEffect = () => {
    if (typeof window === 'undefined' || !window.gsap || !textRef.current)
      return

    const textElement = textRef.current

    // 기존 애니메이션 정리
    window.gsap.killTweensOf('*')

    // 기존 구슬들 제거
    if (containerRef.current) {
      containerRef.current.querySelectorAll('.physics-ball').forEach((ball) => {
        if (ball.parentNode) {
          ball.parentNode.removeChild(ball)
        }
      })
    }

    // 텍스트를 단어별로 분리
    splitTextIntoWords(textElement, text)

    const words = textElement.querySelectorAll('.word')
    window.gsap.set(textElement, { opacity: 1 })

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
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      applyEffect()
    }
  }

  // 텍스트나 효과 변경 시 애니메이션 적용
  useEffect(() => {
    const timer = setTimeout(() => {
      applyEffect()
    }, 300)
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

            {/* 텍스트 - 드래그 가능하도록 수정 */}
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
            transform: translateY(-15px);
          }
          60% {
            transform: translateY(-8px);
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

// 나머지 컴포넌트들은 동일...
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
        </div>
      </div>
    </div>
  )
}

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
        </main>
      </div>

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
