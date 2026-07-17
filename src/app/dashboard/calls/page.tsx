'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { DataTable } from '@/components/ui/DataTable';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Button } from '@/components/ui/button';

import { useCalls } from '@/lib/hooks/useCalls';

export default function CallsPage() {
  const router = useRouter();
  const { data: calls, isLoading, isError } = useCalls();


  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Call Logs</h1>
          <p className="text-muted-foreground">View and manage history of incoming and outgoing calls.</p>
        </div>
        <Button render={<Link href="/dashboard/calls/entry" />}>
          Log New Call
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center p-8 text-muted-foreground">Loading calls...</div>
      ) : isError ? (
        <div className="flex justify-center p-8 text-destructive">Failed to load calls.</div>
      ) : (
        <DataTable 
          data={calls || []}
          onRowClick={(item) => router.push(`/dashboard/calls/${item.id}`)}
          columns={[
            { key: 'mobile', header: 'Phone Number' },
            { 
              key: 'customerName', 
              header: 'Customer',
              render: (item) => item.customerName || 'Unknown'
            },
            { 
              key: 'callType', 
              header: 'Direction',
              render: (item) => (
                <StatusBadge 
                  label={item.callType} 
                  category={item.callType === 'INBOUND' ? 'info' : 'default'} 
                />
              )
            },
            { 
              key: 'category', 
              header: 'Disposition',
              render: (item) => (
                <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-800">
                  {item.category?.name || 'Uncategorized'}
                </span>
              )
            },
            { 
              key: 'createdAt', 
              header: 'Date & Time',
              render: (item) => new Date(item.createdAt).toLocaleString()
            },
          ]}
        />
      )}
    </div>
  );
}
