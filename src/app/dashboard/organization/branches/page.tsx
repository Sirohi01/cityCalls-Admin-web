'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { DataTable } from '@/components/ui/DataTable';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Button } from '@/components/ui/button';
import { AppFormField } from '@/components/ui/AppFormField';
import { FormSheet } from '@/components/ui/FormSheet';
import { useBranches, useCreateBranch, Branch } from '@/lib/hooks/useOrganization';

const createBranchSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  code: z.string().min(2, 'Code is required').max(10),
});
type CreateBranchValues = z.infer<typeof createBranchSchema>;

function AddBranchForm({ onClose }: { onClose: () => void }) {
  const createBranch = useCreateBranch();
  const { register, handleSubmit, formState: { errors } } = useForm<CreateBranchValues>({
    resolver: zodResolver(createBranchSchema),
  });

  const onSubmit = (values: CreateBranchValues) => {
    createBranch.mutate(values, { onSuccess: onClose });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <AppFormField label="Branch Name" placeholder="Delhi Central" error={errors.name?.message} {...register('name')} />
      <AppFormField label="Branch Code" placeholder="DEL01" error={errors.code?.message} {...register('code')} />
      {createBranch.isError && (
        <p className="text-sm text-destructive">{createBranch.error.response?.data?.message ?? 'Failed to create branch.'}</p>
      )}
      <Button type="submit" className="w-full" disabled={createBranch.isPending}>
        {createBranch.isPending ? 'Creating...' : 'Create Branch'}
      </Button>
    </form>
  );
}

export default function BranchesPage() {
  const { data: branches, isLoading, isError } = useBranches();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Branches</h1>
          <p className="text-muted-foreground">Manage main organizational branches.</p>
        </div>
        <FormSheet triggerLabel="Add Branch" title="Add Branch" description="Create a new branch.">
          {(close) => <AddBranchForm onClose={close} />}
        </FormSheet>
      </div>

      {isLoading ? (
        <div className="flex justify-center p-8 text-muted-foreground">Loading branches...</div>
      ) : isError ? (
        <div className="flex justify-center p-8 text-destructive">Failed to load branches.</div>
      ) : (
        <>
          <p className="text-sm text-muted-foreground">{branches?.length ?? 0} branches</p>
          <DataTable<Branch>
            data={branches || []}
            pageSize={10}
            columns={[
              { key: 'code', header: 'Code' },
              { key: 'name', header: 'Branch Name' },
              {
                key: 'coverage',
                header: 'Coverage',
                render: (item) => (
                  <span className="text-xs text-muted-foreground">
                    {item.coverage?.cities?.length ? item.coverage.cities.join(', ') : '—'}
                    {item.coverage?.pinCodes?.length ? ` (${item.coverage.pinCodes.length} pincodes)` : ''}
                  </span>
                ),
              },
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
