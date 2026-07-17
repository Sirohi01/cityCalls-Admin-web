'use client';

import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AppFormField } from '@/components/ui/AppFormField';

export default function CallEntryPage() {
  const router = useRouter();

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Log New Call</h1>
          <p className="text-muted-foreground">Manually enter details for a call interaction.</p>
        </div>
        <Button variant="outline" onClick={() => router.back()}>Cancel</Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Interaction Details</CardTitle>
          <CardDescription>Record the outcome and notes from the phone call.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <AppFormField label="Mobile Number" placeholder="e.g. 9876543210" />
            <AppFormField label="Call Direction" placeholder="Inbound / Outbound" />
          </div>
          
          <div className="grid grid-cols-2 gap-6">
            <AppFormField label="Customer (Optional)" placeholder="Search existing customer..." />
            <AppFormField label="Disposition" placeholder="Sales / Support / Follow-up / Junk" />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium leading-none">Call Notes / Transcript</label>
            <textarea 
              className="flex min-h-[120px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
              placeholder="Enter detailed notes about the conversation..."
            />
          </div>
        </CardContent>
        <CardFooter className="flex justify-end gap-2 bg-muted/50 p-6">
          <Button variant="outline" onClick={() => router.back()}>Cancel</Button>
          <Button onClick={() => router.push('/dashboard/calls')}>Save Call Log</Button>
        </CardFooter>
      </Card>
    </div>
  );
}
