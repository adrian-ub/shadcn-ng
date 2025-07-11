export interface TOCItem {
  slug: string
  text: string
  depth: number
  active?: boolean
}

export interface TOCConfig {
  items: TOCItem[]
}

export function createTOC(headings: Array<{ slug: string, text: string, depth: number }>): TOCConfig {
  return {
    items: headings.map((heading, index) => ({
      ...heading,
      active: index === 0,
    })),
  }
}

export function getActiveHeadingFromScroll(
  headings: Array<{ slug: string, text: string, depth: number }>,
  scrollY: number,
  headerHeight: number = 80,
): string | null {
  const headingElements = headings.map(h => document.getElementById(h.slug)).filter(Boolean)

  if (headingElements.length === 0)
    return null

  let currentActive: string | null = null

  for (let i = headingElements.length - 1; i >= 0; i--) {
    const element = headingElements[i]
    if (!element)
      continue

    const rect = element.getBoundingClientRect()
    const offsetTop = rect.top + scrollY

    if (scrollY + headerHeight >= offsetTop - 10) {
      currentActive = element.id
      break
    }
  }

  if (!currentActive && headingElements.length > 0 && headingElements[0]) {
    currentActive = headingElements[0].id
  }

  return currentActive
}
