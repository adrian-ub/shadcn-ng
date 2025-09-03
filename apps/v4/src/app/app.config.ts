import type {
  ApplicationConfig,
} from '@angular/core'
import { provideContent, withMarkdownRenderer } from '@analogjs/content'
import { withShikiHighlighter } from '@analogjs/content/shiki-highlighter'
import { provideFileRouter } from '@analogjs/router'
import {
  inject,
  Injector,
  PLATFORM_ID,
  provideAppInitializer,
  provideBrowserGlobalErrorListeners,
  provideZonelessChangeDetection,
} from '@angular/core'
import { provideClientHydration } from '@angular/platform-browser'
import { withInMemoryScrolling } from '@angular/router'
import { initializeCustomElements } from './md-components'

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideFileRouter(
      withInMemoryScrolling({ anchorScrolling: 'enabled', scrollPositionRestoration: 'top' }),
    ),
    provideClientHydration(),
    provideContent(withMarkdownRenderer(), withShikiHighlighter()),
    provideAppInitializer(() => {
      const initializerFn = initializeCustomElements(inject(Injector), inject(PLATFORM_ID))
      return initializerFn()
    }),
  ],
}
