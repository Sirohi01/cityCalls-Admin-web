'use client';

import { useState } from 'react';
import { DataTable } from '@/components/ui/DataTable';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Button } from '@/components/ui/button';

import { useMasters } from '@/lib/hooks/useMasters';

export default function MastersPage() {
  const { data: masters, isLoading, isError } = useMasters(['SYMPTOM', 'DEFECT', 'SOLUTION']);


  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Masters Configuration</h1>
          <p className="text-muted-foreground">Manage generic system masters (Symptoms, Defects, etc).</p>
        </div>
        <Button>Add Master</Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center p-8 text-muted-foreground">Loading masters...</div>
      ) : isError ? (
        <div className="flex justify-center p-8 text-destructive">Failed to load masters.</div>
      ) : (
        <DataTable 
          data={masters || []}
          columns={[
            { key: 'masterType', header: 'Master Type' },
            { key: 'label', header: 'Name' },
            { key: 'key', header: 'System Key' },
            { 
              key: 'active', 
              header: 'Status',
              render: (item) => (
                <StatusBadge 
                  label={item.active ? 'Active' : 'Inactive'} 
                  category={item.active ? 'success' : 'default'} 
                />
              )
            }
          ]}
        />
      )}
    </div>
  );
}
