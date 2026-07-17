'use client';

import { use } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Mail, Phone } from 'lucide-react';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function LeadDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id } = use(params);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Lead: Hotel Taj</h1>
          <p className="text-muted-foreground">{id} • Created on 2026-07-16</p>
        </div>
        <div className="ml-auto space-x-2">
          <StatusBadge label="Contacted" category="info" />
          <Button>Convert to Customer</Button>
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
                <span>9988776655</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span>admin@taj.com</span>
              </div>
              <div className="pt-4 border-t grid grid-cols-2 gap-y-4 text-sm">
                <span className="text-muted-foreground">Source:</span>
                <span className="font-medium text-right">Referral</span>
                <span className="text-muted-foreground">Value:</span>
                <span className="font-medium text-right text-primary">₹1,50,000</span>
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
                      className="flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                      placeholder="Add a note..."
                    />
                  </div>
                  <div className="flex justify-end">
                    <Button size="sm">Save Note</Button>
                  </div>
                  <div className="space-y-4 pt-4 border-t">
                    <div className="text-sm">
                      <span className="font-semibold">System</span>
                      <span className="text-muted-foreground ml-2 text-xs">2026-07-16 10:00 AM</span>
                      <p className="mt-1 text-slate-700">Lead captured via referral form.</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="calls">
              <Card>
                <CardContent className="pt-6 text-sm text-muted-foreground text-center">
                  No calls logged yet.
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
