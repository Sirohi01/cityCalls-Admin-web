'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { DataTable } from '@/components/ui/DataTable';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Button } from '@/components/ui/button';

import { useCustomers } from '@/lib/hooks/useCustomers';

export default function CustomersPage() {
  const router = useRouter();
  const { data: customers, isLoading, isError } = useCustomers();


  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Customers</h1>
          <p className="text-muted-foreground">Manage customer profiles and history.</p>
        </div>
        <Button render={<Link href="/dashboard/customers/create" />}>
          Add Customer
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center p-8 text-muted-foreground">Loading customers...</div>
      ) : isError ? (
        <div className="flex justify-center p-8 text-destructive">Failed to load customers.</div>
      ) : (
        <DataTable 
          data={customers || []}
          onRowClick={(item) => router.push(`/dashboard/customers/${item.id}`)}
          columns={[
            { key: 'name', header: 'Name' },
            { 
              key: 'mobile', 
              header: 'Mobile',
              render: (item) => item.contacts?.[0]?.mobile || 'N/A'
            },
            { 
              key: 'city', 
              header: 'City',
              render: (item) => item.addresses?.[0]?.city || 'N/A'
            },
            { key: 'customerType', header: 'Type' },
            { 
              key: 'createdAt', 
              header: 'Created At',
              render: (item) => new Date(item.createdAt).toLocaleDateString()
            }
          ]}
        />
      )}
    </div>
  );
}
