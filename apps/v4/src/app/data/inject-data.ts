import { injectContent, injectContentFiles } from '@analogjs/content'
import { map, of } from 'rxjs'

export function injectData<Attributes extends Record<string, any>>(folder: string, slug: string) {
  const contentFiles = injectContentFiles<Attributes>(contentFile => contentFile.filename.includes(`/src/content/${folder}`))

  const contentFile = contentFiles.find((contentFile) => {
    return contentFile.filename.includes(`${folder}/${slug}`)
  })

  if (!contentFile) {
    return of(null)
  }

  const parts = contentFile.filename.split('/').slice(3)
  const customFilename = parts.join('/').split('.md').join('')

  return injectContent<Attributes>({
    customFilename,
  }).pipe(
    map((doc) => {
      return {
        ...doc,
        slug: doc.slug.replace('/index', ''),
      }
    }),
  )
}
