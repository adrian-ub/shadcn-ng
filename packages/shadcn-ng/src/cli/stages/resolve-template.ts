import prompts from 'prompts'

import { highlighter } from '../../utils/highlighter'
import { cancelProcess } from '../utils/cancel-process'

/**
 * Templates supported by `init`. The Phase 4 template engine consumes the
 * selected template to scaffold the project (standalone / SSR / Nx
 * monorepo variants).
 */
export const AVAILABLE_TEMPLATES = [
  'standalone',
  'ssr',
  'nx-monorepo',
] as const

/** Locked default used when `--defaults` is passed or prompts are skipped. */
export const DEFAULT_TEMPLATE = 'standalone'

/**
 * Resolves the project template for `init`.
 *
 * - An explicit valid template is honored without prompting.
 * - An unknown template rejects with an error listing the available ones.
 * - `--defaults` silently uses the locked default.
 * - Otherwise an interactive select prompt is shown.
 */
export async function resolveTemplate(
  template: string | undefined,
  options: { defaults: boolean },
): Promise<string> {
  if (template) {
    if (!(AVAILABLE_TEMPLATES as readonly string[]).includes(template)) {
      throw new Error(
        `Unknown template "${template}". Available templates: ${AVAILABLE_TEMPLATES.join(', ')}.`,
      )
    }

    return template
  }

  if (options.defaults) {
    return DEFAULT_TEMPLATE
  }

  const { value } = await prompts({
    type: 'select',
    name: 'value',
    message: `Which ${highlighter.info('template')} would you like to use?`,
    choices: AVAILABLE_TEMPLATES.map(template => ({
      title: template,
      value: template,
    })),
    initial: DEFAULT_TEMPLATE,
  }, { onCancel: () => cancelProcess() })

  return value
}
