import { Location } from '@angular/common'
import { inject } from '@angular/core'
import { NavigationEnd, Router } from '@angular/router'
import { filter, map, startWith } from 'rxjs'

export function injectCurrentPath() {
  const router = inject(Router)
  const location = inject(Location)

  return router.events.pipe(
    filter(event => event instanceof NavigationEnd),
    startWith(location.path()),
    map(() => location.path()),
  )
}
