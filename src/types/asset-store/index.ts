// Schema 속성 타입 정의
export interface SchemaProperty {
  type: 'string' | 'number' | 'boolean'
  default: string | number | boolean
  min?: number
  max?: number
  step?: number
  enum?: string[]
  ui?: {
    control: 'slider' | 'checkbox' | 'radio' | 'dropdown'
  }
}

// Asset schema 타입
export interface AssetSchema {
  [key: string]: SchemaProperty
}

// Asset metadata 타입
export interface AssetMetadata {
  name: string
  version: string
  entry: string
  description?: string
  schema: AssetSchema
  i18n?: {
    [locale: string]: {
      description?: string
      [key: string]: string | undefined
    }
  }
}

// Asset 타입 정의
export interface AssetItem {
  id: string
  title: string
  category: string
  rating: number
  downloads: number
  likes?: number
  thumbnail: string
  isPro?: boolean
  configFile?: string
  isFavorite?: boolean
}
