'use client';

import React from 'react';
import { cn } from '@/lib/utils';

export interface TagProps {
  label: string;
  hasAvatar?: boolean;
  avatar?: React.ReactNode;
  isRemovable?: boolean;
  isError?: boolean;
  isDisabled?: boolean;
  isReadOnly?: boolean;
  onRemove?: () => void;
  onClick?: () => void;
  className?: string;
}

const Tag: React.FC<TagProps> = ({
  label,
  hasAvatar = false,
  avatar,
  isRemovable = false,
  isError = false,
  isDisabled = false,
  isReadOnly = false,
  onRemove,
  onClick,
  className,
}) => {
  // Validation
  if (hasAvatar && !avatar) {
    console.warn('Tag: Avatar content must be provided when hasAvatar is true.');
  }

  // Base tag classes
  const baseClasses = [
    'inline-flex',
    'items-center',
    'gap-1.5',
    'px-2',
    'py-1',
    'text-caption',
    'font-medium',
    'rounded-small',
    'transition-colors',
    'duration-200',
  ];

  // State-based styling
  const getStateClasses = () => {
    const classes = [];

    // Error state (highest priority)
    if (isError) {
      classes.push(
        'bg-red-50',
        'text-red-700',
        'border',
        'border-red-200'
      );
    } 
    // Normal state
    else {
      classes.push(
        'bg-surface-secondary',
        'text-text-primary',
        'border',
        'border-border'
      );
    }

    // Disabled state
    if (isDisabled) {
      classes.push('opacity-50', 'cursor-not-allowed');
    } 
    // Interactive states (when not disabled)
    else if (!isReadOnly) {
      if (onClick) {
        classes.push('cursor-pointer');
        if (isError) {
          classes.push('hover:bg-red-100');
        } else {
          classes.push('hover:bg-gray-medium');
        }
      }
    }

    return classes;
  };

  // Handle tag click
  const handleTagClick = () => {
    if (!isDisabled && !isReadOnly && onClick) {
      onClick();
    }
  };

  // Handle remove click
  const handleRemoveClick = (event: React.MouseEvent) => {
    event.stopPropagation();
    if (!isDisabled && !isReadOnly && onRemove) {
      onRemove();
    }
  };

  // Remove button classes
  const getRemoveButtonClasses = () => {
    const classes = [
      'ml-1',
      'w-4',
      'h-4',
      'rounded-full',
      'flex',
      'items-center',
      'justify-center',
      'transition-colors',
      'duration-200',
    ];

    if (isDisabled || isReadOnly) {
      classes.push('cursor-not-allowed');
    } else {
      classes.push('cursor-pointer');
      if (isError) {
        classes.push('hover:bg-red-200', 'text-red-600');
      } else {
        classes.push('hover:bg-gray-slate', 'hover:text-white', 'text-text-secondary');
      }
    }

    return classes;
  };

  // Avatar component
  const renderAvatar = () => {
    if (!hasAvatar || !avatar) return null;

    return (
      <div className="w-4 h-4 rounded-full overflow-hidden flex-shrink-0">
        {avatar}
      </div>
    );
  };

  // Remove icon (X)
  const renderRemoveIcon = () => (
    <svg 
      width="12" 
      height="12" 
      viewBox="0 0 24 24" 
      fill="currentColor"
      className="w-3 h-3"
    >
      <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
    </svg>
  );

  // Combine all classes
  const tagClasses = cn(
    baseClasses,
    getStateClasses(),
    className
  );

  return (
    <div
      className={tagClasses}
      onClick={handleTagClick}
      role={onClick ? 'button' : undefined}
      tabIndex={!isDisabled && !isReadOnly && onClick ? 0 : undefined}
      aria-disabled={isDisabled}
      aria-readonly={isReadOnly}
      onKeyDown={(e) => {
        if ((e.key === 'Enter' || e.key === ' ') && onClick) {
          e.preventDefault();
          handleTagClick();
        }
      }}
    >
      {/* Avatar */}
      {renderAvatar()}
      
      {/* Label */}
      <span className="select-none whitespace-nowrap">
        {label}
      </span>
      
      {/* Remove Button */}
      {isRemovable && (
        <button
          type="button"
          className={cn(getRemoveButtonClasses())}
          onClick={handleRemoveClick}
          disabled={isDisabled || isReadOnly}
          aria-label={`Remove ${label} tag`}
          tabIndex={-1} // Remove from tab order, parent handles focus
        >
          {renderRemoveIcon()}
        </button>
      )}
    </div>
  );
};

export default Tag;