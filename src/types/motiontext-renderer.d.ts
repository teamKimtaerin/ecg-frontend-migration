declare module 'motiontext-renderer' {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  export function configurePluginSource(config: any, callback?: () => void): void
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  export function registerExternalPlugin(name: string, plugin: any): void

  export class MotionTextRenderer {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    constructor(container: HTMLElement, config?: any)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    loadScenario(scenario: any): Promise<void>
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    loadConfig(config: any): Promise<void>
    attachMedia(mediaElement: HTMLVideoElement): void
    seek(time: number): void
    play(): void
    pause(): void
    dispose(): void
  }

  export class MotionTextController {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    constructor(renderer: MotionTextRenderer, videoElement: HTMLVideoElement, container?: HTMLElement | null, options?: any)
    mount(): void
    destroy(): void
    syncToVideo(): void
    dispose(): void
  }
}