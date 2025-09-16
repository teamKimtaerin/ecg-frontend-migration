# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 🎬 Project Overview

ECG (Easy Caption Generator) Frontend - A powerful subtitle editing tool built with Next.js featuring advanced animation capabilities, audio-driven effects, and real-time collaborative editing.

### Tech Stack

- **Framework**: Next.js 15.5.2 with App Router
- **Language**: TypeScript 5
- **UI Library**: React 19.1.1
- **Styling**: TailwindCSS v4 with PostCSS
- **State Management**: Zustand 5.0.8
- **Drag & Drop**: @dnd-kit/core & @dnd-kit/sortable
- **Animation**: GSAP 3.13.0, motiontext-renderer 1.1.0
- **Icons**: Lucide React via react-icons
- **Utilities**: clsx, tailwind-merge, chroma-js

## 🚀 Development Commands

### Essential Commands

Use yarn as the package manager:

```bash
yarn dev         # Start development server (http://localhost:3000)
yarn build       # Build for production
yarn build:static # Build for static S3 hosting
yarn start       # Start production server
yarn lint        # Run ESLint checks
yarn lint:fix    # Fix linting issues automatically
yarn format      # Format code with Prettier
yarn format:check # Check code formatting
yarn type-check  # TypeScript type checking
yarn gen:scenario # Generate scenario from real.json
```

### Testing Commands

```bash
yarn test        # Run Jest unit tests
yarn test:watch  # Run tests in watch mode
yarn test:coverage # Generate test coverage report
yarn test:e2e    # Run Playwright E2E tests
yarn test:e2e:ui # Run Playwright with UI mode
```

## 🏗️ Architecture

### Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── (route)/           # Route group for main pages
│   │   ├── editor/        # Main editor page
│   │   │   ├── components/    # Editor-specific components
│   │   │   │   ├── ClipComponent/
│   │   │   │   ├── VideoPlayer/
│   │   │   │   ├── AnimationAssetSidebar/
│   │   │   │   └── SubtitleEditList.tsx
│   │   │   ├── hooks/     # Custom hooks (DnD, selection)
│   │   │   ├── store/     # Zustand store with slices
│   │   │   └── types/     # TypeScript types
│   │   ├── asset-store/   # Animation plugin marketplace
│   │   ├── motiontext-demo/ # Plugin preview demos
│   │   └── signup/        # Authentication flow
│   ├── (main)/           # Main landing pages
│   ├── auth/             # Auth callbacks
│   └── shared/           # Shared motiontext utilities
│       └── motiontext/   # Renderer integration
├── components/
│   ├── ui/              # Reusable UI components (30+ components)
│   ├── icons/           # Centralized Lucide icon wrappers
│   └── DnD/             # Drag & drop components
├── lib/
│   ├── store/           # Global stores (authStore)
│   └── utils/           # Utility functions
│       └── colors.ts    # Color system utilities
├── services/            # API services
├── utils/               # General utilities
└── hooks/               # Global custom hooks

