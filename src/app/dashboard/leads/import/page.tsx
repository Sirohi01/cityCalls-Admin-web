'use client';

import { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { UploadCloud } from 'lucide-react';
import { useImportEntity } from '@/lib/hooks/useImportExport';

export default function LeadImportPage() {
  const router = useRouter();
  const importEntity = useImportEntity();
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState<{ successCount: number; failureCount: number } | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleImport = () => {
    if (!file) return;
    importEntity.mutate(
      { entity: 'leads', file, mode: 'partial' },
      {
        onSuccess: (data) => {
          setResult({ successCount: data.successCount, failureCount: data.failureCount });
        },
      }
    );
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Bulk Import Leads</h1>
          <p className="text-muted-foreground">Upload a CSV file to import multiple leads at once.</p>
        </div>
        <Button variant="outline" onClick={() => router.back()}>Cancel</Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Upload CSV</CardTitle>
          <CardDescription>File must contain columns: source, ownerId (required); contactName, contactMobile (optional). CSV only.</CardDescription>
        </CardHeader>
        <CardContent>
          <input ref={inputRef} type="file" accept=".csv" className="hidden" onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
          <div
            onClick={() => inputRef.current?.click()}
            className="border-2 border-dashed border-slate-200 rounded-lg p-12 flex flex-col items-center justify-center text-center hover:bg-slate-50 transition-colors cursor-pointer"
          >
            <UploadCloud className="h-10 w-10 text-muted-foreground mb-4" />
            <h3 className="font-semibold text-lg">{file ? file.name : 'Click to select a CSV file'}</h3>
            <p className="text-sm text-muted-foreground mt-1">Support for a single CSV upload.</p>
          </div>

          {importEntity.isError && (
            <p className="text-sm text-destructive mt-4">{importEntity.error.response?.data?.message ?? 'Import failed.'}</p>
          )}
          {result && (
            <p className="text-sm mt-4">
              Imported {result.successCount} lead(s) successfully
              {result.failureCount > 0 ? `, ${result.failureCount} row(s) failed validation.` : '.'}
            </p>
          )}
        </CardContent>
        <CardFooter className="flex justify-end gap-2 bg-muted/50 p-6">
          <Button variant="outline" onClick={() => router.back()}>Cancel</Button>
          <Button onClick={handleImport} disabled={!file || importEntity.isPending}>
            {importEntity.isPending ? 'Importing...' : 'Process Import'}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
