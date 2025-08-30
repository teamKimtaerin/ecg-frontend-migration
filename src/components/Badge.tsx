'use client';

import React from 'react';
import { 
  cn, 
  SIZE_CLASSES,
  BADGE_COLORS,
  TRANSITIONS,
  logComponentWarning,
  type ComponentSize,
  type BaseComponentProps 
} from '@/lib/utils';

export type BadgeVariant = keyof typeof BADGE_COLORS;
export type BadgeFixed = 'none' | 'top' | 'right' | 'bottom' | 'left';

export interface BadgeProps extends Omit<BaseComponentProps, 'isDisabled'> {
  label?: string;
  icon?: React.ReactNode;
  variant?: BadgeVariant;
  fixed?: BadgeFixed;
  id?: string;
}

const Badge: React.FC<BadgeProps> = ({
  label,
  icon,
  variant = 'neutral',
  fixed = 'none',
  size = 'small',
  className,
  id
}) => {
  // Validation
  if (!label && !icon) {
    logComponentWarning('Badge', 'Either label or icon must be provided.');
  }

  // Get size and color classes
  const sizeClasses = SIZE_CLASSES.badge[size];
  const colorClasses = BADGE_COLORS[variant];

  // Determine if it's icon-only
  const isIconOnly = !label && icon;

  // Base badge classes
  const badgeClasses = cn(
    // Base styles
    'inline-flex',
    'items-center',
    'justify-center',
    'font-medium',
    'rounded-full',
    'whitespace-nowrap',
    'select-none',
    
    // Size-based classes
    isIconOnly ? sizeClasses.onlyIcon : sizeClasses.container,
    
    // Color classes
    colorClasses.bg,
    colorClasses.text,
    
    // Transitions
    TRANSITIONS.colors,
    
    // Fixed positioning
    fixed !== 'none' && getFixedPositionClasses(fixed),
    
    className
  );

  // Icon classes
  const iconClasses = cn(
    sizeClasses.icon,
    'flex-shrink-0',
    label && 'mr-1' // Add margin when both icon and label exist
  );

  return (
    <span 
      className={badgeClasses}
      id={id}
      role="status"
      aria-label={label || 'Badge'}
    >
      {/* Icon */}
      {icon && (
        <span className={iconClasses}>
          {icon}
        </span>
      )}
      
      {/* Label */}
      {label && (
        <span className="truncate">
          {label}
        </span>
      )}
    </span>
  );
};

/**
 * Get fixed position classes for badge positioning
 */
function getFixedPositionClasses(fixed: BadgeFixed): string {
  const baseFixed = 'absolute z-10';
  
  switch (fixed) {
    case 'top':
      return cn(baseFixed, '-top-2 left-1/2 -translate-x-1/2');
    case 'right':
      return cn(baseFixed, '-top-2 -right-2');
    case 'bottom':
      return cn(baseFixed, '-bottom-2 left-1/2 -translate-x-1/2');
    case 'left':
      return cn(baseFixed, '-top-2 -left-2');
    case 'none':
    default:
      return '';
  }
}

export default Badge;