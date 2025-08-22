import { registrySchema } from 'shadcn-ng/schema'
import * as z from 'zod'

export async function GET(): Promise<Response> {
  const JsonRegistrySchema = z.toJSONSchema(registrySchema)

  return new Response(JSON.stringify(JsonRegistrySchema, null, 2))
}
