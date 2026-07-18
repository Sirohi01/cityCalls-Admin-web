'use client';

import { use } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AppFormField } from '@/components/ui/AppFormField';
import { FormSheet } from '@/components/ui/FormSheet';
import { ArrowLeft } from 'lucide-react';

import { useCustomer, useAddCustomerAddress, useCustomerProducts, useAddCustomerProduct } from '@/lib/hooks/useCustomers';
import { useMasters } from '@/lib/hooks/useMasters';

const addAddressSchema = z.object({
  line1: z.string().min(1, 'Address line is required'),
  city: z.string().min(1, 'City is required'),
  state: z.string().min(1, 'State is required'),
  pinCode: z.string().min(4, 'Pin code is required'),
});
type AddAddressValues = z.infer<typeof addAddressSchema>;

function AddAddressForm({ customerId, onClose }: { customerId: string; onClose: () => void }) {
  const addAddress = useAddCustomerAddress();
  const { register, handleSubmit, formState: { errors } } = useForm<AddAddressValues>({ resolver: zodResolver(addAddressSchema) });

  const onSubmit = (values: AddAddressValues) => {
    addAddress.mutate({ ...values, country: 'India', customerId }, { onSuccess: onClose });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <AppFormField label="Address Line 1" error={errors.line1?.message} {...register('line1')} />
      <AppFormField label="City" error={errors.city?.message} {...register('city')} />
      <AppFormField label="State" error={errors.state?.message} {...register('state')} />
      <AppFormField label="Pin Code" error={errors.pinCode?.message} {...register('pinCode')} />
      {addAddress.isError && <p className="text-sm text-destructive">Failed to add address.</p>}
      <Button type="submit" className="w-full" disabled={addAddress.isPending}>
        {addAddress.isPending ? 'Adding...' : 'Add Address'}
      </Button>
    </form>
  );
}

const addProductSchema = z.object({
  brandId: z.string().min(1, 'Select a brand'),
  productTypeId: z.string().min(1, 'Select a product type'),
  modelNumber: z.string().optional(),
  serialNumber: z.string().optional(),
});
type AddProductValues = z.infer<typeof addProductSchema>;

function AddApplianceForm({ customerId, onClose }: { customerId: string; onClose: () => void }) {
  const addProduct = useAddCustomerProduct();
  const { data: masters } = useMasters(['BRAND', 'PRODUCT_TYPE']);
  const brands = masters?.filter((m) => m.masterType === 'BRAND') || [];
  const productTypes = masters?.filter((m) => m.masterType === 'PRODUCT_TYPE') || [];
  const { register, handleSubmit, formState: { errors } } = useForm<AddProductValues>({ resolver: zodResolver(addProductSchema) });

  const onSubmit = (values: AddProductValues) => {
    addProduct.mutate({ ...values, customerId }, { onSuccess: onClose });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-1.5">
        <label className="text-sm font-medium">Brand</label>
        <select className="w-full h-9 rounded-md border border-input bg-transparent px-3 text-sm" {...register('brandId')}>
          <option value="">Select a brand...</option>
          {brands.map((b) => <option key={b._id} value={b._id}>{b.label}</option>)}
        </select>
        {errors.brandId && <p className="text-sm text-destructive">{errors.brandId.message}</p>}
      </div>
      <div className="space-y-1.5">
        <label className="text-sm font-medium">Product Type</label>
        <select className="w-full h-9 rounded-md border border-input bg-transparent px-3 text-sm" {...register('productTypeId')}>
          <option value="">Select a product type...</option>
          {productTypes.map((p) => <option key={p._id} value={p._id}>{p.label}</option>)}
        </select>
        {errors.productTypeId && <p className="text-sm text-destructive">{errors.productTypeId.message}</p>}
      </div>
      <AppFormField label="Model Number (Optional)" {...register('modelNumber')} />
      <AppFormField label="Serial Number (Optional)" {...register('serialNumber')} />
      {addProduct.isError && <p className="text-sm text-destructive">Failed to add appliance.</p>}
      <Button type="submit" className="w-full" disabled={addProduct.isPending}>
        {addProduct.isPending ? 'Adding...' : 'Add Appliance'}
      </Button>
    </form>
  );
}

export default function CustomerDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id } = use(params);
  const { data: customer, isLoading, isError } = useCustomer(id);
  const { data: products } = useCustomerProducts(id);
  const { data: masters } = useMasters(['BRAND', 'PRODUCT_TYPE', 'CUSTOMER_TYPE']);

  if (isLoading) return <div className="p-8 text-center text-muted-foreground">Loading customer details...</div>;
  if (isError || !customer) return <div className="p-8 text-center text-destructive">Failed to load customer details.</div>;

  const masterLabel = (masterId: string) => masters?.find((m) => m._id === masterId)?.label ?? masterId;
  const customerTypeLabel = (key: string) => masters?.find((m) => m.masterType === 'CUSTOMER_TYPE' && m.key === key)?.label ?? key;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{customer.name}</h1>
          <p className="text-muted-foreground">ID: {customer._id}</p>
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
              <span className="text-muted-foreground">Email:</span>
              <span className="font-medium">{customer.email || 'N/A'}</span>
              <span className="text-muted-foreground">Type:</span>
              <span className="font-medium">{customerTypeLabel(customer.customerType)}</span>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle>Addresses</CardTitle>
              <FormSheet triggerLabel="Add Address" title="Add Address" description={`New address for ${customer.name}.`}>
                {(close) => <AddAddressForm customerId={id} onClose={close} />}
              </FormSheet>
            </CardHeader>
            <CardContent className="space-y-4">
              {customer.addresses?.map((addr, idx) => (
                <div key={addr._id ?? idx} className="rounded-md border p-4 text-sm">
                  <p className="font-medium">Address {idx + 1}{addr.isDefault ? ' (Default)' : ''}</p>
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
              <FormSheet triggerLabel="Add Appliance" title="Add Appliance" description={`Register a product for ${customer.name}.`}>
                {(close) => <AddApplianceForm customerId={id} onClose={close} />}
              </FormSheet>
            </CardHeader>
            <CardContent className="space-y-4">
              {(products || []).map((p) => (
                <div key={p._id} className="rounded-md border p-4 text-sm">
                  <p className="font-medium">{masterLabel(p.brandId)} {masterLabel(p.productTypeId)}</p>
                  <p className="text-muted-foreground">
                    {p.serialNumber ? `Serial: ${p.serialNumber}` : 'No serial number'}
                    {p.warrantyExpiresAt ? ` | Warranty until: ${new Date(p.warrantyExpiresAt).toLocaleDateString()}` : ''}
                  </p>
                </div>
              ))}
              {(!products || products.length === 0) && (
                <p className="text-muted-foreground text-sm">No appliances registered.</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
