'use client';

import { useState } from 'react';
import { DataTable } from '@/components/ui/DataTable';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AppFormField } from '@/components/ui/AppFormField';
import { Megaphone, Users, Send } from 'lucide-react';

import { useCampaigns } from '@/lib/hooks/useCampaigns';

export default function CampaignsPage() {
  const { data: campaigns, isLoading, isError } = useCampaigns();


  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Marketing Campaigns</h1>
          <p className="text-muted-foreground">Launch targeted promotional offers and bulk updates.</p>
        </div>
      </div>

      <Tabs defaultValue="list" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="list">All Campaigns</TabsTrigger>
          <TabsTrigger value="create">Launch New Campaign</TabsTrigger>
        </TabsList>
        
        <TabsContent value="list">
          <Card>
            <CardHeader>
              <CardTitle>Campaign History</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex justify-center p-8 text-muted-foreground">Loading campaigns...</div>
              ) : isError ? (
                <div className="flex justify-center p-8 text-destructive">Failed to load campaigns.</div>
              ) : (
                <DataTable 
                  data={campaigns || []}
                  columns={[
                    { key: 'name', header: 'Campaign Name' },
                    { key: 'targetAudience', header: 'Audience Group' },
                    { 
                      key: 'sentCount', 
                      header: 'Reach',
                      render: (item) => <span className="font-semibold text-slate-700">{(item.sentCount || 0).toLocaleString()} Users</span>
                    },
                    { 
                      key: 'status', 
                      header: 'Status',
                      render: (item) => (
                        <StatusBadge 
                          label={item.status} 
                          category={item.status === 'ACTIVE' ? 'success' : 'default'} 
                        />
                      )
                    },
                    { 
                      key: 'createdAt', 
                      header: 'Launched On',
                      render: (item) => new Date(item.createdAt).toLocaleDateString()
                    },
                    {
                      key: 'action',
                      header: 'Analytics',
                      render: () => <Button size="sm" variant="outline">View Report</Button>
                    }
                  ]}
                />
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="create">
          <Card className="max-w-4xl border-indigo-100">
            <CardHeader className="bg-indigo-50/50">
              <CardTitle className="flex items-center gap-2 text-indigo-900">
                <Megaphone className="w-5 h-5 text-indigo-600" />
                Setup Campaign
              </CardTitle>
              <CardDescription>Filter your audience and select a message template to blast.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-8 pt-6">
              
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Users className="w-5 h-5 text-slate-400" /> 1. Target Audience
                </h3>
                <div className="grid grid-cols-2 gap-6 p-4 border rounded-lg bg-slate-50">
                  <AppFormField label="Audience Segment" placeholder="e.g., Out of Warranty Customers" />
                  <AppFormField label="Region Filter (Optional)" placeholder="e.g., Delhi NCR" />
                  <div className="col-span-2 text-sm text-indigo-600 font-medium">
                    Estimated Reach: ~450 Customers matched.
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Megaphone className="w-5 h-5 text-slate-400" /> 2. Content
                </h3>
                <div className="grid grid-cols-2 gap-6 p-4 border rounded-lg bg-slate-50">
                  <AppFormField label="Campaign Name" placeholder="e.g., Summer Discount Push" />
                  <AppFormField label="Message Template" placeholder="Select an approved template..." />
                </div>
              </div>

              <div className="flex justify-end border-t pt-6">
                <Button className="bg-indigo-600 hover:bg-indigo-700 gap-2">
                  <Send className="w-4 h-4" /> Launch Campaign
                </Button>
              </div>

            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
