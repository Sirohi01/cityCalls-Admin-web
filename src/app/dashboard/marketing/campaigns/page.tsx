'use client';

import { useForm, useWatch } from 'react-hook-form';
import { DataTable } from '@/components/ui/DataTable';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AppFormField } from '@/components/ui/AppFormField';
import { Separator } from '@/components/ui/separator';
import { Megaphone, Users, Send } from 'lucide-react';

import { useCampaigns, useCreateCampaign, useSendCampaign, Campaign } from '@/lib/hooks/useCampaigns';
import { useNotificationTemplates } from '@/lib/hooks/useNotificationTemplates';
import { useMasters, Master } from '@/lib/hooks/useMasters';

interface CampaignFormValues {
  name: string;
  channel: 'WHATSAPP' | 'EMAIL';
  templateId: string;
  tags: string;
  segments: string;
  customerType: string;
  scheduledAt: string;
}

function audienceSummary(campaign: Campaign, customerTypes?: Master[]) {
  const parts: string[] = [];
  if (campaign.audienceFilter.tags?.length) parts.push(`tags: ${campaign.audienceFilter.tags.join(', ')}`);
  if (campaign.audienceFilter.segments?.length) parts.push(`segments: ${campaign.audienceFilter.segments.join(', ')}`);
  if (campaign.audienceFilter.customerType) {
    const label = customerTypes?.find((t) => t.key === campaign.audienceFilter.customerType)?.label ?? campaign.audienceFilter.customerType;
    parts.push(label);
  }
  return parts.length ? parts.join(' · ') : 'All customers';
}

function CreateCampaignForm() {
  const createCampaign = useCreateCampaign();
  const { data: templates } = useNotificationTemplates();
  const { data: customerTypes } = useMasters(['CUSTOMER_TYPE']);
  const { register, handleSubmit, control, reset } = useForm<CampaignFormValues>({
    defaultValues: { channel: 'WHATSAPP', tags: '', segments: '', customerType: '', scheduledAt: '' },
  });
  const channel = useWatch({ control, name: 'channel' });
  const eligibleTemplates = (templates || []).filter((t) => t.channel === channel);

  const onSubmit = (values: CampaignFormValues) => {
    createCampaign.mutate(
      {
        name: values.name,
        channel: values.channel,
        templateId: values.templateId,
        audienceFilter: {
          tags: values.tags ? values.tags.split(',').map((t) => t.trim()).filter(Boolean) : [],
          segments: values.segments ? values.segments.split(',').map((s) => s.trim()).filter(Boolean) : [],
          customerType: values.customerType || undefined,
        },
        scheduledAt: values.scheduledAt || undefined,
      },
      { onSuccess: () => reset({ channel: 'WHATSAPP', tags: '', segments: '', customerType: '', scheduledAt: '', name: '', templateId: '' }) }
    );
  };

  return (
    <Card className="max-w-4xl border-indigo-100">
      <CardHeader className="bg-indigo-50/50">
        <CardTitle className="flex items-center gap-2 text-indigo-900">
          <Megaphone className="w-5 h-5 text-indigo-600" />
          Setup Campaign
        </CardTitle>
        <CardDescription>Filter your audience by tag/segment and select an approved message template.</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="space-y-8 pt-6">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Users className="w-5 h-5 text-slate-400" /> 1. Target Audience
            </h3>
            <div className="grid grid-cols-2 gap-6 p-4 border rounded-lg bg-slate-50">
              <AppFormField label="Tags (comma-separated, optional)" placeholder="e.g., out-of-warranty, amc-expiring" {...register('tags')} />
              <AppFormField label="Segments (comma-separated, optional)" placeholder="e.g., delhi-ncr" {...register('segments')} />
              <div className="space-y-1.5">
                <label className="text-sm font-medium">Customer Type (Optional)</label>
                <select className="w-full h-9 rounded-md border border-input bg-transparent px-3 text-sm" {...register('customerType')}>
                  <option value="">Any</option>
                  {customerTypes?.map((t) => (
                    <option key={t._id} value={t.key}>{t.label}</option>
                  ))}
                </select>
              </div>
              <div className="col-span-2 text-xs text-slate-500">
                Only customers who granted marketing consent for this channel will be included. Reach is determined at send time — no pre-send estimate is available.
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Megaphone className="w-5 h-5 text-slate-400" /> 2. Content
            </h3>
            <div className="grid grid-cols-2 gap-6 p-4 border rounded-lg bg-slate-50">
              <AppFormField label="Campaign Name" placeholder="e.g., Summer Discount Push" {...register('name', { required: true })} />
              <div className="space-y-1.5">
                <label className="text-sm font-medium">Channel</label>
                <select className="w-full h-9 rounded-md border border-input bg-transparent px-3 text-sm" {...register('channel', { required: true })}>
                  <option value="WHATSAPP">WhatsApp</option>
                  <option value="EMAIL">Email</option>
                </select>
              </div>
              <div className="col-span-2 space-y-1.5">
                <label className="text-sm font-medium">Message Template</label>
                <select className="w-full h-9 rounded-md border border-input bg-transparent px-3 text-sm" {...register('templateId', { required: true })}>
                  <option value="">Select an approved template...</option>
                  {eligibleTemplates.map((t) => (
                    <option key={t._id} value={t._id}>{t.triggerKey}</option>
                  ))}
                </select>
                {eligibleTemplates.length === 0 && (
                  <p className="text-xs text-amber-600">No {channel} templates available.</p>
                )}
              </div>
            </div>
          </div>

          {createCampaign.isError && (
            <p className="text-sm text-destructive">{createCampaign.error.response?.data?.message ?? 'Failed to create campaign.'}</p>
          )}
          {createCampaign.isSuccess && <p className="text-sm text-green-600">Campaign created. Send it from the campaign list.</p>}
        </CardContent>
        <div className="flex justify-end border-t p-6 pt-6">
          <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700 gap-2" disabled={createCampaign.isPending}>
            <Send className="w-4 h-4" /> {createCampaign.isPending ? 'Saving...' : 'Save Campaign'}
          </Button>
        </div>
      </form>
    </Card>
  );
}

