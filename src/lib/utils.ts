/**
 * Design System Utility Functions
 * Shared utilities for consistent component styling and behavior
 */

import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Combines and merges className strings using clsx and tailwind-merge
 * Resolves conflicts between Tailwind classes intelligently
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Component size type definitions
 */
export type ComponentSize = 'small' | 'medium' | 'large' | 'extra-large';
export type ComponentVariant = 'accent' | 'primary' | 'secondary' | 'negative';
export type ComponentStyle = 'fill' | 'outline';
export type StaticColor = 'none' | 'white' | 'black';

// 공통 베이스 인터페이스
export interface BaseComponentProps {
  size?: ComponentSize;
  isDisabled?: boolean;
  className?: string;
}

export interface InteractiveComponentProps extends BaseComponentProps {
  isReadOnly?: boolean;
  onClick?: () => void;
}

export interface StatefulComponentProps {
  isPending?: boolean;
  isError?: boolean;
  isSelected?: boolean;
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
  } as const,
  compactPadding: {
    small: 'px-3 py-1',
    medium: 'px-4 py-1.5',
    large: 'px-5 py-2',
    'extra-large': 'px-6 py-2.5',
  } as const,
  typography: {
    small: 'text-caption',
    medium: 'text-body',
    large: 'text-body', 
    'extra-large': 'text-h3',
  } as const,
  iconSize: {
    small: 'icon-ui-small',
    medium: 'icon-ui-small',
    large: 'icon-ui-medium',
    'extra-large': 'icon-ui-medium',
  } as const,
  // 공통 아이콘 크기 (Tailwind 클래스)
  iconClasses: {
    small: 'w-3 h-3',
    medium: 'w-4 h-4',
    large: 'w-4 h-4',
    'extra-large': 'w-5 h-5',
  } as const,
  // 공통 gap 크기
  gap: {
    small: 'gap-1',
    medium: 'gap-1.5',
    large: 'gap-2',
    'extra-large': 'gap-2',
  } as const,
  // 공통 프로그레스 유틸리티
  progress: {
    small: { height: 'h-1', fontSize: 'text-xs' },
    medium: { height: 'h-2', fontSize: 'text-sm' },
    large: { height: 'h-3', fontSize: 'text-base' },
    'extra-large': { height: 'h-4', fontSize: 'text-lg' },
  },
  // 스위치 전용 크기 클래스
  switch: {
    small: {
      track: 'w-9 h-5',
      thumb: 'w-4 h-4',
      thumbTransform: 'translate-x-4',
      thumbPosition: 'top-1/2 -translate-y-1/2 left-0.2'
    },
    medium: {
      track: 'w-11 h-6', 
      thumb: 'w-5 h-5',
      thumbTransform: 'translate-x-5',
      thumbPosition: 'top-1/2 -translate-y-1/2 left-0.2'
    },
    large: {
      track: 'w-13 h-7',
      thumb: 'w-6 h-6', 
      thumbTransform: 'translate-x-6',
      thumbPosition: 'top-1/2 -translate-y-1/2 left-0.2'
    },
    'extra-large': {
      track: 'w-15 h-8',
      thumb: 'w-7 h-7',
      thumbTransform: 'translate-x-7',
      thumbPosition: 'top-1/2 -translate-y-1/2 left-0.2'
    }
  },
  // 태그 전용 크기 클래스
  tag: {
    small: 'px-1.5 py-0.5 text-xs',
    medium: 'px-2 py-1 text-caption',
    large: 'px-3 py-1.5 text-sm',
    'extra-large': 'px-4 py-2 text-base',
  },
} as const;

/**
 * Common variant-based styling
 */
