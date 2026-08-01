/**
 * Errors raised by the template engine.
 *
 * These are plain `Error` subclasses for now; the Phase 6 helpers package
 * introduces the shared `ShadcnError` hierarchy.
 */

/** A template variant name that is not part of the known variants. */
export class UnknownTemplateError extends Error {
  constructor(template: string, available: string[]) {
    super(
      `Unknown template "${template}". Available templates: ${available.join(', ')}.`,
    )
    this.name = 'UnknownTemplateError'
  }
}

/** A template directory that cannot be found or is not a directory. */
export class TemplateNotFoundError extends Error {
  constructor(templateDir: string) {
    super(`Template directory not found: ${templateDir}`)
    this.name = 'TemplateNotFoundError'
  }
}
