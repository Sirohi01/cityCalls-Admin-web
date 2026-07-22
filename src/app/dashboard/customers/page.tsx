'use client';

import { Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { DataTable } from '@/components/ui/DataTable';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

import { useCustomers, Customer } from '@/lib/hooks/useCustomers';
import { useMasters } from '@/lib/hooks/useMasters';

export default function CustomersPage() {
  return (
    <Suspense>
      <CustomersPageContent />
    </Suspense>
  );
}

function CustomersPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const vertical = searchParams.get('vertical') ?? undefined;
  const { data: customers, isLoading, isError } = useCustomers({ vertical });
  const { data: customerTypes } = useMasters(['CUSTOMER_TYPE']);
  const customerTypeLabel = (key: string) => customerTypes?.find((t) => t.key === key)?.label ?? key;


  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between pb-1 mb-1.5 border-b border-border/50">
        <div>
          <h1 className="text-lg font-medium tracking-tight text-foreground">{vertical === 'BEAUTY' ? 'Beauty & Salon Customers' : 'Customers'}</h1>
          <p className="text-[13px] text-muted-foreground">Manage customer profiles and history.</p>
        </div>
        <Button size="sm" render={<Link href="/dashboard/customers/create" />}>
          Add Customer
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center p-8 text-muted-foreground">Loading customers...</div>
      ) : isError ? (
        <div className="flex justify-center p-8 text-destructive">Failed to load customers.</div>
      ) : (
        <>
          {/* <p className="text-sm text-muted-foreground">{customers?.length ?? 0} customers</p> */}
          <DataTable<Customer>
          data={customers || []}
          pageSize={10}
          onRowClick={(item) => router.push(`/dashboard/customers/${item._id}`)}
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
            { key: 'customerType', header: 'Type', render: (item) => customerTypeLabel(item.customerType) },
            {
              key: 'createdAt',
              header: 'Created At',
              render: (item) => new Date(item.createdAt).toLocaleDateString()
            }
          ]}
          />
        </>
      )}
    </div>
  );
}
