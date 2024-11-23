export interface TNavItem {
  title: string
  href?: string
  disabled?: boolean
  label?: string
}

export type TSidebarNavItem = TNavItem & {
  items: TSidebarNavItem[]
}

export type TNavItemWithChildren = TNavItem & {
  items: TNavItemWithChildren[]
}

export interface TDocsConfig {
  mainNav: TNavItem[]
  sidebarNav: TSidebarNavItem[]
}

export const docsConfig: TDocsConfig = {
  mainNav: [
    {
      title: 'Docs',
      href: '/docs',
    },
    {
      title: 'Components',
      href: '/docs/components/accordion',
    },
    {
      title: 'Examples',
      href: '/examples/authentication',
    },
    {
      title: 'Colors',
      href: '/colors',
    },
  ],
  sidebarNav: [
    {
      title: 'Getting Started',
      items: [
        {
          title: 'Introduction',
          href: '/docs',
          items: [],
        },
        {
          title: 'Installation',
          href: '/docs/installation',
          items: [],
        },
        {
          title: 'components.json',
          href: '/docs/components-json',
          items: [],
        },
        {
          title: 'Theming',
          href: '/docs/theming',
          items: [],
        },
        {
          title: 'Dark mode',
          href: '/docs/dark-mode',
          disabled: true,
          label: 'Soon',
          items: [],
        },
        {
          title: 'CLI',
          href: '/docs/cli',
          items: [],
        },
        {
          title: 'Typography',
          href: '/docs/components/typography',
          items: [],
        },
      ],
    },
    {
      title: 'Installation',
      items: [
        {
          title: 'Angular',
          href: '/docs/installation/angular',
          items: [],
        },
        {
          title: 'Manual',
          href: '/docs/installation/manual',
          items: [],
        },
      ],
    },
    {
      title: 'Components',
      items: [
        {
          title: 'Accordion',
          href: '/docs/components/accordion',
          items: [],
        },
        {
          title: 'Alert',
          href: '/docs/components/alert',
          items: [],
        },
        {
          title: 'Aspect Ratio',
          href: '/docs/components/aspect-ratio',
          items: [],
        },
        {
          title: 'Avatar',
          href: '/docs/components/avatar',
          items: [],
        },
        {
          title: 'Badge',
          href: '/docs/components/badge',
          items: [],
        },
        {
          title: 'Breadcrumb',
          href: '/docs/components/breadcrumb',
          items: [],
        },
        {
          title: 'Button',
          href: '/docs/components/button',
          items: [],
        },
        {
          title: 'Card',
          href: '/docs/components/card',
          items: [],
        },
        {
          title: 'Collapsible',
          href: '/docs/components/collapsible',
          items: [],
        },
        {
          title: 'Dialog',
          href: '/docs/components/dialog',
          items: [],
        },
        {
          title: 'Input',
          href: '/docs/components/input',
          items: [],
        },
        {
          title: 'Pagination',
          href: '/docs/components/pagination',
          label: 'New',
          items: [],
        },
        {
          title: 'Progress',
          href: '/docs/components/progress',
          items: [],
        },
        {
          title: 'Separator',
          href: '/docs/components/separator',
          items: [],
        },
        {
          title: 'Skeleton',
          href: '/docs/components/skeleton',
          items: [],
        },
        {
          title: 'Sonner',
          href: '/docs/components/sonner',
          items: [],
        },
        {
          title: 'Switch',
          href: '/docs/components/switch',
          items: [],
        },
        {
          title: 'Table',
          href: '/docs/components/table',
          items: [],
        },
        {
          title: 'Tabs',
          href: '/docs/components/tabs',
          items: [],
        },
        {
          title: 'Textarea',
          href: '/docs/components/textarea',
          items: [],
        },
        {
          title: 'Toggle',
          href: '/docs/components/toggle',
          items: [],
        },
      ],
    },
  ],
}
