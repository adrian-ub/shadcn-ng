import { describe, expect, it } from 'vitest'
import { SchemaError } from '../../src/registry/errors'
import { registryItemSchema } from '../../src/registry/schemas'
import {
  validate,
  validateRegistryIndex,
  validateRegistryItem,
  validateRegistryManifest,
} from '../../src/registry/validator'

// ── P2.T5b: zod schema validation layer ────────────────────────────────────

const validItem = {
  name: 'button',
  type: 'registry:ui',
  files: [{ path: 'ui/button.ts', type: 'registry:ui' }],
}

const validManifest = {
  name: 'radix-ng',
  homepage: 'https://github.com/adrian-ub/shadcn-ng',
  items: [validItem],
}

describe('p2.T5b: validate (generic)', () => {
  it('returns parsed data for valid input', () => {
    const result = validate(registryItemSchema, validItem, 'Invalid registry item')
    expect(result).toEqual(validItem)
  })

  it('throws SchemaError for invalid input', () => {
    expect(() =>
      validate(registryItemSchema, { name: 'button' }, 'Invalid registry item'),
    ).toThrow(SchemaError)
  })

  it('includes the failing zod path in the error message', () => {
    try {
      validate(registryItemSchema, { name: 'button' }, 'Invalid registry item')
      expect.unreachable('Should have thrown')
    }
    catch (error) {
      expect(error).toBeInstanceOf(SchemaError)
      if (error instanceof SchemaError) {
        expect(error.name).toBe('SchemaError')
        expect(error.message).toContain('Invalid registry item')
        expect(error.message).toContain('type')
      }
    }
  })
})

describe('p2.T5b: validateRegistryItem', () => {
  it('passes a valid registry item', () => {
    expect(validateRegistryItem(validItem)).toEqual(validItem)
  })

  it('throws SchemaError when the item is missing the required type', () => {
    expect(() => validateRegistryItem({ name: 'button' })).toThrow(SchemaError)
  })

  it('includes the item name context in the error message', () => {
    try {
      validateRegistryItem({ name: 'button' }, 'button')
      expect.unreachable('Should have thrown')
    }
    catch (error) {
      if (error instanceof SchemaError) {
        expect(error.message).toContain('"button"')
      }
    }
  })
})

describe('p2.T5b: validateRegistryIndex', () => {
  it('passes a valid index (array of items)', () => {
    expect(validateRegistryIndex([validItem])).toEqual([validItem])
  })

  it('throws SchemaError when the index is not an array', () => {
    expect(() => validateRegistryIndex({ name: 'not-an-array' })).toThrow(
      SchemaError,
    )
  })
})

describe('p2.T5b: validateRegistryManifest', () => {
  it('passes a valid manifest with name, homepage, and items', () => {
    expect(validateRegistryManifest(validManifest)).toEqual(validManifest)
  })

  it('throws SchemaError when the manifest is missing homepage', () => {
    expect(() =>
      validateRegistryManifest({ name: 'radix-ng', items: [validItem] }),
    ).toThrow(SchemaError)
  })
})
