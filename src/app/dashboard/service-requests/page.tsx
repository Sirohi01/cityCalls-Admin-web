'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { DataTable } from '@/components/ui/DataTable';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Button } from '@/components/ui/button';

import { useServiceRequests } from '@/lib/hooks/useServiceRequests';

export default function ServiceRequestsPage() {
  const router = useRouter();
  const { data: tickets, isLoading, isError } = useServiceRequests();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Service Requests</h1>
          <p className="text-muted-foreground">Manage and track customer tickets.</p>
        </div>
        <div className="space-x-2">
          <Button variant="outline" render={<Link href="/dashboard/dispatch" />}>
            Dispatch Board
          </Button>
          <Button render={<Link href="/dashboard/service-requests/create" />}>
            Create Request
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center p-8 text-muted-foreground">Loading service requests...</div>
      ) : isError ? (
        <div className="flex justify-center p-8 text-destructive">Failed to load service requests.</div>
      ) : (
        <DataTable 
          data={tickets || []}
          onRowClick={(item) => router.push(`/dashboard/service-requests/${item._id}`)}
          columns={[
            { key: 'number', header: 'SR ID' },
            { 
              key: 'customer', 
              header: 'Customer',
              render: (item) => item.customer?.name || 'Unknown'
            },
            { 
              key: 'priority', 
              header: 'Priority',
              render: (item) => (
                <span className={`text-xs font-semibold ${item.priority === 'HIGH' ? 'text-red-600' : item.priority === 'MEDIUM' ? 'text-amber-600' : 'text-green-600'}`}>
                  {item.priority}
                </span>
              )
            },
            { 
              key: 'status', 
              header: 'Status',
              render: (item) => (
                <StatusBadge 
                  label={item.status} 
                  category={
                    item.status === 'NEW' ? 'error' : 
                    item.status.includes('ASSIGNED') ? 'info' : 
                    item.status.includes('IN_PROGRESS') ? 'warning' : 'default'
                  } 
                />
              )
            },
            { 
              key: 'assignee', 
              header: 'Assignee',
              render: (item) => item.assignedToUser?.name || item.assignedToVendor?.name || 'Unassigned'
            },
            { 
              key: 'createdAt', 
              header: 'Created On',
              render: (item) => new Date(item.createdAt).toLocaleDateString()
            },
          ]}
        />
      )}
    </div>
  );
}
