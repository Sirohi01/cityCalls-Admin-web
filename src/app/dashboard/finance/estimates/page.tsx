'use client';

import { useState } from 'react';
import { DataTable } from '@/components/ui/DataTable';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AppFormField } from '@/components/ui/AppFormField';
import { FileText, Plus } from 'lucide-react';

import { useEstimates } from '@/lib/hooks/useEstimates';

export default function EstimatesPage() {
  const { data: estimates, isLoading, isError } = useEstimates();


  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Estimates</h1>
          <p className="text-muted-foreground">Manage and generate cost estimates for service requests.</p>
        </div>
      </div>

      <Tabs defaultValue="list" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="list">All Estimates</TabsTrigger>
          <TabsTrigger value="create">Create Estimate</TabsTrigger>
        </TabsList>
        
        <TabsContent value="list">
          <Card>
            <CardHeader>
              <CardTitle>Estimate Records</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex justify-center p-8 text-muted-foreground">Loading estimates...</div>
              ) : isError ? (
                <div className="flex justify-center p-8 text-destructive">Failed to load estimates.</div>
              ) : (
                <DataTable 
                  data={estimates || []}
                  columns={[
                    { key: 'number', header: 'Estimate ID' },
                    { key: 'serviceRequestId', header: 'Linked SR' },
                    { key: 'customerName', header: 'Customer' },
                    { 
                      key: 'grandTotal', 
                      header: 'Total Amount',
                      render: (item) => <span className="font-semibold">₹{(item.grandTotal || 0).toLocaleString()}</span>
                    },
                    { 
                      key: 'status', 
                      header: 'Status',
                      render: (item) => (
                        <StatusBadge 
                          label={item.status} 
                          category={item.status === 'APPROVED' ? 'success' : item.status === 'REJECTED' ? 'error' : 'warning'} 
                        />
                      )
                    },
                    { 
                      key: 'createdAt', 
                      header: 'Date',
                      render: (item) => new Date(item.createdAt).toLocaleDateString()
                    },
                  ]}
                />
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="create">
          <Card className="max-w-4xl">
            <CardHeader>
              <CardTitle>Generate New Estimate</CardTitle>
              <CardDescription>Select a service request and add line items for spares and labor.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-6 pb-6 border-b">
                <AppFormField label="Link Service Request" placeholder="Search by SR ID..." />
                <AppFormField label="Customer Name (Auto-filled)" placeholder="Customer will appear here" />
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-lg">Line Items</h3>
                  <Button size="sm" variant="outline" className="gap-1">
                    <Plus className="w-4 h-4" /> Add Item
                  </Button>
                </div>
                
                <div className="rounded-lg border border-slate-200 overflow-hidden">
                  <table className="w-full text-sm text-left">
                    <thead className="bg-slate-50 text-slate-700">
                      <tr>
                        <th className="px-4 py-3 font-semibold">Item / Description</th>
                        <th className="px-4 py-3 font-semibold w-32">Type</th>
                        <th className="px-4 py-3 font-semibold w-24 text-right">Qty</th>
                        <th className="px-4 py-3 font-semibold w-32 text-right">Price (₹)</th>
                        <th className="px-4 py-3 font-semibold w-32 text-right">Total (₹)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      <tr>
                        <td className="px-4 py-3">AC Compressor Gas Recharge</td>
                        <td className="px-4 py-3"><Badge variant="outline">Spare Part</Badge></td>
                        <td className="px-4 py-3 text-right">1</td>
                        <td className="px-4 py-3 text-right">1,200</td>
                        <td className="px-4 py-3 text-right font-medium">1,200</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3">Labor Charge</td>
                        <td className="px-4 py-3"><Badge variant="secondary">Labor</Badge></td>
                        <td className="px-4 py-3 text-right">1</td>
                        <td className="px-4 py-3 text-right">300</td>
                        <td className="px-4 py-3 text-right font-medium">300</td>
                      </tr>
                    </tbody>
                    <tfoot className="bg-slate-50 border-t">
                      <tr>
                        <td colSpan={4} className="px-4 py-4 text-right font-bold text-lg">Grand Total:</td>
                        <td className="px-4 py-4 text-right font-bold text-lg text-primary">₹1,500</td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <Button className="gap-2">
                  <FileText className="w-4 h-4" /> Save & Send for Approval
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
