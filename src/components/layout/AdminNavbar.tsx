'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { LogOut } from 'lucide-react';
import { clearSession, useMe } from '@/lib/hooks/useAuth';

export function AdminNavbar() {
  const router = useRouter();
  const { data: me } = useMe();

  const handleLogout = () => {
    clearSession();
    router.push('/login');
  };

  return (
    <header className="h-12 flex items-center gap-4 px-6 border-b bg-white sticky top-0 z-10">
      <SidebarTrigger />
      <div className="ml-auto flex items-center space-x-4">
        <span className="text-sm font-medium">{me?.email ?? me?.name ?? me?.mobile ?? ''}</span>
        <button onClick={handleLogout} className="p-2 text-slate-500 hover:text-red-600 transition-colors bg-slate-100 hover:bg-red-50 rounded-md" title="Logout">
          <LogOut className="w-5 h-5" />
        </button>
      </div>
    </header>
  );
}
