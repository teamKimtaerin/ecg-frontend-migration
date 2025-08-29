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
    container: 'w-8 h-4',
    thumb: 'w-3 h-3',
    thumbPosition: 'translate-x-4'
  },
  medium: {
    container: 'w-11 h-6', 
    thumb: 'w-5 h-5',
    thumbPosition: 'translate-x-5'
  },
  large: {
    container: 'w-14 h-7',
    thumb: 'w-6 h-6', 
    thumbPosition: 'translate-x-7'
  },
  'extra-large': {
    container: 'w-16 h-8',
    thumb: 'w-7 h-7',
    thumbPosition: 'translate-x-8'
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

  const switchContainerClasses = cn(
    'inline-flex items-center cursor-pointer relative',
    'rounded-full',
    'transition-all',
    'border-2',
    sizeClasses.container,
    
    // Base states
    isSelected 
      ? isEmphasized 
        ? 'bg-primary-dark border-primary-dark'
        : 'bg-primary border-primary'
      : 'bg-gray-medium border-gray-medium',
    
    // Hover states
    !isDisabled && !isReadOnly && (
      isSelected
        ? isEmphasized
          ? 'hover:bg-primary hover:border-primary' 
          : 'hover:bg-primary-dark hover:border-primary-dark'
        : 'hover:bg-gray-slate hover:border-gray-slate'
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
    'absolute left-0.5 top-0.5',
    'bg-white',
    'rounded-full',
    'shadow-sm',
    'transition-transform',
    sizeClasses.thumb,
    isSelected && sizeClasses.thumbPosition,
    
    // Emphasis shadow
    isEmphasized && 'shadow-md'
  );

  const labelClasses = cn(
    'text-text-primary',
    'font-medium',
    SIZE_CLASSES.typography[size],
    isDisabled && 'opacity-50'
  );

  return (
    <div className={cn('inline-flex items-center gap-2 text-black', className)}>
      <div
        role="switch"
        aria-checked={isSelected}
        aria-disabled={isDisabled}
        aria-readonly={isReadOnly}
        tabIndex={isDisabled || isReadOnly ? -1 : 0}
        className={switchContainerClasses}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        id={id}
      >
        <div className={thumbClasses} />
      </div>
      
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