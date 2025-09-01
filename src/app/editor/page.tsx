'use client'

import React, { useState } from 'react'

import Header from '@/components/Header'
import Button from '@/components/Button'
import Dropdown from '@/components/Dropdown'
import Slider from '@/components/Slider'
import Tab from '@/components/Tab'
import TabItem from '@/components/TabItem'
import VideoPlayer from '@/components/VideoPlayer'

// MyFiles Sidebar Component
interface MyFilesSidebarProps {
  isOpen: boolean
  onToggle: () => void
}

function MyFilesSidebar({ isOpen, onToggle }: MyFilesSidebarProps) {
  return (
    <>
      {/* Toggle Button */}
      <button
        onClick={onToggle}
        className={`fixed left-4 top-1/2 -translate-y-1/2 bg-slate-800/80 backdrop-blur-sm border border-slate-600/40 rounded-r-lg p-2 z-50 shadow-lg transition-all duration-300 hover:scale-105 ${
          isOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'
        }`}
      >
        <svg className="w-4 h-4 text-text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Sidebar */}
      <div className={`fixed left-0 top-[100px] bottom-4 w-[280px] bg-slate-800/80 backdrop-blur-sm border border-slate-600/40 rounded-r-lg z-40 shadow-xl sidebar-transition ${
        isOpen ? 'sidebar-visible' : 'sidebar-hidden-left'
      }`}>
        <div className="p-4">
          <div className="relative flex items-center justify-center mb-4">
            <h2 className="text-text-primary text-lg font-bold">My Files</h2>
            <button
              onClick={onToggle}
              className="absolute right-0 text-text-primary hover:text-text-secondary"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          </div>
          
          <div className="text-center space-y-4 mt-16">
            <div className="space-y-2">
              <h3 className="text-text-primary text-base font-bold">You must sign in to</h3>
              <h3 className="text-text-primary text-base font-bold">access your archive</h3>
            </div>
            
            <div className="space-y-3">
              <Button
                variant="secondary" 
                style="outline"
                size="small"
                className="w-full text-slate-300 border-slate-400/50 hover:bg-slate-500/20 hover:text-white transition-all duration-200"
              >
                Login
              </Button>
              <Button
                variant="accent"
                size="small"
                className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:from-blue-400 hover:to-indigo-500 hover:shadow-lg hover:scale-105 transition-all duration-200 shadow-md"
              >
                Sign up
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

// Edit Sidebar Component  
interface EditSidebarProps {
  isOpen: boolean
  onToggle: () => void
  animationSpeed: number
  setAnimationSpeed: (value: number) => void
  animationStrength: number
  setAnimationStrength: (value: number) => void
}

function EditSidebar({ 
  isOpen, 
  onToggle, 
  animationSpeed, 
  setAnimationSpeed, 
  animationStrength, 
  setAnimationStrength 
}: EditSidebarProps) {
  return (
    <>
      {/* Toggle Button */}
      <button
        onClick={onToggle}
        className={`fixed right-4 top-1/2 -translate-y-1/2 bg-slate-800/80 backdrop-blur-sm border border-slate-600/40 rounded-l-lg p-2 z-50 shadow-lg transition-all duration-300 hover:scale-105 ${
          isOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'
        }`}
      >
        <svg className="w-4 h-4 text-text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      {/* Sidebar */}
      <div className={`fixed right-0 top-[100px] bottom-4 w-[280px] bg-slate-800/80 backdrop-blur-sm border border-slate-600/40 rounded-l-lg z-40 overflow-y-auto shadow-xl sidebar-transition ${
        isOpen ? 'sidebar-visible' : 'sidebar-hidden-right'
      }`}>
        <div className="p-3 leading-loose">
          <div className="relative flex items-center justify-center mb-3">
            <button
              onClick={onToggle}
              className="absolute left-0 text-text-primary hover:text-text-secondary"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
            <h2 className="text-text-primary text-lg font-bold">Edit</h2>
          </div>

          {/* Tab Navigation */}
          <div className="mb-4 flex justify-center">
            <Tab selectedItem="basic" size="small" isQuiet={true}>
              <TabItem id="basic" label="Basic" />
              <TabItem id="animation" label="Animation" />
              <TabItem id="effect" label="Effect" />
            </Tab>
          </div>

          {/* Text Formatting Tools */}
          <div className="bg-gradient-to-r from-slate-600 to-gray-600 border border-slate-400/50 rounded-full p-1 mb-4 flex items-center justify-center space-x-1 shadow-md">
            <button className="text-slate-300 hover:text-white font-bold text-sm px-2 py-1 hover:bg-slate-500/30 rounded transition-colors">B</button>
            <button className="text-slate-300 hover:text-white italic text-sm px-2 py-1 hover:bg-slate-500/30 rounded transition-colors">I</button>
            <button className="text-slate-300 hover:text-white underline text-sm px-2 py-1 hover:bg-slate-500/30 rounded transition-colors">S</button>
            <button className="text-slate-300 hover:text-white line-through text-sm px-2 py-1 hover:bg-slate-500/30 rounded transition-colors">U</button>
            <button className="text-slate-300 hover:text-white text-sm px-2 py-1 hover:bg-slate-500/30 rounded transition-colors">H</button>
          </div>

          {/* Color Controls */}
          <div className="space-y-2 mb-4">
            <div className="grid grid-cols-3 gap-1 text-xs text-slate-400">
              <span className="text-center">텍스트 색상</span>
              <span className="text-center">배경 색상</span>
              <span className="text-center">폰트</span>
            </div>
            <div className="grid grid-cols-3 gap-2 items-center">
              <div className="w-6 h-6 bg-white border border-slate-600 mx-auto rounded shadow-sm"></div>
              <div className="w-6 h-6 bg-slate-900 border border-white mx-auto rounded shadow-sm"></div>
              <Dropdown
                value="Font 1"
                options={[
                  { value: 'Font 1', label: 'Font 1' },
                  { value: 'Font 2', label: 'Font 2' },
                  { value: 'Font 3', label: 'Font 3' }
                ]}
                size="small"
                className="dropdown-dark"
              />
            </div>
          </div>

          {/* Size and Weight Controls */}
          <div className="space-y-2 mb-4">
            <div className="flex justify-stretch text-xs text-slate-400">
              <span>텍스트 크기</span>
              <span>텍스트 굵기</span>
            </div>
            <div className="flex space-x-2">
              <Dropdown
                value="16"
                options={[
                  { value: '12', label: '12' },
                  { value: '14', label: '14' },
                  { value: '16', label: '16' },
                  { value: '18', label: '18' },
                  { value: '20', label: '20' }
                ]}
                size="small"
                className="dropdown-dark flex-1"
              />
              <Dropdown
                value="2"
                options={[
                  { value: '1', label: '1' },
                  { value: '2', label: '2' },
                  { value: '3', label: '3' },
                  { value: '4', label: '4' }
                ]}
                size="small"
                className="dropdown-dark flex-1"
              />
            </div>
          </div>

          {/* Length Controls */}
          <div className="space-y-2 mb-4">
            <div className="grid grid-cols-3 gap-1 text-xs text-slate-400">
              <span className="text-center">최소 길이</span>
              <span className="text-center">문자 간격</span>
              <span className="text-center">최대 길이</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <input className="bg-slate-600/80 border border-slate-500/50 text-white text-xs px-1 py-1 rounded text-center focus:border-slate-400 focus:ring-1 focus:ring-slate-400/50" defaultValue="10" />
              <input className="bg-slate-600/80 border border-slate-500/50 text-white text-xs px-1 py-1 rounded text-center focus:border-slate-400 focus:ring-1 focus:ring-slate-400/50" defaultValue="3%" />
              <input className="bg-slate-600/80 border border-slate-500/50 text-white text-xs px-1 py-1 rounded text-center focus:border-slate-400 focus:ring-1 focus:ring-slate-400/50" defaultValue="20" />
            </div>
          </div>

          {/* Animation Controls */}
          <div className="space-y-3 mb-4">
            <div className="space-y-2">
              <Slider
                label="애니메이션 속도"
                value={animationSpeed}
                onChange={setAnimationSpeed}
                minValue={0}
                maxValue={100}
                valueFormat={(value) => `${value}%`}
                hasFill={true}
                width="150%"
              />
            </div>
            <div className="space-y-2">
              <Slider
                label="애니메이션 강도"
                value={animationStrength}
                onChange={setAnimationStrength}
                minValue={0}
                maxValue={100}
                valueFormat={(value) => `${value}%`}
                hasFill={true}
                width="150%"
              />
            </div>
          </div>

          {/* Save Button */}
          <Button
            variant="accent"
            size="small"
            className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-full hover:from-blue-400 hover:to-indigo-500 hover:shadow-lg hover:scale-105 transition-all duration-200 shadow-md"
          >
            Save Style
          </Button>
        </div>
      </div>
    </>
  )
}

// Main Editor Page
export default function EditorPage() {
  const [isMyFilesOpen, setIsMyFilesOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(true)
  const [animationSpeed, setAnimationSpeed] = useState(20)
  const [animationStrength, setAnimationStrength] = useState(20)

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-slate-950 to-black text-text-primary relative overflow-hidden">
      {/* Header */}
      <Header isVisible={true} />

      {/* Main Content */}
      <div className="pt-[100px] pb-4 min-h-screen flex relative">
        {/* My Files Sidebar */}
        <MyFilesSidebar 
          isOpen={isMyFilesOpen}
          onToggle={() => setIsMyFilesOpen(!isMyFilesOpen)}
        />

        {/* Central Video Player */}
        <div className="absolute left-1/2 transform -translate-x-1/2 top-[80px] w-[960px] h-[540px]">
          <VideoPlayer />
        </div>

        {/* Edit Sidebar */}
        <EditSidebar 
          isOpen={isEditOpen}
          onToggle={() => setIsEditOpen(!isEditOpen)}
          animationSpeed={animationSpeed}
          setAnimationSpeed={setAnimationSpeed}
          animationStrength={animationStrength}
          setAnimationStrength={setAnimationStrength}
        />
      </div>

    </div>
  )
}