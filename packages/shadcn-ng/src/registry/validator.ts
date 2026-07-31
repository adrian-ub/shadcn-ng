import type { z } from 'zod'
import type { Registry, RegistryIndex, RegistryItem } from './schemas'
import { SchemaError } from './errors'
import {

  registryIndexSchema,

  registryItemSchema,
  registrySchema,
} from './schemas'

// ── validate ────────────────────────────────────────────────────────────────

/**
 * Parses `data` against a zod schema, returning the typed value.
 *
 * @throws {SchemaError} When validation fails. The message lists every zod
 *   issue with its path, so callers can pinpoint the invalid field.
 */
export function validate<T>(
  schema: z.ZodType<T>,
  data: unknown,
  message = 'Invalid data',
): T {
  const parsed = schema.safeParse(data)
  if (!parsed.success) {
    throw new SchemaError(`${message}:\n${formatZodIssues(parsed.error)}`)
  }
  return parsed.data
}

// ── Convenience validators ──────────────────────────────────────────────────

/**
 * Validates a single registry item.
 *
 * @param data - The raw item payload to validate.
 * @param name - Optional item name used to make the error message actionable.
 * @throws {SchemaError} When the payload does not match {@link registryItemSchema}.
 */
export function validateRegistryItem(data: unknown, name?: string): RegistryItem {
  const context = name
    ? `Invalid registry item "${name}"`
    : 'Invalid registry item'
  return validate(registryItemSchema, data, context)
}

/**
 * Validates a registry index (a flat array of registry items).
 *
 * @throws {SchemaError} When the payload does not match {@link registryIndexSchema}.
 */
export function validateRegistryIndex(data: unknown): RegistryIndex {
  return validate(registryIndexSchema, data, 'Invalid registry index')
}

/**
 * Validates a full registry manifest (`{ name, homepage, items }`).
 *
 * @throws {SchemaError} When the payload does not match {@link registrySchema}.
 */
export function validateRegistryManifest(data: unknown): Registry {
  return validate(registrySchema, data, 'Invalid registry manifest')
}

// ── Helpers ─────────────────────────────────────────────────────────────────

function formatZodIssues(error: z.ZodError): string {
  return error.errors
    .map((issue) => {
      const issuePath = issue.path.length ? issue.path.join('.') : '(root)'
      return `  - ${issuePath}: ${issue.message}`
    })
    .join('\n')
}
