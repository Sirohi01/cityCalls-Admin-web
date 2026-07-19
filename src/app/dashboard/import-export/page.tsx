'use client';

import { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { UploadCloud, DownloadCloud, FileSpreadsheet, CheckCircle2, XCircle } from 'lucide-react';

import { useImportEntity, downloadExport, EXPORT_ENTITIES, ImportEntityInput } from '@/lib/hooks/useImportExport';

const IMPORT_ENTITIES: { value: ImportEntityInput['entity']; label: string }[] = [
  { value: 'customers', label: 'Customers Directory' },
  { value: 'leads', label: 'Leads Data' },
];

const EXPORT_ENTITY_LABELS: Record<(typeof EXPORT_ENTITIES)[number], string> = {
  customers: 'All Customers',
  leads: 'All Leads',
  serviceRequests: 'Service Requests',
  calls: 'Calls',
  invoices: 'Invoices',
};

function ImportSection() {
  const importEntity = useImportEntity();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [entity, setEntity] = useState<ImportEntityInput['entity']>('customers');
  const [file, setFile] = useState<File | null>(null);
  const [mode, setMode] = useState<'partial' | 'strict'>('partial');

  const handleImport = (dryRun: boolean) => {
    if (!file) return;
    importEntity.mutate({ entity, file, dryRun, mode });
  };

  return (
    <Card className="border-dashed border-2 border-slate-200">
      <CardHeader className="bg-slate-50/50 pb-4 border-b">
        <CardTitle className="flex items-center gap-2">
          <UploadCloud className="w-5 h-5 text-indigo-600" /> Bulk Import
        </CardTitle>
        <CardDescription>Upload a CSV file to bulk-create customers or leads. XLSX is not supported for import.</CardDescription>
      </CardHeader>
      <CardContent className="pt-6 space-y-6">
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700">Select Entity Type</label>
          <select
            className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm"
            value={entity}
            onChange={(e) => setEntity(e.target.value as ImportEntityInput['entity'])}
          >
            {IMPORT_ENTITIES.map((e) => <option key={e.value} value={e.value}>{e.label}</option>)}
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700">Row Handling</label>
          <select className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm" value={mode} onChange={(e) => setMode(e.target.value as 'partial' | 'strict')}>
            <option value="partial">Partial — import valid rows, skip invalid ones</option>
            <option value="strict">Strict — abort entirely if any row is invalid</option>
          </select>
        </div>

        <input ref={fileInputRef} type="file" accept=".csv" className="hidden" onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
        <div
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-slate-300 rounded-lg p-10 flex flex-col items-center justify-center text-center bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer"
        >
          <FileSpreadsheet className="w-10 h-10 text-slate-400 mb-4" />
          <p className="text-sm font-medium text-slate-700">{file ? file.name : 'Click to select a CSV file'}</p>
          <p className="text-xs text-muted-foreground mt-1">CSV only, maximum file size 20MB</p>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" className="w-full" onClick={() => handleImport(true)} disabled={!file || importEntity.isPending}>
            {importEntity.isPending ? 'Checking...' : 'Dry Run (Validate Only)'}
          </Button>
          <Button className="w-full" onClick={() => handleImport(false)} disabled={!file || importEntity.isPending}>
            {importEntity.isPending ? 'Importing...' : 'Import'}
          </Button>
        </div>

        {importEntity.isError && (
          <p className="text-sm text-destructive">{importEntity.error.response?.data?.message ?? 'Import failed.'}</p>
        )}

        {importEntity.data && (
          <div className="border rounded-lg p-4 space-y-2 bg-slate-50">
            <div className="flex gap-4 text-sm font-medium">
              <span className="flex items-center gap-1 text-green-700"><CheckCircle2 className="w-4 h-4" /> {importEntity.data.successCount} succeeded</span>
              <span className="flex items-center gap-1 text-red-700"><XCircle className="w-4 h-4" /> {importEntity.data.failureCount} failed</span>
              {importEntity.data.dryRun && <span className="text-slate-500">(dry run — nothing was saved)</span>}
            </div>
            {importEntity.data.failures.length > 0 && (
              <div className="text-xs text-slate-600 space-y-1 max-h-40 overflow-y-auto">
                {importEntity.data.failures.map((f, i) => (
                  <div key={i}>Row {f.row}, {f.field}: {f.message}</div>
                ))}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function ExportSection() {
  const [entity, setEntity] = useState<(typeof EXPORT_ENTITIES)[number]>('customers');
  const [format, setFormat] = useState<'csv' | 'xlsx'>('csv');
  const [isDownloading, setIsDownloading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleExport = async () => {
    setIsDownloading(true);
    setError(null);
    try {
      await downloadExport(entity, format);
    } catch {
      setError('Failed to generate export.');
    } finally {
      setIsDownloading(false);
    }
  };

  return (
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
          <select
            className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm"
            value={entity}
            onChange={(e) => setEntity(e.target.value as (typeof EXPORT_ENTITIES)[number])}
          >
            {EXPORT_ENTITIES.map((e) => <option key={e} value={e}>{EXPORT_ENTITY_LABELS[e]}</option>)}
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700">Format</label>
          <select className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm" value={format} onChange={(e) => setFormat(e.target.value as 'csv' | 'xlsx')}>
            <option value="csv">CSV</option>
            <option value="xlsx">Excel (.xlsx)</option>
          </select>
        </div>

        {error && <p className="text-sm text-destructive">{error}</p>}

        <div className="pt-8">
          <Button variant="outline" className="w-full border-green-600 text-green-600 hover:bg-green-50" onClick={handleExport} disabled={isDownloading}>
            {isDownloading ? 'Generating...' : 'Download Export'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default function ImportExportPage() {
  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Import / Export Wizard</h1>
          <p className="text-muted-foreground">Bulk upload data into the system or extract data for external use.</p>
        </div>
      </div>

      <Separator />

      <div className="grid md:grid-cols-2 gap-6">
        <ImportSection />
        <ExportSection />
      </div>
    </div>
  );
}
