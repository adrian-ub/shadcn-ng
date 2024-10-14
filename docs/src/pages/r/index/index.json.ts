import { registry } from '@/registry'

export async function GET(): Promise<Response> {
  const items = registry
    .filter(item => ['registry:ui'].includes(item.type))
    .map((item) => {
      return {
        ...item,
        files: item.files?.map((_file) => {
          const file
            = typeof _file === 'string'
              ? {
                  path: _file,
                  type: item.type,
                }
              : _file

          return file
        }),
      }
    })
  const registryJson = JSON.stringify(items, null, 2)
  return new Response(registryJson)
}
