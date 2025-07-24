import type { SEOProps } from 'astro-seo-plugin'

import { siteConfig } from '~/lib/config'

export const defaultSeo: SEOProps = {
  title: siteConfig.name,
  titleTemplate: `%s - ${siteConfig.name}`,
  description: siteConfig.description,
}
