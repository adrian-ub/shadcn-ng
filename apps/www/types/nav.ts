export interface NavItem {
  title: string
  href?: string
  disabled?: boolean
  external?: boolean
  icon?: unknown
  label?: string
}

export interface NavItemWithChildren extends NavItem {
  items: NavItemWithChildren[]
}

export interface MainNavItem extends NavItem {}

export interface SidebarNavItem extends NavItemWithChildren {}
