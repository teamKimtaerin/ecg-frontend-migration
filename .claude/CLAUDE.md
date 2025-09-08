# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 🎬 Project Overview

ECG (Easy Caption Generator) Frontend - A powerful subtitle editing tool built with Next.js.

### Tech Stack

- **Framework**: Next.js 15.5.2 with App Router
- **Language**: TypeScript 5
- **UI Library**: React 19.1.1
- **Styling**: TailwindCSS v4 with PostCSS
- **State Management**: Zustand 5.0.8
- **Drag & Drop**: @dnd-kit/core & @dnd-kit/sortable
- **Icons**: react-icons (Lucide icons - lu)
- **Utilities**: clsx, tailwind-merge

## 🚀 Development Commands

### Essential Commands

```bash
npm run dev         # Start development server (http://localhost:3000)
npm run build       # Build for production
npm run start       # Start production server
npm run lint        # Run ESLint checks
npm run lint:fix    # Fix linting issues automatically
npm run format      # Format code with Prettier
npm run format:check # Check code formatting
npm run type-check  # TypeScript type checking
```

### Testing Commands

```bash
npm run test        # Run Jest unit tests
npm run test:watch  # Run tests in watch mode
npm run test:coverage # Generate test coverage report
npm run test:e2e    # Run Playwright E2E tests
npm run test:e2e:ui # Run Playwright with UI mode
```

## 🏗️ Architecture

### Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── editor/            # Main editor page
│   │   ├── components/    # Editor-specific components
│   │   │   └── ClipComponent/ # Modular clip component
│   │   ├── hooks/         # Custom hooks (DnD, selection)
│   │   ├── store/         # Zustand store with slices
│   │   └── types/         # TypeScript types
│   └── components/        # Page-level components
├── components/
│   ├── ui/               # Reusable UI components
│   ├── icons/           # Icon components (react-icons wrapper)
│   └── DnD/             # Drag & drop components
├── lib/
│   └── utils/           # Utility functions
│       └── colors.ts    # Color system utilities
└── hooks/               # Global custom hooks
```

### State Management (Zustand)

The editor uses a modular Zustand store with slices:

```typescript
store/
├── editorStore.ts       # Main store combining all slices
└── slices/
    ├── clipSlice.ts     # Clip data and operations
    ├── selectionSlice.ts # Multi-selection state
    └── uiSlice.ts       # UI state (tabs, modals)
```

### Component Architecture

#### Editor Page Hierarchy

```
EditorPage
├── EditorHeaderTabs
├── Toolbar
├── VideoSection
├── SubtitleEditList
│   └── ClipComponent (with DnD)
│       ├── ClipTimeline
│       ├── ClipCheckbox
│       ├── ClipSpeaker
│       ├── ClipWords
│       └── ClipText
└── SelectionBox
```

## 💡 Development Guidelines

### Component Development

**IMPORTANT: Always prefer using existing UI components from `components/ui/`**

Before creating new components, check if these existing UI components can be used:

- `Button` - Standard button with variants
- `Dropdown` - Select/dropdown component
- `Tab/TabItem` - Tab navigation
- `AlertDialog` - Modal dialogs
- `AlertBanner` - Notification banners
- `Badge` - Status badges
- `Checkbox` - Checkbox input
- `HelpText` - Help/error messages
- `ProgressBar` - Progress indicators
- `RadioGroup` - Radio button groups
- `StatusLight` - Status indicators
- `TextField` - Text input fields
- `Toolbar` - Toolbar component

### Color System

Use the centralized color system from `lib/utils/colors.ts`:

- Access semantic colors: `SEMANTIC_COLORS`
- Use color palette: `colorPalette`
- Apply transitions: `TRANSITIONS`

Example:

```typescript
import { SEMANTIC_COLORS, colorPalette } from '@/lib/utils/colors'
```

### Icon Usage

Icons are centralized in `components/icons/`:

```typescript
import { ChevronDownIcon, InfoIcon /* etc */ } from '@/components/icons'
```

All icons use react-icons/lu (Lucide) internally but are wrapped for consistency.

### Drag & Drop Implementation

The editor uses @dnd-kit for drag-and-drop:

1. Clips are wrapped with `SortableContext`
2. Multi-selection is supported via Zustand store
3. Group dragging moves all selected items together

### Key Features

1. **Multi-Selection System**
   - Checkbox selection for multiple clips
   - Drag any selected clip to move all selected clips
   - Selection state managed in Zustand store

2. **Clip Editing**
   - Inline word editing
   - Speaker management with dropdown
   - Timeline display

3. **Undo/Redo**
   - Command pattern implementation
   - EditorHistory utility for state management

## 🔧 Configuration

### TypeScript

- Strict mode enabled
- Path alias: `@/*` maps to `./src/*`
- Use absolute imports

### ESLint

- Flat config format (ESLint 9)
- Next.js core web vitals rules
- Auto-fixable with `npm run lint:fix`

### TailwindCSS v4

- PostCSS-based configuration
- No traditional tailwind.config.js
- Theme variables in globals.css

## 📝 Git Workflow & PR Automation

### Quick PR Creation

```bash
# 1. Stage changes
git add .

# 2. Create PR with auto commit + push
prm "Feat: Your feature description"

# 3. Follow prompts for Claude Code analysis
```

### Branch Naming

- `feature/` - New features
- `fix/` - Bug fixes
- `refactor/` - Code refactoring

### Commit Convention

- `[Feat]` - New feature
- `[Fix]` - Bug fix
- `[Refactor]` - Code refactoring
- `[Docs]` - Documentation
- `[Test]` - Tests

## 🐳 Docker Support

```bash
# Development build
docker build --target dev -t ecg-frontend:dev .
docker run -p 3000:3000 --rm ecg-frontend:dev

# Production build
docker build --target prod -t ecg-frontend:prod .
```

## ⚠️ Important Notes

1. **Always use existing UI components** from `components/ui/` before creating new ones
2. React 19 compatibility: Use `--legacy-peer-deps` when installing packages
3. Development server may use port 3001 if 3000 is occupied
4. Husky pre-commit hooks run automatically
5. The editor page (`/editor`) is the main feature - handle with care
