'use client';

import { useState, useMemo } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { DataTable } from '@/components/ui/DataTable';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AppFormField } from '@/components/ui/AppFormField';
import { FormSheet } from '@/components/ui/FormSheet';
import { Separator } from '@/components/ui/separator';
import { Megaphone, Users, Send, Pencil, Trash2, Search } from 'lucide-react';
import { toast } from 'sonner';

import { useCampaigns, useCreateCampaign, useSendCampaign, Campaign, useUpdateCampaign, useDeleteCampaign } from '@/lib/hooks/useCampaigns';
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
    <Card className="animate-in slide-in-from-right-4 fade-in duration-500 mt-2">
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="space-y-6 pt-5">
          
          <div className="space-y-3">
            <div className="space-y-1 border-b border-border/50 pb-1 mb-2">
              <h2 className="text-sm font-semibold text-foreground flex items-center gap-2">
                <Users className="w-4 h-4 text-indigo-600" /> 1. Target Audience
              </h2>
              <p className="text-[13px] text-muted-foreground">Filter your audience by tag, segment, or customer type.</p>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <AppFormField label="Tags (comma-separated, optional)" placeholder="e.g., out-of-warranty, amc-expiring" {...register('tags')} />
              <AppFormField label="Segments (comma-separated, optional)" placeholder="e.g., delhi-ncr" {...register('segments')} />
              
              <div className="space-y-1.5">
                <label className="text-sm font-medium">Customer Type (Optional)</label>
                <select className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring" {...register('customerType')}>
                  <option value="">Any</option>
                  {customerTypes?.map((t) => (
                    <option key={t._id} value={t.key}>{t.label}</option>
                  ))}
                </select>
              </div>

              <div className="col-span-2 mt-2">
                <div className="bg-slate-50 border border-slate-200 rounded-md p-3 text-[12.5px] text-slate-600 leading-relaxed">
                  <span className="font-semibold text-slate-700">Note:</span> Only customers who granted marketing consent for this channel will be included. Reach is determined at send time — no pre-send estimate is available.
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-3 pt-2">
            <div className="space-y-1 border-b border-border/50 pb-1 mb-2">
              <h2 className="text-sm font-semibold text-foreground flex items-center gap-2">
                <Megaphone className="w-4 h-4 text-indigo-600" /> 2. Content
              </h2>
              <p className="text-[13px] text-muted-foreground">Set campaign name and approved message template.</p>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <AppFormField label="Campaign Name" placeholder="e.g., Summer Discount Push" {...register('name', { required: true })} />
              
              <div className="space-y-1.5">
                <label className="text-sm font-medium">Channel</label>
                <select className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring" {...register('channel', { required: true })}>
                  <option value="WHATSAPP">WhatsApp</option>
                  <option value="EMAIL">Email</option>
                </select>
              </div>

              <div className="col-span-2 space-y-1.5">
                <label className="text-sm font-medium">Message Template</label>
                <select className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring" {...register('templateId', { required: true })}>
                  <option value="">Select an approved template...</option>
                  {eligibleTemplates.map((t) => (
                    <option key={t._id} value={t._id}>{t.triggerKey}</option>
                  ))}
                </select>
                {eligibleTemplates.length === 0 && (
                  <p className="text-xs text-amber-600 mt-1">No {channel} templates available.</p>
                )}
              </div>
            </div>
          </div>

          {createCampaign.isError && (
            <p className="text-sm text-destructive">{createCampaign.error.response?.data?.message ?? 'Failed to create campaign.'}</p>
          )}
          {createCampaign.isSuccess && <p className="text-sm text-green-600">Campaign created. Send it from the campaign list.</p>}
        </CardContent>
        <div className="flex justify-end gap-2 bg-muted/30 p-4 border-t border-border/50">
          <Button type="button" variant="ghost" onClick={() => reset()}>Reset</Button>
          <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700 gap-2" disabled={createCampaign.isPending}>
            <Send className="w-4 h-4" /> {createCampaign.isPending ? 'Saving...' : 'Save Campaign'}
          </Button>
        </div>
      </form>
    </Card>
  );
}

