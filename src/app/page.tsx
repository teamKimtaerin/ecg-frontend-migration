'use client'

import React, { useState, useEffect, useCallback, useRef } from 'react'
import Image from 'next/image'
import Button from '@/components/Button'

export default function Home() {
  const [email, setEmail] = useState('')
  const [isHeaderVisible, setIsHeaderVisible] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)

  const heroRef = useRef<HTMLElement>(null)
  const featuresRef = useRef<HTMLElement>(null)
  const editRef = useRef<HTMLElement>(null)
  const subtitleRef = useRef<HTMLElement>(null)
  const votRef = useRef<HTMLElement>(null)
  const libraryRef = useRef<HTMLElement>(null)

  const handleScroll = useCallback(() => {
    const currentScrollY = window.scrollY

    if (currentScrollY < 50) {
      if (!isHeaderVisible) setIsHeaderVisible(true)
    } else if (Math.abs(currentScrollY - lastScrollY) > 15) {
      const shouldShow = currentScrollY < lastScrollY
      if (shouldShow !== isHeaderVisible) {
        setIsHeaderVisible(shouldShow)
        setLastScrollY(currentScrollY)
      }
    }
  }, [lastScrollY, isHeaderVisible])

  useEffect(() => {
    let timeoutId: NodeJS.Timeout
    const throttledScroll = () => {
      clearTimeout(timeoutId)
      timeoutId = setTimeout(handleScroll, 16) // ~60fps
    }

    window.addEventListener('scroll', throttledScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', throttledScroll)
      clearTimeout(timeoutId)
    }
  }, [handleScroll])

  // Intersection Observer for background animation optimization
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-blob')
          } else {
            entry.target.classList.remove('animate-blob')
          }
        })
      },
      {
        rootMargin: '100px',
        threshold: 0.1,
      }
    )

    const blobs = document.querySelectorAll('.bg-blob')
    blobs.forEach((blob) => observer.observe(blob))

    return () => observer.disconnect()
  }, [])

  // Intersection Observer for section fade-in animations
  useEffect(() => {
    const fadeObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible')
            console.log('Section became visible:', entry.target)
          }
        })
      },
      {
        rootMargin: '0px 0px -100px 0px',
        threshold: 0.2,
      }
    )

    const refs = [
      heroRef,
      featuresRef,
      editRef,
      subtitleRef,
      votRef,
      libraryRef,
    ]

    refs.forEach((ref) => {
      if (ref.current) {
        fadeObserver.observe(ref.current)
        console.log('Observing element:', ref.current)
      }
    })

    return () => {
      fadeObserver.disconnect()
    }
  }, [])

  return (
    <div className="font-sans min-h-screen bg-black text-white overflow-x-hidden relative">
      {/* Animated Background */}
      <div className="fixed inset-0 z-0 overflow-hidden">
        <div className="absolute -inset-10 opacity-40">
          <div className="absolute bottom-1/4 left-3/11 w-86 h-86 bg-primary rounded-full filter blur-3xl bg-blob animate-blob animation-delay-0"></div>
          <div className="absolute top-1/3 left-4/7 w-72 h-72 bg-primary-light rounded-full filter blur-3xl bg-blob animate-blob animation-delay-100"></div>
          <div className="absolute bottom-1/7 left-6/11 w-64 h-64 bg-amber-300 rounded-full filter blur-3xl bg-blob animate-blob animation-delay-200"></div>
          <div className="absolute bottom-2/4 left-4/11 w-86 h-86 bg-red-500 rounded-full filter blur-3xl bg-blob animate-blob animation-delay-300"></div>
          <div className="absolute bottom-1/9 left-1/11 w-56 h-56 bg-green-500 rounded-full filter blur-3xl bg-blob animate-blob animation-delay-300"></div>
          <div className="absolute bottom-1/3 left-5/11 w-56 h-56 bg-white rounded-full filter blur-3xl bg-blob animate-blob animation-delay-300"></div>
          <div className="absolute bottom-6/11 left-9/11 w-56 h-56 bg-fuchsia-600 rounded-full filter blur-3xl bg-blob animate-blob animation-delay-300"></div>
        </div>
      </div>

      {/* Main content with higher z-index */}
      <div className="relative z-10">
        {/* Header */}
        <header
          className={`fixed top-0 w-full bg-black/90 border-b border-gray-slate/20 z-50 transition-transform duration-300 ${
            isHeaderVisible ? 'translate-y-0' : '-translate-y-full'
          }`}
        >
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <a href="/" className="flex items-center space-x-3">
                <Image
                  src="/logo.svg"
                  alt="ECG Logo"
                  width={40}
                  height={40}
                  className="w-10 h-10 rounded-full"
                />
                <h1 className="text-h3 text-white font-bold">ECG</h1>
              </a>
              <nav className="hidden md:flex items-center space-x-8">
                <a
                  href="#features"
                  className="text-sm text-gray-medium font-bold hover:text-white transition-colors"
                >
                  Features
                </a>
                <a
                  href="#open-library"
                  className="text-sm text-gray-medium font-bold hover:text-white transition-colors"
                >
                  Open Library
                </a>
                <a
                  href="#vot"
                  className="flex items-center space-x-1 text-sm text-gray-medium font-bold hover:text-white transition-colors"
                >
                  <span>VoT</span>
                </a>
                <a
                  href="#"
                  className="text-sm text-gray-medium font-bold hover:text-white transition-colors"
                >
                  Login
                </a>
                <Button variant="accent" size="medium" className="rounded-full">
                  Sign up
                </Button>
              </nav>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <section
          ref={heroRef}
          className="min-h-screen flex items-center justify-center px-6 pt-20 fade-in-section"
        >
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <h1 className="text-h1 font-black leading-tight">
                  <span className="block">Expressive</span>
                  <span className="block">Caption</span>
                  <span className="block text-primary">Generator</span>
                  <span className="block">platform</span>
                </h1>
              </div>
              <div className="flex space-x-4">
                <Button
                  variant="accent"
                  size="large"
                  className="bg-status-positive hover:bg-status-positive hover:opacity-70 rounded-full px-8"
                >
                  Easy Start
                </Button>
                <Button
                  variant="secondary"
                  style="outline"
                  size="large"
                  className="rounded-full px-8 border-gray-medium text-gray-medium hover:text-white hover:border-white"
                >
                  Explore Results
                </Button>
              </div>
            </div>

            <div className="relative">
              <div className="bg-gray-slate/30 rounded-2xl p-8 border border-gray-slate/30">
                <div className="text-center space-y-6">
                  <h3 className="text-h3 text-white">
                    Elevate your content quality with vibrant,
                    <br />
                    emotion-driven subtitles.
                  </h3>
                  <div className="space-y-4">
                    <div className="flex space-x-2">
                      <input
                        type="email"
                        placeholder="Enter your email here"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="flex-1 px-4 py-3 bg-black/50 border border-gray-slate/50 rounded-full text-white placeholder-gray-medium focus:outline-none focus:border-primary"
                      />
                      <Button
                        variant="accent"
                        size="medium"
                        className="rounded-full px-6"
                      >
                        Sign up
                      </Button>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="flex-1 h-px bg-gray-slate/30"></div>
                      <span className="text-gray-medium text-sm">or</span>
                      <div className="flex-1 h-px bg-gray-slate/30"></div>
                    </div>
                    <Button
                      variant="secondary"
                      style="outline"
                      size="medium"
                      className="w-full rounded-full border-gray-slate/50 text-white hover:border-white"
                    >
                      <span className="flex items-center justify-center space-x-2">
                        <span className="w-5 h-5 bg-white rounded-full flex items-center justify-center text-black font-bold text-xs">
                          G
                        </span>
                        <span>Sign Up with Google</span>
                      </span>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Fast Transcription Section */}
        <section
          ref={featuresRef}
          id="features"
          className="py-24 px-6 bg-primary-50 fade-in-section"
        >
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <h2 className="text-h1 font-black">
                  <span className="block">Fast</span>
                  <span className="block">Transcription</span>
                </h2>
                <p className="text-h3 text-gray-medium max-w-lg">
                  Make quick and easy vibrant subtitles!
                  <br />
                  Enrich your amazing videos like never before!
                </p>
              </div>
              <Button
                variant="accent"
                size="large"
                className="bg-status-positive hover:opacity-80 rounded-full px-8"
              >
                Fast Transcription
              </Button>
            </div>

            <div className="relative">
              <div className="bg-black rounded-2xl p-4 border border-gray-slate/30">
                <div className="space-y-4">
                  <div className="flex space-x-2">
                    <span className="inline-block w-2 h-2 bg-status-positive rounded-full"></span>
                    <span className="inline-block w-2 h-2 bg-status-notice rounded-full"></span>
                    <span className="inline-block w-2 h-2 bg-status-negative rounded-full"></span>
                    <span className="text-xs text-gray-medium ml-2">
                      Style Options
                    </span>
                  </div>
                  <div className="aspect-video bg-gray-slate opacity-80 rounded-lg flex items-center justify-center">
                    <div className="text-center space-y-2">
                      <div className="w-16 h-16 bg-primary opacity-30 rounded-full flex items-center justify-center mx-auto">
                        <span className="text-primary text-2xl">▶</span>
                      </div>
                      <p className="text-gray-medium text-sm">Video Preview</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Edit Transcription Section */}
        <section
          ref={editRef}
          className="py-24 px-6 bg-primary-50 fade-in-section delay-1"
        >
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1 relative">
              <div className="bg-black rounded-2xl p-6 border border-gray-slate">
                <div className="aspect-[4/3] bg-gray-slate rounded-lg p-4">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-red-600 rounded-full"></div>
                      <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span className="text-gray-medium text-sm ml-4">
                        편집기
                      </span>
                    </div>
                    <div className="space-y-2">
                      <div className="h-2 bg-primary rounded w-3/4"></div>
                      <div className="h-2 bg-primary rounded w-full"></div>
                      <div className="h-2 bg-primary rounded w-2/3"></div>
                    </div>
                    <div className="bg-primary rounded p-3">
                      <p className="text-white text-sm">자막 편집 인터페이스</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="order-1 lg:order-2 space-y-8">
              <div className="space-y-4">
                <h2 className="text-h1 font-black">
                  <span className="block">Edit</span>
                  <span className="block">Transcription</span>
                </h2>
                <p className="text-h3 text-gray-medium max-w-lg">
                  Create more refined and detailed subtitles with Edit Mode!
                  <br />
                  you&apos;ll love the perfect results!
                </p>
              </div>
              <Button
                variant="accent"
                size="large"
                className="bg-status-positive hover:opacity-80 rounded-full px-8"
              >
                Edit Transcription
              </Button>
            </div>
          </div>
        </section>

        {/* Subtitle Editor Section */}
        <section
          ref={subtitleRef}
          className="py-24 px-6 bg-primary-50 fade-in-section delay-2"
        >
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <h2 className="text-h1 font-black">
                  <span className="block">Subtitle Editor</span>
                </h2>
                <p className="text-h3 text-gray-medium max-w-lg">
                  You can even create animated, vibrant subtitles.
                  <br />
                  Start creating your masterpiece right now!
                </p>
              </div>
              <Button
                variant="accent"
                size="large"
                className="bg-status-positive hover:opacity-80 rounded-full px-8"
              >
                Create Subtitles
              </Button>
            </div>

            <div className="relative">
              <div className="bg-black rounded-2xl p-6 border border-gray-slate">
                <div className="aspect-video bg-gray-slate rounded-lg p-4">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-medium text-sm">
                        Waveform Editor
                      </span>
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-status-positive rounded-full"></div>
                        <div className="w-2 h-2 bg-status-notice rounded-full"></div>
                        <div className="w-2 h-2 bg-status-negative rounded-full"></div>
                      </div>
                    </div>
                    <div className="h-16 bg-gradient-to-r from-status-magenta via-status-fuchsia to-status-purple rounded opacity-60"></div>
                    <div className="text-center">
                      <p className="text-white font-semibold">
                        Put that{' '}
                        <span className="text-status-fuchsia">
                          coffee dOWn!
                        </span>{' '}
                        Coffee&apos;s for{' '}
                        <span className="text-status-fuchsia">closers</span>{' '}
                        only!
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* VoT Section */}
        <section
          ref={votRef}
          id="vot"
          className="py-24 px-6 fade-in-section delay-1"
        >
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1 relative">
              <div className="bg-gray-slate/30 rounded-2xl p-6 border border-gray-slate/30">
                <div className="space-y-4">
                  <div className="aspect-video bg-black rounded-lg p-3">
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-red-600 rounded flex items-center justify-center text-white text-xs font-bold">
                          LIVE
                        </div>
                        <span className="text-white text-sm">
                          Breaking News
                        </span>
                      </div>
                      <div className="bg-red-600/20 rounded p-2">
                        <p className="text-white text-sm">BREAKING NEWS</p>
                      </div>
                      <div className="bg-gray-slate rounded p-3">
                        <p className="text-gray-medium text-xs">
                          Latest trending video content...
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-black rounded-lg p-3">
                    <p className="text-white text-sm">
                      Revolutionize your design process with NX immersive
                      designer...
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="order-1 lg:order-2 space-y-8">
              <div className="space-y-4">
                <h2 className="text-h1 font-black">
                  <span className="block text-gray-medium text-h1">VoT</span>
                  <span className="block text-gray-medium text-h2">
                    (Videos of Today)
                  </span>
                </h2>
                <p className="text-h3 text-gray-medium max-w-lg">
                  Curious about what others are creating?
                  <br />
                  Visit VoT!
                  <br />
                  Discover today&apos;s trending videos instantly!
                </p>
              </div>
              <Button
                variant="accent"
                size="large"
                className="bg-status-positive hover:opacity-80 rounded-full px-8"
              >
                Explore Videos
              </Button>
            </div>
          </div>
        </section>

        {/* Open Library Section */}
        <section
          ref={libraryRef}
          id="open-library"
          className="py-24 px-6 fade-in-section delay-2"
        >
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <h2 className="text-h1 font-black">
                  <span className="block">Open Library</span>
                </h2>
                <p className="text-h3 text-gray-medium max-w-lg">
                  Discover a world of customized subtitle assets!
                  <br />
                  Upload your designs for others to use,
                  <br />
                  or find exactly what your video needs!
                </p>
              </div>
              <Button
                variant="accent"
                size="large"
                className="bg-status-positive hover:opacity-80 rounded-full px-8"
              >
                Explore Subtitles
              </Button>
            </div>

            <div className="relative">
              <div className="bg-black rounded-2xl p-6 border border-gray-slate/30">
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-3">
                    <div className="bg-status-purple rounded-lg p-3 aspect-square flex items-center justify-center">
                      <span className="text-white font-bold text-sm">
                        Mauvelous sparkle
                      </span>
                    </div>
                    <div className="bg-status-notice rounded-lg p-3 aspect-square flex items-center justify-center">
                      <span className="text-black font-bold text-sm">
                        गायत्री
                      </span>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="bg-status-informative rounded-lg p-3 aspect-square flex items-center justify-center">
                      <span className="text-white font-bold text-sm">
                        Universal Theme
                      </span>
                    </div>
                    <div className="bg-gradient-to-br from-status-celery to-status-chartreuse rounded-lg p-3 aspect-square flex items-center justify-center">
                      <span className="text-black font-bold text-sm">
                        Nature
                      </span>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="bg-status-fuchsia rounded-lg p-3 aspect-square flex items-center justify-center">
                      <span className="text-white font-bold text-sm">
                        BC Ludva
                      </span>
                    </div>
                    <div className="bg-status-cyan rounded-lg p-3 aspect-square flex items-center justify-center">
                      <span className="text-white font-bold text-sm">
                        BAUBOT
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-gray-slate/10 border-t border-gray-slate/20 mt-20">
          <div className="max-w-7xl mx-auto px-6 py-12">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Image
                    src="/logo.svg"
                    alt="ECG Logo"
                    width={32}
                    height={32}
                    className="w-8 h-8 rounded-full"
                  />
                  <h3 className="text-h3 text-white font-bold">ECG</h3>
                </div>
                <p className="text-gray-medium">
                  Expressive Caption Generator platform for creating vibrant,
                  emotion-driven subtitles.
                </p>
              </div>

              <div className="space-y-4">
                <h4 className="text-white font-semibold">Features</h4>
                <div className="space-y-2">
                  <a
                    href="#"
                    className="block text-gray-medium hover:text-white transition-colors"
                  >
                    Fast Transcription
                  </a>
                  <a
                    href="#"
                    className="block text-gray-medium hover:text-white transition-colors"
                  >
                    Edit Transcription
                  </a>
                  <a
                    href="#"
                    className="block text-gray-medium hover:text-white transition-colors"
                  >
                    Subtitle Editor
                  </a>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-white font-semibold">Discover</h4>
                <div className="space-y-2">
                  <a
                    href="#"
                    className="block text-gray-medium hover:text-white transition-colors"
                  >
                    VoT (Videos of Today)
                  </a>
                  <a
                    href="#"
                    className="block text-gray-medium hover:text-white transition-colors"
                  >
                    Open Library
                  </a>
                  <a
                    href="#"
                    className="block text-gray-medium hover:text-white transition-colors"
                  >
                    Trending
                  </a>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-white font-semibold">Support</h4>
                <div className="space-y-2">
                  <a
                    href="#"
                    className="block text-gray-medium hover:text-white transition-colors"
                  >
                    Documentation
                  </a>
                  <a
                    href="#"
                    className="block text-gray-medium hover:text-white transition-colors"
                  >
                    Help Center
                  </a>
                  <a
                    href="#"
                    className="block text-gray-medium hover:text-white transition-colors"
                  >
                    Contact
                  </a>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-slate/20 mt-12 pt-8 text-center">
              <p className="text-gray-medium">
                © 2024 ECG Platform. All rights reserved.
              </p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  )
}
