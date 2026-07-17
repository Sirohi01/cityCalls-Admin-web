'use client';

import { useState } from 'react';
import { DataTable } from '@/components/ui/DataTable';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Button } from '@/components/ui/button';

const mockTeams = [
  { id: 'T1', subBranch: 'South Delhi Hub', name: 'AC Repair Team A', size: 5, status: 'ACTIVE' },
  { id: 'T2', subBranch: 'Noida Hub', name: 'Plumbing Team 1', size: 3, status: 'ACTIVE' },
];

import { useTeams } from '@/lib/hooks/useOrganization';

export default function TeamsPage() {
  const { data: teams, isLoading } = useTeams();
  const data = teams || [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Teams</h1>
          <p className="text-muted-foreground">Manage field and internal teams.</p>
        </div>
        <Button>Add Team</Button>
      </div>

      <DataTable 
        data={data}
        columns={[
          { key: 'id', header: 'ID' },
          { key: 'subBranch', header: 'Sub-Branch' },
          { key: 'name', header: 'Team Name' },
          { key: 'size', header: 'Members' },
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
