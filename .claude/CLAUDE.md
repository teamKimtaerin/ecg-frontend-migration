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
│   ├── (route)/editor/    # Main editor page (route group)
│   │   ├── components/    # Editor-specific components
│   │   │   ├── ClipComponent/ # Modular clip component
│   │   │   ├── VideoSection.tsx
│   │   │   ├── SubtitleEditList.tsx
│   │   │   └── EditorHeaderTabs.tsx
│   │   ├── hooks/         # Custom hooks (DnD, selection)
│   │   ├── store/         # Zustand store with slices
│   │   │   ├── editorStore.ts
│   │   │   └── slices/    # Individual state slices
│   │   ├── types/         # TypeScript types
│   │   └── page.tsx       # Editor page component
│   ├── (main)/           # Main route group
│   └── auth/             # Authentication pages
├── components/
│   ├── ui/               # Reusable UI components (29+ components)
│   ├── icons/           # Icon components (Lucide wrapper)
│   └── DnD/             # Drag & drop components
├── lib/
│   ├── store/           # Global stores (authStore)
│   └── utils/           # Utility functions
│       └── colors.ts    # Color system utilities
├── services/            # API services
├── utils/               # General utilities
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
    ├── uiSlice.ts       # UI state (tabs, modals)
    ├── saveSlice.ts     # Save/autosave state
    ├── mediaSlice.ts    # Media/video state
    └── wordSlice.ts     # Word-level editing state
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
- `EditableDropdown` - Editable select component
- `Tab/TabItem` - Tab navigation
- `AlertDialog` - Modal dialogs
- `AlertBanner` - Notification banners
- `Badge` - Status badges
- `Checkbox` - Checkbox input
- `RadioButton` - Radio input
- `HelpText` - Help/error messages
- `ProgressBar/ProgressCircle` - Progress indicators
- `StatusLight` - Status indicators
- `Input` - Text input fields
- `ColorPicker` - Color selection
- `FontDropdown` - Font selection
- `Modal` - General modal component
- `Slider` - Range input
- `Switch/ToggleButton` - Toggle controls
- `Tag` - Label/tag component
- `Tooltip` - Hover information
- `ResizablePanelDivider` - Panel resizing

### Color System

Use the centralized color system from `lib/utils/colors.ts`:

- Color variants: `primary`, `secondary`, `accent`, `neutral`, `positive`, `negative`, `notice`, `informative`
- Color intensities: `light`, `medium`, `dark`, `very-light`, `very-dark`
- Utility function: `getColorVar(variant, intensity?)`

Example:

```typescript
import { getColorVar, type ColorVariant } from '@/lib/utils/colors'
const primaryColor = getColorVar('primary', 'medium')
```

### Icon Usage

Icons are centralized in `components/icons/`:

```typescript
import { ChevronDownIcon, InfoIcon /* etc */ } from '@/components/icons'
```

All icons use Lucide React internally but are wrapped for consistency. Available icons include `ChevronDownIcon`, `InfoIcon`, `XIcon`, `PlusIcon`, `AlertCircleIcon`, etc.

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

### Automated PR Creation Scripts

The project includes two powerful PR automation scripts in `.claude/scripts/`:

#### `prm` - Full PR Creation Workflow

```bash
# Creates commit, pushes, and generates PR with Claude Code analysis
prm "Feat: Your feature description"
```

**Features:**

- Validates git status and branch
- Creates commit with Claude Code co-authorship
- Pushes to remote branch
- Generates Claude Code prompt for analysis
- Handles large diffs with temporary files (>1000 lines)
- Interactive PR title/body input
- Auto-opens PR in browser

#### `pronly` - PR from Existing Commits

```bash
# Creates PR from already committed changes
pronly                    # Analyze all commits since dev branch
pronly abc123             # Analyze commits since specific hash
```

**Features:**

- Analyzes existing commit history
- Works with already pushed branches
- Flexible diff analysis (branch comparison or specific commit)
- Same Claude Code integration as `prm`

### Script Workflow

1. **Analysis Phase**:
   - Git status validation
   - Change detection and statistics
   - Diff generation for Claude Code

2. **Claude Integration**:
   - Auto-generates structured prompts
   - Copies to clipboard (macOS)
   - Handles large diffs with temporary files
   - Provides step-by-step instructions

3. **PR Creation**:
   - Interactive title/body input
   - Fallback templates if no input
   - GitHub CLI integration
   - Browser opening option

### Branch Workflow

- **Base Branch**: `dev` (all PRs target dev, not main)
- **Branch Protection**: Cannot create PRs from main/dev branches
- **Branch Naming**:
  - `feature/` - New features
  - `fix/` - Bug fixes
  - `refactor/` - Code refactoring

### Commit Convention

- `[Feat]` - New feature
- `[Fix]` - Bug fix
- `[Refactor]` - Code refactoring
- `[Docs]` - Documentation
- `[Test]` - Tests

**Auto-generated commits include Claude Code co-authorship**

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
6. Scripts in `.claude/scripts/` are executable PR automation tools
7. Always run type-check and lint commands after code changes