function UpdateCampaignForm({ campaign, onClose }: { campaign: Campaign; onClose: () => void }) {
  const updateCampaign = useUpdateCampaign();
  const { data: templates } = useNotificationTemplates();
  const { data: customerTypes } = useMasters(['CUSTOMER_TYPE']);
  const { register, handleSubmit, control } = useForm<CampaignFormValues>({
    defaultValues: {
      name: campaign.name,
      channel: campaign.channel,
      templateId: campaign.templateId,
      tags: campaign.audienceFilter.tags?.join(', ') || '',
      segments: campaign.audienceFilter.segments?.join(', ') || '',
      customerType: campaign.audienceFilter.customerType || '',
      scheduledAt: campaign.scheduledAt || '',
    },
  });
  const channel = useWatch({ control, name: 'channel' });
  const eligibleTemplates = (templates || []).filter((t) => t.channel === channel);

  const onSubmit = (values: CampaignFormValues) => {
    updateCampaign.mutate(
      {
        id: campaign._id,
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
      { onSuccess: onClose }
    );
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <AppFormField label="Campaign Name" {...register('name', { required: true })} />
      <div className="space-y-1.5">
        <label className="text-sm font-medium">Channel</label>
        <select className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm" {...register('channel', { required: true })}>
          <option value="WHATSAPP">WhatsApp</option>
          <option value="EMAIL">Email</option>
        </select>
      </div>
      <div className="space-y-1.5">
        <label className="text-sm font-medium">Message Template</label>
        <select className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm" {...register('templateId', { required: true })}>
          <option value="">Select template...</option>
          {eligibleTemplates.map((t) => <option key={t._id} value={t._id}>{t.triggerKey}</option>)}
        </select>
      </div>
      <AppFormField label="Tags (comma-separated)" {...register('tags')} />
      <AppFormField label="Segments (comma-separated)" {...register('segments')} />
      <div className="space-y-1.5">
        <label className="text-sm font-medium">Customer Type</label>
        <select className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm" {...register('customerType')}>
          <option value="">Any</option>
          {customerTypes?.map((t) => <option key={t._id} value={t.key}>{t.label}</option>)}
        </select>
      </div>
      <Button type="submit" className="w-full" disabled={updateCampaign.isPending}>
        {updateCampaign.isPending ? 'Saving...' : 'Save Changes'}
      </Button>
    </form>
  );
}

export default function CampaignsPage() {
  const { data: campaigns, isLoading, isError } = useCampaigns();
  const { data: customerTypes } = useMasters(['CUSTOMER_TYPE']);
  const sendCampaign = useSendCampaign();
  const deleteCampaign = useDeleteCampaign();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredCampaigns = useMemo(() => {
    if (!campaigns) return [];
    if (!searchTerm) return campaigns;
    const lowerQ = searchTerm.toLowerCase();
    return campaigns.filter(c => 
      c.name.toLowerCase().includes(lowerQ) ||
      c.status.toLowerCase().includes(lowerQ)
    );
  }, [campaigns, searchTerm]);

  const handleDelete = (id: string) => {
    deleteCampaign.mutate(id, {
      onSuccess: () => toast.success('Campaign deleted successfully'),
      onError: () => toast.error('Failed to delete campaign'),
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between pb-1 mb-1.5 border-b border-border/50">
        <div>
          <h1 className="text-lg font-medium tracking-tight text-foreground">Marketing Campaigns</h1>
          <p className="text-[13px] text-muted-foreground">Launch targeted WhatsApp/Email campaigns to consented customer segments.</p>
        </div>
      </div>

      <Tabs defaultValue="list" className="w-full">
        <div className="flex items-center justify-between mb-4">
          <TabsList>
            <TabsTrigger value="list">All Campaigns</TabsTrigger>
            <TabsTrigger value="create">Launch New Campaign</TabsTrigger>
          </TabsList>

          <div className="relative">
            <Search className="absolute left-2.5 top-2 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search campaigns..."
              className="w-64 pl-9 bg-background h-8 text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <TabsContent value="list">
          <Card className="animate-in slide-in-from-right-4 fade-in duration-500 mt-2">
            <CardContent className="p-0">
              {isLoading ? (
                <div className="flex justify-center p-8 text-muted-foreground">Loading campaigns...</div>
              ) : isError ? (
                <div className="flex justify-center p-8 text-destructive">Failed to load campaigns.</div>
              ) : (
                <>
                {/* <p className="text-sm text-muted-foreground mb-2">{campaigns?.length ?? 0} campaigns</p> */}
                <DataTable<Campaign>
                  data={filteredCampaigns}
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
                      header: 'Action',
                      render: (item) => (
                        <div className="flex items-center gap-2">
                          {item.status === 'DRAFT' || item.status === 'SCHEDULED' ? (
                            <Button
                              size="sm"
                              className="bg-indigo-600 hover:bg-indigo-700 gap-1"
                              onClick={() => sendCampaign.mutate(item._id)}
                              disabled={sendCampaign.isPending}
                            >
                              <Send className="w-3 h-3" /> Send Now
                            </Button>
                          ) : null}
                          <FormSheet
                            triggerLabel="Edit"
                            title="Edit Campaign"
                            description={`Update details for ${item.name}`}
                            triggerElement={<Button size="icon" variant="ghost" className="h-8 w-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50"><Pencil className="w-4 h-4" /></Button>}
                          >
                            {(close) => <UpdateCampaignForm campaign={item} onClose={close} />}
                          </FormSheet>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50" onClick={() => handleDelete(item._id)} disabled={deleteCampaign.isPending}>
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
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
