'use client';

import { useState } from 'react';
import { DataTable } from '@/components/ui/DataTable';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

import { useAuditLogs } from '@/lib/hooks/useAuditLogs';

export default function AuditLogsPage() {
  const { data: auditLogs, isLoading, isError } = useAuditLogs();


  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">System Audit Logs</h1>
          <p className="text-muted-foreground">Immutable trail of all actions performed within the system.</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Activity Log</CardTitle>
          <CardDescription>Showing recent system actions. This table is strictly read-only.</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center p-8 text-muted-foreground">Loading audit logs...</div>
          ) : isError ? (
            <div className="flex justify-center p-8 text-destructive">Failed to load audit logs.</div>
          ) : (
            <DataTable 
              data={auditLogs || []}
              columns={[
                { 
                  key: 'createdAt', 
                  header: 'Timestamp',
                  render: (item) => new Date(item.createdAt).toLocaleString()
                },
                { key: 'user', header: 'User / Actor' },
                { 
                  key: 'action', 
                  header: 'Action',
                  render: (item) => (
                    <span className={`px-2 py-1 text-[10px] font-bold rounded-md ${
                      item.action === 'CREATE' ? 'bg-green-100 text-green-800' :
                      item.action === 'UPDATE' ? 'bg-blue-100 text-blue-800' :
                      item.action === 'DELETE' ? 'bg-red-100 text-red-800' :
                      'bg-slate-100 text-slate-800'
                    }`}>
                      {item.action}
                    </span>
                  )
                },
                { key: 'module', header: 'Module' },
                { key: 'target', header: 'Target ID' },
                { key: 'details', header: 'Details' },
              ]}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
