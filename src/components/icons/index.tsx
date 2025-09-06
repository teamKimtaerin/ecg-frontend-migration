import React from 'react'
import {
  LuChevronDown,
  LuInfo,
  LuCircleX,
  LuStar,
  LuHeart,
  LuPlus,
  LuHouse,
  LuUser,
  LuSettings,
  LuX,
  LuCircleAlert,
  LuCircleCheck,
  LuTriangleAlert,
} from 'react-icons/lu'

export interface IconProps {
  className?: string
  size?: number
}

// Chevron Down Icon (Dropdown용)
export const ChevronDownIcon: React.FC<IconProps> = ({
  className,
  size = 20,
}) => <LuChevronDown className={className} size={size} />

// Info Icon (Help Text neutral용)
export const InfoIcon: React.FC<IconProps> = ({ className, size = 20 }) => (
  <LuInfo className={className} size={size} />
)

// Error Icon (Help Text negative용)
export const ErrorIcon: React.FC<IconProps> = ({ className, size = 20 }) => (
  <LuCircleX className={className} size={size} />
)

// 기본 아이콘들 (디자인 시스템 페이지용)
export const StarIcon: React.FC<IconProps> = ({ className, size = 24 }) => (
  <LuStar className={className} size={size} />
)

export const HeartIcon: React.FC<IconProps> = ({ className, size = 24 }) => (
  <LuHeart className={className} size={size} />
)

export const PlusIcon: React.FC<IconProps> = ({ className, size = 24 }) => (
  <LuPlus className={className} size={size} />
)

export const HomeIcon: React.FC<IconProps> = ({ className, size = 24 }) => (
  <LuHouse className={className} size={size} />
)

export const UserIcon: React.FC<IconProps> = ({ className, size = 24 }) => (
  <LuUser className={className} size={size} />
)

export const SettingsIcon: React.FC<IconProps> = ({ className, size = 24 }) => (
  <LuSettings className={className} size={size} />
)

// Close/X Icon (Alert Banner dismiss용)
export const CloseIcon: React.FC<IconProps> = ({ className, size = 20 }) => (
  <LuX className={className} size={size} />
)

// Alert Icon (Alert Banner informative/negative용)
export const AlertIcon: React.FC<IconProps> = ({ className, size = 20 }) => (
  <LuCircleAlert className={className} size={size} />
)

// Check Circle Icon (AlertDialog confirmation용)
export const CheckCircleIcon: React.FC<IconProps> = ({
  className,
  size = 20,
}) => <LuCircleCheck className={className} size={size} />

// Exclamation Triangle Icon (AlertDialog warning용)
export const ExclamationTriangleIcon: React.FC<IconProps> = ({
  className,
  size = 20,
}) => <LuTriangleAlert className={className} size={size} />

// X Circle Icon (AlertDialog error용)
export const XCircleIcon: React.FC<IconProps> = ({ className, size = 20 }) => (
  <LuCircleX className={className} size={size} />
)
