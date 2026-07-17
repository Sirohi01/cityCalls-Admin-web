'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { UploadCloud, DownloadCloud, FileSpreadsheet } from 'lucide-react';

export default function ImportExportPage() {
  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Import / Export Wizard</h1>
          <p className="text-muted-foreground">Bulk upload data into the system or extract data for external use.</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        
        {/* Import Section */}
        <Card className="border-dashed border-2 border-slate-200">
          <CardHeader className="bg-slate-50/50 pb-4 border-b">
            <CardTitle className="flex items-center gap-2">
              <UploadCloud className="w-5 h-5 text-indigo-600" /> Bulk Import
            </CardTitle>
            <CardDescription>Upload CSV files to populate master data, customers, or past tickets.</CardDescription>
          </CardHeader>
          <CardContent className="pt-6 space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Select Entity Type</label>
              <select className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm">
                <option>Customers Directory</option>
                <option>Product / Asset Catalog</option>
                <option>Service Requests (Historical)</option>
                <option>Leads Data</option>
              </select>
            </div>
            
            <div className="border-2 border-dashed border-slate-300 rounded-lg p-10 flex flex-col items-center justify-center text-center bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer">
              <FileSpreadsheet className="w-10 h-10 text-slate-400 mb-4" />
              <p className="text-sm font-medium text-slate-700">Click to upload or drag CSV file here</p>
              <p className="text-xs text-muted-foreground mt-1">Maximum file size 10MB</p>
            </div>

            <Button className="w-full">Validate & Import</Button>
          </CardContent>
        </Card>

        {/* Export Section */}
        <Card className="border-dashed border-2 border-slate-200">
          <CardHeader className="bg-slate-50/50 pb-4 border-b">
            <CardTitle className="flex items-center gap-2">
              <DownloadCloud className="w-5 h-5 text-green-600" /> Master Export
            </CardTitle>
            <CardDescription>Extract complete datasets from the system in CSV or Excel format.</CardDescription>
          </CardHeader>
          <CardContent className="pt-6 space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Select Entity Type</label>
              <select className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm">
                <option>All Customers</option>
                <option>All Active Service Requests</option>
                <option>Financial Ledger (Invoices)</option>
                <option>System Audit Logs</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Start Date</label>
                <input type="date" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">End Date</label>
                <input type="date" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" />
              </div>
            </div>

            <div className="pt-8">
              <Button variant="outline" className="w-full border-green-600 text-green-600 hover:bg-green-50">Generate Export Link</Button>
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}
