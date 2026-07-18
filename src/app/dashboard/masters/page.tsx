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
import { Pencil } from 'lucide-react';

import { useMasters, useCreateMaster, useUpdateMaster, Master } from '@/lib/hooks/useMasters';

const MASTER_TYPES = ['SERVICE_CATEGORY', 'BRAND', 'PRODUCT_TYPE', 'SYMPTOM', 'DEFECT', 'SOLUTION', 'PART', 'UNIT', 'TAX_RATE', 'PRIORITY', 'LEAD_SOURCE', 'CALL_TYPE', 'APPOINTMENT_SLOT', 'PAYMENT_METHOD', 'CUSTOMER_TYPE'];

const MASTER_TYPE_LABELS: Record<string, string> = {
  SERVICE_CATEGORY: 'Service Categories',
  BRAND: 'Brands',
  PRODUCT_TYPE: 'Product Types',
  SYMPTOM: 'Symptoms',
  DEFECT: 'Defects',
  SOLUTION: 'Solutions',
  PART: 'Parts',
  UNIT: 'Units',
  TAX_RATE: 'Tax Rates',
  PRIORITY: 'Priorities',
  LEAD_SOURCE: 'Lead Sources',
  CALL_TYPE: 'Call Types',
  APPOINTMENT_SLOT: 'Appointment Slots',
  PAYMENT_METHOD: 'Payment Methods',
  CUSTOMER_TYPE: 'Customer Types',
};

const createMasterSchema = z.object({
  masterType: z.string().min(1, 'Select a master type'),
  key: z.string().min(1, 'Key is required'),
  label: z.string().min(1, 'Label is required'),
  parentId: z.string().optional(),
  sortOrder: z.number().optional(),
});
type CreateMasterValues = z.infer<typeof createMasterSchema>;

function AddMasterForm({ defaultType, siblings, onClose }: { defaultType: string; siblings: Master[]; onClose: () => void }) {
  const createMaster = useCreateMaster();
  const { register, handleSubmit, formState: { errors } } = useForm<CreateMasterValues>({
    resolver: zodResolver(createMasterSchema),
    defaultValues: { masterType: defaultType, sortOrder: 0 },
  });

  const onSubmit = (values: CreateMasterValues) => {
    createMaster.mutate({ ...values, parentId: values.parentId || undefined }, { onSuccess: onClose });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-1.5">
        <label className="text-sm font-medium">Master Type</label>
        <select className="w-full h-9 rounded-md border border-input bg-transparent px-3 text-sm" {...register('masterType')}>
          {MASTER_TYPES.map((t) => <option key={t} value={t}>{MASTER_TYPE_LABELS[t]}</option>)}
        </select>
        {errors.masterType && <p className="text-sm text-destructive">{errors.masterType.message}</p>}
      </div>
      <AppFormField label="System Key" placeholder="e.g. AC_LEAK" error={errors.key?.message} {...register('key')} />
      <AppFormField label="Display Label" placeholder="e.g. AC Gas Leak" error={errors.label?.message} {...register('label')} />
      <div className="space-y-1.5">
        <label className="text-sm font-medium">Parent Entry (Optional)</label>
        <select className="w-full h-9 rounded-md border border-input bg-transparent px-3 text-sm" {...register('parentId')}>
          <option value="">None</option>
          {siblings.map((s) => <option key={s._id} value={s._id}>{s.label}</option>)}
        </select>
      </div>
      <AppFormField label="Sort Order" type="number" {...register('sortOrder', { valueAsNumber: true })} />
      {createMaster.isError && <p className="text-sm text-destructive">{createMaster.error.response?.data?.message ?? 'Failed to create master.'}</p>}
      <Button type="submit" className="w-full" disabled={createMaster.isPending}>
        {createMaster.isPending ? 'Creating...' : 'Add Master'}
      </Button>
    </form>
  );
}

const editMasterSchema = z.object({
  label: z.string().min(1, 'Label is required'),
  parentId: z.string().optional(),
  sortOrder: z.number().optional(),
});
type EditMasterValues = z.infer<typeof editMasterSchema>;

