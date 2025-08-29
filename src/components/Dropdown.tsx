'use client';

import React, { useState, useRef, useEffect } from 'react';
import { 
  cn, 
  getDisabledClasses,
  getSizeClasses,
  SIZE_CLASSES,
  type ComponentSize
} from '@/lib/utils';

export interface DropdownOption {
  value: string;
  label: string;
  disabled?: boolean;
  icon?: React.ReactNode;
}

export interface DropdownProps {
  label?: string;
  labelPosition?: 'top' | 'side';
  placeholder?: string;
  value?: string;
  width?: number;
  size?: ComponentSize;
  isQuiet?: boolean;
  necessityIndicator?: 'text' | 'icon' | 'none';
  isRequired?: boolean;
  menuContainer?: 'popover' | 'tray';
  isError?: boolean;
  isDisabled?: boolean;
  isReadOnly?: boolean;
  description?: string;
  errorMessage?: string;
  options: DropdownOption[];
  onChange?: (value: string) => void;
  className?: string;
  id?: string;
}

const DROPDOWN_SIZE_CLASSES = {
  small: {
    trigger: 'h-8 text-sm px-3',
    menu: 'text-sm py-1',
    option: 'px-3 py-1.5',
    icon: 'w-4 h-4'
  },
  medium: {
    trigger: 'h-10 text-base px-3',
    menu: 'text-base py-1',
    option: 'px-3 py-2',
    icon: 'w-5 h-5'
  },
  large: {
    trigger: 'h-12 text-lg px-4',
    menu: 'text-lg py-1',
    option: 'px-4 py-2.5',
    icon: 'w-5 h-5'
  },
  'extra-large': {
    trigger: 'h-14 text-xl px-4',
    menu: 'text-xl py-2',
    option: 'px-4 py-3',
    icon: 'w-6 h-6'
  }
} as const;

