'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { DataTable } from '@/components/ui/DataTable';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Button } from '@/components/ui/button';
import { AppFormField } from '@/components/ui/AppFormField';
import { FormSheet } from '@/components/ui/FormSheet';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';

import { useBrands, Brand } from '@/lib/hooks/useBrands';
import { useMasters, useCreateMaster, Master } from '@/lib/hooks/useMasters';

const addMasterSchema = z.object({
  key: z.string().min(1, 'Key is required'),
  label: z.string().min(1, 'Name is required'),
});
type AddMasterValues = z.infer<typeof addMasterSchema>;

function AddMasterEntryForm({ masterType, onClose }: { masterType: 'BRAND' | 'PRODUCT_TYPE'; onClose: () => void }) {
  const createMaster = useCreateMaster();
  const { register, handleSubmit, formState: { errors } } = useForm<AddMasterValues>({ resolver: zodResolver(addMasterSchema) });

  const onSubmit = (values: AddMasterValues) => {
    createMaster.mutate({ masterType, ...values }, { onSuccess: onClose });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <AppFormField label="System Key" placeholder="e.g. LG" error={errors.key?.message} {...register('key')} />
      <AppFormField label="Display Name" placeholder="e.g. LG" error={errors.label?.message} {...register('label')} />
      {createMaster.isError && <p className="text-sm text-destructive">Failed to create entry.</p>}
      <Button type="submit" className="w-full" disabled={createMaster.isPending}>
        {createMaster.isPending ? 'Adding...' : 'Add'}
      </Button>
    </form>
  );
}

export default function BrandsPage() {
  const { data: brandsData, isLoading: loadingBrands } = useBrands();
  const { data: productTypes, isLoading: loadingProductTypes } = useMasters(['PRODUCT_TYPE']);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Brands & Product Types</h1>
        <p className="text-muted-foreground">Manage the appliance catalog hierarchy.</p>
      </div>

      <Tabs defaultValue="brands" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="brands">Brands</TabsTrigger>
          <TabsTrigger value="product-types">Product Types</TabsTrigger>
        </TabsList>

        <TabsContent value="brands">
          <Card>
            <CardContent className="pt-6 space-y-4">
              <div className="flex justify-end">
                <FormSheet triggerLabel="Add Brand" title="Add Brand" description="Register a new appliance brand.">
                  {(close) => <AddMasterEntryForm masterType="BRAND" onClose={close} />}
                </FormSheet>
              </div>
              {loadingBrands ? (
                <div className="text-center text-muted-foreground p-8">Loading brands...</div>
              ) : (
                <DataTable<Brand>
                  data={brandsData || []}
                  pageSize={10}
                  columns={[
                    { key: 'name', header: 'Brand Name' },
                    { key: 'key', header: 'System Key' },
                    {
                      key: 'status',
                      header: 'Status',
                      render: (item) => <StatusBadge label={item.status} category={item.status === 'Active' ? 'success' : 'default'} />,
                    },
                  ]}
                />
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="product-types">
          <Card>
            <CardContent className="pt-6 space-y-4">
              <div className="flex justify-end">
                <FormSheet triggerLabel="Add Product Type" title="Add Product Type" description="Register a new appliance/product type.">
                  {(close) => <AddMasterEntryForm masterType="PRODUCT_TYPE" onClose={close} />}
                </FormSheet>
              </div>
              {loadingProductTypes ? (
                <div className="text-center text-muted-foreground p-8">Loading product types...</div>
              ) : (
                <DataTable<Master>
                  data={productTypes || []}
                  pageSize={10}
                  columns={[
                    { key: 'label', header: 'Product Type' },
                    { key: 'key', header: 'System Key' },
                    {
                      key: 'active',
                      header: 'Status',
                      render: (item) => <StatusBadge label={item.active ? 'Active' : 'Inactive'} category={item.active ? 'success' : 'default'} />,
                    },
                  ]}
                />
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
