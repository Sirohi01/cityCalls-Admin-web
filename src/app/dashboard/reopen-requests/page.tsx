'use client';

import { useState } from 'react';
import { DataTable } from '@/components/ui/DataTable';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { AlertCircle, CheckCircle, XCircle } from 'lucide-react';

import { useReopenRequests } from '@/lib/hooks/useReopenRequests';

export default function ReopenRequestsPage() {
  const { data: reopenRequests, isLoading, isError } = useReopenRequests();


  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Reopen Requests</h1>
          <p className="text-muted-foreground">Review and manage tickets that customers want to reopen.</p>
        </div>
      </div>

      <Card className="border-orange-200">
        <CardHeader className="bg-orange-50/50">
          <CardTitle className="text-orange-800 flex items-center gap-2">
            <AlertCircle className="w-5 h-5" /> Pending Reviews
          </CardTitle>
          <CardDescription>Tickets flagged during happy calls or reported by customers.</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          {isLoading ? (
            <div className="flex justify-center p-8 text-muted-foreground">Loading reopen requests...</div>
          ) : isError ? (
            <div className="flex justify-center p-8 text-destructive">Failed to load reopen requests.</div>
          ) : (
            <DataTable 
              data={reopenRequests || []}
              columns={[
                { key: 'originalServiceRequestId', header: 'Service Request' },
                { key: 'customerName', header: 'Customer' },
                { 
                  key: 'reason', 
                  header: 'Reopen Reason',
                  render: (item) => <span className="text-sm font-medium text-slate-700">{item.reason}</span>
                },
                { 
                  key: 'reopenedAt', 
                  header: 'Requested On',
                  render: (item) => new Date(item.reopenedAt).toLocaleDateString()
                },
                { 
                  key: 'status', 
                  header: 'Status',
                  render: (item) => (
                    <StatusBadge 
                      label={item.status} 
                      category={item.status === 'APPROVED' ? 'success' : 'error'} 
                    />
                  )
                },
                {
                  key: 'actions',
                  header: 'Decision',
                  render: (item) => item.status === 'PENDING' ? (
                    <div className="flex items-center gap-2">
                      <Button size="sm" className="bg-green-600 hover:bg-green-700 h-8 px-2" title="Approve & Send to Dispatch">
                        <CheckCircle className="w-4 h-4 mr-1" /> Approve
                      </Button>
                      <Button size="sm" variant="destructive" className="h-8 px-2" title="Reject Request">
                        <XCircle className="w-4 h-4 mr-1" /> Reject
                      </Button>
                    </div>
                  ) : (
                    <span className="text-sm text-muted-foreground">Reviewed</span>
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
