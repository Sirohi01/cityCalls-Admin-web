'use client';

import { useState } from 'react';
import { DataTable } from '@/components/ui/DataTable';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ShieldCheck, UserPlus, Key } from 'lucide-react';

import { useUsers } from '@/lib/hooks/useUsers';
import { useRoles } from '@/lib/hooks/useRoles';

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
              <Button className="gap-2">
                <UserPlus className="w-4 h-4" /> Add User
              </Button>
            </CardHeader>
            <CardContent>
              {usersLoading ? (
                <div className="flex justify-center p-8 text-muted-foreground">Loading users...</div>
              ) : (
                <DataTable 
                  data={users || []}
                  columns={[
                    { key: 'name', header: 'Full Name' },
                    { key: 'email', header: 'Email Address' },
                    { 
                      key: 'role', 
                      header: 'Assigned Role',
                      render: (item) => <span className="font-semibold text-slate-700">{item.role || 'Unassigned'}</span>
                    },
                    { 
                      key: 'status', 
                      header: 'Status',
                      render: (item) => (
                        <StatusBadge 
                          label={item.status || 'ACTIVE'} 
                          category={(!item.status || item.status === 'ACTIVE') ? 'success' : 'default'} 
                        />
                      )
                    },
                    {
                      key: 'action',
                      header: 'Action',
                      render: () => (
                        <Button size="sm" variant="outline" className="h-8">Edit</Button>
                      )
                    }
                  ]}
                />
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Roles Tab */}
        <TabsContent value="roles">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-primary" />
                  Role Permission Matrix
                </CardTitle>
                <CardDescription>Define what each role can see and do in the system.</CardDescription>
              </div>
              <Button variant="secondary" className="gap-2">
                <Key className="w-4 h-4" /> Create Custom Role
              </Button>
            </CardHeader>
            <CardContent>
              {rolesLoading ? (
                <div className="flex justify-center p-8 text-muted-foreground">Loading roles...</div>
              ) : (
                <DataTable 
                  data={roles || []}
                  columns={[
                    { key: 'name', header: 'Role Name' },
                    { 
                      key: 'permissions', 
                      header: 'Access Scope',
                      render: (item) => <span className="text-sm text-muted-foreground">{item.permissions?.length || 0} permissions</span>
                    },
                    {
                      key: 'action',
                      header: 'Manage Matrix',
                      render: () => (
                        <Button size="sm" variant="outline" className="h-8 border-primary text-primary hover:bg-primary/5">Edit Permissions</Button>
                      )
                    }
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
