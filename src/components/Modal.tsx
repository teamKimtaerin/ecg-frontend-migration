'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { 
  cn, 
  SIZE_CLASSES,
  TRANSITIONS,
  MODAL_ANIMATIONS,
  MODAL_VARIANTS,
  getModalAnimationClasses,
  getModalVariantClasses,
  preventBodyScroll,
  createModalHandler,
  trapFocus,
  getInitialFocus,
  logComponentWarning,
  type BaseComponentProps 
} from '@/lib/utils';
import { CloseIcon } from './icons';
import Button from './Button';

export type ModalSize = 'sm' | 'md' | 'lg' | 'xl' | 'full';
export type ModalAnimation = keyof typeof MODAL_ANIMATIONS;
export type ModalVariant = keyof typeof MODAL_VARIANTS;
export type ModalPlacement = 'center' | 'top' | 'bottom' | 'left' | 'right';

export interface ModalProps extends Omit<BaseComponentProps, 'size'> {
  // State
  open?: boolean;
  isOpen?: boolean;
  onClose?: () => void;
  onOpen?: () => void;
  onShow?: () => void;
  onHide?: () => void;
  
  // Content
  title?: string;
  subtitle?: string;
  children?: React.ReactNode;
  content?: React.ReactNode;
  header?: React.ReactNode;
  footer?: React.ReactNode;
  
  // Appearance
  size?: ModalSize;
  variant?: ModalVariant;
  centered?: boolean;
  placement?: ModalPlacement;
  backdrop?: boolean | 'static';
  backdropClassName?: string;
  overlayClassName?: string;
  
  // Behavior
  closeOnEsc?: boolean;
  closeOnBackdropClick?: boolean;
  showCloseButton?: boolean;
  closeButton?: boolean;
  dismissible?: boolean;
  
  // Animation
  animation?: ModalAnimation;
  animationDuration?: number;
  fade?: boolean;
  
  // Layout
  fullScreen?: boolean;
  scrollable?: boolean;
  verticallyScrollable?: boolean;
  
  // Focus & Accessibility
  keyboard?: boolean;
  autoFocus?: boolean;
  enforceFocus?: boolean;
  restoreFocus?: boolean;
  
  // Advanced
  container?: HTMLElement;
  preventScroll?: boolean;
  zIndex?: number;
  tabIndex?: number;
  
  // Events
  onEnter?: () => void;
  onEntering?: () => void;
  onEntered?: () => void;
  onExit?: () => void;
  onExiting?: () => void;
  onExited?: () => void;
  
  // ARIA
  role?: string;
  'aria-labelledby'?: string;
  'aria-describedby'?: string;
  'aria-label'?: string;
  
  // Custom
  id?: string;
  'data-testid'?: string;
  
  // Actions
  primaryAction?: {
    label: string;
    onClick: () => void;
    variant?: 'primary' | 'secondary' | 'accent' | 'negative';
    disabled?: boolean;
  };
  secondaryAction?: {
    label: string;
    onClick: () => void;
    variant?: 'primary' | 'secondary' | 'accent' | 'negative';
    disabled?: boolean;
  };
  cancelAction?: {
    label?: string;
    onClick?: () => void;
  };
}

