import type { APIRoute } from 'astro'
import { Buffer } from 'node:buffer'
import { getCollection } from 'astro:content'
import satori from 'satori'
import { html as toReactElement } from 'satori-html'
import sharp from 'sharp'

async function loadAssets(): Promise<
  { name: string, data: Buffer, weight: 400 | 600, style: 'normal' }[]
> {
  const [
    { base64Font: normal },
    { base64Font: mono },
    { base64Font: semibold },
  ] = await Promise.all([
    import('./_geist-regular-otf.json').then(mod => mod.default || mod),
    import('./_geistmono-regular-otf.json').then(mod => mod.default || mod),
    import('./_geist-semibold-otf.json').then(mod => mod.default || mod),
  ])

  return [
    {
      name: 'Geist',
      data: Buffer.from(normal, 'base64'),
      weight: 400 as const,
      style: 'normal' as const,
    },
    {
      name: 'Geist Mono',
      data: Buffer.from(mono, 'base64'),
      weight: 400 as const,
      style: 'normal' as const,
    },
    {
      name: 'Geist',
      data: Buffer.from(semibold, 'base64'),
      weight: 600 as const,
      style: 'normal' as const,
    },
  ]
}

export const GET: APIRoute = async ({ props }) => {
  const { title, description } = props

  const [fonts] = await Promise.all([loadAssets()])

  const html = toReactElement(`
<div tw="flex h-full w-full bg-black text-white" style="font-family: Geist Sans">
  <div tw="flex border absolute border-stone-700 border-dashed inset-y-0 left-16 w-[1px]"></div>
  <div tw="flex border absolute border-stone-700 border-dashed inset-y-0 right-16 w-[1px]"></div>
  <div tw="flex border absolute border-stone-700 inset-x-0 h-[1px] top-16"></div>
  <div tw="flex border absolute border-stone-700 inset-x-0 h-[1px] bottom-16"></div>
  <div tw="flex absolute flex-row bottom-24 right-24 text-white">
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="48" height="48">
      <rect width="256" height="256" fill="none"></rect>
      <line x1="208" y1="128" x2="128" y2="208" fill="none" stroke="url(#paint1_linear_1284_572)" stroke-linecap="round" stroke-linejoin="round" stroke-width="32"></line>
      <line x1="192" y1="40" x2="40" y2="192" fill="none" stroke="url(#paint3_linear_1284_572)" stroke-linecap="round" stroke-linejoin="round" stroke-width="32"></line>
      <defs xmlns="http://www.w3.org/2000/svg">
        <linearGradient xmlns="http://www.w3.org/2000/svg" id="paint1_linear_1284_572" x1="45.4927" y1="198.353" x2="209.607" y2="120.339" gradientUnits="userSpaceOnUse">
          <stop stop-color="#E40035"></stop>
          <stop offset="0.24" stop-color="#F60A48"></stop>
          <stop offset="0.352" stop-color="#F20755"></stop>
          <stop offset="0.494" stop-color="#DC087D"></stop>
          <stop offset="0.745" stop-color="#9717E7"></stop>
          <stop offset="1" stop-color="#6C00F5"></stop>
        </linearGradient>
        <linearGradient xmlns="http://www.w3.org/2000/svg" id="paint3_linear_1284_572" x1="45.4927" y1="198.353" x2="209.607" y2="120.339" gradientUnits="userSpaceOnUse">
          <stop stop-color="#E40035"></stop>
          <stop offset="0.24" stop-color="#F60A48"></stop>
          <stop offset="0.352" stop-color="#F20755"></stop>
          <stop offset="0.494" stop-color="#DC087D"></stop>
          <stop offset="0.745" stop-color="#9717E7"></stop>
          <stop offset="1" stop-color="#6C00F5"></stop>
        </linearGradient>
      </defs>
    </svg>
  </div>
  <div tw="flex flex-col absolute w-[896px] justify-center inset-32">
    <div tw="tracking-tight flex-grow-1 flex flex-col justify-center leading-[1.1]" style="text-wrap: balance; font-weight: 600; font-size: ${title && title.length > 20 ? '64px' : '80px'}; letter-spacing: -0.04em"> ${title} </div>
    <div tw="text-[40px] leading-[1.5] flex-grow-1 text-stone-400" style="font-weight: 500; text-wrap: balance"> ${description} </div>
  </div>
</div>
`)

  const svg = await satori(html, {
    fonts,
    width: 1200,
    height: 628,
  })

  const svgBuffer = Buffer.from(svg)
  const png = sharp(svgBuffer).png().toBuffer()

  const pngBuffer = await png

  return new Response(new Uint8Array(pngBuffer), {
    headers: { 'Content-Type': 'image/png' },
  })
}

export async function getStaticPaths() {
  const docs = await getCollection('docs')
  return docs.map((doc) => {
    return {
      params: { slug: doc.id },
      props: {
        title: doc.data.title,
        description: doc.data.description || '',
      },
    }
  })
}
