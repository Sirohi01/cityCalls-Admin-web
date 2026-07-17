'use client';

import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { UploadCloud } from 'lucide-react';

export default function LeadImportPage() {
  const router = useRouter();

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
          <CardDescription>File must contain columns: Name, Mobile, Source. Maximum 1000 rows.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="border-2 border-dashed border-slate-200 rounded-lg p-12 flex flex-col items-center justify-center text-center hover:bg-slate-50 transition-colors cursor-pointer">
            <UploadCloud className="h-10 w-10 text-muted-foreground mb-4" />
            <h3 className="font-semibold text-lg">Click or drag file to this area to upload</h3>
            <p className="text-sm text-muted-foreground mt-1">Support for a single or bulk upload.</p>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end gap-2 bg-muted/50 p-6">
          <Button variant="outline" onClick={() => router.back()}>Cancel</Button>
          <Button disabled>Process Import</Button>
        </CardFooter>
      </Card>
    </div>
  );
}
