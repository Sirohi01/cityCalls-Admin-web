'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
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
  Database
} from 'lucide-react';

// module/action values here match citycalls-api's real RBAC vocabulary
// exactly (src/modules/*/​*.routes.ts's requirePermission(module, action)
// calls) — not a frontend-invented naming scheme. Cross-check against
// docs/openapi/citycalls.yaml before adding a new item.
interface NavItem {
  title: string;
  url: string;
  icon: React.ComponentType<{ className?: string }>;
  module?: string;
  action?: string;
  anyOf?: { module: string; action?: string }[];
  alwaysVisible?: boolean;
}

const navItems: { group: string; items: NavItem[] }[] = [
  {
    group: 'Main',
    items: [
      { title: 'Dashboard', url: '/dashboard', icon: LayoutDashboard, alwaysVisible: true },
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
      { title: 'New Call', url: '/dashboard/calls/entry', icon: PhoneCall, module: 'calls', action: 'create' },
    ],
  },
  {
    group: 'Leads',
    items: [
      { title: 'Pipeline', url: '/dashboard/leads', icon: Target, module: 'leads' },
      { title: 'Bulk Import', url: '/dashboard/leads/import', icon: Upload, module: 'leads', action: 'import' },
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
      { title: 'Service Requests', url: '/dashboard/service-requests', icon: Ticket, module: 'serviceRequests' },
      { title: 'Dispatch Board', url: '/dashboard/dispatch', icon: MapPin, module: 'serviceRequests', action: 'assign' },
    ],
  },
  {
    group: 'Quality Assurance',
    items: [
      { title: 'Happy Calls', url: '/dashboard/happy-calls', icon: SmilePlus, module: 'happyCalls' },
      { title: 'Reopen Requests', url: '/dashboard/reopen-requests', icon: RefreshCcw, module: 'happyCalls' },
    ],
  },
  {
    group: 'Communications',
    items: [
      { title: 'Notifications', url: '/dashboard/notifications', icon: Bell, alwaysVisible: true },
      { title: 'Templates', url: '/dashboard/notifications/templates', icon: MessageSquare, module: 'config', action: 'manageSettings' },
      { title: 'Campaigns', url: '/dashboard/marketing/campaigns', icon: Megaphone, module: 'marketing' },
    ],
  },
  {
    group: 'Analytics & Intelligence',
    items: [
      { title: 'Reports', url: '/dashboard/reports', icon: BarChart4, module: 'reports' },
      { title: 'AI Settings', url: '/dashboard/ai-settings', icon: BrainCircuit, module: 'ai', action: 'manageSettings' },
    ],
  },
  {
    group: 'System & Data',
    items: [
      { title: 'Audit Logs', url: '/dashboard/audit-logs', icon: FileKey, module: 'config', action: 'manageSettings' },
      {
        title: 'Import/Export',
        url: '/dashboard/import-export',
        icon: Database,
        anyOf: [
          { module: 'customers', action: 'export' },
          { module: 'leads', action: 'export' },
          { module: 'serviceRequests', action: 'export' },
          { module: 'calls', action: 'export' },
          { module: 'finance', action: 'export' },
        ],
      },
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
      { title: 'Masters', url: '/dashboard/masters', icon: Settings, module: 'config' },
      { title: 'Roles & Users', url: '/dashboard/roles', icon: Users, module: 'users' },
    ],
  },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar className="border-r bg-white">
      <SidebarHeader className="h-12 flex justify-center items-center px-4 border-b bg-[#000]">
        <img src="/logo.png" alt="CityCalls Logo" className="h-10 w-auto object-contain" />
      </SidebarHeader>
      <SidebarContent>
        {navItems.map((group) => (
          <SidebarGroup key={group.group}>
            <SidebarGroupLabel>{group.group}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => (
                  <PermissionGate key={item.title} module={item.module} action={item.action} anyOf={item.anyOf} alwaysVisible={item.alwaysVisible}>
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
  );
}
