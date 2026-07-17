'use client';

import { useState } from 'react';
import { DataTable } from '@/components/ui/DataTable';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Bell, Smartphone, Mail, AlertTriangle } from 'lucide-react';

import { useNotifications } from '@/lib/hooks/useNotifications';

export default function NotificationsPage() {
  const { data: notifications, isLoading, isError } = useNotifications();


  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Notification Center</h1>
          <p className="text-muted-foreground">Monitor system alerts, SMS, WhatsApp, and Email logs.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card className="bg-slate-50 border-slate-200">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 bg-white rounded-full border shadow-sm"><Bell className="w-5 h-5 text-indigo-600" /></div>
            <div>
              <p className="text-sm font-medium text-slate-500">System Alerts</p>
              <h3 className="text-2xl font-bold">12</h3>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-slate-50 border-slate-200">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 bg-white rounded-full border shadow-sm"><Smartphone className="w-5 h-5 text-green-600" /></div>
            <div>
              <p className="text-sm font-medium text-slate-500">SMS Sent Today</p>
              <h3 className="text-2xl font-bold">458</h3>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-slate-50 border-slate-200">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 bg-white rounded-full border shadow-sm"><Mail className="w-5 h-5 text-blue-600" /></div>
            <div>
              <p className="text-sm font-medium text-slate-500">Emails Sent</p>
              <h3 className="text-2xl font-bold">24</h3>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-red-50 border-red-100">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 bg-white rounded-full border shadow-sm"><AlertTriangle className="w-5 h-5 text-red-600" /></div>
            <div>
              <p className="text-sm font-medium text-red-800">Failed Deliveries</p>
              <h3 className="text-2xl font-bold text-red-700">3</h3>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center p-8 text-muted-foreground">Loading notifications...</div>
          ) : isError ? (
            <div className="flex justify-center p-8 text-destructive">Failed to load notifications.</div>
          ) : (
            <DataTable 
              data={notifications || []}
              columns={[
                { 
                  key: 'type', 
                  header: 'Type',
                  render: (item) => (
                    <span className={`px-2 py-1 text-xs font-bold rounded-md ${
                      item.type === 'SMS' ? 'bg-indigo-100 text-indigo-700' :
                      item.type === 'WhatsApp' ? 'bg-green-100 text-green-700' :
                      item.type === 'System' ? 'bg-slate-200 text-slate-700' :
                      'bg-blue-100 text-blue-700'
                    }`}>
                      {item.type || 'System'}
                    </span>
                  )
                },
                { 
                  key: 'recipient', 
                  header: 'Recipient',
                  render: (item) => item.recipient || 'System User'
                },
                { key: 'content', header: 'Message Content' },
                { 
                  key: 'createdAt', 
                  header: 'Timestamp',
                  render: (item) => new Date(item.createdAt).toLocaleString()
                },
                { 
                  key: 'status', 
                  header: 'Status',
                  render: (item) => (
                    <StatusBadge 
                      label={item.status || 'Delivered'} 
                      category={item.status === 'FAILED' ? 'error' : 'success'} 
                    />
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
