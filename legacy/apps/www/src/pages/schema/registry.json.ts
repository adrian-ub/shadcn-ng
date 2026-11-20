import { toJsonSchema } from '@valibot/to-json-schema'
import { RegistrySchema } from 'shadcn-ng/registry'

export async function GET(): Promise<Response> {
  const JsonRegistrySchema = toJsonSchema(RegistrySchema, {
    errorMode: 'ignore',
  })

  return new Response(JSON.stringify(JsonRegistrySchema, null, 2))
}
