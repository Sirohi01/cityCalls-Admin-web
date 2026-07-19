'use client';

import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { AppFormField } from '@/components/ui/AppFormField';
import { useCreateCustomer } from '@/lib/hooks/useCustomers';
import { useMasters } from '@/lib/hooks/useMasters';
import { useCheckPincode, areaCityLabel } from '@/lib/hooks/useGeo';

const createCustomerSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  mobile: z.string().min(10, 'Enter a valid mobile number'),
  email: z.string().email('Enter a valid email').optional().or(z.literal('')),
  customerType: z.string().min(1, 'Select a customer type'),
  addressLine1: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  pinCode: z.string().optional(),
});
type CreateCustomerValues = z.infer<typeof createCustomerSchema>;

export default function CreateCustomerPage() {
  const router = useRouter();
  const createCustomer = useCreateCustomer();
  const { data: customerTypes } = useMasters(['CUSTOMER_TYPE']);
  const checkPincode = useCheckPincode();
  const { register, handleSubmit, setValue, formState: { errors } } = useForm<CreateCustomerValues>({
    resolver: zodResolver(createCustomerSchema),
    defaultValues: { customerType: 'RESIDENTIAL' },
  });

  const handlePincodeBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const pinCode = e.target.value.trim();
    if (pinCode.length < 6) return;
    checkPincode.mutate(pinCode, {
      onSuccess: (result) => {
        setValue('city', areaCityLabel(result));
        setValue('state', result.state ?? '');
      },
    });
  };

  const onSubmit = (values: CreateCustomerValues) => {
    // Street line is optional now — at minimum, city/state/pinCode resolved
    // from the pincode check is saved as a real address.
    const hasAddress = values.city && values.state && values.pinCode;
    createCustomer.mutate(
      {
        name: values.name,
        customerType: values.customerType,
        email: values.email || undefined,
        contacts: [{ name: values.name, mobile: values.mobile, isPrimary: true }],
        addresses: hasAddress
          ? [{ line1: values.addressLine1 || undefined, city: values.city!, state: values.state!, pinCode: values.pinCode!, country: 'India', isDefault: true }]
          : [],
      },
      { onSuccess: () => router.push('/dashboard/customers') }
    );
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Add Customer</h1>
          <p className="text-muted-foreground">Create a new customer profile.</p>
        </div>
        <Button variant="outline" onClick={() => router.back()}>Cancel</Button>
      </div>

      <Separator />

      <form onSubmit={handleSubmit(onSubmit)}>
        <Card>
          <CardHeader>
            <CardTitle>Customer Details</CardTitle>
            <CardDescription>Enter the primary contact information.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <AppFormField label="Full Name" placeholder="e.g. Ramesh Singh" error={errors.name?.message} {...register('name')} />
              <AppFormField label="Mobile Number" placeholder="e.g. 9876543210" error={errors.mobile?.message} {...register('mobile')} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <AppFormField label="Email Address (Optional)" placeholder="e.g. ramesh@example.com" error={errors.email?.message} {...register('email')} />
              <div className="space-y-1.5">
                <label className="text-sm font-medium">Customer Type</label>
                <select className="w-full h-9 rounded-md border border-input bg-transparent px-3 text-sm" {...register('customerType')}>
                  {customerTypes?.map((t) => (
                    <option key={t._id} value={t.key}>{t.label}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Address (Optional)</label>
              <p className="text-xs text-muted-foreground">Enter a pin code to auto-fill City/State, or leave all blank to skip the address for now.</p>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <AppFormField
                label="Pin Code"
                placeholder="e.g. 110001"
                {...register('pinCode', {
                  onBlur: handlePincodeBlur,
                })}
              />
              <AppFormField label="City" placeholder="Auto-filled from pin code" {...register('city')} />
              <AppFormField label="State" placeholder="Auto-filled from pin code" {...register('state')} />
            </div>
            {checkPincode.isPending && <p className="text-xs text-muted-foreground">Looking up City/State for this pin code...</p>}
            {checkPincode.isError && <p className="text-xs text-destructive">Couldn&apos;t look up this pin code — enter City/State manually.</p>}
            <AppFormField label="Address Line 1 (Optional)" placeholder="e.g. House No. 12, Sector 5" {...register('addressLine1')} />
            {createCustomer.isError && (
              <p className="text-sm text-destructive">{createCustomer.error.response?.data?.message ?? 'Failed to create customer.'}</p>
            )}
          </CardContent>
          <CardFooter className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => router.back()}>Cancel</Button>
            <Button type="submit" disabled={createCustomer.isPending}>
              {createCustomer.isPending ? 'Saving...' : 'Save Customer'}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
}
