'use client';

import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AppFormField } from '@/components/ui/AppFormField';

export default function CreateCustomerPage() {
  const router = useRouter();

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Add Customer</h1>
          <p className="text-muted-foreground">Create a new customer profile.</p>
        </div>
        <Button variant="outline" onClick={() => router.back()}>Cancel</Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Customer Details</CardTitle>
          <CardDescription>Enter the primary contact information.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <AppFormField label="Full Name" placeholder="e.g. Ramesh Singh" />
            <AppFormField label="Mobile Number" placeholder="e.g. 9876543210" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <AppFormField label="Email Address (Optional)" placeholder="e.g. ramesh@example.com" />
            <AppFormField label="Customer Type" placeholder="Residential / Commercial" />
          </div>
          <AppFormField label="City" placeholder="e.g. Delhi" />
        </CardContent>
        <CardFooter className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => router.back()}>Cancel</Button>
          <Button onClick={() => router.push('/dashboard/customers')}>Save Customer</Button>
        </CardFooter>
      </Card>
    </div>
  );
}
