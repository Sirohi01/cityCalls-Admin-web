'use client';

import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

import { useLeads, LEAD_STAGES } from '@/lib/hooks/useLeads';

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
        <div className="space-x-2">
          <Button variant="outline" render={<Link href="/dashboard/leads/list" />}>
            List View
          </Button>
          <Button render={<Link href="/dashboard/leads/import" />}>
            Import Leads
          </Button>
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
