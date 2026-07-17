'use client';

import { useState } from 'react';
import { DataTable } from '@/components/ui/DataTable';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Button } from '@/components/ui/button';

const mockSubBranches = [
  { id: 'SB1', branch: 'Delhi Main Branch', name: 'South Delhi Hub', status: 'ACTIVE' },
  { id: 'SB2', branch: 'Delhi Main Branch', name: 'Noida Hub', status: 'ACTIVE' },
];

import { useSubBranches } from '@/lib/hooks/useOrganization';

export default function SubBranchesPage() {
  const { data: subBranches, isLoading } = useSubBranches();
  const data = subBranches || [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Sub-Branches</h1>
          <p className="text-muted-foreground">Manage sub-branches under main branches.</p>
        </div>
        <Button>Add Sub-Branch</Button>
      </div>

      <DataTable 
        data={data}
        columns={[
          { key: 'id', header: 'ID' },
          { key: 'branch', header: 'Parent Branch' },
          { key: 'name', header: 'Sub-Branch Name' },
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
