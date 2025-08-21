/* eslint-disable antfu/no-top-level-await */
import { getCollection } from 'astro:content'
import { loader } from '@/docs/source'

export const source = loader({
  baseUrl: '/docs',
  source: {
    pageData: await getCollection('docs'),
    metaData: await getCollection('meta'),
  },
})
