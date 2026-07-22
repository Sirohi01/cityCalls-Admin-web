'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { BrainCircuit, Mic, MessageCircleHeart, Power } from 'lucide-react';

import { useAISettings, useUpdateAISettings } from '@/lib/hooks/useAISettings';

export default function AISettingsPage() {
  const { data: settings, isLoading } = useAISettings();
  const updateSettings = useUpdateAISettings();
  const disabled = isLoading || updateSettings.isPending;

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center justify-between pb-1 mb-1.5 border-b border-border/50">
        <div>
          <h1 className="text-lg font-medium tracking-tight text-foreground">AI Settings</h1>
          <p className="text-[13px] text-muted-foreground">Configure artificial intelligence features for your workspace.</p>
        </div>
      </div>

      <div className="grid gap-6">
        <Card className="border-indigo-100 bg-indigo-50/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-indigo-900">
              <Power className="w-5 h-5 text-indigo-600" /> AI Features
            </CardTitle>
            <CardDescription>Global kill switch — when off, no AI feature runs regardless of the toggles below.</CardDescription>
          </CardHeader>
          <CardContent className="flex items-center justify-between">
            <div className="text-sm font-medium text-slate-700">Enable AI Features</div>
            <Switch
              checked={settings?.enabled ?? false}
              onChange={(e) => updateSettings.mutate({ enabled: e.target.checked })}
              disabled={disabled}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mic className="w-5 h-5 text-indigo-600" /> Call Summarization
            </CardTitle>
            <CardDescription>Generate an AI summary of a call from its notes or a linked recording.</CardDescription>
          </CardHeader>
          <CardContent className="flex items-center justify-between">
            <div className="text-sm font-medium text-slate-700">Enable Call Summarization</div>
            <Switch
              checked={settings?.featureFlags.CALL_SUMMARIZATION ?? false}
              onChange={(e) => updateSettings.mutate({ featureFlags: { CALL_SUMMARIZATION: e.target.checked } })}
              disabled={disabled}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageCircleHeart className="w-5 h-5 text-pink-600" /> Complaint Classification
            </CardTitle>
            <CardDescription>Automatically classify complaint text into categories using AI.</CardDescription>
          </CardHeader>
          <CardContent className="flex items-center justify-between">
            <div className="text-sm font-medium text-slate-700">Enable Complaint Classification</div>
            <Switch
              checked={settings?.featureFlags.COMPLAINT_CLASSIFICATION ?? false}
              onChange={(e) => updateSettings.mutate({ featureFlags: { COMPLAINT_CLASSIFICATION: e.target.checked } })}
              disabled={disabled}
            />
          </CardContent>
        </Card>

        <Card className="border-indigo-100 bg-indigo-50/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-indigo-900">
              <BrainCircuit className="w-5 h-5 text-indigo-600" /> LLM Configuration & Usage Limits
            </CardTitle>
            <CardDescription>Select the underlying AI provider/model and set daily usage caps.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Provider</label>
                <select
                  className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={settings?.provider ?? 'GEMINI'}
                  onChange={(e) => updateSettings.mutate({ provider: e.target.value as 'GEMINI' | 'OPENAI' })}
                  disabled={disabled}
                >
                  <option value="GEMINI">Google Gemini</option>
                  <option value="OPENAI">OpenAI</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Model</label>
                <input
                  type="text"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  defaultValue={settings?.aiModel ?? ''}
                  onBlur={(e) => e.target.value && updateSettings.mutate({ model: e.target.value })}
                  disabled={disabled}
                  placeholder="e.g. gemini-1.5-flash"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Max Requests / Day</label>
                <input
                  type="number"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  defaultValue={settings?.usageLimits.maxRequestsPerDay ?? 0}
                  onBlur={(e) => updateSettings.mutate({ usageLimits: { maxRequestsPerDay: Number(e.target.value) } })}
                  disabled={disabled}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Max Tokens / Day</label>
                <input
                  type="number"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  defaultValue={settings?.usageLimits.maxTokensPerDay ?? 0}
                  onBlur={(e) => updateSettings.mutate({ usageLimits: { maxTokensPerDay: Number(e.target.value) } })}
                  disabled={disabled}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
