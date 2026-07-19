'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { DataTable } from '@/components/ui/DataTable';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { AppFormField } from '@/components/ui/AppFormField';
import { FormSheet } from '@/components/ui/FormSheet';
import { Pencil } from 'lucide-react';

import { useEmployees, useCreateEmployee, useUpdateEmployee, Employee } from '@/lib/hooks/useEmployees';
import { useUsers } from '@/lib/hooks/useUsers';
import { useBranches, useSubBranches, useTeams } from '@/lib/hooks/useOrganization';

function splitList(value?: string): string[] {
  return (value ?? '').split(',').map((v) => v.trim()).filter(Boolean);
}

const employeeFormSchema = z.object({
  userId: z.string().min(1, 'Select a user'),
  branchId: z.string().min(1, 'Select a branch'),
  subBranchId: z.string().optional(),
  teamId: z.string().optional(),
  skills: z.string().optional(),
  certifications: z.string().optional(),
  dailyCapacity: z.number().min(1),
  active: z.boolean(),
});
type EmployeeFormValues = z.infer<typeof employeeFormSchema>;

function EmployeeForm({ employee, onClose }: { employee?: Employee; onClose: () => void }) {
  const isEdit = !!employee;
  const createEmployee = useCreateEmployee();
  const updateEmployee = useUpdateEmployee();
  const mutation = isEdit ? updateEmployee : createEmployee;
  const { data: users } = useUsers();
  const { data: branches } = useBranches();
  const { register, handleSubmit, watch, formState: { errors } } = useForm<EmployeeFormValues>({
    resolver: zodResolver(employeeFormSchema),
    defaultValues: {
      userId: employee?.userId._id ?? '',
      branchId: employee?.branchId ?? '',
      subBranchId: employee?.subBranchId ?? '',
      teamId: employee?.teamId ?? '',
      skills: employee?.skills?.join(', ') ?? '',
      certifications: employee?.certifications?.join(', ') ?? '',
      dailyCapacity: employee?.dailyCapacity ?? 5,
      active: employee?.active ?? true,
    },
  });
  const branchId = watch('branchId');
  const { data: subBranches } = useSubBranches(branchId || undefined);
  const { data: teams } = useTeams();
  const branchTeams = teams?.filter((t) => t.branchId === branchId) ?? [];

  const onSubmit = (values: EmployeeFormValues) => {
    const payload = {
      branchId: values.branchId,
      subBranchId: values.subBranchId || undefined,
      teamId: values.teamId || undefined,
      skills: splitList(values.skills),
      certifications: splitList(values.certifications),
      dailyCapacity: values.dailyCapacity,
      active: values.active,
    };
    if (isEdit && employee) {
      updateEmployee.mutate({ id: employee._id, ...payload }, { onSuccess: onClose });
    } else {
      createEmployee.mutate({ userId: values.userId, ...payload }, { onSuccess: onClose });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-1.5">
        <label className="text-sm font-medium">User Account</label>
        <select className="w-full h-9 rounded-md border border-input bg-transparent px-3 text-sm" disabled={isEdit} {...register('userId')}>
          <option value="">Select a user...</option>
          {(users || []).map((u) => (
            <option key={u._id} value={u._id}>{u.name} ({u.role.replace(/_/g, ' ')})</option>
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

      <div className="space-y-1.5">
        <label className="text-sm font-medium">Sub-Branch (Optional)</label>
        <select className="w-full h-9 rounded-md border border-input bg-transparent px-3 text-sm" disabled={!branchId} {...register('subBranchId')}>
          <option value="">None</option>
          {(subBranches || []).map((sb) => <option key={sb._id} value={sb._id}>{sb.name}</option>)}
        </select>
      </div>

      <div className="space-y-1.5">
        <label className="text-sm font-medium">Team (Optional)</label>
        <select className="w-full h-9 rounded-md border border-input bg-transparent px-3 text-sm" disabled={!branchId} {...register('teamId')}>
          <option value="">None</option>
          {branchTeams.map((t) => <option key={t._id} value={t._id}>{t.name}</option>)}
        </select>
      </div>

      <AppFormField label="Skills (comma-separated)" placeholder="AC_REPAIR, ELECTRICAL" {...register('skills')} />
      <AppFormField label="Certifications (comma-separated)" placeholder="Refrigerant Handling" {...register('certifications')} />
      <AppFormField label="Daily Capacity" type="number" error={errors.dailyCapacity?.message} {...register('dailyCapacity', { valueAsNumber: true })} />

      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" className="w-4 h-4" {...register('active')} />
        Active
      </label>

      {mutation.isError && (
        <p className="text-sm text-destructive">{mutation.error.response?.data?.message ?? `Failed to ${isEdit ? 'update' : 'create'} employee.`}</p>
      )}
      <Button type="submit" className="w-full" disabled={mutation.isPending}>
        {mutation.isPending ? 'Saving...' : isEdit ? 'Save Changes' : 'Add Employee'}
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
          {(close) => <EmployeeForm onClose={close} />}
        </FormSheet>
      </div>

      <Separator />

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
            <>
            <p className="text-sm text-muted-foreground mb-2">{employees?.length ?? 0} employees</p>
            <DataTable<Employee>
              data={employees || []}
              pageSize={10}
              columns={[
                { key: 'userId.name', header: 'Name', render: (item) => item.userId?.name ?? '—' },
                { key: 'userId.email', header: 'Email', render: (item) => item.userId?.email ?? '—' },
                { key: 'userId.mobile', header: 'Mobile', render: (item) => item.userId?.mobile ?? '—' },
                { key: 'skills', header: 'Skills', render: (item) => item.skills?.join(', ') || '—' },
                { key: 'dailyCapacity', header: 'Capacity', render: (item) => String(item.dailyCapacity ?? '—') },
                {
                  key: 'active',
                  header: 'Status',
                  render: (item) => <StatusBadge label={item.active ? 'ACTIVE' : 'INACTIVE'} category={item.active ? 'success' : 'default'} />,
                },
                {
                  key: 'actions',
                  header: '',
                  render: (item) => (
                    <FormSheet
                      triggerLabel="Edit"
                      title="Edit Employee"
                      description={`Update ${item.userId?.name ?? 'employee'}'s assignment.`}
                      triggerElement={<Button size="sm" variant="ghost"><Pencil className="w-4 h-4" /></Button>}
                    >
                      {(close) => <EmployeeForm employee={item} onClose={close} />}
                    </FormSheet>
                  ),
                },
              ]}
            />
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