const Modal: React.FC<ModalProps> = ({
  // State
  open,
  isOpen,
  onClose,
  onOpen,
  onShow,
  onHide,
  
  // Content
  title,
  subtitle,
  children,
  content,
  header,
  footer,
  
  // Appearance
  size = 'md',
  variant = 'default',
  centered = true,
  placement = 'center',
  backdrop = true,
  backdropClassName,
  overlayClassName,
  
  // Behavior
  closeOnEsc = true,
  closeOnBackdropClick = true,
  showCloseButton = true,
  closeButton = true,
  dismissible = true,
  
  // Animation
  animation = 'zoom',
  animationDuration = 300,
  fade = true,
  
  // Layout
  fullScreen = false,
  scrollable = true,
  verticallyScrollable = true,
  
  // Focus & Accessibility
  keyboard = true,
  autoFocus = true,
  enforceFocus = true,
  restoreFocus = true,
  
  // Advanced
  container,
  preventScroll = true,
  zIndex = 1050,
  tabIndex = -1,
  
  // Events
  onEnter,
  onEntering,
  onEntered,
  onExit,
  onExiting,
  onExited,
  
  // ARIA
  role = 'dialog',
  'aria-labelledby': ariaLabelledBy,
  'aria-describedby': ariaDescribedBy,
  'aria-label': ariaLabel,
  
  // Custom
  className,
  id,
  'data-testid': dataTestId,
  
  // Actions
  primaryAction,
  secondaryAction,
  cancelAction,
}) => {
  const [isMounted, setIsMounted] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);
  const previousActiveElement = useRef<HTMLElement | null>(null);
  const focusTrap = useRef<(() => void) | null>(null);
  
  // Resolve open state - prefer isOpen over open
  const modalIsOpen = isOpen ?? open ?? false;
  const actualShowCloseButton = showCloseButton && closeButton && dismissible;
  
  // Validation
  if (!children && !content && !title && !header) {
    logComponentWarning('Modal', 'Modal should have content (children, content, title, or header).');
  }

  if (backdrop === 'static' && closeOnBackdropClick) {
    logComponentWarning('Modal', 'closeOnBackdropClick is ignored when backdrop is "static".');
  }

  // Handle mounting for SSR
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Animation lifecycle callbacks
  const handleEnter = useCallback(() => {
    setIsAnimating(true);
    onEnter?.();
    onEntering?.();
    
    const timer = setTimeout(() => {
      onEntered?.();
      setIsAnimating(false);
    }, animationDuration);
    
    return () => clearTimeout(timer);
  }, [onEnter, onEntering, onEntered, animationDuration]);

  const handleExit = useCallback(() => {
    setIsAnimating(true);
    onExit?.();
    onExiting?.();
    
    const timer = setTimeout(() => {
      onExited?.();
      setIsAnimating(false);
    }, animationDuration);
    
    return () => clearTimeout(timer);
  }, [onExit, onExiting, onExited, animationDuration]);

  // Handle modal state changes
  useEffect(() => {
    if (modalIsOpen) {
      // Store previously focused element for restoration
      if (restoreFocus) {
        previousActiveElement.current = document.activeElement as HTMLElement;
      }
      
      // Prevent body scroll
      if (preventScroll) {
        preventBodyScroll(true);
      }

      // Setup focus trap
      if (enforceFocus && modalRef.current) {
        focusTrap.current = trapFocus(modalRef.current);
      }

      // Auto focus modal
      if (autoFocus && modalRef.current) {
        const initialFocusElement = getInitialFocus(modalRef.current);
        if (initialFocusElement) {
          initialFocusElement.focus();
        } else {
          modalRef.current.focus();
        }
      }

      // Show callback
      onShow?.();
      onOpen?.();
      handleEnter();
    } else {
      // Handle exit
      handleExit();
      
      // Cleanup focus trap
      if (focusTrap.current) {
        focusTrap.current();
        focusTrap.current = null;
      }
      
      // Restore scroll
      if (preventScroll) {
        preventBodyScroll(false);
      }

      // Restore focus
      if (restoreFocus && previousActiveElement.current) {
        previousActiveElement.current.focus();
        previousActiveElement.current = null;
      }

      // Hide callback
      onHide?.();
    }

    return () => {
      if (preventScroll) {
        preventBodyScroll(false);
      }
      if (focusTrap.current) {
        focusTrap.current();
      }
    };
  }, [modalIsOpen, autoFocus, preventScroll, restoreFocus, enforceFocus, onShow, onOpen, onHide, handleEnter, handleExit]);

  // Handle keyboard events
  useEffect(() => {
    if (!keyboard || !modalIsOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && closeOnEsc && dismissible) {
        event.preventDefault();
        onClose?.();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [modalIsOpen, keyboard, closeOnEsc, dismissible, onClose]);

  // Event handlers
  const { handleBackdropClick } = createModalHandler(
    modalIsOpen,
    onClose,
    closeOnEsc,
    closeOnBackdropClick && backdrop !== 'static' && dismissible
  );

  const handleCloseClick = () => {
    if (dismissible) {
      onClose?.();
    }
  };

  const handlePrimaryAction = () => {
    primaryAction?.onClick();
    if (!primaryAction?.onClick.toString().includes('onClose')) {
      onClose?.();
    }
  };

  const handleSecondaryAction = () => {
    secondaryAction?.onClick();
    if (!secondaryAction?.onClick.toString().includes('onClose')) {
      onClose?.();
    }
  };

  const handleCancelAction = () => {
    if (cancelAction?.onClick) {
      cancelAction.onClick();
    } else {
      onClose?.();
    }
  };

  // Get size classes
  const sizeClasses = SIZE_CLASSES.modal[size];
  const isFullScreen = fullScreen || size === 'full';

  // Get variant classes
  const variantClasses = getModalVariantClasses(variant);

  // Animation classes
  const overlayAnimationClasses = getModalAnimationClasses(animation, modalIsOpen, 'overlay');
  const modalAnimationClasses = getModalAnimationClasses(animation, modalIsOpen, 'modal');

  // Placement classes
  const placementClasses = {
    center: 'items-center justify-center',
    top: 'items-start justify-center pt-20',
    bottom: 'items-end justify-center pb-20',
    left: 'items-center justify-start pl-20',
    right: 'items-center justify-end pr-20',
  }[placement];

  // Overlay classes
  const overlayClasses = cn(
    'fixed inset-0',
    `z-[${zIndex}]`,
    'flex',
    placementClasses,
    backdrop && 'bg-black bg-opacity-50',
    'p-4',
    overlayAnimationClasses,
    modalIsOpen ? 'opacity-100' : 'opacity-0 pointer-events-none',
    backdropClassName,
    overlayClassName
  );

  // Modal container classes
  const modalClasses = cn(
    'relative',
    'outline-none',
    'max-w-full',
    'max-h-full',
    
    // Variant styles
    variantClasses,
    
    // Size handling
    isFullScreen 
      ? 'w-full h-full rounded-none'
      : cn('w-full rounded-small', sizeClasses.container),
    
    // Scrolling
    scrollable && !isFullScreen && 'max-h-[90vh]',
    verticallyScrollable && scrollable && 'overflow-y-auto',
    isFullScreen && scrollable && 'overflow-auto',
    
    // Animation
    modalAnimationClasses,
    
    className
  );

  // Header classes
  const headerClasses = cn(
    'flex items-start justify-between',
    'border-b border-gray-medium',
    isFullScreen ? 'p-6' : 'p-4',
    'min-h-[60px]'
  );

  // Title classes
  const titleClasses = cn(
    'font-semibold text-black leading-tight flex-1',
    sizeClasses.title
  );

  // Subtitle classes
  const subtitleClasses = cn(
    'text-text-secondary mt-1',
    'text-sm'
  );

  // Content classes
  const contentClasses = cn(
    'flex-1',
    isFullScreen ? 'p-6' : 'p-4',
    sizeClasses.content,
    !scrollable && 'overflow-hidden'
  );

  // Footer classes
  const footerClasses = cn(
    'border-t border-gray-medium',
    'flex items-center justify-end gap-3',
    isFullScreen ? 'p-6' : 'p-4'
  );

  // Close button classes
  const closeButtonClasses = cn(
    'p-1 ml-4',
    'rounded-default',
    'text-gray-slate',
    'hover:text-black',
    'hover:bg-gray-light',
    'transition-colors',
    'duration-200',
    'flex-shrink-0'
  );

  if (!isMounted) return null;

  // Don't render if not open and not animating
  if (!modalIsOpen && !isAnimating) return null;

  const modalContent = (
    <div 
      ref={backdropRef}
      className={overlayClasses}
      onClick={handleBackdropClick}
      style={{ 
        zIndex,
        animationDuration: `${animationDuration}ms`
      }}
      data-testid={dataTestId ? `${dataTestId}-backdrop` : undefined}
    >
      <div
        ref={modalRef}
        className={modalClasses}
        role={role}
        aria-modal="true"
        aria-labelledby={ariaLabelledBy || (title && id ? `${id}-title` : undefined)}
        aria-describedby={ariaDescribedBy || (id ? `${id}-content` : undefined)}
        aria-label={ariaLabel}
        tabIndex={tabIndex}
        id={id}
        data-testid={dataTestId}
      >
        {/* Header */}
        {(title || subtitle || header || actualShowCloseButton) && (
          <div className={headerClasses}>
            {header || (
              <div className="flex-1 min-w-0">
                {title && (
                  <h2 
                    className={titleClasses}
                    id={id ? `${id}-title` : undefined}
                  >
                    {title}
                  </h2>
                )}
                {subtitle && (
                  <p className={subtitleClasses}>
                    {subtitle}
                  </p>
                )}
              </div>
            )}
            
            {actualShowCloseButton && (
              <button
                type="button"
                className={closeButtonClasses}
                onClick={handleCloseClick}
                aria-label="Close modal"
                data-testid={dataTestId ? `${dataTestId}-close` : undefined}
              >
                <CloseIcon className="w-5 h-5" />
              </button>
            )}
          </div>
        )}

        {/* Content */}
        <div 
          className={contentClasses}
          id={id ? `${id}-content` : undefined}
        >
          {content || children}
        </div>

        {/* Footer */}
        {(footer || primaryAction || secondaryAction || cancelAction) && (
          <div className={footerClasses}>
            {footer || (
              <>
                {cancelAction && (
                  <Button
                    label={cancelAction.label || 'Cancel'}
                    variant="secondary"
                    style="outline"
                    size={size === 'sm' ? 'small' : size === 'lg' || size === 'xl' ? 'large' : 'medium'}
                    onClick={handleCancelAction}
                  />
                )}
                
                {secondaryAction && (
                  <Button
                    label={secondaryAction.label}
                    variant={secondaryAction.variant || 'secondary'}
                    style="fill"
                    size={size === 'sm' ? 'small' : size === 'lg' || size === 'xl' ? 'large' : 'medium'}
                    onClick={handleSecondaryAction}
                    isDisabled={secondaryAction.disabled}
                  />
                )}

                {primaryAction && (
                  <Button
                    label={primaryAction.label}
                    variant={primaryAction.variant || 'primary'}
                    style="fill"
                    size={size === 'sm' ? 'small' : size === 'lg' || size === 'xl' ? 'large' : 'medium'}
                    onClick={handlePrimaryAction}
                    isDisabled={primaryAction.disabled}
                  />
                )}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );

  // Render in portal if container is provided, otherwise render normally
  const targetContainer = container || (typeof document !== 'undefined' ? document.body : null);
  
  if (!targetContainer) return null;

  return createPortal(modalContent, targetContainer);
};

export default Modal;