'use client';

import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AppFormField } from '@/components/ui/AppFormField';
import { useCreateCatalogService } from '@/lib/hooks/useCatalogServices';
import { useMasters } from '@/lib/hooks/useMasters';

const createServiceSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  categoryId: z.string().min(1, 'Select a category'),
  basePrice: z.number().min(0),
});
type CreateServiceValues = z.infer<typeof createServiceSchema>;

export default function CreateServicePage() {
  const router = useRouter();
  const createService = useCreateCatalogService();
  const { data: categories } = useMasters(['SERVICE_CATEGORY']);
  const { register, handleSubmit, formState: { errors } } = useForm<CreateServiceValues>({ resolver: zodResolver(createServiceSchema) });

  const onSubmit = (values: CreateServiceValues) => {
    createService.mutate(
      { name: values.name, categoryId: values.categoryId, pricing: { basePrice: values.basePrice } },
      { onSuccess: () => router.push('/dashboard/catalog/services') }
    );
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Add Service</h1>
          <p className="text-muted-foreground">Define a new service for the catalog.</p>
        </div>
        <Button variant="outline" onClick={() => router.back()}>Cancel</Button>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Card>
          <CardHeader>
            <CardTitle>Service Details</CardTitle>
            <CardDescription>Enter the service name, pricing, and category.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <AppFormField label="Service Name" placeholder="e.g. AC Gas Refill" error={errors.name?.message} {...register('name')} />
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-sm font-medium">Category</label>
                <select className="w-full h-9 rounded-md border border-input bg-transparent px-3 text-sm" {...register('categoryId')}>
                  <option value="">Select a category...</option>
                  {(categories || []).map((c) => <option key={c._id} value={c._id}>{c.label}</option>)}
                </select>
                {errors.categoryId && <p className="text-sm text-destructive">{errors.categoryId.message}</p>}
              </div>
              <AppFormField label="Base Price (₹)" type="number" placeholder="499" error={errors.basePrice?.message} {...register('basePrice', { valueAsNumber: true })} />
            </div>
            {createService.isError && (
              <p className="text-sm text-destructive">{createService.error.response?.data?.message ?? 'Failed to create service.'}</p>
            )}
          </CardContent>
          <CardFooter className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => router.back()}>Cancel</Button>
            <Button type="submit" disabled={createService.isPending}>
              {createService.isPending ? 'Saving...' : 'Save Service'}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
}
