'use client';

import { use, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { MediaGallery } from '@/components/media/MediaGallery';

import { useCatalogService, useUpdateCatalogService } from '@/lib/hooks/useCatalogServices';
import { useMasters } from '@/lib/hooks/useMasters';

export default function ServiceDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id } = use(params);
  const { data: service, isLoading, isError } = useCatalogService(id);
  const { data: categories } = useMasters(['SERVICE_CATEGORY']);
  const { data: symptoms } = useMasters(['SYMPTOM']);
  const updateService = useUpdateCatalogService(id);
  const [addingSymptom, setAddingSymptom] = useState('');

  if (isLoading) return <div className="p-8 text-center text-muted-foreground">Loading service...</div>;
  if (isError || !service) return <div className="p-8 text-center text-destructive">Failed to load service.</div>;

  const categoryLabel = categories?.find((c) => c._id === service.categoryId)?.label ?? 'N/A';
  const linkedSymptoms = symptoms?.filter((s) => service.symptomIds?.includes(s._id)) ?? [];
  const unlinkedSymptoms = symptoms?.filter((s) => !service.symptomIds?.includes(s._id)) ?? [];

  const removeSymptom = (symptomId: string) => {
    updateService.mutate({ symptomIds: (service.symptomIds ?? []).filter((sid) => sid !== symptomId) });
  };

  const addSymptom = () => {
    if (!addingSymptom) return;
    updateService.mutate({ symptomIds: [...(service.symptomIds ?? []), addingSymptom] }, { onSuccess: () => setAddingSymptom('') });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{service.name}</h1>
          <p className="text-muted-foreground">Manage service configuration and pricing.</p>
        </div>
        <div className="ml-auto flex items-center gap-3">
          <StatusBadge label={service.active ? 'Active' : 'Inactive'} category={service.active ? 'success' : 'default'} />
          <Button
            size="sm"
            variant={service.active ? 'outline' : 'default'}
            onClick={() => updateService.mutate({ active: !service.active })}
            disabled={updateService.isPending}
          >
            {service.active ? 'Deactivate' : 'Activate'}
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Service Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-y-4 text-sm">
              <span className="text-muted-foreground">Name:</span>
              <span className="font-medium">{service.name}</span>
              <span className="text-muted-foreground">Category:</span>
              <span className="font-medium">{categoryLabel}</span>
              <span className="text-muted-foreground">Base Price:</span>
              <span className="font-medium">₹{(service.pricing?.basePrice ?? 0).toLocaleString('en-IN')}</span>
              <span className="text-muted-foreground">Warranty:</span>
              <span className="font-medium">{service.warrantyPeriodDays ?? 0} days</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Linked Symptoms</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              {linkedSymptoms.map((s) => (
                <li key={s._id} className="flex items-center justify-between border-b pb-2">
                  <span>{s.label}</span>
                  <Button variant="ghost" size="sm" className="text-destructive h-6" onClick={() => removeSymptom(s._id)} disabled={updateService.isPending}>
                    Remove
                  </Button>
                </li>
              ))}
              {linkedSymptoms.length === 0 && <p className="text-muted-foreground text-sm">No symptoms linked yet.</p>}
            </ul>
            <div className="pt-4 flex gap-2">
              <select className="flex-1 h-9 rounded-md border border-input bg-transparent px-3 text-sm" value={addingSymptom} onChange={(e) => setAddingSymptom(e.target.value)}>
                <option value="">Select a symptom...</option>
                {unlinkedSymptoms.map((s) => <option key={s._id} value={s._id}>{s.label}</option>)}
              </select>
              <Button variant="outline" onClick={addSymptom} disabled={!addingSymptom || updateService.isPending}>Link</Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <MediaGallery entityType="SERVICE" entityId={id} />
    </div>
  );
}
