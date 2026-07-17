'use client';

import { useState } from 'react';
import { DataTable } from '@/components/ui/DataTable';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { MessageSquarePlus } from 'lucide-react';

const mockTemplates = [
  { id: 'TPL-01', name: 'Ticket Created', channel: 'SMS', content: 'Dear {{CustomerName}}, your service request {{TicketID}} has been logged.', lastUpdated: '2026-07-01' },
  { id: 'TPL-02', name: 'Technician Assigned', channel: 'WhatsApp', content: 'Technician {{TechName}} is on the way for ticket {{TicketID}}.', lastUpdated: '2026-07-10' },
  { id: 'TPL-03', name: 'Invoice Generated', channel: 'Email', content: 'Hi, please find attached invoice {{InvoiceID}} for amount ₹{{Amount}}.', lastUpdated: '2026-07-15' },
];

import { useNotificationTemplates } from '@/lib/hooks/useNotificationTemplates';

export default function TemplatesPage() {
  const { data: templates, isLoading } = useNotificationTemplates();
  const data = templates || [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Notification Templates</h1>
          <p className="text-muted-foreground">Manage dynamic messaging templates for SMS, WhatsApp, and Email.</p>
        </div>
        <Button className="gap-2">
          <MessageSquarePlus className="w-4 h-4" /> Create Template
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Active Templates</CardTitle>
          <CardDescription>Use curly braces like {'{{Variable}}'} to insert dynamic data into messages.</CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable 
            data={data}
            columns={[
              { key: 'name', header: 'Template Name' },
              { 
                key: 'channel', 
                header: 'Channel',
                render: (item) => (
                  <span className={`px-2 py-1 text-xs font-bold rounded-md ${
                    item.channel === 'SMS' ? 'bg-indigo-100 text-indigo-700' :
                    item.channel === 'WhatsApp' ? 'bg-green-100 text-green-700' :
                    'bg-blue-100 text-blue-700'
                  }`}>
                    {item.channel}
                  </span>
                )
              },
              { key: 'content', header: 'Message Structure' },
              { key: 'lastUpdated', header: 'Last Updated' },
              {
                key: 'action',
                header: 'Action',
                render: () => <Button size="sm" variant="outline">Edit</Button>
              }
            ]}
          />
        </CardContent>
      </Card>
    </div>
  );
}
