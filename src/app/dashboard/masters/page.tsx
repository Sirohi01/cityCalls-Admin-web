'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { DataTable } from '@/components/ui/DataTable';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Button } from '@/components/ui/button';
import { AppFormField } from '@/components/ui/AppFormField';
import { FormSheet } from '@/components/ui/FormSheet';

import { useMasters, useCreateMaster, Master } from '@/lib/hooks/useMasters';

const MASTER_TYPES = ['SERVICE_CATEGORY', 'BRAND', 'PRODUCT_TYPE', 'SYMPTOM', 'DEFECT', 'SOLUTION', 'PART', 'UNIT', 'TAX_RATE', 'PRIORITY', 'LEAD_SOURCE', 'CALL_TYPE', 'APPOINTMENT_SLOT', 'PAYMENT_METHOD'];

const createMasterSchema = z.object({
  masterType: z.string().min(1, 'Select a master type'),
  key: z.string().min(1, 'Key is required'),
  label: z.string().min(1, 'Label is required'),
});
type CreateMasterValues = z.infer<typeof createMasterSchema>;

function AddMasterForm({ onClose }: { onClose: () => void }) {
  const createMaster = useCreateMaster();
  const { register, handleSubmit, formState: { errors } } = useForm<CreateMasterValues>({ resolver: zodResolver(createMasterSchema) });

  const onSubmit = (values: CreateMasterValues) => {
    createMaster.mutate(values, { onSuccess: onClose });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-1.5">
        <label className="text-sm font-medium">Master Type</label>
        <select className="w-full h-9 rounded-md border border-input bg-transparent px-3 text-sm" {...register('masterType')}>
          <option value="">Select a type...</option>
          {MASTER_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
        </select>
        {errors.masterType && <p className="text-sm text-destructive">{errors.masterType.message}</p>}
      </div>
      <AppFormField label="System Key" placeholder="e.g. AC_LEAK" error={errors.key?.message} {...register('key')} />
      <AppFormField label="Display Label" placeholder="e.g. AC Gas Leak" error={errors.label?.message} {...register('label')} />
      {createMaster.isError && <p className="text-sm text-destructive">{createMaster.error.response?.data?.message ?? 'Failed to create master.'}</p>}
      <Button type="submit" className="w-full" disabled={createMaster.isPending}>
        {createMaster.isPending ? 'Creating...' : 'Add Master'}
      </Button>
    </form>
  );
}

export default function MastersPage() {
  const { data: masters, isLoading, isError } = useMasters(['SYMPTOM', 'DEFECT', 'SOLUTION']);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Masters Configuration</h1>
          <p className="text-muted-foreground">Manage generic system masters (Symptoms, Defects, etc).</p>
        </div>
        <FormSheet triggerLabel="Add Master" title="Add Master Entry" description="Create a new master-list entry.">
          {(close) => <AddMasterForm onClose={close} />}
        </FormSheet>
      </div>

      {isLoading ? (
        <div className="flex justify-center p-8 text-muted-foreground">Loading masters...</div>
      ) : isError ? (
        <div className="flex justify-center p-8 text-destructive">Failed to load masters.</div>
      ) : (
        <DataTable<Master>
          data={masters || []}
          columns={[
            { key: 'masterType', header: 'Master Type' },
            { key: 'label', header: 'Name' },
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
  );
}
