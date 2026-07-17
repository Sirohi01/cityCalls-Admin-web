'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { DataTable } from '@/components/ui/DataTable';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AppFormField } from '@/components/ui/AppFormField';
import { FormSheet } from '@/components/ui/FormSheet';

import { useEmployees, useCreateEmployee, Employee } from '@/lib/hooks/useEmployees';
import { useUsers } from '@/lib/hooks/useUsers';
import { useBranches } from '@/lib/hooks/useOrganization';

const createEmployeeSchema = z.object({
  userId: z.string().min(1, 'Select a user'),
  branchId: z.string().min(1, 'Select a branch'),
});
type CreateEmployeeValues = z.infer<typeof createEmployeeSchema>;

function AddEmployeeForm({ onClose }: { onClose: () => void }) {
  const createEmployee = useCreateEmployee();
  const { data: users } = useUsers();
  const { data: branches } = useBranches();
  const { register, handleSubmit, formState: { errors } } = useForm<CreateEmployeeValues>({
    resolver: zodResolver(createEmployeeSchema),
  });

  const onSubmit = (values: CreateEmployeeValues) => {
    createEmployee.mutate(values, { onSuccess: onClose });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-1.5">
        <label className="text-sm font-medium">User Account</label>
        <select className="w-full h-9 rounded-md border border-input bg-transparent px-3 text-sm" {...register('userId')}>
          <option value="">Select a user...</option>
          {(users || []).map((u) => (
            <option key={u._id} value={u._id}>{u.name} ({u.role})</option>
          ))}
        </select>
        {errors.userId && <p className="text-sm text-destructive">{errors.userId.message}</p>}
      </div>
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
      {createEmployee.isError && (
        <p className="text-sm text-destructive">{createEmployee.error.response?.data?.message ?? 'Failed to create employee.'}</p>
      )}
      <Button type="submit" className="w-full" disabled={createEmployee.isPending}>
        {createEmployee.isPending ? 'Creating...' : 'Add Employee'}
      </Button>
    </form>
  );
}

export default function EmployeesPage() {
  const { data: employees, isLoading, isError } = useEmployees();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Employees</h1>
          <p className="text-muted-foreground">Manage internal staff and field technicians.</p>
        </div>
        <FormSheet triggerLabel="Add Employee" title="Add Employee" description="Link an existing user account to an employee record.">
          {(close) => <AddEmployeeForm onClose={close} />}
        </FormSheet>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Staff List</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center p-8 text-muted-foreground">Loading employees...</div>
          ) : isError ? (
            <div className="flex justify-center p-8 text-destructive">Failed to load employees.</div>
          ) : (
            <DataTable<Employee>
              data={employees || []}
              columns={[
                { key: 'userId.name', header: 'Name', render: (item) => item.userId?.name ?? '—' },
                { key: 'userId.email', header: 'Email', render: (item) => item.userId?.email ?? '—' },
                { key: 'userId.mobile', header: 'Mobile', render: (item) => item.userId?.mobile ?? '—' },
                { key: 'skills', header: 'Skills', render: (item) => item.skills?.join(', ') || '—' },
                {
                  key: 'active',
                  header: 'Status',
                  render: (item) => <StatusBadge label={item.active ? 'ACTIVE' : 'INACTIVE'} category={item.active ? 'success' : 'default'} />,
                },
              ]}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
