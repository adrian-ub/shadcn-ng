import type { UnistNode, UnistTree } from '../../types/unist'

import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import { u } from 'unist-builder'

import { visit } from 'unist-util-visit'
import { Index } from '../__registry__'
import { styles } from '../registry/registry-styles'

function toCamelCase(str: string): string {
  return str
    .split(/[-_]/)
    .map((word, index) => {
      if (index === 0) {
        return word
      }
      return (
        word.charAt(0).toUpperCase()
        + word.slice(1)
      )
    })
    .join('')
}

export function rehypeComponent() {
  return async (tree: UnistTree) => {
    visit(tree, (node: UnistNode) => {
      // src prop overrides both name and fileName.
      const { value: srcPath }
        = (getNodeAttributeByName(node, 'src') as {
          name: string
          value?: string
          type?: string
        }) || {}

      if (node.name === 'ComponentSource') {
        const name = getNodeAttributeByName(node, 'name')?.value as string
        const fileName = getNodeAttributeByName(node, 'fileName')?.value as
          | string
          | undefined

        if (!name && !srcPath) {
          return null
        }

        try {
          for (const style of styles) {
            let src: string

            if (srcPath) {
              src = srcPath
            }
            else {
              const component = Index[style.name][name]
              src = fileName
                ? component.files.find((file: string) => file.endsWith(`${fileName}.ts`)) || component.files[0]
                : component.files[0]
            }

            // Read the source file.
            const filePath = path.join(process.cwd(), 'src', src)
            let source = fs.readFileSync(filePath, 'utf8')

            // Replace imports.
            // TODO: Use @swc/core and a visitor to replace this.
            // For now a simple regex should do.
            source = source.replaceAll(
              `~/registry/${style.name}/`,
              '~/components/',
            )
            source = source.replaceAll('export default', 'export')
            source = source.replace(/selector: '\[([^\]]+)\]'/, 'selector: \'$1\'')

            // Add code as children so that rehype can take over at build time.
            node.children?.push(
              u('element', {
                tagName: 'pre',
                properties: {
                  __src__: src,
                  __style__: style.name,
                  slot: style.name,
                },
                attributes: [
                  {
                    name: 'styleName',
                    type: 'mdxJsxAttribute',
                    value: style.name,
                  },
                ],
                children: [
                  u('element', {
                    tagName: 'code',
                    properties: {
                      className: ['language-angular-ts'],
                    },
                    children: [
                      {
                        type: 'text',
                        value: source,
                      },
                    ],
                  }),
                ],
              }),
            )
          }
        }
        catch (error) {
          console.error(error)
        }
      }

      if (node.name === 'ComponentPreview') {
        const name = getNodeAttributeByName(node, 'name')?.value as string

        if (!name) {
          return null
        }

        try {
          for (const style of styles) {
            const component = Index[style.name][name]
            const src = component.files[0]

            // Read the source file.
            const filePath = path.join(process.cwd(), 'src', src)
            let source = fs.readFileSync(filePath, 'utf8')

            // Replace imports.
            source = source.replaceAll(
              `~/registry/${style.name}/`,
              '~/components/',
            )
            source = source.replaceAll('export default', 'export')
            source = source.replace(/selector: '\[([^\]]+)\]'/, 'selector: \'$1\'')

            node.attributes?.push({
              type: 'mdxJsxAttribute',
              name: toCamelCase(`code-${style.name}`),
              value: source,
            })

            // Add code as children so that rehype can take over at build time.
            node.children?.push(
              u('element', {
                tagName: 'pre',
                properties: {
                  __src__: src,
                  slot: style.name,
                },
                children: [
                  u('element', {
                    tagName: 'code',
                    properties: {
                      className: ['language-angular-ts'],
                    },
                    children: [
                      {
                        type: 'text',
                        value: source,
                      },
                    ],
                  }),
                ],
              }),
            )
          }
        }
        catch (error) {
          console.error(error)
        }
      }
    })
  }
}

function getNodeAttributeByName(node: UnistNode, name: string): { name: string, value: unknown, type?: string } | undefined {
  return node.attributes?.find(attribute => attribute.name === name)
}
