'use client';

import { useState } from 'react';
import { DataTable } from '@/components/ui/DataTable';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { IndianRupee } from 'lucide-react';

import { useInvoices } from '@/lib/hooks/useInvoices';

export default function InvoicesPage() {
  const { data: invoices, isLoading, isError } = useInvoices();
  const [selectedInvoiceId, setSelectedInvoiceId] = useState<string | null>(null);

  const data = invoices || [];
  const selectedInvoice = data.find(i => i.id === selectedInvoiceId) || data[0];


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
                <DataTable 
                  data={data}
                  onRowClick={(item) => setSelectedInvoiceId(item.id)}
                  columns={[
                    { key: 'number', header: 'Invoice ID' },
                    { key: 'estimateId', header: 'Linked Estimate' },
                    { key: 'customerName', header: 'Customer' },
                    { 
                      key: 'grandTotal', 
                      header: 'Billed Amount',
                      render: (item) => <span className="font-semibold text-slate-800">₹{(item.grandTotal || 0).toLocaleString()}</span>
                    },
                    { 
                      key: 'paymentStatus', 
                      header: 'Payment Status',
                      render: (item) => (
                        <StatusBadge 
                          label={item.paymentStatus} 
                          category={item.paymentStatus === 'PAID' ? 'success' : 'error'} 
                        />
                      )
                    },
                    { 
                      key: 'createdAt', 
                      header: 'Invoice Date',
                      render: (item) => new Date(item.createdAt).toLocaleDateString()
                    },
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
                  {selectedInvoice && (
                    <StatusBadge 
                      label={selectedInvoice.paymentStatus} 
                      category={selectedInvoice.paymentStatus === 'PAID' ? 'success' : 'error'} 
                    />
                  )}
                </div>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                {selectedInvoice ? (
                  <>
                    <div className="grid grid-cols-2 text-sm gap-y-4">
                      <div className="text-slate-500">Bill To:</div>
                      <div className="font-medium text-right">{selectedInvoice.customerName}</div>
                      
                      <div className="text-slate-500">Estimate ID:</div>
                      <div className="font-medium text-right text-primary">{selectedInvoice.estimateId || 'N/A'}</div>
                      
                      <div className="text-slate-500">Total Amount:</div>
                      <div className="font-bold text-lg text-right text-slate-900">₹{(selectedInvoice.grandTotal || 0).toLocaleString()}</div>
                    </div>

                    {selectedInvoice.paymentStatus !== 'PAID' && (
                      <div className="border-t pt-6 mt-6">
                        <h4 className="font-semibold mb-4 flex items-center gap-2">
                          <IndianRupee className="w-5 h-5 text-primary" />
                          Record Payment
                        </h4>
                        <div className="bg-orange-50 border border-orange-100 p-4 rounded-md mb-4 text-sm text-orange-800">
                          Customer has an outstanding balance of <strong>₹{(selectedInvoice.grandTotal || 0).toLocaleString()}</strong>.
                        </div>
                        <div className="flex gap-2">
                          <Button className="w-full bg-green-600 hover:bg-green-700">Mark as Paid (Cash)</Button>
                          <Button className="w-full" variant="outline">Send Payment Link</Button>
                        </div>
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
