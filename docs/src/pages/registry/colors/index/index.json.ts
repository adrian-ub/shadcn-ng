import { colorsData } from '@/registry/colors'

export async function GET(): Promise<Response> {
  return new Response(JSON.stringify(colorsData(), null, 2))
}
