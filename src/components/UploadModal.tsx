'use client'

import React, { useState, useCallback, useRef } from 'react'
import {
  cn,
  SIZE_CLASSES,
  TRANSITIONS
} from '@/lib/utils'
import Modal, { type ModalProps } from './Modal'
import Button from './Button'
import ButtonGroup from './ButtonGroup'
import Dropdown from './Dropdown'
import Switch from './Switch'

export interface UploadModalProps extends Omit<ModalProps, 'children' | 'title' | 'size'> {
  onFileSelect: (files: FileList) => void
  acceptedTypes?: string[]
  maxFileSize?: number
  multiple?: boolean
}

const UploadModal: React.FC<UploadModalProps> = ({
  isOpen,
  onClose,
  onFileSelect,
  acceptedTypes = ['audio/*', 'video/*'],
  maxFileSize = 100 * 1024 * 1024, // 100MB
  multiple = true,
  ...modalProps
}) => {
  const [isDragOver, setIsDragOver] = useState(false)
  const [selectedLanguage, setSelectedLanguage] = useState('Korean (South Korea)')
  const [useTranscriptionDictionary, setUseTranscriptionDictionary] = useState(false)
  const [submitAutomatically, setSubmitAutomatically] = useState(true)
  const [inputMethod, setInputMethod] = useState<'file' | 'link'>('file')
  const [videoUrl, setVideoUrl] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragOver(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragOver(false)
  }, [])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragOver(false)

    const files = e.dataTransfer.files
    if (files.length > 0) {
      // Validate dropped files
      const validFiles = Array.from(files).filter(file => {
        const isValidType = acceptedTypes.some(type => {
          if (type.endsWith('/*')) {
            const baseType = type.replace('/*', '')
            return file.type.startsWith(baseType)
          }
          return file.type === type
        })
        const isValidSize = file.size <= maxFileSize
        
        if (!isValidType) {
          console.warn(`File ${file.name} has invalid type: ${file.type}`)
        }
        if (!isValidSize) {
          console.warn(`File ${file.name} exceeds size limit: ${(file.size / 1024 / 1024).toFixed(2)}MB`)
        }
        
        return isValidType && isValidSize
      })
      
      if (validFiles.length > 0) {
        // Create new FileList-like object
        const dt = new DataTransfer()
        validFiles.forEach(file => dt.items.add(file))
        onFileSelect(dt.files)
      }
    }
  }, [onFileSelect, acceptedTypes, maxFileSize])

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      onFileSelect(files)
    }
  }, [onFileSelect])

  const handleBrowseClick = useCallback(() => {
    fileInputRef.current?.click()
  }, [])

  const handleSubmit = useCallback(() => {
    console.log('Fast transcription started with:', {
      language: selectedLanguage,
      useDictionary: useTranscriptionDictionary,
      autoSubmit: submitAutomatically,
      method: inputMethod,
      ...(inputMethod === 'link' && { url: videoUrl })
    })
    onClose()
  }, [selectedLanguage, useTranscriptionDictionary, submitAutomatically, inputMethod, videoUrl, onClose])

  return (
    <>
      <input
        ref={fileInputRef}
        type="file"
        multiple={multiple}
        accept={acceptedTypes.join(',')}
        onChange={handleFileChange}
        className="hidden"
      />
      
      <Modal
        {...modalProps}
        isOpen={isOpen}
        onClose={onClose}
        size="lg"
        title="Fast Transcription"
        className="max-w-4xl"
      >
        <div className={cn('flex flex-col', SIZE_CLASSES.gap['extra-large'])}>
          {/* Input Method Selection */}
          <div className={cn('flex flex-col', SIZE_CLASSES.gap.medium)}>
            <h3 className="text-h3 font-semibold text-text-primary">
              1. Choose input method
            </h3>
            
            <ButtonGroup orientation="horizontal" spacing="none" className="bg-surface-secondary rounded-small p-1">
              <Button
                variant={inputMethod === 'file' ? 'primary' : 'secondary'}
                style={inputMethod === 'file' ? 'fill' : 'outline'}
                size="medium"
                onClick={() => setInputMethod('file')}
                className="flex-1 border-0 hover:shadow-none focus:shadow-none"
              >
                Upload Files
              </Button>
              <Button
                variant={inputMethod === 'link' ? 'primary' : 'secondary'}
                style={inputMethod === 'link' ? 'fill' : 'outline'}
                size="medium"
                onClick={() => setInputMethod('link')}
                className="flex-1 border-0 hover:shadow-none focus:shadow-none"
              >
                Import Link
              </Button>
            </ButtonGroup>
          </div>

          {/* File Upload Section */}
          {inputMethod === 'file' && (
            <div className={cn('flex flex-col', SIZE_CLASSES.gap.medium)}>
              <h4 className="text-body font-semibold text-text-primary">
                Upload your files
              </h4>
              
              <div
                className={cn(
                  'border-2 border-dashed rounded-small text-center cursor-pointer min-h-[200px] flex flex-col items-center justify-center',
                  SIZE_CLASSES.padding['extra-large'],
                  TRANSITIONS.colors,
                  isDragOver
                    ? 'border-primary bg-primary-opaque'
                    : 'border-border bg-surface-secondary hover:border-primary hover:bg-primary-opaque'
                )}
                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                onClick={handleBrowseClick}
              >
                <div className={cn('flex flex-col items-center', SIZE_CLASSES.gap.medium)}>
                  <div className="w-16 h-16 mx-auto bg-primary rounded-full flex items-center justify-center">
                    <svg className={cn(SIZE_CLASSES.iconClasses.large, "text-white")} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                  </div>
                  
                  <div>
                    <p className="text-body text-text-primary font-medium">
                      Drop files here or click to browse
                    </p>
                    <p className="text-caption text-text-secondary mt-1">
                      Supports audio and video files (max {Math.round(maxFileSize / 1024 / 1024)}MB)
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Link Import Section */}
          {inputMethod === 'link' && (
            <div className={cn('flex flex-col', SIZE_CLASSES.gap.medium)}>
              <h4 className="text-body font-semibold text-text-primary">
                Import from link
              </h4>
              <div className={cn('flex flex-col', SIZE_CLASSES.gap.medium)}>
                <div>
                  <label className="block text-body font-medium text-text-primary mb-2">
                    Video URL
                  </label>
                  <input
                    type="url"
                    value={videoUrl}
                    onChange={(e) => setVideoUrl(e.target.value)}
                    placeholder="https://example.com/video.mp4 or YouTube/Vimeo URL"
                    className={cn(
                      'w-full bg-surface border border-border rounded-default text-text-primary placeholder-text-secondary',
                      SIZE_CLASSES.padding.medium,
                      'focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary',
                      TRANSITIONS.colors
                    )}
                  />
                </div>
                
                <div className={cn('bg-surface-secondary rounded-small', SIZE_CLASSES.padding.medium)}>
                  <div className={cn('flex items-start', SIZE_CLASSES.gap.medium)}>
                    <div className={cn('bg-primary rounded-full flex items-center justify-center flex-shrink-0 mt-0.5', SIZE_CLASSES.iconClasses.medium)}>
                      <svg className={cn(SIZE_CLASSES.iconClasses.small, "text-white")} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-caption font-semibold text-text-primary mb-1">
                        Supported platforms:
                      </p>
                      <p className="text-caption text-text-secondary">
                        YouTube, Vimeo, Direct video links (MP4, MOV, AVI, etc.)
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Language Selection Section */}
          <div className={cn('flex flex-col', SIZE_CLASSES.gap.medium)}>
            <h3 className="text-h3 font-semibold text-text-primary">
              2. Configure transcription settings
            </h3>
            
            <div className={cn('flex flex-col', SIZE_CLASSES.gap.medium)}>
              <Dropdown
                label="Audio Language"
                value={selectedLanguage}
                onChange={(value) => setSelectedLanguage(value)}
                options={[
                  { value: 'Korean (South Korea)', label: 'Korean (South Korea)' },
                  { value: 'English (US)', label: 'English (US)' },
                  { value: 'Japanese', label: 'Japanese' },
                  { value: 'Chinese (Simplified)', label: 'Chinese (Simplified)' }
                ]}
                size="medium"
                placeholder="Select language"
              />
              
              {/* Additional options */}
              <div className={cn('flex flex-col', SIZE_CLASSES.gap.medium)}>
                <Switch
                  label="Use transcription dictionary"
                  isSelected={useTranscriptionDictionary}
                  onChange={setUseTranscriptionDictionary}
                  size="medium"
                  id="transcription-dictionary-switch"
                />
                
                <Switch
                  label="Submit automatically after transcription"
                  isSelected={submitAutomatically}
                  onChange={setSubmitAutomatically}
                  size="medium"
                  id="auto-submit-switch"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Modal Actions */}
        <div className={cn(
          'flex justify-end border-t border-border',
          'mt-6 pt-6' // Using consistent spacing pattern
        )}>
          <ButtonGroup orientation="horizontal" spacing="small">
            <Button
              variant="secondary"
              style="outline"
              size="medium"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              style="fill"
              size="medium"
              onClick={handleSubmit}
            >
              Start Transcription
            </Button>
          </ButtonGroup>
        </div>
      </Modal>
    </>
  )
}

export default UploadModal