'use client';

import React from 'react';

export interface ButtonProps {
  label?: string;
  hideLabel?: string;
  icon?: React.ReactNode;
  variant?: 'accent' | 'primary' | 'secondary' | 'negative';
  staticColor?: 'none' | 'white' | 'black';
  style?: 'fill' | 'outline';
  size?: 'small' | 'medium' | 'large' | 'extra-large';
  justified?: boolean;
  isPending?: boolean;
  isDisabled?: boolean;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
  children?: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
  label,
  hideLabel,
  icon,
  variant = 'accent',
  staticColor = 'none',
  style = 'fill',
  size = 'medium',
  justified = false,
  isPending = false,
  isDisabled = false,
  onClick,
  type = 'button',
  className = '',
  children,
}) => {
  // Icon이 필요한 경우 validation
  if (!label && !icon) {
    console.warn('Button: Icon must be present if the label is not defined.');
  }

  // Base classes
  const baseClasses = [
    'inline-flex',
    'items-center',
    'justify-center',
    'font-medium',
    'transition-colors',
    'focus:outline-none',
    'focus:ring-2',
    'focus:ring-offset-2',
  ];

  // Size classes
  const sizeClasses = {
    small: ['px-3', 'py-1.5', 'text-caption', 'rounded-default'],
    medium: ['px-4', 'py-2', 'text-body', 'rounded-default'],
    large: ['px-6', 'py-3', 'text-body', 'rounded-default'],
    'extra-large': ['px-8', 'py-4', 'text-h3', 'rounded-default'],
  };

  // Icon sizes based on button size
  const iconSizes = {
    small: 'icon-ui-small',
    medium: 'icon-ui-small',
    large: 'icon-ui-medium',
    'extra-large': 'icon-ui-medium',
  };

  // Variant and style combinations
  const getVariantClasses = () => {
    if (staticColor !== 'none') {
      // Static color overrides variant
      if (staticColor === 'white') {
        return style === 'fill' 
          ? ['bg-white', 'text-text-primary', 'hover:bg-gray-light']
          : ['border-2', 'border-white', 'text-white', 'hover:bg-white', 'hover:text-text-primary'];
      } else if (staticColor === 'black') {
        return style === 'fill'
          ? ['bg-black', 'text-white', 'hover:bg-gray-slate']
          : ['border-2', 'border-black', 'text-text-primary', 'hover:bg-black', 'hover:text-white'];
      }
    }

    // Default variant styles
    switch (variant) {
      case 'accent':
      case 'primary':
        return style === 'fill'
          ? ['bg-primary', 'text-white', 'hover:bg-primary-dark', 'focus:ring-primary-light']
          : ['border-2', 'border-primary', 'text-primary', 'hover:bg-primary', 'hover:text-white', 'focus:ring-primary-light'];

      case 'secondary':
        return style === 'fill'
          ? ['bg-surface', 'text-text-primary', 'border-2', 'border-border', 'hover:bg-surface-secondary']
          : ['border-2', 'border-border', 'text-text-primary', 'hover:bg-surface-secondary'];

      case 'negative':
        // Using existing design system colors for negative/destructive actions
        return style === 'fill'
          ? ['bg-gray-slate', 'text-white', 'hover:bg-black', 'focus:ring-gray-medium']
          : ['border-2', 'border-gray-slate', 'text-gray-slate', 'hover:bg-gray-slate', 'hover:text-white', 'focus:ring-gray-medium'];

      default:
        return style === 'fill'
          ? ['bg-primary', 'text-white', 'hover:bg-primary-dark', 'focus:ring-primary-light']
          : ['border-2', 'border-primary', 'text-primary', 'hover:bg-primary', 'hover:text-white', 'focus:ring-primary-light'];
    }
  };

  // State classes
  const stateClasses = [];
  if (isDisabled) {
    stateClasses.push('opacity-50', 'cursor-not-allowed', 'pointer-events-none');
  }
  if (justified) {
    stateClasses.push('w-full');
  }

  // Combine all classes
  const buttonClasses = [
    ...baseClasses,
    ...sizeClasses[size],
    ...getVariantClasses(),
    ...stateClasses,
    className,
  ].join(' ');

  // Handle click with pending state
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (isPending || isDisabled) {
      event.preventDefault();
      return;
    }
    onClick?.(event);
  };

  // Content rendering
  const renderContent = () => {
    const hasLabel = label || children;
    const showIcon = icon && !isPending;
    const showSpinner = isPending;

    return (
      <>
        {showSpinner && (
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2" />
        )}
        {showIcon && (
          <span className={`${iconSizes[size]} ${hasLabel ? 'mr-2' : ''}`}>
            {icon}
          </span>
        )}
        {hasLabel && (
          <span className={hideLabel ? 'sr-only' : ''}>
            {label || children}
          </span>
        )}
      </>
    );
  };

  return (
    <button
      type={type}
      className={buttonClasses}
      onClick={handleClick}
      disabled={isDisabled}
      aria-label={hideLabel || label}
    >
      {renderContent()}
    </button>
  );
};

export default Button;