import { describe, expect, it } from 'vitest'
import {
  registryItemTypeSchema,
  registryItemSchema,
  registryIndexSchema,
  rawConfigSchema,
  configSchema,
} from '../src/registry/schemas/index'
import {
  SchemaError,
  FetchError,
  DepNotFoundError,
  CycleError,
} from '../src/registry/errors'

// ── P2.T1: Zod Schema Validation ──────────────────────────────────────────

describe('P2.T1: Registry Zod Schemas — RegistryItemType', () => {
  it('accepts valid registry item types', () => {
    const validTypes = [
      'registry:lib',
      'registry:block',
      'registry:component',
      'registry:ui',
      'registry:service',
      'registry:page',
      'registry:file',
      'registry:theme',
      'registry:example',
      'registry:style',
      'registry:internal',
    ] as const
    for (const type of validTypes) {
      expect(registryItemTypeSchema.safeParse(type).success).toBe(true)
    }
  })

  it('rejects invalid registry item types', () => {
    expect(registryItemTypeSchema.safeParse('registry:invalid').success).toBe(false)
    expect(registryItemTypeSchema.safeParse('ui').success).toBe(false)
    expect(registryItemTypeSchema.safeParse('').success).toBe(false)
  })
})

describe('P2.T1: RegistryItemSchema', () => {
  it('validates a complete valid RegistryItem', () => {
    const item = {
      name: 'button',
      type: 'registry:ui',
      title: 'Button',
      description: 'A button component',
      dependencies: ['@angular/core'],
      devDependencies: ['@types/jest'],
      registryDependencies: ['utils'],
      files: [
        { path: 'button.ts', type: 'registry:ui' as const, content: '// code' },
        { path: 'button.css', type: 'registry:file' as const, target: './styles' },
      ],
      categories: ['buttons'],
    }
    const result = registryItemSchema.safeParse(item)
    expect(result.success).toBe(true)
  })

  it('validates minimal RegistryItem (name + type only)', () => {
    const item = { name: 'utils', type: 'registry:lib' }
    const result = registryItemSchema.safeParse(item)
    expect(result.success).toBe(true)
  })

  it('rejects RegistryItem without name', () => {
    const result = registryItemSchema.safeParse({ type: 'registry:ui' })
    expect(result.success).toBe(false)
  })

  it('rejects RegistryItem without type', () => {
    const result = registryItemSchema.safeParse({ name: 'button' })
    expect(result.success).toBe(false)
  })

  it('rejects RegistryItem with empty name', () => {
    const result = registryItemSchema.safeParse({ name: '', type: 'registry:ui' })
    expect(result.success).toBe(false)
  })

  it('rejects RegistryItem with non-array dependencies', () => {
    const result = registryItemSchema.safeParse({ name: 'btn', type: 'registry:ui', dependencies: 'not-an-array' })
    expect(result.success).toBe(false)
  })

  it('rejects RegistryItemFile missing target for registry:file type', () => {
    const item = {
      name: 'test',
      type: 'registry:ui',
      files: [{ path: 'test.css', type: 'registry:file' }],
    }
    const result = registryItemSchema.safeParse(item)
    expect(result.success).toBe(false)
  })

  it('accepts RegistryItemFile with optional target for non-file types', () => {
    const item = {
      name: 'test',
      type: 'registry:ui',
      files: [{ path: 'test.ts', type: 'registry:ui' }],
    }
    const result = registryItemSchema.safeParse(item)
    expect(result.success).toBe(true)
  })
})

describe('P2.T1: RegistryIndexSchema', () => {
  it('validates an array of RegistryItems', () => {
    const items = [
      { name: 'button', type: 'registry:ui' },
      { name: 'card', type: 'registry:ui', dependencies: ['button'] },
    ]
    expect(registryIndexSchema.safeParse(items).success).toBe(true)
  })

  it('validates empty array', () => {
    expect(registryIndexSchema.safeParse([]).success).toBe(true)
  })

  it('rejects non-array input', () => {
    expect(registryIndexSchema.safeParse({ name: 'button' }).success).toBe(false)
  })
})

