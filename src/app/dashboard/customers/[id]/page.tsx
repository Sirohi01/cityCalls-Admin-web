'use client';

import { use } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

import { useCustomer } from '@/lib/hooks/useCustomers';

export default function CustomerDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id } = use(params);
  const { data: customer, isLoading, isError } = useCustomer(id);

  if (isLoading) return <div className="p-8 text-center text-muted-foreground">Loading customer details...</div>;
  if (isError || !customer) return <div className="p-8 text-center text-destructive">Failed to load customer details.</div>;


  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{customer.name}</h1>
          <p className="text-muted-foreground">ID: {customer.id}</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Profile Overview</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="grid grid-cols-2 gap-2 text-sm">
              <span className="text-muted-foreground">Name:</span>
              <span className="font-medium">{customer.name}</span>
              <span className="text-muted-foreground">Mobile:</span>
              <span className="font-medium">{customer.contacts?.[0]?.mobile || 'N/A'}</span>
              <span className="text-muted-foreground">Type:</span>
              <span className="font-medium">{customer.customerType}</span>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle>Addresses</CardTitle>
              <Button size="sm" variant="outline">Add Address</Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {customer.addresses?.map((addr, idx) => (
                <div key={idx} className="rounded-md border p-4 text-sm relative group">
                  <Button variant="ghost" size="icon" className="absolute top-2 right-2 opacity-0 group-hover:opacity-100">
                    <span className="sr-only">Edit</span>
                    ✎
                  </Button>
                  <p className="font-medium">Address {idx + 1}</p>
                  <p className="text-muted-foreground">{[addr.line1, addr.city, addr.state, addr.pinCode].filter(Boolean).join(', ')}</p>
                </div>
              ))}
              {(!customer.addresses || customer.addresses.length === 0) && (
                <p className="text-muted-foreground text-sm">No addresses found.</p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle>Appliances / Products</CardTitle>
              <Button size="sm" variant="outline">Add Appliance</Button>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border p-4 text-sm relative group">
                <Button variant="ghost" size="icon" className="absolute top-2 right-2 opacity-0 group-hover:opacity-100">
                  <span className="sr-only">Edit</span>
                  ✎
                </Button>
                <p className="font-medium">LG Split AC (1.5 Ton)</p>
                <p className="text-muted-foreground">Serial: LG-AC-2023-9912 | Warranty: Out of Warranty</p>
                <p className="text-xs text-muted-foreground pt-2">Added on: 2026-07-15</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
