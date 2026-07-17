'use client';

import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AppFormField } from '@/components/ui/AppFormField';

export default function CreateServicePage() {
  const router = useRouter();

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Add Service</h1>
          <p className="text-muted-foreground">Define a new service for the catalog.</p>
        </div>
        <Button variant="outline" onClick={() => router.back()}>Cancel</Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Service Details</CardTitle>
          <CardDescription>Enter the service name, pricing, and category.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <AppFormField label="Service Name" placeholder="e.g. AC Gas Refill" />
          <div className="grid grid-cols-2 gap-4">
            <AppFormField label="Category" placeholder="e.g. HVAC" />
            <AppFormField label="Base Price (₹)" type="number" placeholder="499" />
          </div>
          <AppFormField label="Description (Optional)" placeholder="Short description of the service" />
        </CardContent>
        <CardFooter className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => router.back()}>Cancel</Button>
          <Button onClick={() => router.push('/dashboard/catalog/services')}>Save Service</Button>
        </CardFooter>
      </Card>
    </div>
  );
}
