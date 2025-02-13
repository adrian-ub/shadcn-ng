import { toJsonSchema } from '@valibot/to-json-schema'
import { RawConfigSchema } from 'shadcn-ng/registry'

export async function GET(): Promise<Response> {
  const JsonRawConfigSchema = toJsonSchema(RawConfigSchema, {
    errorMode: 'ignore',
  })

  return new Response(JSON.stringify(JsonRawConfigSchema, null, 2))
}