export const VARIANT_STYLES = {
  primary: {
    fill: ['bg-primary', 'text-white', 'hover:bg-primary-dark', 'focus:ring-primary-light'],
    outline: ['border-2', 'border-primary', 'text-primary', 'hover:bg-primary', 'hover:text-white', 'focus:ring-primary-light'],
  },
  accent: {
    fill: ['bg-primary', 'text-white', 'hover:bg-primary-dark', 'focus:ring-primary-light'], 
    outline: ['border-2', 'border-primary', 'text-primary', 'hover:bg-primary', 'hover:text-white', 'focus:ring-primary-light'],
  },
  secondary: {
    fill: ['bg-surface', 'text-black', 'border-2', 'border-border', 'hover:bg-surface-secondary', 'hover:text-black'],
    outline: ['border-2', 'border-border', 'text-text-primary', 'hover:bg-surface-secondary', 'hover:text-black'],
  },
  negative: {
    fill: ['bg-gray-slate', 'text-white', 'hover:bg-black', 'focus:ring-gray-medium'],
    outline: ['border-2', 'border-gray-slate', 'text-gray-slate', 'hover:bg-gray-slate', 'hover:text-white', 'focus:ring-gray-medium'],
  },
} as const;

/**
 * 시맨틱 컬러 스타일 (에러, 성공, 경고 등)
 */
export const SEMANTIC_COLORS = {
  error: {
    fill: ['bg-red-50', 'text-red-700', 'border', 'border-red-200'],
    outline: ['border', 'border-red-200', 'text-red-700', 'hover:bg-red-50'],
    background: 'bg-red-50',
    text: 'text-red-700',
    border: 'border-red-200',
    hover: 'hover:bg-red-100'
  },
  success: {
    fill: ['bg-green-50', 'text-green-700', 'border', 'border-green-200'],
    outline: ['border', 'border-green-200', 'text-green-700', 'hover:bg-green-50'],
    background: 'bg-green-50',
    text: 'text-green-700',
    border: 'border-green-200',
    hover: 'hover:bg-green-100'
  },
  warning: {
    fill: ['bg-yellow-50', 'text-yellow-700', 'border', 'border-yellow-200'],
    outline: ['border', 'border-yellow-200', 'text-yellow-700', 'hover:bg-yellow-50'],
    background: 'bg-yellow-50',
    text: 'text-yellow-700',
    border: 'border-yellow-200',
    hover: 'hover:bg-yellow-100'
  },
  info: {
    fill: ['bg-blue-50', 'text-blue-700', 'border', 'border-blue-200'],
    outline: ['border', 'border-blue-200', 'text-blue-700', 'hover:bg-blue-50'],
    background: 'bg-blue-50',
    text: 'text-blue-700',
    border: 'border-blue-200',
    hover: 'hover:bg-blue-100'
  },
  neutral: {
    fill: ['bg-surface-secondary', 'text-text-primary', 'border', 'border-border'],
    outline: ['border', 'border-border', 'text-text-primary', 'hover:bg-surface-secondary'],
    background: 'bg-surface-secondary',
    text: 'text-text-primary',
    border: 'border-border',
    hover: 'hover:bg-gray-medium'
  }
} as const;

/**
 * Static color overrides
 */
export const STATIC_COLOR_STYLES = {
  white: {
    fill: ['bg-white', 'text-black', 'hover:bg-gray-medium', 'hover:text-black'],
    outline: ['border-2', 'border-white', 'text-white', 'hover:bg-white', 'hover:text-black'],
  },
  black: {
    fill: ['bg-black', 'text-white', 'hover:bg-gray-slate'],
    outline: ['border-2', 'border-black', 'text-black', 'hover:bg-black', 'hover:text-white'],
  },
} as const;

/**
 * 공통 전환 애니메이션 클래스
 */
export const TRANSITIONS = {
  fast: 'transition-all duration-200 ease-out',
  normal: 'transition-all duration-300 ease-in-out',
  slow: 'transition-all duration-500 ease-in-out',
  colors: 'transition-colors duration-200',
  transform: 'transition-transform duration-300 ease-out',
} as const;

/**
 * Generate base interactive element classes
 */
