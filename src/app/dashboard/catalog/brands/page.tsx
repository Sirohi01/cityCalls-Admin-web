'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { DataTable } from '@/components/ui/DataTable';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Button } from '@/components/ui/button';
import { AppFormField } from '@/components/ui/AppFormField';
import { FormSheet } from '@/components/ui/FormSheet';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { MediaGallery } from '@/components/media/MediaGallery';

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
  const [selectedBrand, setSelectedBrand] = useState<Brand | null>(null);

  return (
    <div className="space-y-4">
      <div className="pb-1 mb-1.5 border-b border-border/50">
        <h1 className="text-lg font-medium tracking-tight text-foreground">Brands & Product Types</h1>
        <p className="text-[13px] text-muted-foreground">Manage the appliance catalog hierarchy.</p>
      </div>

      <Tabs defaultValue="brands" className="w-full">
        <div className="flex items-center justify-between ">
          <TabsList>
            <TabsTrigger value="brands">Brands</TabsTrigger>
            <TabsTrigger value="product-types">Product Types</TabsTrigger>
          </TabsList>
          <div>
            <TabsContent value="brands" className="m-0">
              <FormSheet triggerLabel="Add Brand" title="Add Brand" description="Register a new appliance brand.">
                {(close) => <AddMasterEntryForm masterType="BRAND" onClose={close} />}
              </FormSheet>
            </TabsContent>
            <TabsContent value="product-types" className="m-0">
              <FormSheet triggerLabel="Add Product Type" title="Add Product Type" description="Register a new appliance/product type.">
                {(close) => <AddMasterEntryForm masterType="PRODUCT_TYPE" onClose={close} />}
              </FormSheet>
            </TabsContent>
          </div>
        </div>

        <TabsContent value="brands">
          <div className="pt-2 space-y-4">
            {loadingBrands ? (
              <div className="text-center text-muted-foreground p-8">Loading brands...</div>
            ) : (
              <DataTable<Brand>
                data={brandsData || []}
                pageSize={10}
                onRowClick={(item) => setSelectedBrand(item)}
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
            <p className="text-xs text-muted-foreground">Click a brand to manage its photos and videos.</p>
          </div>
        </TabsContent>

        <TabsContent value="product-types">
          <div className="pt-2 space-y-4">
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
          </div>
        </TabsContent>
      </Tabs>

      <Sheet open={!!selectedBrand} onOpenChange={(open) => !open && setSelectedBrand(null)}>
        <SheetContent className="overflow-y-auto">
          <SheetHeader>
            <SheetTitle>{selectedBrand?.name}</SheetTitle>
            <SheetDescription>Photos and videos for this brand.</SheetDescription>
          </SheetHeader>
          <div className="flex-1 px-4 pb-4">
            {selectedBrand && <MediaGallery entityType="MASTER" entityId={selectedBrand.id} title="Brand Media" />}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