public/
├── plugin/              # Animation plugins
│   └── legacy/          # Legacy plugin collection
│       ├── elastic@1.0.0/
│       ├── rotation@1.0.0/
│       └── [other plugins]
└── real.json           # Audio analysis data
```

### State Management (Zustand)

Modular store architecture with slices:

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

### Animation Plugin System

#### Plugin Structure

Plugins are located in `public/plugin/legacy/[name@version]/`:

- `manifest.json` - Plugin metadata and parameter schema
- `index.mjs` - ES module implementation
- `assets/` - Thumbnails and resources

#### MotionText Renderer Integration

The project uses `motiontext-renderer` for advanced subtitle animations:

- **Scenario Generation**: Dynamic scene creation from plugins and parameters
- **Plugin Loading**: On-demand loading with preload optimization
- **Preview System**: Live preview with drag/resize/rotate controls
- **Parameter Controls**: Dynamic UI generation from plugin schemas

Key integration points:

- `src/app/shared/motiontext/` - Core renderer utilities
- `src/app/(route)/asset-store/` - Plugin marketplace and preview
- `src/app/(route)/motiontext-demo/` - Demo and testing environment

### Audio Analysis Integration

Audio metadata in `public/real.json` drives dynamic animations:

```typescript
{
  segments: [
    {
      words: [
        {
          word: string,
          volume_db: number, // For intensity scaling
          pitch_hz: number, // For effect selection
          confidence: number, // For reliability
        },
      ],
    },
  ]
}
```

### Component Architecture

#### Editor Page Hierarchy

```
EditorPage
├── EditorHeaderTabs
├── Toolbar
├── VideoSection
│   ├── VideoPlayer
│   └── SubtitleOverlay
├── SubtitleEditList
│   └── ClipComponent (with DnD)
│       ├── ClipTimeline
│       ├── ClipCheckbox
│       ├── ClipSpeaker
│       ├── ClipWords
│       └── ClipText
├── AnimationAssetSidebar
│   ├── AssetGrid
│   ├── AssetControlPanel
│   └── UsedAssetsStrip
└── SelectionBox
```

## 💡 Development Guidelines

### Component Development

**IMPORTANT: Always use existing UI components from `components/ui/`**

Available components include:

- `Button`, `Dropdown`, `EditableDropdown`
- `Tab/TabItem`, `AlertDialog`, `Modal`
- `Input`, `Checkbox`, `RadioButton`, `Switch`
- `Badge`, `Tag`, `StatusLight`
- `Slider`, `ColorPicker`, `FontDropdown`
- `ProgressBar`, `ProgressCircle`
- `Tooltip`, `HelpText`
- And 15+ more...

### Color System

Use centralized colors from `lib/utils/colors.ts`:

```typescript
import { getColorVar } from '@/lib/utils/colors'
const primaryColor = getColorVar('primary', 'medium')
```

Variants: `primary`, `secondary`, `accent`, `neutral`, `positive`, `negative`, `notice`, `informative`
Intensities: `very-light`, `light`, `medium`, `dark`, `very-dark`

### Icon Usage

All icons are centralized in `components/icons/`:

```typescript
import { ChevronDownIcon, InfoIcon } from '@/components/icons'
```

### Plugin Development

When creating animation plugins:

1. Place in `public/plugin/[name@version]/`
2. Create `manifest.json` with schema
3. Implement as ES module (`.mjs`)
4. Use GSAP for animations
5. Ensure proper cleanup in `dispose()`

### Key Features

1. **Multi-Selection System**: Checkbox selection with group operations
2. **Word-Level Editing**: Inline editing with drag & drop
3. **Audio-Driven Effects**: Dynamic animations based on audio analysis
4. **Real-time Preview**: Live animation preview with controls
5. **Speaker Management**: Auto-detection and manual assignment
6. **Undo/Redo**: Command pattern implementation

## 🔧 Configuration

### TypeScript

- Strict mode enabled
- Path alias: `@/*` maps to `./src/*`
- Use absolute imports

### ESLint

- Flat config (ESLint 9)
- Next.js core web vitals
- Auto-fix with `yarn lint:fix`

### TailwindCSS v4

- PostCSS-based configuration
- Theme variables in globals.css
- Uses @tailwindcss/postcss plugin

### Next.js

- Static export for S3: `output: 'export'`
- Image optimization disabled for static hosting
- CloudFront domains configured

## 📝 Git Workflow

### PR Automation Scripts

Located in `.claude/scripts/`:

#### `prm` - Full PR Workflow

```bash
prm "Feat: Your feature description"
```

Creates commit, pushes, and generates PR with Claude Code analysis.

#### `pronly` - PR from Existing Commits

```bash
pronly  # Analyze all commits since dev
```

Creates PR from already committed changes.

### Branch Conventions

- Base branch: `dev` (not main)
- Branch prefixes: `feature/`, `fix/`, `refactor/`
- Commit prefixes: `[Feat]`, `[Fix]`, `[Refactor]`, `[Docs]`, `[Test]`

## 🐳 Docker Support

```bash
# Development
docker build --target dev -t ecg-frontend:dev .
docker run -p 3000:3000 --rm ecg-frontend:dev

# Production
docker build --target prod -t ecg-frontend:prod .
```

## ⚠️ Important Notes

1. **Always use existing UI components** from `components/ui/`
2. React 19 requires `--legacy-peer-deps` for some packages
3. Editor page (`/editor`) is the main feature - handle with care
4. Run `yarn type-check` and `yarn lint` after changes
5. Animation cleanup is critical for performance
6. MotionText renderer requires proper scenario structure
7. Audio analysis data drives dynamic effects
8. Static export configured for S3 deployment
9. PR scripts require GitHub CLI (`gh`) authentication
10. Plugin manifests define UI and parameter schemas
