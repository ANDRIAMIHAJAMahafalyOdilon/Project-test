'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  FileText,
  FileDown,
  Settings,
  Users,
  LogOut,
  ChevronUp,
} from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  useSidebar,
} from '@/components/ui/sidebar';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/contexts/auth-context';
import { useLanguage } from '@/contexts/language-context';
import { useLogout } from '@/hooks/use-auth-mutations';
import { cn } from '@/lib/utils';
import type { I18nKey } from '@/lib/i18n';

const mainNavItems = [
  {
    translationKey: 'sidebar.dashboard' as I18nKey,
    url: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    translationKey: 'sidebar.forms' as I18nKey,
    url: '/forms',
    icon: FileText,
  },
  {
    translationKey: 'sidebar.pdf' as I18nKey,
    url: '/pdf',
    icon: FileDown,
  },
];

const managementNavItems = [
  {
    translationKey: 'sidebar.users' as I18nKey,
    url: '/users',
    icon: Users,
  },
  {
    translationKey: 'sidebar.settings' as I18nKey,
    url: '/settings',
    icon: Settings,
  },
];

export function AppSidebar() {
  const pathname = usePathname();
  const { state, isMobile } = useSidebar();
  const isRailCollapsed = state === 'collapsed';
  const { user } = useAuth();
  const logoutMutation = useLogout();
  const { t } = useLanguage();

  const userDisplayName = user
    ? [user.firstName, user.lastName].filter(Boolean).join(' ').trim() || user.email
    : '';

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="shrink-0 gap-0 border-b border-sidebar-border/60 !p-0">
        <Tooltip>
          <TooltipTrigger asChild>
            <Link
              href="/dashboard"
              aria-label="DocuFlow — Dashboard"
              className={cn(
                'flex w-full min-w-0 max-w-full items-center justify-start outline-none transition-colors',
                'hover:bg-sidebar-accent/45 focus-visible:ring-2 focus-visible:ring-sidebar-ring',
                isRailCollapsed ? 'py-1.5' : 'py-2',
              )}
            >
              {/* img natif : w-full s’applique vraiment sur toute la largeur (Next/Image gardait des tailles fixes) */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/docuflow-icon.svg"
                alt=""
                className={cn(
                  'block min-w-0 max-w-full object-contain object-left',
                  'ml-0',
                  /* Rail : petite zone */
                  isRailCollapsed ? 'h-10 w-auto' : 'h-9 w-auto',
                )}
                width={180}
                height={180}
                decoding="async"
              />
            </Link>
          </TooltipTrigger>
          <TooltipContent
            side="right"
            align="center"
            sideOffset={8}
            hidden={!isRailCollapsed || isMobile}
          >
            DocuFlow
          </TooltipContent>
        </Tooltip>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>{t('sidebar.principal')}</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainNavItems.map((item) => (
                <SidebarMenuItem key={item.url}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === item.url}
                    tooltip={t(item.translationKey)}
                  >
                    <Link href={item.url}>
                      <item.icon />
                      <span>{t(item.translationKey)}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>{t('sidebar.management')}</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {managementNavItems.map((item) => (
                <SidebarMenuItem key={item.url}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === item.url}
                    tooltip={t(item.translationKey)}
                  >
                    <Link href={item.url}>
                      <item.icon />
                      <span>{t(item.translationKey)}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                >
                  <Avatar className="size-8 rounded-lg">
                    <AvatarImage src={user?.avatar} alt={userDisplayName} />
                    <AvatarFallback className="rounded-lg">
                      {userDisplayName ? getInitials(userDisplayName) : 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">{userDisplayName}</span>
                    <span className="truncate text-xs text-muted-foreground">
                      {user?.email}
                    </span>
                  </div>
                  <ChevronUp className="ml-auto size-4" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
                side="top"
                align="end"
                sideOffset={4}
              >
                <DropdownMenuItem asChild>
                  <Link href="/settings">
                    <Settings className="mr-2 size-4" />
                    Paramètres
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => logoutMutation.mutate()}
                  disabled={logoutMutation.isPending}
                  className="text-destructive focus:text-destructive"
                >
                  <LogOut className="mr-2 size-4" />
                  {logoutMutation.isPending ? 'Déconnexion...' : 'Déconnexion'}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}
