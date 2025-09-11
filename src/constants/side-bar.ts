/* eslint-disable @typescript-eslint/no-explicit-any */
// sidebar-groups.ts
import {
  LayoutGrid,
  UserRound,
  Contact,
  SquareCheckBig,
  Package,
  CircleArrowOutUpRight,
  Wrench,
} from 'lucide-react'

export type Role =
  | 'ceo'
  | 'manager'
  | 'sale_cashier'
  | 'rent_cashier'
  | 'storekeeper'

export interface SidebarItem {
  title: string
  icon: any
  url: string
}

export interface SidebarGroup {
  label: string
  items: SidebarItem[]
}

export const getSidebarGroups = (): SidebarGroup[] => {
  return [
    {
      label: 'Asosiy',
      items: [{ title: 'Dashboard', icon: LayoutGrid, url: '/dashboard' }],
    },
    {
      label: 'Mijozlar va xodimlar',
      items: [
        { title: 'Sotuvchilar', icon: UserRound, url: '/sellers' },
        { title: 'Kassirlar', icon: UserRound, url: '/cashiers' },
        { title: 'Mijozlar', icon: Contact, url: '/clients' },
      ],
    },
    {
      label: 'Operatsiyalar',
      items: [
        { title: 'Sotuvlar', icon: SquareCheckBig, url: '/sales' },
        { title: 'Sotuv Mahsulotlar', icon: Package, url: '/sale-products' },
        { title: 'Ijara Mahsulotlar', icon: Package, url: '/rent-products' },
        { title: 'Ijaralar', icon: CircleArrowOutUpRight, url: '/rents' },
        { title: "Ta'mirlash", icon: Wrench, url: '/repairs' },
      ],
    },
  ]
}
