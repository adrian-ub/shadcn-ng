import { toJsonSchema } from '@valibot/to-json-schema'
import { RegistryItemSchema } from 'shadcn-ng/registry'

export async function GET(): Promise<Response> {
  const JsonRegistryItemSchema = toJsonSchema(RegistryItemSchema, {
    errorMode: 'ignore',
  })

  return new Response(JSON.stringify(JsonRegistryItemSchema, null, 2))
}
