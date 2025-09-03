import type { Injector } from '@angular/core'
import { isPlatformBrowser } from '@angular/common'

export function initializeCustomElements(
  injector: Injector,
  platform: object,
): () => Promise<void> {
  return async () => {
    if (isPlatformBrowser(platform)) {
      // const { createCustomElement } = await import('@angular/elements')
    }
  }
}
