import fs from 'node:fs'
import { join } from 'node:path'
import process from 'node:process'
import glob from 'fast-glob'
import matter from 'gray-matter'

export interface DocAttributes {
  title?: string
  description?: string
  slug?: string
  [key: string]: any
}

export interface DocFile {
  path: string
  frontmatter: DocAttributes
}

export function getDocFiles(): DocFile[] {
  const files = glob.sync('src/content/docs/**/*.md', { cwd: process.cwd(), absolute: true })
  const basePath = join(process.cwd(), 'src/content/docs/')

  return files.map((file) => {
    const content = matter(fs.readFileSync(file, 'utf-8'))
    let relativePath = file.replace(basePath, '').replace(/\.md$/, '')
    relativePath = relativePath.replace(/\/index$/, '')

    return {
      path: file,
      frontmatter: {
        ...content.data,
        slug: content.data.slug || relativePath,
      },
    }
  })
}

export function getOgRoutesFromDocs(): string[] {
  const docFiles = getDocFiles()
  const routes = docFiles.map(doc =>
    `/api/v1/og/docs-${doc.frontmatter.slug}.png?title=${encodeURIComponent(doc.frontmatter.title || '')}&description=${encodeURIComponent(doc.frontmatter.description || '')}`,
  )
  return routes
}

export function getRoutesFromDocs(): string[] {
  return getDocFiles().map(doc => `/docs/${doc.frontmatter.slug === 'index' ? '' : doc.frontmatter.slug}`)
}
