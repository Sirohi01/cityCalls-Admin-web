'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { DataTable } from '@/components/ui/DataTable';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AppFormField } from '@/components/ui/AppFormField';
import { FormSheet } from '@/components/ui/FormSheet';

import { useVendors, useCreateVendor, Vendor } from '@/lib/hooks/useVendors';

const createVendorSchema = z.object({
  companyName: z.string().min(2, 'Company name is required'),
  contactName: z.string().min(1, 'Contact name is required'),
  contactMobile: z.string().min(10, 'Enter a valid mobile number'),
});
type CreateVendorValues = z.infer<typeof createVendorSchema>;

function OnboardVendorForm({ onClose }: { onClose: () => void }) {
  const createVendor = useCreateVendor();
  const { register, handleSubmit, formState: { errors } } = useForm<CreateVendorValues>({ resolver: zodResolver(createVendorSchema) });

  const onSubmit = (values: CreateVendorValues) => {
    createVendor.mutate(
      { companyName: values.companyName, contactPersons: [{ name: values.contactName, mobile: values.contactMobile }] },
      { onSuccess: onClose }
    );
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <AppFormField label="Company / Agency Name" error={errors.companyName?.message} {...register('companyName')} />
      <AppFormField label="Primary Contact Name" error={errors.contactName?.message} {...register('contactName')} />
      <AppFormField label="Primary Contact Mobile" error={errors.contactMobile?.message} {...register('contactMobile')} />
      {createVendor.isError && <p className="text-sm text-destructive">{createVendor.error.response?.data?.message ?? 'Failed to onboard vendor.'}</p>}
      <Button type="submit" className="w-full" disabled={createVendor.isPending}>
        {createVendor.isPending ? 'Onboarding...' : 'Onboard Vendor'}
      </Button>
    </form>
  );
}

export default function VendorsPage() {
  const { data: vendors, isLoading, isError } = useVendors();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Vendors</h1>
          <p className="text-muted-foreground">Manage third-party service agencies and partners.</p>
        </div>
        <FormSheet triggerLabel="Onboard Vendor" title="Onboard Vendor" description="Register a new vendor company.">
          {(close) => <OnboardVendorForm onClose={close} />}
        </FormSheet>
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
            <DataTable<Vendor>
              data={vendors || []}
              columns={[
                { key: 'companyName', header: 'Agency Name' },
                { key: 'contactPersons', header: 'Primary Contact', render: (item) => item.contactPersons?.[0]?.name || 'N/A' },
                { key: 'mobile', header: 'Mobile', render: (item) => item.contactPersons?.[0]?.mobile || 'N/A' },
                { key: 'serviceAreas', header: 'Pin Codes Served', render: (item) => item.serviceAreas?.pinCodes?.join(', ') || 'N/A' },
                {
                  key: 'active',
                  header: 'Status',
                  render: (item) => (
                    <StatusBadge
                      label={item.blacklisted ? 'BLACKLISTED' : item.active ? 'ACTIVE' : 'INACTIVE'}
                      category={item.blacklisted ? 'error' : item.active ? 'success' : 'default'}
                    />
                  ),
                },
              ]}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
