'use client';

import { Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { DataTable } from '@/components/ui/DataTable';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

import { useCatalogServices, CatalogService } from '@/lib/hooks/useCatalogServices';
import { useMasters } from '@/lib/hooks/useMasters';

export default function ServicesPage() {
  return (
    <Suspense>
      <ServicesPageContent />
    </Suspense>
  );
}

function ServicesPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const vertical = searchParams.get('vertical') ?? undefined;
  const { data: services, isLoading, isError } = useCatalogServices({ vertical });
  const { data: categories } = useMasters(['SERVICE_CATEGORY']);
  const categoryLabel = (id?: string) => categories?.find((c) => c._id === id)?.label ?? 'N/A';

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{vertical === 'BEAUTY' ? 'Beauty & Salon Services' : 'Services Catalog'}</h1>
          <p className="text-muted-foreground">Manage the list of services offered to customers.</p>
        </div>
        <Button render={<Link href="/dashboard/catalog/services/create" />}>
          Add Service
        </Button>
      </div>

      <Separator />

      {isLoading ? (
        <div className="flex justify-center p-8 text-muted-foreground">Loading services...</div>
      ) : isError ? (
        <div className="flex justify-center p-8 text-destructive">Failed to load services.</div>
      ) : (
        <>
        <p className="text-sm text-muted-foreground">{services?.length ?? 0} services</p>
        <DataTable<CatalogService>
          data={services || []}
          pageSize={10}
          onRowClick={(item) => router.push(`/dashboard/catalog/services/${item._id}`)}
          columns={[
            { key: 'name', header: 'Service Name' },
            { key: 'categoryId', header: 'Category', render: (item) => categoryLabel(item.categoryId) },
            { key: 'pricing', header: 'Base Price (₹)', render: (item) => (item.pricing?.basePrice ?? 0).toLocaleString('en-IN') },
            {
              key: 'active',
              header: 'Status',
              render: (item) => <StatusBadge label={item.active ? 'Active' : 'Inactive'} category={item.active ? 'success' : 'default'} />,
            },
          ]}
        />
        </>
      )}
    </div>
  );
}
