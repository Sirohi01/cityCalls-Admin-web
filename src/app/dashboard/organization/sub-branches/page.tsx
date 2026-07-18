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
import { useSubBranches, useCreateSubBranch, useBranches, SubBranch } from '@/lib/hooks/useOrganization';

const createSubBranchSchema = z.object({
  branchId: z.string().min(1, 'Select a branch'),
  name: z.string().min(2, 'Name is required'),
  code: z.string().min(2, 'Code is required').max(10),
});
type CreateSubBranchValues = z.infer<typeof createSubBranchSchema>;

function AddSubBranchForm({ onClose }: { onClose: () => void }) {
  const createSubBranch = useCreateSubBranch();
  const { data: branches } = useBranches();
  const { register, handleSubmit, formState: { errors } } = useForm<CreateSubBranchValues>({
    resolver: zodResolver(createSubBranchSchema),
  });

  const onSubmit = (values: CreateSubBranchValues) => {
    createSubBranch.mutate(values, { onSuccess: onClose });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-1.5">
        <label className="text-sm font-medium">Parent Branch</label>
        <select className="w-full h-9 rounded-md border border-input bg-transparent px-3 text-sm" {...register('branchId')}>
          <option value="">Select a branch...</option>
          {(branches || []).map((b) => (
            <option key={b._id} value={b._id}>{b.name}</option>
          ))}
        </select>
        {errors.branchId && <p className="text-sm text-destructive">{errors.branchId.message}</p>}
      </div>
      <AppFormField label="Sub-Branch Name" placeholder="South Delhi Hub" error={errors.name?.message} {...register('name')} />
      <AppFormField label="Sub-Branch Code" placeholder="DEL01-S" error={errors.code?.message} {...register('code')} />
      {createSubBranch.isError && (
        <p className="text-sm text-destructive">{createSubBranch.error.response?.data?.message ?? 'Failed to create sub-branch.'}</p>
      )}
      <Button type="submit" className="w-full" disabled={createSubBranch.isPending}>
        {createSubBranch.isPending ? 'Creating...' : 'Create Sub-Branch'}
      </Button>
    </form>
  );
}

export default function SubBranchesPage() {
  const { data: branches } = useBranches();
  const [branchFilter, setBranchFilter] = useState('');
  const { data: subBranches, isLoading, isError } = useSubBranches(branchFilter || undefined);
  const branchName = (id: string) => branches?.find((b) => b._id === id)?.name ?? id;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Sub-Branches</h1>
          <p className="text-muted-foreground">Manage sub-branches under main branches.</p>
        </div>
        <FormSheet triggerLabel="Add Sub-Branch" title="Add Sub-Branch" description="Create a new sub-branch under a parent branch.">
          {(close) => <AddSubBranchForm onClose={close} />}
        </FormSheet>
      </div>

      <div className="flex items-center gap-2">
        <label className="text-sm font-medium text-slate-700">Filter by Parent Branch:</label>
        <select
          className="h-9 rounded-md border border-input bg-transparent px-3 text-sm"
          value={branchFilter}
          onChange={(e) => setBranchFilter(e.target.value)}
        >
          <option value="">All Branches</option>
          {(branches || []).map((b) => (
            <option key={b._id} value={b._id}>{b.name}</option>
          ))}
        </select>
      </div>

      {isLoading ? (
        <div className="flex justify-center p-8 text-muted-foreground">Loading sub-branches...</div>
      ) : isError ? (
        <div className="flex justify-center p-8 text-destructive">Failed to load sub-branches.</div>
      ) : (
        <>
          <p className="text-sm text-muted-foreground">{subBranches?.length ?? 0} sub-branches</p>
          <DataTable<SubBranch>
            data={subBranches || []}
            pageSize={10}
            columns={[
              { key: 'code', header: 'Code' },
              { key: 'branchId', header: 'Parent Branch', render: (item) => branchName(item.branchId) },
              { key: 'name', header: 'Sub-Branch Name' },
              {
                key: 'active',
                header: 'Status',
                render: (item) => <StatusBadge label={item.active ? 'ACTIVE' : 'INACTIVE'} category={item.active ? 'success' : 'default'} />,
              },
            ]}
          />
        </>
      )}
    </div>
  );
}
