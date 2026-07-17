'use client';

import { useState } from 'react';
import { DataTable } from '@/components/ui/DataTable';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { IndianRupee } from 'lucide-react';

import { useInvoices, useRecordPayment, useShareInvoice, Invoice } from '@/lib/hooks/useInvoices';
import { useCustomers } from '@/lib/hooks/useCustomers';

export default function InvoicesPage() {
  const { data: invoices, isLoading, isError } = useInvoices();
  const { data: customers } = useCustomers();
  const [selectedInvoiceId, setSelectedInvoiceId] = useState<string | null>(null);
  const recordPayment = useRecordPayment();
  const shareInvoice = useShareInvoice();

  const data = invoices || [];
  const selectedInvoice = data.find(i => i._id === selectedInvoiceId) || data[0];
  const customerName = (id?: string) => customers?.find((c) => c._id === id)?.name ?? 'Unknown';
  const outstanding = (inv: Invoice) => inv.total - inv.amountPaid;

  const handleMarkPaid = () => {
    if (!selectedInvoice) return;
    recordPayment.mutate({ invoiceId: selectedInvoice._id, amount: outstanding(selectedInvoice), method: 'CASH' });
  };

  const handleShare = () => {
    if (!selectedInvoice) return;
    shareInvoice.mutate({ invoiceId: selectedInvoice._id, channels: ['EMAIL', 'WHATSAPP'] });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Invoices & Payments</h1>
          <p className="text-muted-foreground">Manage final billing and record customer payments.</p>
        </div>
      </div>

      <Tabs defaultValue="list" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="list">All Invoices</TabsTrigger>
          <TabsTrigger value="detail">Invoice Viewer</TabsTrigger>
        </TabsList>

        <TabsContent value="list">
          <Card>
            <CardHeader>
              <CardTitle>Invoice Records</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex justify-center p-8 text-muted-foreground">Loading invoices...</div>
              ) : isError ? (
                <div className="flex justify-center p-8 text-destructive">Failed to load invoices.</div>
              ) : (
                <DataTable<Invoice>
                  data={data}
                  onRowClick={(item) => setSelectedInvoiceId(item._id)}
                  columns={[
                    { key: 'number', header: 'Invoice ID' },
                    { key: 'customerId', header: 'Customer', render: (item) => customerName(item.customerId) },
                    { key: 'total', header: 'Billed Amount', render: (item) => <span className="font-semibold text-slate-800">₹{(item.total || 0).toLocaleString('en-IN')}</span> },
                    {
                      key: 'status',
                      header: 'Payment Status',
                      render: (item) => <StatusBadge label={item.status} category={item.status === 'PAID' ? 'success' : 'error'} />,
                    },
                    { key: 'createdAt', header: 'Invoice Date', render: (item) => new Date(item.createdAt).toLocaleDateString() },
                  ]}
                />
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="detail">
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader className="bg-slate-50 border-b pb-4">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-2xl">Invoice {selectedInvoice?.number}</CardTitle>
                    <CardDescription className="mt-1">Generated on {selectedInvoice ? new Date(selectedInvoice.createdAt).toLocaleDateString() : ''}</CardDescription>
                  </div>
                  {selectedInvoice && <StatusBadge label={selectedInvoice.status} category={selectedInvoice.status === 'PAID' ? 'success' : 'error'} />}
                </div>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                {selectedInvoice ? (
                  <>
                    <div className="grid grid-cols-2 text-sm gap-y-4">
                      <div className="text-slate-500">Bill To:</div>
                      <div className="font-medium text-right">{customerName(selectedInvoice.customerId)}</div>

                      <div className="text-slate-500">Amount Paid:</div>
                      <div className="font-medium text-right">₹{selectedInvoice.amountPaid.toLocaleString('en-IN')}</div>

                      <div className="text-slate-500">Total Amount:</div>
                      <div className="font-bold text-lg text-right text-slate-900">₹{(selectedInvoice.total || 0).toLocaleString('en-IN')}</div>
                    </div>

                    {selectedInvoice.status !== 'PAID' && selectedInvoice.status !== 'CANCELLED' && (
                      <div className="border-t pt-6 mt-6">
                        <h4 className="font-semibold mb-4 flex items-center gap-2">
                          <IndianRupee className="w-5 h-5 text-primary" />
                          Record Payment
                        </h4>
                        <div className="bg-orange-50 border border-orange-100 p-4 rounded-md mb-4 text-sm text-orange-800">
                          Customer has an outstanding balance of <strong>₹{outstanding(selectedInvoice).toLocaleString('en-IN')}</strong>.
                        </div>
                        <div className="flex gap-2">
                          <Button className="w-full bg-green-600 hover:bg-green-700" onClick={handleMarkPaid} disabled={recordPayment.isPending}>
                            {recordPayment.isPending ? 'Recording...' : 'Mark as Paid (Cash)'}
                          </Button>
                          <Button className="w-full" variant="outline" onClick={handleShare} disabled={shareInvoice.isPending}>
                            {shareInvoice.isPending ? 'Sending...' : 'Share via Email/WhatsApp'}
                          </Button>
                        </div>
                        {recordPayment.isError && <p className="text-sm text-destructive mt-2">Failed to record payment.</p>}
                        {shareInvoice.isSuccess && <p className="text-sm text-green-600 mt-2">Invoice shared.</p>}
                      </div>
                    )}
                  </>
                ) : (
                  <div className="text-center p-8 text-muted-foreground">Select an invoice from the list to view details.</div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
