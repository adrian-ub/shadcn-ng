import type { ConfigLoaderSuccessResult } from 'tsconfig-paths'
import { createMatchPath } from 'tsconfig-paths'

export async function resolveImport(
  importPath: string,
  config: Pick<ConfigLoaderSuccessResult, 'absoluteBaseUrl' | 'paths'>,
): Promise<string | undefined> {
  return createMatchPath(config.absoluteBaseUrl, config.paths)(
    importPath,
    undefined,
    () => true,
    ['.ts', '.css'],
  )
}
