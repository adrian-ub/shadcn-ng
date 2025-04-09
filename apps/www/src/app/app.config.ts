import type { ApplicationConfig } from '@angular/core'
import { provideFileRouter, requestContextInterceptor } from '@analogjs/router'
import {
  provideHttpClient,
  withFetch,
  withInterceptors,
} from '@angular/common/http'
import { provideZoneChangeDetection } from '@angular/core'
import { provideClientHydration } from '@angular/platform-browser'
import { TitleStrategy } from '@angular/router'
import { CustomTitleStrategy } from './lib/custom-title.strategy'

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideFileRouter(),
    provideHttpClient(
      withFetch(),
      withInterceptors([requestContextInterceptor]),
    ),
    provideClientHydration(),
    { provide: TitleStrategy, useClass: CustomTitleStrategy },
  ],
}
