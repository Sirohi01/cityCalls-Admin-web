'use client';

import { useState } from 'react';
import Link from 'next/link';
import { DataTable } from '@/components/ui/DataTable';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { PhoneCall } from 'lucide-react';

import { useHappyCalls } from '@/lib/hooks/useHappyCalls';

export default function HappyCallsPage() {
  const { data: happyCalls, isLoading, isError } = useHappyCalls();


  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Happy Calls</h1>
          <p className="text-muted-foreground">Follow up with customers on recently closed service requests.</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Pending Follow-ups</CardTitle>
          <CardDescription>Tickets that were recently closed and need a satisfaction check.</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center p-8 text-muted-foreground">Loading happy calls...</div>
          ) : isError ? (
            <div className="flex justify-center p-8 text-destructive">Failed to load happy calls.</div>
          ) : (
            <DataTable 
              data={happyCalls || []}
              columns={[
                { key: 'id', header: 'Follow-up ID' },
                { key: 'serviceRequestId', header: 'Service Request' },
                { key: 'customerName', header: 'Customer' },
                { key: 'serviceName', header: 'Service Type' },
                { 
                  key: 'completedAt', 
                  header: 'Job Completed On',
                  render: (item) => new Date(item.completedAt).toLocaleDateString()
                },
                { 
                  key: 'status', 
                  header: 'Status',
                  render: (item) => (
                    <StatusBadge 
                      label={item.status} 
                      category={item.status === 'COMPLETED' ? 'success' : 'warning'} 
                    />
                  )
                },
                {
                  key: 'action',
                  header: 'Action',
                  render: (item) => item.status === 'PENDING' ? (
                    <Button size="sm" variant="outline" className="gap-2" render={<Link href={`/dashboard/happy-calls/entry?ticket=${item.serviceRequestId}`} />}>
                      <PhoneCall className="w-3 h-3" /> Log Call
                    </Button>
                  ) : (
                    <span className="text-sm text-muted-foreground">Done</span>
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
