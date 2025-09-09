'use client'

import React from 'react'
import { IoSettings, IoRefresh, IoCheckmark, IoClose } from 'react-icons/io5'
import {
  AssetSettings,
  RotationTextSettings,
  TypeWriterSettings,
  ElasticBounceSettings,
  GlitchEffectSettings,
  ScalePopSettings,
  FadeInStaggerSettings,
  SlideUpSettings,
  MagneticPullSettings,
} from './types'
import SliderControl from './controls/SliderControl'
import SelectControl from './controls/SelectControl'
import ToggleControl from './controls/ToggleControl'

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
  // Rotation Text 설정들
  const [rotationAngle, setRotationAngle] = React.useState(180)
  const [rotationAnimationDuration, setRotationAnimationDuration] =
    React.useState(2.0)
  const [rotationStaggerDelay, setRotationStaggerDelay] = React.useState(0.3)
  const [rotationDirection, setRotationDirection] = React.useState<
    'left' | 'right'
  >('right')
  const [enableGradient, setEnableGradient] = React.useState(false)

  // TypeWriter 설정들
  const [typingSpeed, setTypingSpeed] = React.useState(0.1)
  const [startDelay, setStartDelay] = React.useState(0.5)
  const [showCursor, setShowCursor] = React.useState(true)
  const [cursorBlinkSpeed, setCursorBlinkSpeed] = React.useState(0.8)
  const [randomSpeed, setRandomSpeed] = React.useState(false)

  // Elastic Bounce 설정들
  const [bounceStrength, setBounceStrength] = React.useState(0.7)
  const [elasticAnimationDuration, setElasticAnimationDuration] =
    React.useState(1.5)
  const [elasticStaggerDelay, setElasticStaggerDelay] = React.useState(0.1)
  const [startScale, setStartScale] = React.useState(0)
  const [overshoot, setOvershoot] = React.useState(1.3)

  // Glitch 설정들
  const [glitchIntensity, setGlitchIntensity] = React.useState(5)
  const [glitchAnimationDuration, setGlitchAnimationDuration] =
    React.useState(2)
  const [glitchFrequency, setGlitchFrequency] = React.useState(0.3)
  const [colorSeparation, setColorSeparation] = React.useState(true)
  const [noiseEffect, setNoiseEffect] = React.useState(true)

  // Scale Pop 설정들
  const [popStartScale, setPopStartScale] = React.useState(0)
  const [maxScale, setMaxScale] = React.useState(1.3)
  const [popDuration, setPopDuration] = React.useState(0.6)
  const [popStaggerDelay, setPopStaggerDelay] = React.useState(0.08)
  const [popRotationAmount, setPopRotationAmount] = React.useState(10)

  // Fade In 설정들
  const [fadeStaggerDelay, setFadeStaggerDelay] = React.useState(0.1)
  const [fadeAnimationDuration, setFadeAnimationDuration] = React.useState(0.8)
  const [fadeStartOpacity, setFadeStartOpacity] = React.useState(0)
  const [fadeScaleStart, setFadeScaleStart] = React.useState(0.9)
  const [ease, setEase] = React.useState<
    'power1.out' | 'power2.out' | 'power3.out' | 'back.out' | 'elastic.out'
  >('power2.out')

  // Slide Up 설정들
  const [slideDistance, setSlideDistance] = React.useState(50)
  const [slideAnimationDuration, setSlideAnimationDuration] =
    React.useState(0.8)
  const [slideStaggerDelay, setSlideStaggerDelay] = React.useState(0.1)
  const [slideOvershoot, setSlideOvershoot] = React.useState(10)
  const [blurEffect, setBlurEffect] = React.useState(true)

  // Magnetic Pull 설정들
  const [scatterDistance, setScatterDistance] = React.useState(200)
  const [pullSpeed, setPullSpeed] = React.useState(1.5)
  const [magneticStaggerDelay, setMagneticStaggerDelay] = React.useState(0.05)
  const [magneticStrength, setMagneticStrength] = React.useState(1.2)
  const [elasticEffect, setElasticEffect] = React.useState(true)

  const isRotationText = assetName === 'Rotation Text'
  const isTypeWriter = assetName === 'TypeWriter Text'
  const isElasticBounce = assetName === 'Elastic Bounce'
  const isGlitchEffect = assetName === 'Glitch Effect'
  const isScalePop = assetName === 'Scale Pop'
  const isFadeInStagger = assetName === 'Fade In Stagger'
  const isSlideUp = assetName === 'Slide Up'
  const isMagneticPull = assetName === 'Magnetic Pull'

  const handleReset = () => {
    if (isRotationText) {
      setRotationAngle(180)
      setRotationAnimationDuration(2.0)
      setRotationStaggerDelay(0.3)
      setRotationDirection('right')
      setEnableGradient(false)
    } else if (isTypeWriter) {
      setTypingSpeed(0.1)
      setStartDelay(0.5)
      setShowCursor(true)
      setCursorBlinkSpeed(0.8)
      setRandomSpeed(false)
    } else if (isElasticBounce) {
      setBounceStrength(0.7)
      setElasticAnimationDuration(1.5)
      setElasticStaggerDelay(0.1)
      setStartScale(0)
      setOvershoot(1.3)
    } else if (isGlitchEffect) {
      setGlitchIntensity(5)
      setGlitchAnimationDuration(2)
      setGlitchFrequency(0.3)
      setColorSeparation(true)
      setNoiseEffect(true)
    } else if (isScalePop) {
      setPopStartScale(0)
      setMaxScale(1.3)
      setPopDuration(0.6)
      setPopStaggerDelay(0.08)
      setPopRotationAmount(10)
    } else if (isFadeInStagger) {
      setFadeStaggerDelay(0.1)
      setFadeAnimationDuration(0.8)
      setFadeStartOpacity(0)
      setFadeScaleStart(0.9)
      setEase('power2.out')
    } else if (isSlideUp) {
      setSlideDistance(50)
      setSlideAnimationDuration(0.8)
      setSlideStaggerDelay(0.1)
      setSlideOvershoot(10)
      setBlurEffect(true)
    } else if (isMagneticPull) {
      setScatterDistance(200)
      setPullSpeed(1.5)
      setMagneticStaggerDelay(0.05)
      setMagneticStrength(1.2)
      setElasticEffect(true)
    }
  }

  const handleApply = () => {
    if (isRotationText) {
      const settings: RotationTextSettings = {
        rotationAngle,
        animationDuration: rotationAnimationDuration,
        staggerDelay: rotationStaggerDelay,
        rotationDirection,
        enableGradient,
      }
      onSettingsChange?.(settings as unknown as AssetSettings)
    } else if (isTypeWriter) {
      const settings: TypeWriterSettings = {
        typingSpeed,
        startDelay,
        showCursor,
        cursorBlinkSpeed,
        randomSpeed,
      }
      onSettingsChange?.(settings as unknown as AssetSettings)
    } else if (isElasticBounce) {
      const settings: ElasticBounceSettings = {
        bounceStrength,
        animationDuration: elasticAnimationDuration,
        staggerDelay: elasticStaggerDelay,
        startScale,
        overshoot,
      }
      onSettingsChange?.(settings as unknown as AssetSettings)
    } else if (isGlitchEffect) {
      const settings: GlitchEffectSettings = {
        glitchIntensity,
        animationDuration: glitchAnimationDuration,
        glitchFrequency,
        colorSeparation,
        noiseEffect,
      }
      onSettingsChange?.(settings as unknown as AssetSettings)
    } else if (isScalePop) {
      const settings: ScalePopSettings = {
        startScale: popStartScale,
        maxScale,
        popDuration,
        staggerDelay: popStaggerDelay,
        rotationAmount: popRotationAmount,
      }
      onSettingsChange?.(settings as unknown as AssetSettings)
    } else if (isFadeInStagger) {
      const settings: FadeInStaggerSettings = {
        staggerDelay: fadeStaggerDelay,
        animationDuration: fadeAnimationDuration,
        startOpacity: fadeStartOpacity,
        scaleStart: fadeScaleStart,
        ease,
      }
      onSettingsChange?.(settings as unknown as AssetSettings)
    } else if (isSlideUp) {
      const settings: SlideUpSettings = {
        slideDistance,
        animationDuration: slideAnimationDuration,
        staggerDelay: slideStaggerDelay,
        overshoot: slideOvershoot,
        blurEffect,
      }
      onSettingsChange?.(settings as unknown as AssetSettings)
    } else if (isMagneticPull) {
      const settings: MagneticPullSettings = {
        scatterDistance,
        pullSpeed,
        staggerDelay: magneticStaggerDelay,
        magneticStrength,
        elasticEffect,
      }
      onSettingsChange?.(settings as unknown as AssetSettings)
    }
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
        {isRotationText ? (
          <>
            <SliderControl
              label="회전 각도"
              value={rotationAngle}
              min={0}
              max={360}
              step={10}
              unit="°"
              emoji="🔄"
              onChange={setRotationAngle}
            />
            <SliderControl
              label="애니메이션 속도"
              value={rotationAnimationDuration}
              min={0.5}
              max={5}
              step={0.1}
              unit="s"
              emoji="⚡"
              onChange={setRotationAnimationDuration}
            />
            <SliderControl
              label="단어 간격"
              value={rotationStaggerDelay}
              min={0}
              max={1}
              step={0.1}
              unit="s"
              emoji="📏"
              onChange={setRotationStaggerDelay}
            />
            <SelectControl
              label="회전 방향"
              value={rotationDirection}
              options={[
                { value: 'right', label: '오른쪽' },
                { value: 'left', label: '왼쪽' },
              ]}
              emoji="🧭"
              onChange={(value) =>
                setRotationDirection(value as 'left' | 'right')
              }
            />
            <ToggleControl
              label="그라데이션 효과"
              value={enableGradient}
              emoji="🌈"
              onChange={setEnableGradient}
            />
          </>
        ) : isTypeWriter ? (
          <>
            <SliderControl
              label="타이핑 속도"
              value={typingSpeed}
              min={0.05}
              max={1}
              step={0.05}
              unit="s"
              emoji="⌨️"
              onChange={setTypingSpeed}
            />
            <SliderControl
              label="시작 지연시간"
              value={startDelay}
              min={0}
              max={3}
              step={0.1}
              unit="s"
              emoji="⏳"
              onChange={setStartDelay}
            />
            <ToggleControl
              label="커서 표시"
              value={showCursor}
              emoji="⎸"
              onChange={setShowCursor}
            />
            <SliderControl
              label="커서 깜빡임 속도"
              value={cursorBlinkSpeed}
              min={0.3}
              max={2}
              step={0.1}
              unit="s"
              emoji="💫"
              onChange={setCursorBlinkSpeed}
            />
            <ToggleControl
              label="랜덤 속도"
              value={randomSpeed}
              emoji="🎲"
              onChange={setRandomSpeed}
            />
          </>
        ) : isElasticBounce ? (
          <>
            <SliderControl
              label="바운스 강도"
              value={bounceStrength}
              min={0.1}
              max={2}
              step={0.1}
              unit=""
              emoji="🏀"
              onChange={setBounceStrength}
            />
            <SliderControl
              label="애니메이션 속도"
              value={elasticAnimationDuration}
              min={0.5}
              max={4}
              step={0.1}
              unit="s"
              emoji="⚡"
              onChange={setElasticAnimationDuration}
            />
            <SliderControl
              label="단어 간격"
              value={elasticStaggerDelay}
              min={0}
              max={0.5}
              step={0.05}
              unit="s"
              emoji="📏"
              onChange={setElasticStaggerDelay}
            />
            <SliderControl
              label="시작 크기"
              value={startScale}
              min={0}
              max={1}
              step={0.1}
              unit=""
              emoji="📐"
              onChange={setStartScale}
            />
            <SliderControl
              label="오버슈트 크기"
              value={overshoot}
              min={1}
              max={2}
              step={0.1}
              unit=""
              emoji="📈"
              onChange={setOvershoot}
            />
          </>
        ) : isGlitchEffect ? (
          <>
            <SliderControl
              label="글리치 강도"
              value={glitchIntensity}
              min={1}
              max={20}
              step={1}
              unit=""
              emoji="⚡"
              onChange={setGlitchIntensity}
            />
            <SliderControl
              label="애니메이션 주기"
              value={glitchAnimationDuration}
              min={0.5}
              max={5}
              step={0.1}
              unit="s"
              emoji="🔄"
              onChange={setGlitchAnimationDuration}
            />
            <SliderControl
              label="글리치 빈도"
              value={glitchFrequency}
              min={0.1}
              max={1}
              step={0.1}
              unit="s"
              emoji="📡"
              onChange={setGlitchFrequency}
            />
            <ToggleControl
              label="색상 분리 효과"
              value={colorSeparation}
              emoji="🌈"
              onChange={setColorSeparation}
            />
            <ToggleControl
              label="노이즈 효과"
              value={noiseEffect}
              emoji="📺"
              onChange={setNoiseEffect}
            />
          </>
        ) : isScalePop ? (
          <>
            <SliderControl
              label="시작 크기"
              value={popStartScale}
              min={0}
              max={0.5}
              step={0.05}
              unit=""
              emoji="🔍"
              onChange={setPopStartScale}
            />
            <SliderControl
              label="최대 크기"
              value={maxScale}
              min={1}
              max={2}
              step={0.1}
              unit=""
              emoji="🎯"
              onChange={setMaxScale}
            />
            <SliderControl
              label="팝업 속도"
              value={popDuration}
              min={0.2}
              max={1.5}
              step={0.1}
              unit="s"
              emoji="💥"
              onChange={setPopDuration}
            />
            <SliderControl
              label="순차 간격"
              value={popStaggerDelay}
              min={0.02}
              max={0.3}
              step={0.01}
              unit="s"
              emoji="📏"
              onChange={setPopStaggerDelay}
            />
            <SliderControl
              label="회전 각도"
              value={popRotationAmount}
              min={0}
              max={45}
              step={5}
              unit="°"
              emoji="🔄"
              onChange={setPopRotationAmount}
            />
          </>
        ) : isFadeInStagger ? (
          <>
            <SliderControl
              label="순차 간격"
              value={fadeStaggerDelay}
              min={0.02}
              max={0.5}
              step={0.01}
              unit="s"
              emoji="📏"
              onChange={setFadeStaggerDelay}
            />
            <SliderControl
              label="페이드 속도"
              value={fadeAnimationDuration}
              min={0.2}
              max={2}
              step={0.1}
              unit="s"
              emoji="🌅"
              onChange={setFadeAnimationDuration}
            />
            <SliderControl
              label="시작 투명도"
              value={fadeStartOpacity}
              min={0}
              max={0.5}
              step={0.05}
              unit=""
              emoji="👻"
              onChange={setFadeStartOpacity}
            />
            <SliderControl
              label="시작 크기"
              value={fadeScaleStart}
              min={0.5}
              max={1}
              step={0.05}
              unit=""
              emoji="📐"
              onChange={setFadeScaleStart}
            />
            <SelectControl
              label="이징 타입"
              value={ease}
              options={[
                { value: 'power1.out', label: 'Power1 Out' },
                { value: 'power2.out', label: 'Power2 Out' },
                { value: 'power3.out', label: 'Power3 Out' },
                { value: 'back.out', label: 'Back Out' },
                { value: 'elastic.out', label: 'Elastic Out' },
              ]}
              emoji="📈"
              onChange={(value) =>
                setEase(
                  value as
                    | 'power1.out'
                    | 'power2.out'
                    | 'power3.out'
                    | 'back.out'
                    | 'elastic.out'
                )
              }
            />
          </>
        ) : isSlideUp ? (
          <>
            <SliderControl
              label="슬라이드 거리"
              value={slideDistance}
              min={20}
              max={150}
              step={5}
              unit="px"
              emoji="⬆️"
              onChange={setSlideDistance}
            />
            <SliderControl
              label="애니메이션 속도"
              value={slideAnimationDuration}
              min={0.3}
              max={2}
              step={0.1}
              unit="s"
              emoji="⚡"
              onChange={setSlideAnimationDuration}
            />
            <SliderControl
              label="순차 간격"
              value={slideStaggerDelay}
              min={0.02}
              max={0.4}
              step={0.01}
              unit="s"
              emoji="📏"
              onChange={setSlideStaggerDelay}
            />
            <SliderControl
              label="오버슈트"
              value={slideOvershoot}
              min={0}
              max={30}
              step={2}
              unit="px"
              emoji="📈"
              onChange={setSlideOvershoot}
            />
            <ToggleControl
              label="블러 효과"
              value={blurEffect}
              emoji="💫"
              onChange={setBlurEffect}
            />
          </>
        ) : isMagneticPull ? (
          <>
            <SliderControl
              label="흩어짐 거리"
              value={scatterDistance}
              min={50}
              max={500}
              step={10}
              unit="px"
              emoji="💫"
              onChange={setScatterDistance}
            />
            <SliderControl
              label="끌려오는 속도"
              value={pullSpeed}
              min={0.5}
              max={4}
              step={0.1}
              unit="s"
              emoji="🧲"
              onChange={setPullSpeed}
            />
            <SliderControl
              label="글자 간격"
              value={magneticStaggerDelay}
              min={0}
              max={0.2}
              step={0.01}
              unit="s"
              emoji="📏"
              onChange={setMagneticStaggerDelay}
            />
            <SliderControl
              label="자석 강도"
              value={magneticStrength}
              min={1}
              max={2}
              step={0.1}
              unit=""
              emoji="🔋"
              onChange={setMagneticStrength}
            />
            <ToggleControl
              label="탄성 효과"
              value={elasticEffect}
              emoji="🏀"
              onChange={setElasticEffect}
            />
          </>
        ) : (
          <div className="pt-2 border-t border-slate-700/50">
            <p className="text-xs text-slate-500 italic">
              알 수 없는 에셋입니다: {assetName}
            </p>
          </div>
        )}
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
    </div>
  )
}

export default AssetControlPanel
