'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Star } from 'lucide-react';
import { Suspense, useState } from 'react';
import { useRecordHappyCallOutcome } from '@/lib/hooks/useHappyCalls';

export default function HappyCallEntryPage() {
  return (
    <Suspense>
      <HappyCallEntryForm />
    </Suspense>
  );
}

function HappyCallEntryForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const happyCallId = searchParams.get('id') ?? '';
  const recordOutcome = useRecordHappyCallOutcome(happyCallId);

  const [resolved, setResolved] = useState<'yes' | 'no' | ''>('');
  const [rating, setRating] = useState(0);
  const [remarks, setRemarks] = useState('');

  const handleSubmit = () => {
    if (!happyCallId) return;
    recordOutcome.mutate(
      {
        status: 'COMPLETED',
        customerSatisfaction: rating || undefined,
        remarks: remarks || undefined,
        reopenRequested: resolved === 'no',
      },
      { onSuccess: () => router.push('/dashboard/happy-calls') }
    );
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Log Happy Call</h1>
          <p className="text-muted-foreground">Record customer feedback.</p>
        </div>
        <Button variant="outline" onClick={() => router.back()}>Cancel</Button>
      </div>

      {!happyCallId && (
        <p className="text-sm text-destructive">No happy call selected — go back to the list and click &quot;Log Call&quot; on a pending entry.</p>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Customer Feedback</CardTitle>
          <CardDescription>Ask the customer the following questions regarding their recent service experience.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">

          <div className="space-y-4">
            <label className="text-sm font-bold text-slate-800">1. Was your issue completely resolved?</label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer border p-3 rounded-md hover:bg-slate-50 flex-1">
                <input type="radio" name="resolved" value="yes" checked={resolved === 'yes'} onChange={() => setResolved('yes')} className="w-4 h-4 accent-primary" />
                <span className="font-medium text-green-700">Yes, fully resolved</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer border p-3 rounded-md hover:bg-slate-50 flex-1">
                <input type="radio" name="resolved" value="no" checked={resolved === 'no'} onChange={() => setResolved('no')} className="w-4 h-4 accent-red-600" />
                <span className="font-medium text-red-600">No, issue persists (Request Reopen)</span>
              </label>
            </div>
          </div>

          <div className="space-y-4">
            <label className="text-sm font-bold text-slate-800">2. How would you rate the service experience?</label>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  onClick={() => setRating(star)}
                  className={`w-10 h-10 cursor-pointer transition-colors ${rating >= star ? 'fill-yellow-400 text-yellow-400' : 'text-slate-300'}`}
                />
              ))}
              <span className="ml-4 font-bold text-lg text-slate-500">{rating} / 5</span>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-800">3. Any additional comments from the customer?</label>
            <textarea
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              className="flex min-h-[100px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              placeholder="Type customer's feedback or complaints here..."
            />
          </div>

          {recordOutcome.isError && (
            <p className="text-sm text-destructive">{recordOutcome.error.response?.data?.message ?? 'Failed to submit feedback.'}</p>
          )}
        </CardContent>
        <CardFooter className="flex justify-end bg-slate-50 p-6 border-t">
          <Button onClick={handleSubmit} disabled={!happyCallId || recordOutcome.isPending} className="bg-green-600 hover:bg-green-700">
            {recordOutcome.isPending ? 'Submitting...' : 'Submit Feedback'}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
