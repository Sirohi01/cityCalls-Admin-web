'use client';

import { DataTable } from '@/components/ui/DataTable';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Clock, Megaphone } from 'lucide-react';

import { useCustomers, Customer } from '@/lib/hooks/useCustomers';

function pincodeTagOf(customer: Customer): string {
  return customer.tags?.find((t) => t.startsWith('waitlist-'))?.replace('waitlist-', '') ?? '—';
}

export default function ServiceAreaWaitlistPage() {
  const { data: customers, isLoading, isError } = useCustomers({ tag: 'waitlist' });
  const data = customers || [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Service Area Waitlist</h1>
        <p className="text-muted-foreground">Callers from areas we don&apos;t serve yet — captured so we can reach out once we launch there.</p>
      </div>

      <Card className="border-indigo-100 bg-indigo-50/40">
        <CardContent className="flex items-start gap-3 pt-6 text-sm text-indigo-900">
          <Megaphone className="mt-0.5 h-4 w-4 shrink-0 text-indigo-600" />
          <p>
            When a branch launches covering one of these pincodes, target it from{' '}
            <span className="font-semibold">Marketing → Campaigns</span> using the tag <code className="rounded bg-white px-1 py-0.5">waitlist-&lt;pincode&gt;</code>
            {' '}(or the broader <code className="rounded bg-white px-1 py-0.5">waitlist</code> tag) as the audience filter.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Clock className="w-4 h-4" /> Waiting Customers</CardTitle>
          <CardDescription>{data.length} people waiting across {new Set(data.map(pincodeTagOf)).size} pincode(s).</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center p-8 text-muted-foreground">Loading waitlist...</div>
          ) : isError ? (
            <div className="flex justify-center p-8 text-destructive">Failed to load waitlist.</div>
          ) : (
            <DataTable<Customer>
              data={data}
              pageSize={10}
              columns={[
                { key: 'name', header: 'Name' },
                { key: 'mobile', header: 'Mobile', render: (item) => item.contacts?.[0]?.mobile ?? '—' },
                { key: 'pincode', header: 'Pincode', render: (item) => pincodeTagOf(item) },
                { key: 'city', header: 'City / State', render: (item) => item.notes?.[0]?.replace(/^Waitlist:\s*/, '').replace(/\s*\(pincode.*\)$/, '') || '—' },
                { key: 'createdAt', header: 'Waiting Since', render: (item) => new Date(item.createdAt).toLocaleDateString() },
              ]}
              emptyMessage="No one is on the waitlist right now."
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
