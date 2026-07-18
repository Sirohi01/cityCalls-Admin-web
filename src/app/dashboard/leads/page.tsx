'use client';

import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AppFormField } from '@/components/ui/AppFormField';
import { FormSheet } from '@/components/ui/FormSheet';

import { useLeads, useCreateLead, CreateLeadInput, LEAD_STAGES } from '@/lib/hooks/useLeads';
import { useMasters } from '@/lib/hooks/useMasters';
import { useUsers } from '@/lib/hooks/useUsers';

function AddLeadForm({ close }: { close: () => void }) {
  const createLead = useCreateLead();
  const { data: sources } = useMasters(['LEAD_SOURCE']);
  const { data: users } = useUsers();
  const { register, handleSubmit, formState: { errors } } = useForm<CreateLeadInput>({
    defaultValues: { priority: 'NORMAL' },
  });

  const onSubmit = (values: CreateLeadInput) => {
    createLead.mutate(values, { onSuccess: () => close() });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <AppFormField label="Contact Name" {...register('contactName')} />
      <AppFormField label="Contact Mobile" {...register('contactMobile')} />

      <div className="space-y-1.5">
        <label className="text-sm font-medium">Source</label>
        <select className="w-full h-9 rounded-md border border-input bg-transparent px-3 text-sm" {...register('source', { required: true })}>
          <option value="">Select a source...</option>
          {(sources || []).map((s) => <option key={s._id} value={s.key}>{s.label}</option>)}
        </select>
        {errors.source && <p className="text-sm text-destructive">Select a source</p>}
      </div>

      <div className="space-y-1.5">
        <label className="text-sm font-medium">Priority</label>
        <select className="w-full h-9 rounded-md border border-input bg-transparent px-3 text-sm" {...register('priority')}>
          <option value="LOW">Low</option>
          <option value="NORMAL">Normal</option>
          <option value="HIGH">High</option>
          <option value="URGENT">Urgent</option>
        </select>
      </div>

      <div className="space-y-1.5">
        <label className="text-sm font-medium">Owner</label>
        <select className="w-full h-9 rounded-md border border-input bg-transparent px-3 text-sm" {...register('ownerId', { required: true })}>
          <option value="">Select an owner...</option>
          {(users || []).map((u) => <option key={u._id} value={u._id}>{u.name} ({u.role.replace(/_/g, ' ')})</option>)}
        </select>
        {errors.ownerId && <p className="text-sm text-destructive">Select an owner</p>}
      </div>

      <AppFormField label="Product Interest (Optional)" {...register('productInterest')} />
      <div className="space-y-1.5">
        <label className="text-sm font-medium">Requirement (Optional)</label>
        <textarea
          {...register('requirement')}
          className="flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
        />
      </div>

      {createLead.isError && (
        <p className="text-sm text-destructive">{createLead.error.response?.data?.message ?? 'Failed to create lead.'}</p>
      )}
      <Button type="submit" className="w-full" disabled={createLead.isPending}>
        {createLead.isPending ? 'Creating...' : 'Create Lead'}
      </Button>
    </form>
  );
}

export default function LeadsPipelinePage() {
  const { data: allLeads, isLoading, isError } = useLeads();
  const leads = allLeads || [];

  return (
    <div className="space-y-6 h-[calc(100vh-10rem)] flex flex-col">
      <div className="flex items-center justify-between shrink-0">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Lead Pipeline</h1>
          <p className="text-muted-foreground">Manage leads through the sales cycle.</p>
        </div>
        <div className="space-x-2 flex items-center">
          <Button variant="outline" render={<Link href="/dashboard/leads/list" />}>
            List View
          </Button>
          <Button variant="outline" render={<Link href="/dashboard/leads/import" />}>
            Import Leads
          </Button>
          <FormSheet triggerLabel="Add Lead" title="Add Lead" description="Manually log a new lead into the pipeline.">
            {(close) => <AddLeadForm close={close} />}
          </FormSheet>
        </div>
      </div>

      <div className="flex-1 overflow-x-auto overflow-y-hidden">
        <div className="flex h-full gap-4 min-w-max pb-4">
          {isLoading ? (
            <div className="p-8 text-muted-foreground w-full flex justify-center">Loading leads...</div>
          ) : isError ? (
            <div className="p-8 text-destructive w-full flex justify-center">Failed to load leads.</div>
          ) : LEAD_STAGES.map(stage => {
            const stageLeads = leads.filter(l => l.stage === stage);
            return (
              <div key={stage} className="flex flex-col w-80 shrink-0 bg-slate-100/50 rounded-lg border border-slate-200">
                <div className="p-3 border-b bg-slate-100/80 rounded-t-lg flex justify-between items-center shrink-0">
                  <h3 className="font-semibold text-sm">{stage.replace(/_/g, ' ')}</h3>
                  <Badge variant="secondary">{stageLeads.length}</Badge>
                </div>
                <div className="flex-1 p-3 space-y-3 overflow-y-auto">
                  {stageLeads.map(lead => (
                    <Card key={lead._id} className="cursor-pointer hover:shadow-md transition-shadow">
                      <CardContent className="p-4 space-y-2">
                        <div className="flex justify-between items-start">
                          <Link href={`/dashboard/leads/${lead._id}`} className="font-semibold hover:underline">
                            {lead.contactName || 'Unnamed Lead'}
                          </Link>
                        </div>
                        <div className="text-sm text-muted-foreground">{lead.contactMobile || 'No mobile on file'}</div>
                        <div className="flex justify-between items-center pt-2 mt-2 border-t">
                          <span className="text-xs text-muted-foreground">{lead.number}</span>
                          <span className="text-xs font-semibold text-primary">{lead.source}</span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                  {stageLeads.length === 0 && (
                    <div className="text-center p-4 text-xs text-muted-foreground border-2 border-dashed border-slate-200 rounded-lg">
                      No leads in this stage
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
