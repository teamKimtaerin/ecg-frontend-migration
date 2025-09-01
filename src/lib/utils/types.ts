/**
 * Component type definitions
 */

// Component size type definitions
export type ComponentSize = 'small' | 'medium' | 'large' | 'extra-large'
export type ComponentVariant = 'accent' | 'primary' | 'secondary' | 'negative'
export type ComponentStyle = 'fill' | 'outline'
export type StaticColor = 'none' | 'white' | 'black'

// Common base interface
export interface BaseComponentProps {
  size?: ComponentSize
  isDisabled?: boolean
  className?: string
}

export interface InteractiveComponentProps extends BaseComponentProps {
  isReadOnly?: boolean
  onClick?: () => void
}

export interface StatefulComponentProps {
  isPending?: boolean
  isError?: boolean
  isSelected?: boolean
}

/**
 * Common size-based class mappings
 */
export const SIZE_CLASSES = {
  padding: {
    small: 'px-3 py-1.5',
    medium: 'px-4 py-2',
    large: 'px-6 py-3',
    'extra-large': 'px-8 py-4',
  },
  gap: {
    small: 'gap-2',
    medium: 'gap-4',
    large: 'gap-6',
    'extra-large': 'gap-8',
  },
  text: {
    small: 'text-sm',
    medium: 'text-base',
    large: 'text-lg',
    'extra-large': 'text-xl',
  },
  height: {
    small: 'h-8',
    medium: 'h-10',
    large: 'h-12',
    'extra-large': 'h-16',
  },
  width: {
    small: 'w-8',
    medium: 'w-10',
    large: 'w-12',
    'extra-large': 'w-16',
  },
  iconSize: {
    small: 'w-4 h-4',
    medium: 'w-5 h-5',
    large: 'w-6 h-6',
    'extra-large': 'w-8 h-8',
  },
  iconClasses: {
    small: 'w-4 h-4',
    medium: 'w-5 h-5',
    large: 'w-6 h-6',
    'extra-large': 'w-8 h-8',
  },
  badge: {
    small: 'px-2 py-0.5 text-xs',
    medium: 'px-2.5 py-0.5 text-sm',
    large: 'px-3 py-1 text-base',
    'extra-large': 'px-4 py-1.5 text-lg',
  },
  alertBanner: {
    small: 'px-3 py-2',
    medium: 'px-4 py-3',
    large: 'px-6 py-4',
    'extra-large': 'px-8 py-6',
  },
  alertDialog: {
    small: 'p-4',
    medium: 'p-6',
    large: 'p-8',
    'extra-large': 'p-10',
  },
  progressBar: {
    small: 'h-2',
    medium: 'h-3',
    large: 'h-4',
    'extra-large': 'h-6',
  },
  progressCircle: {
    small: 'w-8 h-8',
    medium: 'w-12 h-12',
    large: 'w-16 h-16',
    'extra-large': 'w-24 h-24',
  },
  modal: {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
  },
  typography: {
    small: 'text-sm',
    medium: 'text-base',
    large: 'text-lg',
    'extra-large': 'text-xl',
  },
  switch: {
    small: 'w-8 h-5',
    medium: 'w-10 h-6',
    large: 'w-12 h-7',
    'extra-large': 'w-14 h-8',
  },
  statusLight: {
    small: {
      container: 'gap-1.5',
      text: 'text-xs',
      dot: 'w-2 h-2',
    },
    medium: {
      container: 'gap-2',
      text: 'text-sm',
      dot: 'w-3 h-3',
    },
    large: {
      container: 'gap-2.5',
      text: 'text-base',
      dot: 'w-4 h-4',
    },
    'extra-large': {
      container: 'gap-3',
      text: 'text-lg',
      dot: 'w-5 h-5',
    },
  },
} as const

// Utility functions for components
export const getSizeClasses = (size: ComponentSize = 'medium') => {
  return SIZE_CLASSES.padding[size]
}

export const getVariantClasses = (variant: ComponentVariant = 'primary', style: ComponentStyle = 'fill', staticColor: StaticColor = 'none') => {
  const baseVariants = {
    accent: style === 'fill' ? 'bg-accent text-white border-accent' : 'border-accent text-accent',
    primary: style === 'fill' ? 'bg-primary text-white border-primary' : 'border-primary text-primary',
    secondary: style === 'fill' ? 'bg-secondary text-text-primary border-border' : 'border-secondary text-secondary',
    negative: style === 'fill' ? 'bg-negative text-white border-negative' : 'border-negative text-negative',
  }
  
  const colorOverrides = {
    white: 'text-white border-white',
    black: 'text-black border-black',
    none: ''
  }
  
  return `${baseVariants[variant]} ${staticColor !== 'none' ? colorOverrides[staticColor] : ''}`
}

export const getDisabledClasses = () => {
  return 'opacity-50 cursor-not-allowed pointer-events-none'
}

export const getBaseInteractiveClasses = () => {
  return 'transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary'
}

// Component warning function
export const logComponentWarning = (component: string, message: string) => {
  if (process.env.NODE_ENV === 'development') {
    console.warn(`${component}: ${message}`)
  }
}