function EditMasterForm({ master, siblings, onClose }: { master: Master; siblings: Master[]; onClose: () => void }) {
  const updateMaster = useUpdateMaster();
  const { register, handleSubmit, formState: { errors } } = useForm<EditMasterValues>({
    resolver: zodResolver(editMasterSchema),
    defaultValues: { label: master.label, parentId: master.parentId ?? '', sortOrder: master.sortOrder ?? 0 },
  });

  const onSubmit = (values: EditMasterValues) => {
    updateMaster.mutate(
      { masterType: master.masterType, id: master._id, ...values, parentId: values.parentId || undefined },
      { onSuccess: onClose }
    );
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <AppFormField label="System Key" value={master.key} disabled readOnly />
      <AppFormField label="Display Label" error={errors.label?.message} {...register('label')} />
      <div className="space-y-1.5">
        <label className="text-sm font-medium">Parent Entry (Optional)</label>
        <select className="w-full h-9 rounded-md border border-input bg-transparent px-3 text-sm" {...register('parentId')}>
          <option value="">None</option>
          {siblings.filter((s) => s._id !== master._id).map((s) => <option key={s._id} value={s._id}>{s.label}</option>)}
        </select>
      </div>
      <AppFormField label="Sort Order" type="number" {...register('sortOrder', { valueAsNumber: true })} />
      {updateMaster.isError && <p className="text-sm text-destructive">{updateMaster.error.response?.data?.message ?? 'Failed to update master.'}</p>}
      <Button type="submit" className="w-full" disabled={updateMaster.isPending}>
        {updateMaster.isPending ? 'Saving...' : 'Save Changes'}
      </Button>
    </form>
  );
}

export default function MastersPage() {
  const [selectedType, setSelectedType] = useState('SERVICE_CATEGORY');
  const { data: masters, isLoading, isError } = useMasters([selectedType]);
  const updateMaster = useUpdateMaster();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Masters Configuration</h1>
          <p className="text-muted-foreground">Manage system master lists — pick a type below to see only that list.</p>
        </div>
        <FormSheet triggerLabel="Add Master" title="Add Master Entry" description="Create a new master-list entry.">
          {(close) => <AddMasterForm defaultType={selectedType} siblings={masters || []} onClose={close} />}
        </FormSheet>
      </div>

      <div className="flex flex-wrap gap-2 border-b pb-4">
        {MASTER_TYPES.map((t) => (
          <button
            key={t}
            onClick={() => setSelectedType(t)}
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
              selectedType === t
                ? 'bg-primary text-primary-foreground'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            {MASTER_TYPE_LABELS[t]}
          </button>
        ))}
      </div>

      <div className="flex items-center gap-2">
        <h2 className="text-xl font-semibold">{MASTER_TYPE_LABELS[selectedType]}</h2>
        {!isLoading && !isError && <span className="text-sm text-muted-foreground">({masters?.length ?? 0} entries)</span>}
      </div>

      {isLoading ? (
        <div className="flex justify-center p-8 text-muted-foreground">Loading {MASTER_TYPE_LABELS[selectedType].toLowerCase()}...</div>
      ) : isError ? (
        <div className="flex justify-center p-8 text-destructive">Failed to load masters.</div>
      ) : (
        <DataTable<Master>
          data={masters || []}
          pageSize={10}
          emptyMessage={`No ${MASTER_TYPE_LABELS[selectedType].toLowerCase()} yet.`}
          columns={[
            { key: 'label', header: 'Name' },
            { key: 'key', header: 'System Key' },
            {
              key: 'active',
              header: 'Status',
              render: (item) => <StatusBadge label={item.active ? 'Active' : 'Inactive'} category={item.active ? 'success' : 'default'} />,
            },
            {
              key: 'actions',
              header: '',
              render: (item) => (
                <div className="flex items-center gap-1">
                  <FormSheet
                    triggerLabel="Edit"
                    title="Edit Master Entry"
                    description={`Update ${item.label}.`}
                    triggerElement={<Button size="sm" variant="ghost"><Pencil className="w-4 h-4" /></Button>}
                  >
                    {(close) => <EditMasterForm master={item} siblings={masters || []} onClose={close} />}
                  </FormSheet>
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={updateMaster.isPending}
                    onClick={() => updateMaster.mutate({ masterType: item.masterType, id: item._id, active: !item.active })}
                  >
                    {item.active ? 'Deactivate' : 'Activate'}
                  </Button>
                </div>
              ),
            },
          ]}
        />
      )}
    </div>
  );
}
