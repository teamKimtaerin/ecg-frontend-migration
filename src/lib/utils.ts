/**
 * Main utils export for backward compatibility
 *
 * This file re-exports all utilities from the utils/ directory
 * to maintain compatibility with existing imports.
 *
 * For new code, prefer importing directly from specific utility files:
 * - import { cn } from '@/lib/utils/cn'
 * - import { formatFileSize } from '@/lib/utils/formatting'
 * - import { isValidEmail } from '@/lib/utils/validation'
 */

export * from './utils/index'
