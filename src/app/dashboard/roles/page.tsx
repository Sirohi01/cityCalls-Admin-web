'use client';

import { useForm } from 'react-hook-form';
import { DataTable } from '@/components/ui/DataTable';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AppFormField } from '@/components/ui/AppFormField';
import { FormSheet } from '@/components/ui/FormSheet';
import { ShieldCheck, Key } from 'lucide-react';

import { useUsers, useCreateUser, CreateUserInput, STAFF_ROLES, User } from '@/lib/hooks/useUsers';
import { useRoles, Role } from '@/lib/hooks/useRoles';
import { useBranches } from '@/lib/hooks/useOrganization';

function AddUserForm({ close }: { close: () => void }) {
  const createUser = useCreateUser();
  const { data: branches } = useBranches();
  const { register, handleSubmit } = useForm<CreateUserInput>({ defaultValues: { role: 'EMPLOYEE' } });

  const onSubmit = (values: CreateUserInput) => {
    createUser.mutate(
      { ...values, branchId: values.branchId || undefined },
      { onSuccess: () => close() }
    );
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <AppFormField label="Full Name" required {...register('name', { required: true })} />
      <AppFormField label="Mobile Number" required {...register('mobile', { required: true })} />
      <AppFormField label="Email (Optional)" type="email" {...register('email')} />
      <AppFormField label="Temporary Password" type="password" required {...register('password', { required: true, minLength: 8 })} />

      <div className="space-y-1.5">
        <label className="text-sm font-medium">Role</label>
        <select className="w-full h-9 rounded-md border border-input bg-transparent px-3 text-sm" {...register('role', { required: true })}>
          {STAFF_ROLES.map((r) => <option key={r} value={r}>{r.replace(/_/g, ' ')}</option>)}
        </select>
      </div>

      <div className="space-y-1.5">
        <label className="text-sm font-medium">Branch (Optional)</label>
        <select className="w-full h-9 rounded-md border border-input bg-transparent px-3 text-sm" {...register('branchId')}>
          <option value="">Unassigned</option>
          {(branches || []).map((b) => <option key={b._id} value={b._id}>{b.name}</option>)}
        </select>
      </div>

      {createUser.isError && (
        <p className="text-sm text-destructive">{createUser.error.response?.data?.message ?? 'Failed to create user.'}</p>
      )}

      <Button type="submit" className="w-full" disabled={createUser.isPending}>
        {createUser.isPending ? 'Creating...' : 'Create User'}
      </Button>
    </form>
  );
}

export default function RolesAndUsersPage() {
  const { data: users, isLoading: usersLoading } = useUsers();
  const { data: roles, isLoading: rolesLoading } = useRoles();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Roles & Users</h1>
          <p className="text-muted-foreground">Manage system access, user accounts, and permission matrices.</p>
        </div>
      </div>

      <Tabs defaultValue="users" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="users">System Users</TabsTrigger>
          <TabsTrigger value="roles">Roles & Permissions</TabsTrigger>
        </TabsList>

        {/* Users Tab */}
        <TabsContent value="users">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>User Directory</CardTitle>
                <CardDescription>All employees and admins who can log into the dashboard.</CardDescription>
              </div>
              <FormSheet triggerLabel="Add User" title="Add User" description="Create a staff login for the admin panel.">
                {(close) => <AddUserForm close={close} />}
              </FormSheet>
            </CardHeader>
            <CardContent>
              {usersLoading ? (
                <div className="flex justify-center p-8 text-muted-foreground">Loading users...</div>
              ) : (
                <DataTable<User>
                  data={users || []}
                  columns={[
                    { key: 'name', header: 'Full Name' },
                    { key: 'email', header: 'Email Address', render: (item) => item.email ?? '—' },
                    {
                      key: 'role',
                      header: 'Assigned Role',
                      render: (item) => <span className="font-semibold text-slate-700">{item.role.replace(/_/g, ' ')}</span>,
                    },
                    {
                      key: 'status',
                      header: 'Status',
                      render: (item) => <StatusBadge label={item.status} category={item.status === 'ACTIVE' ? 'success' : 'default'} />,
                    },
                  ]}
                />
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Roles Tab */}
        <TabsContent value="roles">
          <Card>
            <CardHeader>
              <div>
                <CardTitle className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-primary" />
                  Role Permission Matrix
                </CardTitle>
                <CardDescription className="flex items-center gap-1.5 mt-1">
                  <Key className="w-3.5 h-3.5" />
                  Permissions are fixed at deployment via the RBAC seed script — there is no runtime editor yet.
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              {rolesLoading ? (
                <div className="flex justify-center p-8 text-muted-foreground">Loading roles...</div>
              ) : (
                <DataTable<Role>
                  data={roles || []}
                  columns={[
                    { key: 'name', header: 'Role Name' },
                    {
                      key: 'permissions',
                      header: 'Access Scope',
                      render: (item) => <span className="text-sm text-muted-foreground">{item.permissions.length} permissions granted</span>,
                    },
                  ]}
                />
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
