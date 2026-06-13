import type { ApplicationConfig } from '@angular/core'
import { provideBrowserGlobalErrorListeners } from '@angular/core'
import { provideClientHydration } from '@angular/platform-browser'

import { provideRouter } from '@angular/router'
import { routes } from './app.routes'

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideClientHydration(),
  ],
}
