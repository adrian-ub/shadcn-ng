import { styles } from '~/registry/registry-styles'

export async function GET(): Promise<Response> {
  return new Response(JSON.stringify(styles, null, 2))
}