describe('P2.T1: Config Schemas', () => {
  it('validates a valid RawConfig', () => {
    const config = {
      style: 'new-york',
      tailwind: {
        css: 'src/styles.css',
        baseColor: 'zinc',
      },
      aliases: {
        components: '~/components',
        utils: '~/lib/utils',
      },
    }
    const result = rawConfigSchema.safeParse(config)
    expect(result.success).toBe(true)
  })

  it('applies defaults for optional tailwind fields', () => {
    const config = {
      style: 'default',
      tailwind: {
        css: 'src/styles.css',
        baseColor: 'neutral',
      },
      aliases: {
        components: '~/components',
        utils: '~/lib/utils',
      },
    }
    const result = rawConfigSchema.safeParse(config)
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.tailwind.cssVariables).toBe(true)
      expect(result.data.tailwind.prefix).toBe('')
    }
  })

  it('rejects RawConfig with invalid style', () => {
    const result = rawConfigSchema.safeParse({
      style: 'invalid-style',
      tailwind: { css: 'styles.css', baseColor: 'zinc' },
      aliases: { components: '~/c', utils: '~/u' },
    })
    expect(result.success).toBe(false)
  })

  it('rejects RawConfig without aliases', () => {
    const result = rawConfigSchema.safeParse({
      style: 'new-york',
      tailwind: { css: 'styles.css', baseColor: 'zinc' },
    })
    expect(result.success).toBe(false)
  })

  it('validates ConfigSchema with resolvedPaths', () => {
    const config = {
      style: 'new-york',
      tailwind: { css: 'styles.css', baseColor: 'zinc' },
      aliases: { components: '~/c', utils: '~/u' },
      resolvedPaths: {
        cwd: '/project',
        tailwindConfig: '/project/tailwind.config.ts',
        tailwindCss: '/project/styles.css',
        utils: '/project/lib/utils.ts',
        components: '/project/components',
        lib: '/project/lib',
        services: '/project/services',
        ui: '/project/components/ui',
      },
    }
    const result = configSchema.safeParse(config)
    expect(result.success).toBe(true)
  })

  it('rejects ConfigSchema missing resolvedPaths', () => {
    const result = configSchema.safeParse({
      style: 'new-york',
      tailwind: { css: 'styles.css', baseColor: 'zinc' },
      aliases: { components: '~/c', utils: '~/u' },
    })
    expect(result.success).toBe(false)
  })
})

// ── P2.T2: Error Classes ──────────────────────────────────────────────────

describe('P2.T2: Error classes', () => {
  it('SchemaError has correct name and message', () => {
    const error = new SchemaError('Invalid schema: missing name')
    expect(error).toBeInstanceOf(Error)
    expect(error.name).toBe('SchemaError')
    expect(error.message).toBe('Invalid schema: missing name')
  })

  it('SchemaError preserves cause when provided', () => {
    const cause = new Error('Zod error')
    const error = new SchemaError('Validation failed', { cause })
    expect(error.cause).toBe(cause)
  })

  it('FetchError has correct name and message', () => {
    const error = new FetchError('Failed to fetch registry', 404)
    expect(error.name).toBe('FetchError')
    expect(error.message).toBe('Failed to fetch registry')
  })

  it('FetchError stores status code', () => {
    const error = new FetchError('Not found', 404)
    expect(error.statusCode).toBe(404)
  })

  it('FetchError defaults status to 0', () => {
    const error = new FetchError('Network error')
    expect(error.statusCode).toBe(0)
  })

  it('DepNotFoundError has correct name and dependency name', () => {
    const error = new DepNotFoundError('button')
    expect(error.name).toBe('DepNotFoundError')
    expect(error.dependencyName).toBe('button')
    expect(error.message).toContain('button')
  })

  it('CycleError has correct name and cycle path', () => {
    const error = new CycleError(['button', 'dialog', 'button'])
    expect(error.name).toBe('CycleError')
    expect(error.cycle).toEqual(['button', 'dialog', 'button'])
    expect(error.message).toContain('button')
    expect(error.message).toContain('dialog')
  })

  it('CycleError formats single-node cycle', () => {
    const error = new CycleError(['self'])
    expect(error.cycle).toEqual(['self'])
  })

  it('all error types are instanceof Error', () => {
    expect(new SchemaError('x')).toBeInstanceOf(Error)
    expect(new FetchError('x')).toBeInstanceOf(Error)
    expect(new DepNotFoundError('x')).toBeInstanceOf(Error)
    expect(new CycleError(['x'])).toBeInstanceOf(Error)
  })
})
