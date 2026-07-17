'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { BrainCircuit, Mic, MessageCircleHeart, Wand2 } from 'lucide-react';

import { useAISettings, useUpdateAISettings, AISettings } from '@/lib/hooks/useAISettings';

export default function AISettingsPage() {
  const { data: settings, isLoading } = useAISettings();
  const updateSettings = useUpdateAISettings();

  const handleToggle = (key: keyof AISettings) => (checked: boolean) => {
    updateSettings.mutate({ [key]: checked });
  };


  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">AI Settings</h1>
          <p className="text-muted-foreground">Configure artificial intelligence features for your workspace.</p>
        </div>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mic className="w-5 h-5 text-indigo-600" /> Auto Call Transcription
            </CardTitle>
            <CardDescription>Automatically transcribe recorded calls to text and store them in the call timeline.</CardDescription>
          </CardHeader>
          <CardContent className="flex items-center justify-between">
            <div className="text-sm font-medium text-slate-700">Enable Transcription Engine</div>
            <Switch 
              checked={settings?.autoTranscriptionEnabled ?? true} 
              onChange={(e) => handleToggle('autoTranscriptionEnabled')(e.target.checked)}
              disabled={isLoading || updateSettings.isPending}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageCircleHeart className="w-5 h-5 text-pink-600" /> Sentiment Analysis
            </CardTitle>
            <CardDescription>Analyze customer sentiment (Happy, Neutral, Angry) during interactions and flag negative experiences.</CardDescription>
          </CardHeader>
          <CardContent className="flex items-center justify-between">
            <div className="text-sm font-medium text-slate-700">Enable Sentiment Tracking</div>
            <Switch 
              checked={settings?.sentimentTrackingEnabled ?? true} 
              onChange={(e) => handleToggle('sentimentTrackingEnabled')(e.target.checked)}
              disabled={isLoading || updateSettings.isPending}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wand2 className="w-5 h-5 text-green-600" /> Smart Dispatch & Assignment
            </CardTitle>
            <CardDescription>Let AI suggest or auto-assign the best technician based on location, skill, and current workload.</CardDescription>
          </CardHeader>
          <CardContent className="flex items-center justify-between border-b pb-4 mb-4">
            <div className="text-sm font-medium text-slate-700">Enable AI Suggestions on Dispatch Board</div>
            <Switch 
              checked={settings?.smartDispatchEnabled ?? true} 
              onChange={(e) => handleToggle('smartDispatchEnabled')(e.target.checked)}
              disabled={isLoading || updateSettings.isPending}
            />
          </CardContent>
          <CardContent className="flex items-center justify-between">
            <div className="text-sm font-medium text-slate-700">Fully Automated Auto-Assignment (Bypass Manual Dispatch)</div>
            <Switch 
              checked={settings?.autoAssignEnabled ?? false} 
              onChange={(e) => handleToggle('autoAssignEnabled')(e.target.checked)}
              disabled={isLoading || updateSettings.isPending}
            />
          </CardContent>
        </Card>

        <Card className="border-indigo-100 bg-indigo-50/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-indigo-900">
              <BrainCircuit className="w-5 h-5 text-indigo-600" /> LLM Configuration
            </CardTitle>
            <CardDescription>Select the underlying AI model powering the intelligence features.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Primary Provider</label>
                <select 
                  className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={settings?.primaryProvider || 'openai'}
                  onChange={(e) => updateSettings.mutate({ primaryProvider: e.target.value })}
                  disabled={isLoading || updateSettings.isPending}
                >
                  <option value="openai">OpenAI (GPT-4o)</option>
                  <option value="anthropic">Anthropic (Claude 3.5)</option>
                  <option value="google">Google (Gemini 1.5 Pro)</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
