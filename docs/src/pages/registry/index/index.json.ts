import { registry } from '@/registry/registry'

export async function GET(): Promise<Response> {
  const names = registry.filter(item => item.type === 'components:ui')
  const registryJson = JSON.stringify(names, null, 2)
  return new Response(registryJson)
}
