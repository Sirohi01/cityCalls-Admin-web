'use client';

import { useState } from 'react';
import { DataTable } from '@/components/ui/DataTable';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Button } from '@/components/ui/button';

const mockBranches = [
  { id: 'B1', name: 'Delhi Main Branch', manager: 'Amit Kumar', status: 'ACTIVE' },
  { id: 'B2', name: 'Mumbai North', manager: 'Priya Singh', status: 'ACTIVE' },
  { id: 'B3', name: 'Bangalore East', manager: 'Ravi Teja', status: 'INACTIVE' },
];

import { useBranches } from '@/lib/hooks/useOrganization';

export default function BranchesPage() {
  const { data: branches, isLoading } = useBranches();
  
  const data = branches || [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Branches</h1>
          <p className="text-muted-foreground">Manage main organizational branches.</p>
        </div>
        <Button>Add Branch</Button>
      </div>

      <DataTable 
        data={data}
        columns={[
          { key: 'id', header: 'Branch ID' },
          { key: 'name', header: 'Branch Name' },
          { key: 'manager', header: 'Branch Manager' },
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
    </div>
  );
}
