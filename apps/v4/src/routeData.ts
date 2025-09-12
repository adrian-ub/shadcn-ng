import { defineRouteMiddleware } from '@astrojs/starlight/route-data'

export const onRequest = defineRouteMiddleware((context) => {
  const ogImageUrl = new URL(
    `/og/${context.locals.starlightRoute.id || 'index'}.png`,
    context.site,
  )

  const { head } = context.locals.starlightRoute

  head.push({
    tag: 'meta',
    attrs: { property: 'og:image', content: ogImageUrl.href },
  })
  head.push({
    tag: 'meta',
    attrs: { name: 'twitter:image', content: ogImageUrl.href },
  })
  head.push({
    tag: 'meta',
    attrs: { name: 'twitter:card', content: 'summary_large_image' },
  })
  head.push({
    tag: 'meta',
    attrs: { name: 'twitter:title', content: context.locals.starlightRoute.entry.data.title },
  })
  if (context.locals.starlightRoute.entry.data.description) {
    head.push({
      tag: 'meta',
      attrs: { name: 'twitter:description', content: context.locals.starlightRoute.entry.data.description },
    })
  }
})
