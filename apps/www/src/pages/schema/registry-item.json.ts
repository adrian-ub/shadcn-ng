import { registryItemSchema } from 'shadcn-ng/schema'
import * as z from 'zod'

export async function GET(): Promise<Response> {
  const JsonRegistryItemSchema = z.toJSONSchema(registryItemSchema)

  return new Response(JSON.stringify(JsonRegistryItemSchema, null, 2))
}
