'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { DataTable } from '@/components/ui/DataTable';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Separator } from '@/components/ui/separator';
import { useLeads, Lead } from '@/lib/hooks/useLeads';

export default function LeadsListPage() {
  const router = useRouter();
  const { data: leads, isLoading, isError } = useLeads();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between pb-1 mb-1.5 border-b border-border/50">
        <div>
          <h1 className="text-lg font-medium tracking-tight text-foreground">Leads (List View)</h1>
          <p className="text-[13px] text-muted-foreground">Tabular view of all leads for bulk operations.</p>
        </div>
        <div className="space-x-2">
          <Button size="sm" variant="outline" render={<Link href="/dashboard/leads" />}>
            Pipeline View
          </Button>
          <Button render={<Link href="/dashboard/leads/import" />}>
            Import Leads
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center p-8 text-muted-foreground">Loading leads...</div>
      ) : isError ? (
        <div className="flex justify-center p-8 text-destructive">Failed to load leads.</div>
      ) : (
        <DataTable<Lead>
          data={leads || []}
          onRowClick={(item) => router.push(`/dashboard/leads/${item._id}`)}
          columns={[
            { key: 'contactName', header: 'Name', render: (item) => item.contactName || 'Unnamed Lead' },
            { key: 'contactMobile', header: 'Mobile', render: (item) => item.contactMobile || 'N/A' },
            { key: 'source', header: 'Source' },
            {
              key: 'stage',
              header: 'Stage',
              render: (item) => (
                <StatusBadge
                  label={item.stage.replace(/_/g, ' ')}
                  category={item.stage === 'NEW' ? 'info' : item.stage === 'CONVERTED' ? 'success' : 'default'}
                />
              ),
            },
            { key: 'priority', header: 'Priority' },
            { key: 'createdAt', header: 'Created On', render: (item) => new Date(item.createdAt).toLocaleDateString() },
          ]}
        />
      )}
    </div>
  );
}
