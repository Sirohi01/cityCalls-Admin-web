'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, Controller } from 'react-hook-form';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

import { useCreateServiceRequest } from '@/lib/hooks/useServiceRequests';
import { useCustomers } from '@/lib/hooks/useCustomers';
import { useCatalogServices } from '@/lib/hooks/useCatalogServices';

interface FormValues {
  customerId: string;
  addressIndex: string;
  serviceId: string;
  priority: 'LOW' | 'NORMAL' | 'HIGH' | 'URGENT';
  symptoms: string;
}

export default function CreateServiceRequestPage() {
  const router = useRouter();
  const createReq = useCreateServiceRequest();
  const { data: customers } = useCustomers();
  const { data: services } = useCatalogServices();
  const [selectedCustomerId, setSelectedCustomerId] = useState('');

  const { register, handleSubmit, control, watch, formState: { errors } } = useForm<FormValues>({
    defaultValues: { priority: 'NORMAL' },
  });

  const customerId = watch('customerId');
  const selectedCustomer = customers?.find((c) => c._id === (customerId || selectedCustomerId));

  const onSubmit = (data: FormValues) => {
    const address = selectedCustomer?.addresses[Number(data.addressIndex)];
    // The dropdown only lists addresses that already have a line1 (see the
    // note above the select), so this is always true in practice here —
    // just narrowing the type, not a real runtime fallback.
    if (!selectedCustomer || !address || !address.line1) return;

    createReq.mutate(
      {
        customerId: selectedCustomer._id,
        serviceId: data.serviceId,
        source: 'CALL',
        priority: data.priority,
        symptoms: data.symptoms ? [data.symptoms] : [],
        addressSnapshot: {
          line1: address.line1,
          line2: address.line2,
          landmark: address.landmark,
          city: address.city,
          state: address.state,
          pinCode: address.pinCode,
          country: address.country || 'India',
        },
      },
      {
        onSuccess: () => router.push('/dashboard/service-requests'),
      }
    );
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Create Service Request</h1>
          <p className="text-muted-foreground">Log a new ticket for a customer.</p>
        </div>
        <Button variant="outline" onClick={() => router.back()}>Cancel</Button>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Customer &amp; Address</CardTitle>
            <CardDescription>Select the customer and the service address.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-1.5">
                <label className="text-sm font-medium">Select Customer</label>
                <Controller
                  control={control}
                  name="customerId"
                  rules={{ required: 'Select a customer' }}
                  render={({ field }) => (
                    <select
                      className="w-full h-9 rounded-md border border-input bg-transparent px-3 text-sm"
                      value={field.value ?? ''}
                      onChange={(e) => {
                        field.onChange(e.target.value);
                        setSelectedCustomerId(e.target.value);
                      }}
                    >
                      <option value="">Search customer...</option>
                      {(customers || []).map((c) => (
                        <option key={c._id} value={c._id}>
                          {c.name} ({c.contacts.find((ct) => ct.isPrimary)?.mobile ?? c.contacts[0]?.mobile})
                        </option>
                      ))}
                    </select>
                  )}
                />
                {errors.customerId && <p className="text-sm text-destructive">{errors.customerId.message}</p>}
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium">Select Address</label>
                <select className="w-full h-9 rounded-md border border-input bg-transparent px-3 text-sm" {...register('addressIndex', { required: 'Select an address' })} disabled={!selectedCustomer}>
                  <option value="">{selectedCustomer ? 'Choose registered address...' : 'Select a customer first'}</option>
                  {(selectedCustomer?.addresses || []).map((addr, i) =>
                    // A service request needs a real street line to dispatch a
                    // technician to — addresses saved from a pincode-only check
                    // (city/state known, no line1 yet) aren't usable here until
                    // completed on the customer's profile.
                    addr.line1 ? (
                      <option key={addr._id ?? i} value={i}>
                        {[addr.line1, addr.city, addr.pinCode].filter(Boolean).join(', ')}
                      </option>
                    ) : null
                  )}
                </select>
                {errors.addressIndex && <p className="text-sm text-destructive">{errors.addressIndex.message}</p>}
                {selectedCustomer && selectedCustomer.addresses.length > 0 && selectedCustomer.addresses.every((a) => !a.line1) && (
                  <p className="text-xs text-amber-600">
                    This customer&apos;s saved address(es) don&apos;t have a street line yet — add one from their profile before creating a service request.
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6 pt-4 border-t">
              <div className="space-y-1.5">
                <label className="text-sm font-medium">Service Type</label>
                <select className="w-full h-9 rounded-md border border-input bg-transparent px-3 text-sm" {...register('serviceId', { required: 'Select a service' })}>
                  <option value="">Select a service...</option>
                  {(services || []).map((s) => (
                    <option key={s._id} value={s._id}>{s.name}</option>
                  ))}
                </select>
                {errors.serviceId && <p className="text-sm text-destructive">{errors.serviceId.message}</p>}
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium">Priority</label>
                <select className="w-full h-9 rounded-md border border-input bg-transparent px-3 text-sm" {...register('priority')}>
                  <option value="LOW">Low</option>
                  <option value="NORMAL">Normal</option>
                  <option value="HIGH">High</option>
                  <option value="URGENT">Urgent</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Request Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none">Symptoms / Issue Description</label>
              <textarea
                {...register('symptoms')}
                className="flex min-h-[120px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                placeholder="Describe the issue reported by the customer..."
              />
            </div>
            {createReq.isError && (
              <p className="text-sm text-destructive">{createReq.error.response?.data?.message ?? 'Failed to create service request.'}</p>
            )}
          </CardContent>
          <CardFooter className="flex justify-end gap-2 bg-muted/50 p-6">
            <Button type="button" variant="outline" onClick={() => router.back()}>Cancel</Button>
            <Button type="submit" disabled={createReq.isPending}>
              {createReq.isPending ? 'Creating...' : 'Create Request'}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
}
