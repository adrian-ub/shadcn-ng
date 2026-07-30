// ── Error Classes ──────────────────────────────────────────────────────────

/**
 * Error thrown when registry data fails schema validation.
 */
export class SchemaError extends Error {
  override readonly name = 'SchemaError'

  constructor(message: string, options?: ErrorOptions) {
    super(message, options)
  }
}

/**
 * Error thrown when a registry HTTP fetch fails.
 */
export class FetchError extends Error {
  override readonly name = 'FetchError'
  readonly statusCode: number

  constructor(message: string, statusCode: number = 0) {
    super(message)
    this.statusCode = statusCode
  }
}

/**
 * Error thrown when a registry dependency cannot be resolved.
 */
export class DepNotFoundError extends Error {
  override readonly name = 'DepNotFoundError'
  readonly dependencyName: string

  constructor(dependencyName: string) {
    super(`Registry dependency not found: ${dependencyName}`)
    this.dependencyName = dependencyName
  }
}

/**
 * Error thrown when a circular dependency is detected in the registry tree.
 */
export class CycleError extends Error {
  override readonly name = 'CycleError'
  readonly cycle: string[]

  constructor(cycle: string[]) {
    super(`Circular dependency detected: ${cycle.join(' → ')}`)
    this.cycle = cycle
  }
}
