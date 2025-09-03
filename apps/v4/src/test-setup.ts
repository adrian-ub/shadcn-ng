import { getTestBed } from '@angular/core/testing'
import {
  BrowserTestingModule,
  platformBrowserTesting,
} from '@angular/platform-browser/testing'

import '@angular/compiler'
import '@analogjs/vitest-angular/setup-zone'

getTestBed().initTestEnvironment(
  BrowserTestingModule,
  platformBrowserTesting(),
)
