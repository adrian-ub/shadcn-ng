import type { PackageJson } from 'type-fest'
import path from 'node:path'
import fs from 'fs-extra'

export function getPackageInfo(
  cwd: string = '',
  shouldThrow: boolean = true,
): PackageJson | null {
  const packageJsonPath = path.join(cwd, 'package.json')

  return fs.readJSONSync(packageJsonPath, {
    throws: shouldThrow,
  }) as PackageJson
}
