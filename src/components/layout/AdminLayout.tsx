'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
  SidebarHeader,
} from '@/components/ui/sidebar';
import { PermissionGate } from '@/components/ui/PermissionGate';
import { 
  LayoutDashboard, 
  Settings, 
  Users, 
  Building2, 
  Network,
  Users2,
  UserSquare2,
  BookOpen,
  Wrench,
  Tags,
  Phone,
  PhoneCall,
  Target,
  Upload,
  Ticket,
  MapPin,
  Briefcase,
  Store,
  Receipt,
  IndianRupee,
  SmilePlus,
  RefreshCcw,
  Bell,
  MessageSquare,
  Megaphone,
  BrainCircuit,
  BarChart4,
  FileKey,
  Database,
  LogOut
} from 'lucide-react';

import { clearSession } from '@/lib/hooks/useAuth';

const navItems = [
  {
    group: 'Main',
    items: [
      { title: 'Dashboard', url: '/dashboard', icon: LayoutDashboard, module: 'dashboard' },
    ],
  },
  {
    group: 'Customers',
    items: [
      { title: 'Customer List', url: '/dashboard/customers', icon: UserSquare2, module: 'customers' },
      { title: 'Duplicate Review', url: '/dashboard/customers/duplicate-review', icon: Users2, module: 'customers' },
    ],
  },
  {
    group: 'Catalog',
    items: [
      { title: 'Services', url: '/dashboard/catalog/services', icon: Wrench, module: 'catalog' },
      { title: 'Brands & Models', url: '/dashboard/catalog/brands', icon: Tags, module: 'catalog' },
    ],
  },
  {
    group: 'Calls',
    items: [
      { title: 'Call Logs', url: '/dashboard/calls', icon: Phone, module: 'calls' },
      { title: 'New Call', url: '/dashboard/calls/entry', icon: PhoneCall, module: 'calls' },
    ],
  },
  {
    group: 'Leads',
    items: [
      { title: 'Pipeline', url: '/dashboard/leads', icon: Target, module: 'leads' },
      { title: 'Bulk Import', url: '/dashboard/leads/import', icon: Upload, module: 'leads' },
    ],
  },
  {
    group: 'Workforce',
    items: [
      { title: 'Employees', url: '/dashboard/employees', icon: Briefcase, module: 'employees' },
      { title: 'Vendors', url: '/dashboard/vendors', icon: Store, module: 'vendors' },
    ],
  },
  {
    group: 'Finance',
    items: [
      { title: 'Estimates', url: '/dashboard/finance/estimates', icon: Receipt, module: 'finance' },
      { title: 'Invoices', url: '/dashboard/finance/invoices', icon: IndianRupee, module: 'finance' },
    ],
  },
  {
    group: 'Operations',
    items: [
      { title: 'Service Requests', url: '/dashboard/service-requests', icon: Ticket, module: 'service-requests' },
      { title: 'Dispatch Board', url: '/dashboard/dispatch', icon: MapPin, module: 'service-requests' },
    ],
  },
  {
    group: 'Quality Assurance',
    items: [
      { title: 'Happy Calls', url: '/dashboard/happy-calls', icon: SmilePlus, module: 'happy-calls' },
      { title: 'Reopen Requests', url: '/dashboard/reopen-requests', icon: RefreshCcw, module: 'reopen' },
    ],
  },
  {
    group: 'Communications',
    items: [
      { title: 'Notifications', url: '/dashboard/notifications', icon: Bell, module: 'notifications' },
      { title: 'Templates', url: '/dashboard/notifications/templates', icon: MessageSquare, module: 'notifications' },
      { title: 'Campaigns', url: '/dashboard/marketing/campaigns', icon: Megaphone, module: 'marketing' },
    ],
  },
  {
    group: 'Analytics & Intelligence',
    items: [
      { title: 'Reports', url: '/dashboard/reports', icon: BarChart4, module: 'reports' },
      { title: 'AI Settings', url: '/dashboard/ai-settings', icon: BrainCircuit, module: 'ai-settings' },
    ],
  },
  {
    group: 'System & Data',
    items: [
      { title: 'Audit Logs', url: '/dashboard/audit-logs', icon: FileKey, module: 'audit' },
      { title: 'Import/Export', url: '/dashboard/import-export', icon: Database, module: 'import-export' },
    ],
  },
  {
    group: 'Organization',
    items: [
      { title: 'Branches', url: '/dashboard/organization/branches', icon: Building2, module: 'organization' },
      { title: 'Sub-Branches', url: '/dashboard/organization/sub-branches', icon: Network, module: 'organization' },
      { title: 'Teams', url: '/dashboard/organization/teams', icon: Users2, module: 'organization' },
    ],
  },
  {
    group: 'Configuration',
    items: [
      { title: 'Masters', url: '/dashboard/masters', icon: Settings, module: 'masters' },
      { title: 'Roles & Users', url: '/dashboard/roles', icon: Users, module: 'users' },
    ],
  },
];

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    clearSession();
    router.push('/login');
  };

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <Sidebar className="border-r bg-white">
          <SidebarHeader className="h-16 flex items-center px-4 border-b">
            <span className="font-bold text-lg text-primary">CityCalls Admin</span>
          </SidebarHeader>
          <SidebarContent>
            {navItems.map((group) => (
              <SidebarGroup key={group.group}>
                <SidebarGroupLabel>{group.group}</SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {group.items.map((item) => (
                      <PermissionGate key={item.title} module={item.module}>
                        <SidebarMenuItem>
                          <SidebarMenuButton render={<Link href={item.url} />} isActive={pathname === item.url}>
                            <item.icon />
                            <span>{item.title}</span>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      </PermissionGate>
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            ))}
          </SidebarContent>
        </Sidebar>
        
        <div className="flex-1 flex flex-col min-h-screen bg-gray-50/50">
          <header className="h-16 flex items-center gap-4 px-6 border-b bg-white sticky top-0 z-10">
            <SidebarTrigger />
            <div className="ml-auto flex items-center space-x-4">
              <span className="text-sm font-medium">superadmin@citycalls.local</span>
              <button onClick={handleLogout} className="p-2 text-slate-500 hover:text-red-600 transition-colors bg-slate-100 hover:bg-red-50 rounded-md" title="Logout">
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </header>
          <main className="flex-1 p-6 overflow-auto">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
