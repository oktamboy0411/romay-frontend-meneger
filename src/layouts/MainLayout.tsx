import { Separator } from '@/components/ui/separator'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar'
import { getSidebarGroups } from '@/constants/side-bar'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { User2 } from 'lucide-react'
import { ChevronUp } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

const HIDE_SIDEBAR_ROUTES = ['/auth/login']

export const MainLayout = ({ children }: { children: React.ReactNode }) => {
  const groups = getSidebarGroups()

  const { pathname } = useLocation()
  const navigate = useNavigate()

  const hideSidebar = HIDE_SIDEBAR_ROUTES.includes(pathname)

  const signOut = () => {
    localStorage.clear()
    navigate('/auth/login')
  }

  if (hideSidebar) return children

  return (
    <SidebarProvider>
      <Sidebar collapsible="icon" className="z-20">
        <SidebarHeader>
          <div className="p-2 flex items-center gap-2">
            <img src="/logo.svg" alt="" className="h-6 w-6" />
            {/* 👇 only show text when sidebar is expanded */}
            <div className="flex flex-col group-data-[collapsible=icon]:hidden">
              <span className="font-semibold text-[14px] leading-[100%]">
                Romay ERP
              </span>
              <span className="text-[12px] leading-[100%]">v1.0</span>
            </div>
          </div>
        </SidebarHeader>
        <SidebarContent className="z-20">
          {groups.map((group) => (
            <SidebarGroup key={group.label}>
              <SidebarGroupLabel>{group.label}</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {group.items.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton
                        className="data-[active=true]:bg-[#10B981] data-[active=true]:text-white"
                        isActive={item.url === pathname}
                        asChild
                      >
                        <Link to={item.url} className="flex items-center gap-2">
                          <item.icon className="h-4 w-4" />
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          ))}
        </SidebarContent>
        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuButton>
                    <User2 /> Username
                    <ChevronUp className="ml-auto" />
                  </SidebarMenuButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  side="top"
                  className="w-[--radix-popper-anchor-width]"
                >
                  <DropdownMenuItem>
                    <div onClick={signOut} className=" cursor-pointer">
                      Sign out
                    </div>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <header className="border-b fixed z-10  top-0 left-0 right-0 bg-white">
          <div className="flex items-center pr-6 justify-between">
            <div className="container flex h-16 items-center justify-between px-4 pr-0">
              <div className="flex items-center gap-2">
                <SidebarTrigger />
                {/* <Separator className="mx-2 h-6"/> */}
                <Separator
                  orientation="vertical"
                  className="min-h-4 min-w-0.5"
                />
                {/* <h1 className="text-md font-medium">{header}</h1> */}
                {/* <span className="text-sm text-muted-foreground">({role})</span> */}
              </div>
            </div>
            <div className="flex gap-4 w-full justify-start"></div>
          </div>
        </header>
        <main className="px-6 py-20">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  )
}
