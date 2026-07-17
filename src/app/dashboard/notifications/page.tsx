'use client';

import { DataTable } from '@/components/ui/DataTable';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Bell, AlertTriangle, Inbox, Check } from 'lucide-react';

import { useNotifications, useUnreadCount, useMarkNotificationRead, Notification } from '@/lib/hooks/useNotifications';

export default function NotificationsPage() {
  const { data: notifications, isLoading, isError } = useNotifications();
  const { data: unreadCount } = useUnreadCount();
  const markRead = useMarkNotificationRead();

  const items = notifications || [];
  const failedCount = items.filter((n) => n.status === 'FAILED').length;
  const sentCount = items.filter((n) => n.status === 'SENT' || n.status === 'DELIVERED' || n.status === 'READ').length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Notifications</h1>
          <p className="text-muted-foreground">In-app, SMS, WhatsApp, and email notifications addressed to your account.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card className="bg-slate-50 border-slate-200">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 bg-white rounded-full border shadow-sm"><Bell className="w-5 h-5 text-indigo-600" /></div>
            <div>
              <p className="text-sm font-medium text-slate-500">Unread</p>
              <h3 className="text-2xl font-bold">{unreadCount ?? '—'}</h3>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-slate-50 border-slate-200">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 bg-white rounded-full border shadow-sm"><Inbox className="w-5 h-5 text-green-600" /></div>
            <div>
              <p className="text-sm font-medium text-slate-500">Sent / Delivered (loaded)</p>
              <h3 className="text-2xl font-bold">{sentCount}</h3>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-red-50 border-red-100">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 bg-white rounded-full border shadow-sm"><AlertTriangle className="w-5 h-5 text-red-600" /></div>
            <div>
              <p className="text-sm font-medium text-red-800">Failed Deliveries (loaded)</p>
              <h3 className="text-2xl font-bold text-red-700">{failedCount}</h3>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Showing your most recent notifications.</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center p-8 text-muted-foreground">Loading notifications...</div>
          ) : isError ? (
            <div className="flex justify-center p-8 text-destructive">Failed to load notifications.</div>
          ) : (
            <DataTable<Notification>
              data={items}
              columns={[
                {
                  key: 'channel',
                  header: 'Channel',
                  render: (item) => (
                    <span className={`px-2 py-1 text-xs font-bold rounded-md ${
                      item.channel === 'SMS' ? 'bg-indigo-100 text-indigo-700' :
                      item.channel === 'WHATSAPP' ? 'bg-green-100 text-green-700' :
                      item.channel === 'IN_APP' ? 'bg-slate-200 text-slate-700' :
                      'bg-blue-100 text-blue-700'
                    }`}>
                      {item.channel}
                    </span>
                  ),
                },
                { key: 'triggerKey', header: 'Trigger' },
                { key: 'body', header: 'Message Content', render: (item) => <span className="line-clamp-2 max-w-md">{item.subject ? `${item.subject} — ` : ''}{item.body}</span> },
                { key: 'createdAt', header: 'Timestamp', render: (item) => new Date(item.createdAt).toLocaleString() },
                {
                  key: 'status',
                  header: 'Status',
                  render: (item) => (
                    <StatusBadge label={item.status} category={item.status === 'FAILED' ? 'error' : item.status === 'READ' ? 'default' : 'success'} />
                  ),
                },
                {
                  key: 'action',
                  header: '',
                  render: (item) =>
                    !item.readAt ? (
                      <Button size="sm" variant="outline" className="gap-1" onClick={() => markRead.mutate(item._id)} disabled={markRead.isPending}>
                        <Check className="w-3 h-3" /> Mark Read
                      </Button>
                    ) : null,
                },
              ]}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
