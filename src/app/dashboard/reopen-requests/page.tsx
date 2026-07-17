'use client';

import Link from 'next/link';
import { DataTable } from '@/components/ui/DataTable';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { AlertCircle, ExternalLink } from 'lucide-react';

import { useReopenRequests, ReopenRequest } from '@/lib/hooks/useReopenRequests';

export default function ReopenRequestsPage() {
  const { data: reopenRequests, isLoading, isError } = useReopenRequests();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Reopen Requests</h1>
          <p className="text-muted-foreground">History of service requests reopened via customer feedback.</p>
        </div>
      </div>

      <Card className="border-orange-200">
        <CardHeader className="bg-orange-50/50">
          <CardTitle className="text-orange-800 flex items-center gap-2">
            <AlertCircle className="w-5 h-5" /> Reopened Tickets
          </CardTitle>
          <CardDescription>
            Reopening is applied immediately when a happy call marks an issue as unresolved — there is no separate approval step.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          {isLoading ? (
            <div className="flex justify-center p-8 text-muted-foreground">Loading reopen requests...</div>
          ) : isError ? (
            <div className="flex justify-center p-8 text-destructive">Failed to load reopen requests.</div>
          ) : (
            <DataTable<ReopenRequest>
              data={reopenRequests || []}
              columns={[
                { key: 'requestNumber', header: 'Service Request', render: (item) => item.requestNumber ?? item.originalServiceRequestId },
                { key: 'customerName', header: 'Customer' },
                {
                  key: 'reason',
                  header: 'Reopen Reason',
                  render: (item) => <span className="text-sm font-medium text-slate-700">{item.reason}</span>,
                },
                {
                  key: 'reopenedAt',
                  header: 'Reopened On',
                  render: (item) => new Date(item.reopenedAt).toLocaleDateString(),
                },
                {
                  key: 'status',
                  header: 'Status',
                  render: (item) => <StatusBadge label={item.status} category="success" />,
                },
                {
                  key: 'actions',
                  header: '',
                  render: (item) => (
                    <Button size="sm" variant="outline" className="gap-2" render={<Link href={`/dashboard/service-requests/${item.originalServiceRequestId}`} />}>
                      <ExternalLink className="w-3 h-3" /> View Service Request
                    </Button>
                  ),
                },
              ]}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
