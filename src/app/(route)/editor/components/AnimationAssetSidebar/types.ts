// Asset control panel related types

export interface AssetSettings {
  speed: number
  intensity: number
  duration: number
  // Asset-specific properties (will be extended based on plugin analysis)
  [key: string]: unknown
}

export interface AssetControlPanelProps {
  assetId: string
  assetName: string
  onClose: () => void
  onSettingsChange?: (settings: AssetSettings) => void
}