const Dropdown: React.FC<DropdownProps> = ({
  label,
  labelPosition = 'top',
  placeholder = 'Select an option...',
  value,
  width,
  size = 'medium',
  isQuiet = false,
  necessityIndicator = 'icon',
  isRequired = false,
  menuContainer = 'popover',
  isError = false,
  isDisabled = false,
  isReadOnly = false,
  description,
  errorMessage,
  options,
  onChange,
  className,
  id
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLUListElement>(null);
  const sizeClasses = DROPDOWN_SIZE_CLASSES[size];

  // 선택된 옵션 찾기
  const selectedOption = options.find(option => option.value === value);

  // 외부 클릭 감지
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        triggerRef.current && 
        !triggerRef.current.contains(event.target as Node) &&
        menuRef.current && 
        !menuRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setFocusedIndex(-1);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  // 키보드 이벤트 처리
  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (isDisabled || isReadOnly) return;

    switch (event.key) {
      case 'Enter':
      case ' ':
        event.preventDefault();
        if (isOpen && focusedIndex >= 0) {
          const focusedOption = options[focusedIndex];
          if (!focusedOption.disabled) {
            onChange?.(focusedOption.value);
            setIsOpen(false);
            setFocusedIndex(-1);
          }
        } else {
          setIsOpen(true);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        setFocusedIndex(-1);
        triggerRef.current?.focus();
        break;
      case 'ArrowDown':
        event.preventDefault();
        if (!isOpen) {
          setIsOpen(true);
          setFocusedIndex(0);
        } else {
          setFocusedIndex(prev => {
            const next = prev < options.length - 1 ? prev + 1 : 0;
            return options[next].disabled ? (next < options.length - 1 ? next + 1 : 0) : next;
          });
        }
        break;
      case 'ArrowUp':
        event.preventDefault();
        if (!isOpen) {
          setIsOpen(true);
          setFocusedIndex(options.length - 1);
        } else {
          setFocusedIndex(prev => {
            const next = prev > 0 ? prev - 1 : options.length - 1;
            return options[next].disabled ? (next > 0 ? next - 1 : options.length - 1) : next;
          });
        }
        break;
    }
  };

  const handleOptionClick = (option: DropdownOption) => {
    if (option.disabled) return;
    onChange?.(option.value);
    setIsOpen(false);
    setFocusedIndex(-1);
    triggerRef.current?.focus();
  };

  // 라벨 클래스
  const labelClasses = cn(
    'font-medium',
    SIZE_CLASSES.typography[size],
    isError ? 'text-red-600' : 'text-text-primary',
    isDisabled && 'opacity-50'
  );

  // 트리거 클래스
  const triggerClasses = cn(
    'inline-flex items-center justify-between w-full',
    'rounded-default',
    'font-medium',
    'transition-all duration-200',
    'focus:outline-none focus:ring-2 focus:ring-offset-2',
    sizeClasses.trigger,

    // Quiet vs Regular 스타일
    isQuiet
      ? [
          'border-0 border-b-2 rounded-none bg-transparent',
          isError 
            ? 'border-red-600 focus:ring-red-200'
            : 'border-border focus:ring-primary-light',
          'hover:border-primary'
        ]
      : [
          'border-2 bg-surface',
          isError
            ? 'border-red-600 focus:ring-red-200'
            : 'border-border focus:ring-primary-light',
          'hover:border-primary hover:shadow-sm'
        ],

    // 비활성화 상태
    (isDisabled || isReadOnly) && getDisabledClasses(),

    // 텍스트 색상
    selectedOption ? 'text-text-primary' : 'text-text-secondary'
  );

  // 메뉴 클래스
  const menuClasses = cn(
    'absolute z-50 w-full mt-1 bg-surface border border-border rounded-default shadow-lg',
    'max-h-60 overflow-auto',
    sizeClasses.menu
  );

  // 옵션 클래스
  const getOptionClasses = (option: DropdownOption, index: number) => cn(
    'flex items-center gap-2 w-full cursor-pointer transition-colors',
    sizeClasses.option,
    
    // 상태별 스타일
    option.disabled
      ? 'text-text-secondary cursor-not-allowed opacity-50'
      : [
          'text-text-primary',
          'hover:bg-primary-very-light',
          focusedIndex === index && 'bg-primary-very-light',
          value === option.value && 'bg-primary text-white'
        ]
  );

  // 필수 표시
  const renderNecessityIndicator = () => {
    if (!isRequired) return null;
    
    switch (necessityIndicator) {
      case 'text':
        return <span className="text-red-600 ml-1">(required)</span>;
      case 'icon':
        return <span className="text-red-600 ml-1">*</span>;
      default:
        return null;
    }
  };

  // 드롭다운 화살표 아이콘
  const ChevronIcon = () => (
    <svg 
      className={cn(
        'transition-transform duration-200',
        sizeClasses.icon,
        isOpen && 'transform rotate-180'
      )}
      viewBox="0 0 20 20" 
      fill="currentColor"
    >
      <path 
        fillRule="evenodd" 
        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" 
        clipRule="evenodd" 
      />
    </svg>
  );

  const containerStyle = width ? { width: `${width}px` } : {};

  const renderDropdown = () => (
    <div className="relative" style={containerStyle}>
      <button
        ref={triggerRef}
        type="button"
        className={triggerClasses}
        onClick={() => !isDisabled && !isReadOnly && setIsOpen(!isOpen)}
        onKeyDown={handleKeyDown}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-labelledby={label ? `${id}-label` : undefined}
        disabled={isDisabled}
        id={id}
      >
        <span className="truncate">
          {selectedOption ? (
            <span className="flex items-center gap-2">
              {selectedOption.icon && <span className={sizeClasses.icon}>{selectedOption.icon}</span>}
              {selectedOption.label}
            </span>
          ) : placeholder}
        </span>
        <ChevronIcon />
      </button>

      {isOpen && (
        <ul
          ref={menuRef}
          className={menuClasses}
          role="listbox"
          aria-labelledby={label ? `${id}-label` : undefined}
        >
          {options.map((option, index) => (
            <li
              key={option.value}
              role="option"
              aria-selected={value === option.value}
              className={getOptionClasses(option, index)}
              onClick={() => handleOptionClick(option)}
              onMouseEnter={() => setFocusedIndex(index)}
            >
              {option.icon && <span className={sizeClasses.icon}>{option.icon}</span>}
              {option.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );

  if (labelPosition === 'side') {
    return (
      <div className={cn('flex items-start gap-3', className)}>
        {label && (
          <label 
            htmlFor={id}
            id={`${id}-label`}
            className={cn(labelClasses, 'whitespace-nowrap min-w-0 pt-2')}
          >
            {label}
            {renderNecessityIndicator()}
          </label>
        )}
        <div className="flex-1 min-w-0">
          {renderDropdown()}
          {description && !isError && (
            <p className="text-sm text-text-secondary mt-1">{description}</p>
          )}
          {isError && errorMessage && (
            <p className="text-sm text-red-600 mt-1">{errorMessage}</p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={cn('flex flex-col gap-1', className)}>
      {label && (
        <label 
          htmlFor={id}
          id={`${id}-label`}
          className={labelClasses}
        >
          {label}
          {renderNecessityIndicator()}
        </label>
      )}
      {renderDropdown()}
      {description && !isError && (
        <p className="text-sm text-text-secondary mt-1">{description}</p>
      )}
      {isError && errorMessage && (
        <p className="text-sm text-red-600 mt-1">{errorMessage}</p>
      )}
    </div>
  );
};

export default Dropdown;