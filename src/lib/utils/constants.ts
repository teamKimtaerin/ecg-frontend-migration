/**
 * Application constants
 */

// Component sizes
export const COMPONENT_SIZES = {
  small: 'small',
  medium: 'medium', 
  large: 'large'
} as const

// Animation durations
export const ANIMATION_DURATION = {
  fast: 150,
  normal: 200,
  slow: 300,
  slower: 500
} as const

// Breakpoints (matching Tailwind)
export const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536
} as const

// Z-index layers
export const Z_INDEX = {
  base: 0,
  dropdown: 10,
  sticky: 20,
  modal: 30,
  popover: 40,
  tooltip: 50,
  notification: 60
} as const

// File size limits
export const FILE_SIZE_LIMITS = {
  small: 1024 * 1024, // 1MB
  medium: 10 * 1024 * 1024, // 10MB
  large: 100 * 1024 * 1024, // 100MB
  xl: 500 * 1024 * 1024 // 500MB
} as const

// Supported file types
export const SUPPORTED_FILE_TYPES = {
  images: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  videos: ['video/mp4', 'video/webm', 'video/ogg', 'video/avi', 'video/mov'],
  audio: ['audio/mp3', 'audio/wav', 'audio/ogg', 'audio/aac'],
  documents: ['application/pdf', 'text/plain', 'application/msword']
} as const

// API endpoints
export const API_ENDPOINTS = {
  transcription: {
    upload: '/api/transcription/upload',
    url: '/api/transcription/url'
  },
  health: '/api/health',
  test: '/api/test'
} as const

// Language codes
export const LANGUAGE_CODES = {
  ko: '한국어',
  en: 'English', 
  ja: '日本語',
  zh: '中文',
  es: 'Español',
  fr: 'Français',
  de: 'Deutsch',
  ru: 'Русский',
  pt: 'Português',
  it: 'Italiano'
} as const

export type LanguageCode = keyof typeof LANGUAGE_CODES

// Default values
export const DEFAULTS = {
  language: 'ko' as LanguageCode,
  useDictionary: false,
  autoSubmit: false,
  maxFileSize: FILE_SIZE_LIMITS.large,
  acceptedTypes: [...SUPPORTED_FILE_TYPES.videos, ...SUPPORTED_FILE_TYPES.audio]
} as const

// Error messages
export const ERROR_MESSAGES = {
  fileTooBig: 'File size exceeds the maximum limit',
  invalidFileType: 'File type not supported',
  uploadFailed: 'Upload failed. Please try again.',
  networkError: 'Network error. Please check your connection.',
  invalidUrl: 'Please enter a valid URL',
  requiredField: 'This field is required',
  processingError: 'Processing failed. Please try again.'
} as const

// Success messages  
export const SUCCESS_MESSAGES = {
  uploadSuccess: 'Files uploaded successfully',
  processingStarted: 'Processing started successfully',
  settingsSaved: 'Settings saved successfully',
  copied: 'Copied to clipboard'
} as const