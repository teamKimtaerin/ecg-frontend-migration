'use client';

import React from 'react';
import { 
  cn, 
  getDisabledClasses,
  SIZE_CLASSES,
  type ComponentSize
} from '@/lib/utils';

export interface SwitchProps {
  label?: string;
  isSelected?: boolean;
  size?: ComponentSize;
  isEmphasized?: boolean;
  isDisabled?: boolean;
  isReadOnly?: boolean;
  onChange?: (selected: boolean) => void;
  className?: string;
  id?: string;
}

const SWITCH_SIZE_CLASSES = {
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
} as const;

const Switch: React.FC<SwitchProps> = ({
  label,
  isSelected = false,
  size = 'medium',
  isEmphasized = false,
  isDisabled = false,
  isReadOnly = false,
  onChange,
  className,
  id
}) => {
  const sizeClasses = SWITCH_SIZE_CLASSES[size];
  
  const handleClick = () => {
    if (isDisabled || isReadOnly) return;
    onChange?.(!isSelected);
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (isDisabled || isReadOnly) return;
    if (event.key === ' ' || event.key === 'Enter') {
      event.preventDefault();
      onChange?.(!isSelected);
    }
  };

  const trackClasses = cn(
    'relative inline-flex items-center shrink-0 cursor-pointer',
    'rounded-full',
    'transition-all duration-300 ease-in-out',
    'border-2 border-transparent',
    sizeClasses.track,
    
    // Track background states - OFF/ON 상태에 따라 명확히 구분
    isSelected 
      ? isEmphasized 
        ? 'bg-primary-dark shadow-inner'
        : 'bg-primary shadow-inner'
      : 'bg-gray-slate shadow-inner',
    
    // Hover states
    !isDisabled && !isReadOnly && (
      isSelected
        ? isEmphasized
          ? 'hover:bg-primary hover:shadow-md' 
          : 'hover:bg-primary-dark hover:shadow-md'
        : 'hover:bg-black hover:shadow-sm'
    ),
    
    // Focus states
    'focus:outline-none focus:ring-2 focus:ring-offset-2',
    isSelected 
      ? 'focus:ring-primary-light'
      : 'focus:ring-gray-medium',
      
    // Disabled states
    (isDisabled || isReadOnly) && getDisabledClasses()
  );

  const thumbClasses = cn(
    'absolute',
    sizeClasses.thumbPosition,
    'bg-white',
    'rounded-full',
    'shadow-md',
    'transition-transform duration-300 ease-out',
    'pointer-events-none',
    sizeClasses.thumb,
    
    // Transform - OFF/ON 상태에 따라 좌우 이동
    isSelected && sizeClasses.thumbTransform,
    
    // Interactive visual feedback
    !isDisabled && !isReadOnly && (
      isSelected
        ? 'shadow-lg'
        : 'shadow-md'
    ),
    
    // Enhanced shadow for emphasis
    isEmphasized && 'shadow-xl'
  );

  const labelClasses = cn(
    'text-text-primary',
    'font-medium',
    SIZE_CLASSES.typography[size],
    isDisabled && 'opacity-50'
  );

  return (
    <div className={cn('inline-flex items-center gap-3 text-text-primary', className)}>
      <button
        type="button"
        role="switch"
        aria-checked={isSelected}
        aria-disabled={isDisabled}
        aria-readonly={isReadOnly}
        disabled={isDisabled || isReadOnly}
        className={trackClasses}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        id={id}
        aria-label={label || `Toggle switch ${isSelected ? 'on' : 'off'}`}
      >
        {/* Track 내부의 시각적 인디케이터 */}
        <span className="sr-only">
          {isSelected ? 'On' : 'Off'}
        </span>
        
        {/* Thumb (Handle) */}
        <span 
          className={thumbClasses}
          aria-hidden="true"
        />
      </button>
      
      {label && (
        <label 
          htmlFor={id}
          className={cn(
            labelClasses,
            !isDisabled && !isReadOnly && 'cursor-pointer'
          )}
          onClick={isDisabled || isReadOnly ? undefined : handleClick}
        >
          {label}
        </label>
      )}
    </div>
  );
};

export default Switch;