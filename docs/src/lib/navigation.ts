export interface NavigationGroup {
  title: string
  items: NavigationItem[]
}

export interface NavigationItem {
  title: string
  href: string
}

export interface SidebarConfig {
  groups: NavigationGroup[]
}

export async function getSidebarConfig(): Promise<SidebarConfig> {
  return {
    groups: [
      {
        title: 'Get Started',
        items: [
          { title: 'Introduction', href: '/docs' },
          { title: 'Installation', href: '/docs/installation' },
        ],
      },
      {
        title: 'Components',
        /// keep-sorted {"keys": ["title"]}
        items: [
          { title: 'Button', href: '/docs/components/button' },
        ],
      },
      {
        title: 'Installation',
        items: [
          { title: 'Angular', href: '/docs/installation/angular' },
          { title: 'Analog', href: '/docs/installation/analog' },
          { title: 'Vite', href: '/docs/installation/vite' },
          { title: 'Manual Installation', href: '/docs/installation/manual' },
        ],
      },
      {
        title: 'Dark mode',
        items: [
          { title: 'Angular', href: '/docs/dark-mode/angular' },
        ],
      },
      {
        title: 'Registry',
        items: [
          { title: 'Introduction', href: '/docs/registry' },
          { title: 'Components', href: '/docs/registry/components' },
          { title: 'Blocks', href: '/docs/registry/blocks' },
        ],
      },
    ],
  }
}

export function isActiveRoute(currentPath: string, itemPath: string): boolean {
  const normalizedCurrent = currentPath.replace(/\/$/, '') || '/'
  const normalizedItem = itemPath.replace(/\/$/, '') || '/'

  return normalizedCurrent === normalizedItem
}

export function getActiveNavigation(currentPath: string, config: SidebarConfig): {
  group: string
  item: string
  href: string
} | null {
  for (const group of config.groups) {
    for (const item of group.items) {
      if (isActiveRoute(currentPath, item.href)) {
        return {
          group: group.title,
          item: item.title,
          href: item.href,
        }
      }
    }
  }
  return null
}

export function getPageNavigation(currentPath: string, config: SidebarConfig): {
  prev: NavigationItem | null
  next: NavigationItem | null
} {
  const allItems: NavigationItem[] = []

  for (const group of config.groups) {
    allItems.push(...group.items)
  }

  const currentIndex = allItems.findIndex(item => isActiveRoute(currentPath, item.href))

  if (currentIndex === -1) {
    return { prev: null, next: null }
  }

  return {
    prev: currentIndex > 0 ? allItems[currentIndex - 1] : null,
    next: currentIndex < allItems.length - 1 ? allItems[currentIndex + 1] : null,
  }
}
