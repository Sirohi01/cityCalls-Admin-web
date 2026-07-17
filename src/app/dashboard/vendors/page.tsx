'use client';

import { useState } from 'react';
import { DataTable } from '@/components/ui/DataTable';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

import { useVendors } from '@/lib/hooks/useVendors';

export default function VendorsPage() {
  const { data: vendors, isLoading, isError } = useVendors();


  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Vendors</h1>
          <p className="text-muted-foreground">Manage third-party service agencies and partners.</p>
        </div>
        <Button>Onboard Vendor</Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Vendor Directory</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center p-8 text-muted-foreground">Loading vendors...</div>
          ) : isError ? (
            <div className="flex justify-center p-8 text-destructive">Failed to load vendors.</div>
          ) : (
            <DataTable 
              data={vendors || []}
              columns={[
                { key: 'name', header: 'Agency Name' },
                { key: 'contactPerson', header: 'Primary Contact' },
                { key: 'mobile', header: 'Mobile' },
                { 
                  key: 'areasServed', 
                  header: 'Service Region',
                  render: (item) => item.areasServed?.join(', ') || 'N/A'
                },
                { 
                  key: 'status', 
                  header: 'Status',
                  render: (item) => (
                    <StatusBadge 
                      label={item.status} 
                      category={item.status === 'ACTIVE' ? 'success' : 'error'} 
                    />
                  )
                },
              ]}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
