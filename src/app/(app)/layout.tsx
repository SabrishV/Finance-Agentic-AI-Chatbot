// src/app/(app)/layout.tsx
"use client";

import type { ReactNode } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { MessageSquare, Settings as SettingsIcon } from 'lucide-react';

import { cn } from '@/lib/utils';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { TooltipProvider } from '@/components/ui/tooltip';
import AppLogo from '@/components/layout/AppLogo';
import { ScrollArea } from '@/components/ui/scroll-area';


interface AppLayoutProps {
  children: ReactNode;
}

const navItems = [
  { href: '/', label: 'Chat', icon: MessageSquare },
  { href: '/settings', label: 'Settings', icon: SettingsIcon },
];

export default function AppLayout({ children }: AppLayoutProps) {
  const pathname = usePathname();

  return (
    <TooltipProvider delayDuration={0}>
      <SidebarProvider defaultOpen>
        <Sidebar side="left" collapsible="icon" variant="sidebar" className="border-r">
          <SidebarHeader className="p-4 flex items-center justify-between">
            <AppLogo />
          </SidebarHeader>
          <SidebarContent className="p-2">
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <Link href={item.href} passHref legacyBehavior>
                    <SidebarMenuButton
                      asChild={false}
                      isActive={pathname === item.href}
                      className="w-full"
                      tooltip={{children: item.label, side: "right", align: "center"}}
                      size="default"
                    >
                      <item.icon className="h-5 w-5" />
                      <span className="group-data-[collapsible=icon]:hidden">{item.label}</span>
                    </SidebarMenuButton>
                  </Link>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarContent>
        </Sidebar>
        <SidebarInset>
          <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background px-4 sm:px-6">
            <SidebarTrigger className="md:hidden" />
            <div className="flex-1">
              <h1 className="text-xl font-semibold text-foreground">
                {navItems.find(item => item.href === pathname)?.label || 'Sage Advisor'}
              </h1>
            </div>
          </header>
          <ScrollArea className="flex-1 h-[calc(100vh-4rem)]">
             <main className="p-4 md:p-6 min-h-full">
                {children}
             </main>
          </ScrollArea>
        </SidebarInset>
      </SidebarProvider>
    </TooltipProvider>
  );
}
