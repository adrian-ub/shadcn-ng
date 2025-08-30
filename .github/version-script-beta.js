import { execSync } from 'node:child_process'
// ORIGINALLY FROM CLOUDFLARE WRANGLER:
// https://github.com/cloudflare/wrangler2/blob/main/.github/version-script.js
/**
 * Update the package.json version property for the given package
 *
 * Usage:
 *
 * ```
 * node ./.github/version-script.js <package-name>
 * ```
 *
 * `<package-name>` defaults to `wrangler` if not provided.
 */
import { readFileSync, writeFileSync } from 'node:fs'
import process from 'node:process'

try {
  const packageName = 'shadcn-ng'
  const packageJsonPath = `./packages/${packageName}/package.json`
  const pkg = JSON.parse(readFileSync(packageJsonPath, 'utf-8'))
  const stdout = execSync('git rev-parse --short HEAD', { encoding: 'utf8' })
  pkg.version = `0.0.0-beta.${stdout.trim()}`
  writeFileSync(packageJsonPath, `${JSON.stringify(pkg, null, '\t')}\n`)
}
catch (error) {
  console.error(error)
  process.exit(1)
}
