import { Location } from '@angular/common'
import { inject } from '@angular/core'
import { injectData } from './inject-data'

export interface Doc {
  title: string
  description?: string
}

export function injectDoc() {
  const location = inject(Location)
  const currentPath = location.path()
  const slug = currentPath.replace(/^\//, '').split('/').slice(1).join('/')
  return injectData<Doc>('docs', slug)
}
