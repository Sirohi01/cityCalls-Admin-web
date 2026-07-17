'use client';

import { use, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Phone } from 'lucide-react';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useLead, useAddLeadNote, useConvertLead } from '@/lib/hooks/useLeads';
import { useCalls } from '@/lib/hooks/useCalls';

export default function LeadDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id } = use(params);
  const { data: lead, isLoading, isError } = useLead(id);
  const { data: allCalls } = useCalls();
  const addNote = useAddLeadNote(id);
  const convertLead = useConvertLead(id);
  const [noteText, setNoteText] = useState('');

  if (isLoading) return <div className="p-8 text-center text-muted-foreground">Loading lead details...</div>;
  if (isError || !lead) return <div className="p-8 text-center text-destructive">Failed to load lead details.</div>;

  const relatedCalls = (allCalls || []).filter((c) => c.relatedLeadId === id);

  const handleAddNote = () => {
    if (!noteText.trim()) return;
    addNote.mutate({ text: noteText }, { onSuccess: () => setNoteText('') });
  };

  const handleConvert = () => {
    if (!lead.contactName) {
      alert('This lead has no contact name on file — add one via a note before converting.');
      return;
    }
    convertLead.mutate(
      { convertTo: 'CUSTOMER', name: lead.contactName },
      { onSuccess: () => router.push('/dashboard/customers') }
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Lead: {lead.contactName || lead.number}</h1>
          <p className="text-muted-foreground">{lead.number} • Created on {new Date(lead.createdAt).toLocaleDateString()}</p>
        </div>
        <div className="ml-auto space-x-2">
          <StatusBadge label={lead.stage.replace(/_/g, ' ')} category={lead.stage === 'CONVERTED' ? 'success' : 'info'} />
          {lead.stage !== 'CONVERTED' && (
            <Button onClick={handleConvert} disabled={convertLead.isPending}>
              {convertLead.isPending ? 'Converting...' : 'Convert to Customer'}
            </Button>
          )}
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Contact Info</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2 text-sm">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span>{lead.contactMobile || 'No mobile on file'}</span>
              </div>
              <div className="pt-4 border-t grid grid-cols-2 gap-y-4 text-sm">
                <span className="text-muted-foreground">Source:</span>
                <span className="font-medium text-right">{lead.source}</span>
                <span className="text-muted-foreground">Priority:</span>
                <span className="font-medium text-right">{lead.priority}</span>
                {lead.productInterest && (
                  <>
                    <span className="text-muted-foreground">Interest:</span>
                    <span className="font-medium text-right">{lead.productInterest}</span>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-2">
          <Tabs defaultValue="notes" className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="notes">Notes</TabsTrigger>
              <TabsTrigger value="calls">Call History</TabsTrigger>
            </TabsList>

            <TabsContent value="notes">
              <Card>
                <CardContent className="pt-6 space-y-4">
                  <div className="flex gap-2">
                    <textarea
                      value={noteText}
                      onChange={(e) => setNoteText(e.target.value)}
                      className="flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                      placeholder="Add a note..."
                    />
                  </div>
                  <div className="flex justify-end">
                    <Button size="sm" onClick={handleAddNote} disabled={!noteText.trim() || addNote.isPending}>
                      {addNote.isPending ? 'Saving...' : 'Save Note'}
                    </Button>
                  </div>
                  <div className="space-y-4 pt-4 border-t">
                    {lead.notes.length === 0 && <p className="text-sm text-muted-foreground">No notes yet.</p>}
                    {[...lead.notes].reverse().map((note, i) => (
                      <div key={i} className="text-sm">
                        <span className="text-muted-foreground text-xs">{new Date(note.createdAt).toLocaleString()}</span>
                        <p className="mt-1 text-slate-700">{note.text}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="calls">
              <Card>
                <CardContent className="pt-6">
                  {relatedCalls.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center">No calls logged for this lead yet.</p>
                  ) : (
                    <div className="space-y-3">
                      {relatedCalls.map((c) => (
                        <div key={c._id} className="flex justify-between items-center text-sm border-b pb-2">
                          <span>{c.number} — {c.callType.replace(/_/g, ' ')}</span>
                          <span className="text-muted-foreground text-xs">{new Date(c.createdAt).toLocaleString()}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
