'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { DataTable } from '@/components/ui/DataTable';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Button } from '@/components/ui/button';

import { useCatalogServices } from '@/lib/hooks/useCatalogServices';

export default function ServicesPage() {
  const router = useRouter();
  const { data: services, isLoading, isError } = useCatalogServices();


  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Services Catalog</h1>
          <p className="text-muted-foreground">Manage the list of services offered to customers.</p>
        </div>
        <Button render={<Link href="/dashboard/catalog/services/create" />}>
          Add Service
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center p-8 text-muted-foreground">Loading services...</div>
      ) : isError ? (
        <div className="flex justify-center p-8 text-destructive">Failed to load services.</div>
      ) : (
        <DataTable 
          data={services || []}
          columns={[
            { key: 'name', header: 'Service Name' },
            { 
              key: 'categoryId', 
              header: 'Category',
              render: (item) => item.categoryId || 'N/A'
            },
            { key: 'basePrice', header: 'Base Price (₹)' },
            { 
              key: 'active', 
              header: 'Status',
              render: (item) => (
                <StatusBadge 
                  label={item.active ? 'Active' : 'Inactive'} 
                  category={item.active ? 'success' : 'default'} 
                />
              )
            }
          ]}
        />
      )}
    </div>
  );
}
