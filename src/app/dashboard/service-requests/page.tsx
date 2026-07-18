'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { DataTable } from '@/components/ui/DataTable';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Button } from '@/components/ui/button';

import { useServiceRequests, stageForStatus } from '@/lib/hooks/useServiceRequests';

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
        <>
        <p className="text-sm text-muted-foreground">{tickets?.length ?? 0} service requests</p>
        <DataTable
          data={tickets || []}
          pageSize={10}
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
                <span className={`text-xs font-semibold ${item.priority === 'URGENT' || item.priority === 'HIGH' ? 'text-red-600' : item.priority === 'NORMAL' ? 'text-amber-600' : 'text-green-600'}`}>
                  {item.priority}
                </span>
              )
            },
            {
              key: 'status',
              header: 'Status',
              render: (item) => {
                const stage = stageForStatus(item.status);
                const category =
                  item.status === 'CANCELLED' ? 'error' :
                  stage === 'Open' ? 'error' :
                  stage === 'Assigned' ? 'info' :
                  stage === 'In Progress' ? 'warning' :
                  stage === 'Resolved' ? 'success' : 'default';
                return <StatusBadge label={item.status} category={category} />;
              }
            },
            {
              key: 'assignee',
              header: 'Assignee',
              render: (item) => item.assignee?.name || 'Unassigned'
            },
            { 
              key: 'createdAt', 
              header: 'Created On',
              render: (item) => new Date(item.createdAt).toLocaleDateString()
            },
          ]}
        />
        </>
      )}
    </div>
  );
}
