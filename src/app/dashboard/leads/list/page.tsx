'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { DataTable } from '@/components/ui/DataTable';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/ui/StatusBadge';

const mockLeads = [
  { id: 'LD-001', name: 'Ramesh Singh', mobile: '9876543210', stage: 'New', source: 'Website', amount: 5000, date: '2026-07-17' },
  { id: 'LD-002', name: 'Hotel Taj', mobile: '9988776655', stage: 'Contacted', source: 'Referral', amount: 150000, date: '2026-07-16' },
  { id: 'LD-003', name: 'Priya Sharma', mobile: '9123456789', stage: 'Qualified', source: 'Organic', amount: 12000, date: '2026-07-15' },
];

export default function LeadsListPage() {
  const router = useRouter();
  const [data] = useState(mockLeads);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Leads (List View)</h1>
          <p className="text-muted-foreground">Tabular view of all leads for bulk operations.</p>
        </div>
        <div className="space-x-2">
          <Button variant="outline" render={<Link href="/dashboard/leads" />}>
            Pipeline View
          </Button>
          <Button render={<Link href="/dashboard/leads/import" />}>
            Import Leads
          </Button>
        </div>
      </div>

      <DataTable 
        data={data}
        onRowClick={(item) => router.push(`/dashboard/leads/${item.id}`)}
        columns={[
          { key: 'name', header: 'Name' },
          { key: 'mobile', header: 'Mobile' },
          { key: 'source', header: 'Source' },
          { 
            key: 'stage', 
            header: 'Stage',
            render: (item) => (
              <StatusBadge 
                label={item.stage} 
                category={item.stage === 'New' ? 'info' : item.stage === 'Qualified' ? 'success' : 'default'} 
              />
            )
          },
          { 
            key: 'amount', 
            header: 'Expected Value',
            render: (item) => `₹${item.amount.toLocaleString()}`
          },
          { key: 'date', header: 'Created On' },
        ]}
      />
    </div>
  );
}
