'use client';

import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AppFormField } from '@/components/ui/AppFormField';
import { useCreateCall, CALL_TYPES, CALL_DIRECTIONS } from '@/lib/hooks/useCalls';
import { useCustomers } from '@/lib/hooks/useCustomers';

const callEntrySchema = z.object({
  callerNumber: z.string().min(10, 'Enter a valid mobile number'),
  direction: z.enum(CALL_DIRECTIONS),
  callType: z.enum(CALL_TYPES),
  customerId: z.string().optional(),
  notes: z.string().optional(),
});
type CallEntryValues = z.infer<typeof callEntrySchema>;

export default function CallEntryPage() {
  const router = useRouter();
  const createCall = useCreateCall();
  const { data: customers } = useCustomers();
  const { register, handleSubmit, formState: { errors } } = useForm<CallEntryValues>({
    resolver: zodResolver(callEntrySchema),
    defaultValues: { direction: 'INCOMING', callType: 'INITIAL' },
  });

  const onSubmit = (values: CallEntryValues) => {
    const now = new Date();
    const customer = customers?.find((c) => c._id === values.customerId);
    createCall.mutate(
      {
        callerNumber: values.callerNumber,
        direction: values.direction,
        callType: values.callType,
        customerId: values.customerId || undefined,
        customerName: customer?.name,
        notes: values.notes,
        callDate: now.toISOString().slice(0, 10),
        callTime: now.toTimeString().slice(0, 5),
      },
      { onSuccess: () => router.push('/dashboard/calls') }
    );
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Log New Call</h1>
          <p className="text-muted-foreground">Manually enter details for a call interaction.</p>
        </div>
        <Button variant="outline" onClick={() => router.back()}>Cancel</Button>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Card>
          <CardHeader>
            <CardTitle>Interaction Details</CardTitle>
            <CardDescription>Record the outcome and notes from the phone call.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <AppFormField label="Mobile Number" placeholder="e.g. 9876543210" error={errors.callerNumber?.message} {...register('callerNumber')} />
              <div className="space-y-1.5">
                <label className="text-sm font-medium">Call Direction</label>
                <select className="w-full h-9 rounded-md border border-input bg-transparent px-3 text-sm" {...register('direction')}>
                  <option value="INCOMING">Incoming</option>
                  <option value="OUTGOING">Outgoing</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-1.5">
                <label className="text-sm font-medium">Customer (Optional)</label>
                <select className="w-full h-9 rounded-md border border-input bg-transparent px-3 text-sm" {...register('customerId')}>
                  <option value="">No matching customer</option>
                  {(customers || []).map((c) => (
                    <option key={c._id} value={c._id}>{c.name} ({c.contacts.find((ct) => ct.isPrimary)?.mobile ?? c.contacts[0]?.mobile})</option>
                  ))}
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium">Call Type</label>
                <select className="w-full h-9 rounded-md border border-input bg-transparent px-3 text-sm" {...register('callType')}>
                  {CALL_TYPES.map((t) => <option key={t} value={t}>{t.replace(/_/g, ' ')}</option>)}
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium leading-none">Call Notes / Transcript</label>
              <textarea
                {...register('notes')}
                className="flex min-h-[120px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="Enter detailed notes about the conversation..."
              />
            </div>
            {createCall.isError && (
              <p className="text-sm text-destructive">{createCall.error.response?.data?.message ?? 'Failed to save call log.'}</p>
            )}
          </CardContent>
          <CardFooter className="flex justify-end gap-2 bg-muted/50 p-6">
            <Button type="button" variant="outline" onClick={() => router.back()}>Cancel</Button>
            <Button type="submit" disabled={createCall.isPending}>
              {createCall.isPending ? 'Saving...' : 'Save Call Log'}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
}
