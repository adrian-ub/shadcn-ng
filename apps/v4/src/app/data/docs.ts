import { inject, Injector, runInInjectionContext } from '@angular/core'
import { map, switchMap } from 'rxjs'
import { injectCurrentPath } from '@/utils/inject-current-path'
import { injectData } from './inject-data'

export interface Doc {
  title: string
  description?: string
  links?: {
    doc?: string
    api?: string
  }
}

export function injectDoc() {
  const injector = inject(Injector)

  return injectCurrentPath().pipe(
    map((path: string) => path.replace(/^\//, '').split('/').slice(1).join('/')),
    switchMap(slug =>
      runInInjectionContext(injector, () => injectData<Doc>('docs', slug)),
    ),
  )
}