export default function CampaignsPage() {
  const { data: campaigns, isLoading, isError } = useCampaigns();
  const { data: customerTypes } = useMasters(['CUSTOMER_TYPE']);
  const sendCampaign = useSendCampaign();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between pb-1 mb-1.5 border-b border-border/50">
        <div>
          <h1 className="text-lg font-medium tracking-tight text-foreground">Marketing Campaigns</h1>
          <p className="text-[13px] text-muted-foreground">Launch targeted WhatsApp/Email campaigns to consented customer segments.</p>
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
                <>
                {/* <p className="text-sm text-muted-foreground mb-2">{campaigns?.length ?? 0} campaigns</p> */}
                <DataTable<Campaign>
                  data={campaigns || []}
                  pageSize={10}
                  columns={[
                    { key: 'name', header: 'Campaign Name' },
                    { key: 'audience', header: 'Audience', render: (item) => <span className="text-sm">{audienceSummary(item, customerTypes)}</span> },
                    {
                      key: 'sent',
                      header: 'Sent / Failed',
                      render: (item) => <span className="font-semibold text-slate-700">{item.stats.sent} / {item.stats.failed}</span>,
                    },
                    {
                      key: 'status',
                      header: 'Status',
                      render: (item) => (
                        <StatusBadge
                          label={item.status}
                          category={item.status === 'COMPLETED' ? 'success' : item.status === 'CANCELLED' ? 'error' : 'default'}
                        />
                      ),
                    },
                    { key: 'createdAt', header: 'Created On', render: (item) => new Date(item.createdAt).toLocaleDateString() },
                    {
                      key: 'action',
                      header: '',
                      render: (item) =>
                        item.status === 'DRAFT' || item.status === 'SCHEDULED' ? (
                          <Button
                            size="sm"
                            className="bg-indigo-600 hover:bg-indigo-700 gap-1"
                            onClick={() => sendCampaign.mutate(item._id)}
                            disabled={sendCampaign.isPending}
                          >
                            <Send className="w-3 h-3" /> Send Now
                          </Button>
                        ) : (
                          <span className="text-sm text-muted-foreground">—</span>
                        ),
                    },
                  ]}
                />
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="create">
          <CreateCampaignForm />
        </TabsContent>
      </Tabs>
    </div>
  );
}
