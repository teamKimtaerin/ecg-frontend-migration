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
  compactPadding: {
    small: 'px-3 py-1',
    medium: 'px-4 py-1.5',
    large: 'px-5 py-2',
    'extra-large': 'px-6 py-2.5',
  },
  typography: {
    small: 'text-caption',
    medium: 'text-body',
    large: 'text-body', 
    'extra-large': 'text-h3',
  },
  iconSize: {
    small: 'icon-ui-small',
    medium: 'icon-ui-small',
    large: 'icon-ui-medium',
    'extra-large': 'icon-ui-medium',
  },
  // 공통 아이콘 크기 (Tailwind 클래스)
  iconClasses: {
    small: 'w-3 h-3',
    medium: 'w-4 h-4',
    large: 'w-4 h-4',
    'extra-large': 'w-5 h-5',
  },
  // 공통 gap 크기
  gap: {
    small: 'gap-1',
    medium: 'gap-1.5',
    large: 'gap-2',
    'extra-large': 'gap-2',
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
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

/**
 * Throttle utility for performance optimization  
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  
  return (...args: Parameters<T>) => {
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