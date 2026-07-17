'use client';

import { useState } from 'react';
import { DataTable } from '@/components/ui/DataTable';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

import { useEmployees } from '@/lib/hooks/useEmployees';

export default function EmployeesPage() {
  const { data: employees, isLoading, isError } = useEmployees();


  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Employees</h1>
          <p className="text-muted-foreground">Manage internal staff and field technicians.</p>
        </div>
        <Button>Add Employee</Button>
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
            <DataTable 
              data={employees || []}
              columns={[
                { key: 'name', header: 'Name' },
                { key: 'email', header: 'Email' },
                { key: 'mobile', header: 'Mobile' },
                { key: 'role', header: 'Role' },
                { 
                  key: 'status', 
                  header: 'Status',
                  render: (item) => (
                    <StatusBadge 
                      label={item.status} 
                      category={item.status === 'ACTIVE' ? 'success' : 'default'} 
                    />
                  )
                }
              ]}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
