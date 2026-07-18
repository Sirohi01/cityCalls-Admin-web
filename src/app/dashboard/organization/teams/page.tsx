'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { DataTable } from '@/components/ui/DataTable';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Button } from '@/components/ui/button';
import { AppFormField } from '@/components/ui/AppFormField';
import { FormSheet } from '@/components/ui/FormSheet';
import { useTeams, useCreateTeam, useBranches, Team } from '@/lib/hooks/useOrganization';

const createTeamSchema = z.object({
  branchId: z.string().min(1, 'Select a branch'),
  name: z.string().min(2, 'Name is required'),
});
type CreateTeamValues = z.infer<typeof createTeamSchema>;

function AddTeamForm({ onClose }: { onClose: () => void }) {
  const createTeam = useCreateTeam();
  const { data: branches } = useBranches();
  const { register, handleSubmit, formState: { errors } } = useForm<CreateTeamValues>({
    resolver: zodResolver(createTeamSchema),
  });

  const onSubmit = (values: CreateTeamValues) => {
    createTeam.mutate(values, { onSuccess: onClose });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-1.5">
        <label className="text-sm font-medium">Branch</label>
        <select className="w-full h-9 rounded-md border border-input bg-transparent px-3 text-sm" {...register('branchId')}>
          <option value="">Select a branch...</option>
          {(branches || []).map((b) => (
            <option key={b._id} value={b._id}>{b.name}</option>
          ))}
        </select>
        {errors.branchId && <p className="text-sm text-destructive">{errors.branchId.message}</p>}
      </div>
      <AppFormField label="Team Name" placeholder="AC Repair Team A" error={errors.name?.message} {...register('name')} />
      {createTeam.isError && (
        <p className="text-sm text-destructive">{createTeam.error.response?.data?.message ?? 'Failed to create team.'}</p>
      )}
      <Button type="submit" className="w-full" disabled={createTeam.isPending}>
        {createTeam.isPending ? 'Creating...' : 'Create Team'}
      </Button>
    </form>
  );
}

export default function TeamsPage() {
  const { data: teams, isLoading, isError } = useTeams();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Teams</h1>
          <p className="text-muted-foreground">Manage field and internal teams.</p>
        </div>
        <FormSheet triggerLabel="Add Team" title="Add Team" description="Create a new team within a branch.">
          {(close) => <AddTeamForm onClose={close} />}
        </FormSheet>
      </div>

      {isLoading ? (
        <div className="flex justify-center p-8 text-muted-foreground">Loading teams...</div>
      ) : isError ? (
        <div className="flex justify-center p-8 text-destructive">Failed to load teams.</div>
      ) : (
        <>
          <p className="text-sm text-muted-foreground">{teams?.length ?? 0} teams</p>
          <DataTable<Team>
            data={teams || []}
            pageSize={10}
            columns={[
              { key: 'name', header: 'Team Name' },
              { key: 'memberIds', header: 'Members', render: (item) => String(item.memberIds?.length ?? 0) },
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
