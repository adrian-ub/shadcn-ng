import type { ObjectLiteralExpression } from 'ts-morph'
import type { Config } from '../get-config'
import { promises as fs } from 'node:fs'
import path from 'node:path'
import * as p from '@clack/prompts'
import { SyntaxKind } from 'ts-morph'
import { highlighter } from '../highlighter'
import {
  _createSourceFile,
  _getQuoteChar,
} from '../updaters/update-tailwind-config'

export async function updateTailwindContent(
  content: string[],
  config: Config,
  _options: {
    silent?: boolean
  },
): Promise<void> {
  if (!content) {
    return
  }

  const tailwindFileRelativePath = path.relative(
    config.resolvedPaths.cwd,
    config.resolvedPaths.tailwindConfig,
  )
  const tailwindSpinner = p.spinner()
  tailwindSpinner.start(`Updating ${highlighter.info(tailwindFileRelativePath)}`)

  const raw = await fs.readFile(config.resolvedPaths.tailwindConfig, 'utf8')
  const output = await transformTailwindContent(raw, content, config)
  await fs.writeFile(config.resolvedPaths.tailwindConfig, output, 'utf8')
  tailwindSpinner?.stop(`Updated ${highlighter.info(tailwindFileRelativePath)}`)
}

export async function transformTailwindContent(
  input: string,
  content: string[],
  config: Config,
): Promise<string> {
  const sourceFile = await _createSourceFile(input, config)
  // Find the object with content property.
  // This is faster than traversing the default export.
  // TODO: maybe we do need to traverse the default export?
  const configObject = sourceFile
    .getDescendantsOfKind(SyntaxKind.ObjectLiteralExpression)
    .find(node =>
      node
        .getProperties()
        .some(
          property =>
            property.isKind(SyntaxKind.PropertyAssignment)
            && property.getName() === 'content',
        ),
    )

  // We couldn't find the config object, so we return the input as is.
  if (!configObject) {
    return input
  }

  addTailwindConfigContent(configObject, content)

  return sourceFile.getFullText()
}

async function addTailwindConfigContent(
  configObject: ObjectLiteralExpression,
  content: string[],
): Promise<ObjectLiteralExpression> {
  const quoteChar = _getQuoteChar(configObject)

  const existingProperty = configObject.getProperty('content')

  if (!existingProperty) {
    const newProperty = {
      name: 'content',
      initializer: `[${quoteChar}${content.join(
        `${quoteChar}, ${quoteChar}`,
      )}${quoteChar}]`,
    }
    configObject.addPropertyAssignment(newProperty)

    return configObject
  }

  if (existingProperty.isKind(SyntaxKind.PropertyAssignment)) {
    const initializer = existingProperty.getInitializer()

    // If property is an array, append.
    if (initializer?.isKind(SyntaxKind.ArrayLiteralExpression)) {
      for (const contentItem of content) {
        const newValue = `${quoteChar}${contentItem}${quoteChar}`

        // Check if the array already contains the value.
        if (
          initializer
            .getElements()
            .map(element => element.getText())
            .includes(newValue)
        ) {
          continue
        }

        initializer.addElement(newValue)
      }
    }

    return configObject
  }

  return configObject
}
