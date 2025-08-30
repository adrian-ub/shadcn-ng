import { rawConfigSchema } from 'shadcn-ng/schema'
import * as z from 'zod'

export async function GET(): Promise<Response> {
  const JsonRawConfigSchema = z.toJSONSchema(rawConfigSchema)

  return new Response(JSON.stringify(JsonRawConfigSchema, null, 2))
}