export function getBaseInteractiveClasses() {
  return [
    'inline-flex',
    'items-center', 
    'justify-center',
    'font-medium',
    'transition-all',
    'duration-200',
    'shadow-sm',
    'hover:shadow-md',
    'active:shadow-none',
    'active:translate-y-px',
    'focus:outline-none',
    'focus:ring-2',
    'focus:ring-offset-2',
  ];
}

/**
 * Generate disabled state classes
 */
export function getDisabledClasses() {
  return [
    'opacity-50', 
    'cursor-not-allowed', 
    'pointer-events-none',
    'shadow-none',
    'transform-none'
  ];
}

/**
 * Get size-based classes for components
 */
export function getSizeClasses(size: ComponentSize, compact: boolean = false) {
  const paddingKey = compact ? 'compactPadding' : 'padding';
  return [
    SIZE_CLASSES[paddingKey][size],
    SIZE_CLASSES.typography[size],
    'rounded-default'
  ];
}

/**
 * Get variant styling classes
 */
export function getVariantClasses(
  variant: ComponentVariant, 
  style: ComponentStyle,
  staticColor?: StaticColor
) {
  // Static color overrides variant
  if (staticColor && staticColor !== 'none') {
    return STATIC_COLOR_STYLES[staticColor][style];
  }
  
  return VARIANT_STYLES[variant][style];
}

/**
 * Debounce utility for performance optimization
 */
export function debounce<TArgs extends readonly unknown[], TReturn>(
  func: (...args: TArgs) => TReturn,
  wait: number
): (...args: TArgs) => void {
  let timeout: NodeJS.Timeout;
  
  return (...args: TArgs) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

/**
 * Throttle utility for performance optimization  
 */
export function throttle<TArgs extends readonly unknown[], TReturn>(
  func: (...args: TArgs) => TReturn,
  limit: number
): (...args: TArgs) => void {
  let inThrottle: boolean;
  
  return (...args: TArgs) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

/**
 * Clamp a number within a range
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

/**
 * Check if a value is defined (not null or undefined)
 */
export function isDefined<T>(value: T | null | undefined): value is T {
  return value !== null && value !== undefined;
}

/**
 * Calculate progress percentage from value and range
 */
export function calculateProgress(
  value: number = 0,
  minValue: number = 0,
  maxValue: number = 100
): number {
  return Math.min(100, Math.max(0, ((value - minValue) / (maxValue - minValue)) * 100));
}

/**
 * 공통 이벤트 핸들러 유틸리티
 */
export function createClickHandler({
  isDisabled,
  isReadOnly,
  isPending,
  onClick
}: {
  isDisabled?: boolean;
  isReadOnly?: boolean;
  isPending?: boolean;
  onClick?: () => void;
}) {
  return (event?: React.MouseEvent | React.KeyboardEvent) => {
    if (isDisabled || isReadOnly || isPending) {
      event?.preventDefault();
      return;
    }
    onClick?.();
  };
}

/**
 * 공통 키보드 이벤트 핸들러
 */
export function createKeyboardHandler({
  isDisabled,
  isReadOnly,
  onActivate,
  keys = [' ', 'Enter']
}: {
  isDisabled?: boolean;
  isReadOnly?: boolean;
  onActivate?: () => void;
  keys?: string[];
}) {
  return (event: React.KeyboardEvent) => {
    if (isDisabled || isReadOnly) return;
    if (keys.includes(event.key)) {
      event.preventDefault();
      onActivate?.();
    }
  };
}

/**
 * 시맨틱 컬러 클래스 가져오기
 */
export function getSemanticClasses(
  semantic: 'error' | 'success' | 'warning' | 'info' | 'neutral',
  style: 'fill' | 'outline' = 'fill'
) {
  return SEMANTIC_COLORS[semantic][style];
}

/**
 * Validation 로그 유틸리티
 */
export function logComponentWarning(component: string, message: string) {
  if (process.env.NODE_ENV === 'development') {
    console.warn(`${component}: ${message}`);
  }
}