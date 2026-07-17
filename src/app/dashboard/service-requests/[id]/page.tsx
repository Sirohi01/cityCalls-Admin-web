'use client';

import { use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, User, CheckCircle2, Navigation, Wrench, UserCog } from 'lucide-react';
import { StatusBadge } from '@/components/ui/StatusBadge';

import { useServiceRequest } from '@/lib/hooks/useServiceRequests';

export default function ServiceRequestDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id } = use(params);
  const { data: ticket, isLoading, isError } = useServiceRequest(id);

  if (isLoading) return <div className="p-8 text-center text-muted-foreground">Loading ticket details...</div>;
  if (isError || !ticket) return <div className="p-8 text-center text-destructive">Failed to load ticket details or ticket not found.</div>;


  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Request: {ticket.number}</h1>
          <p className="text-muted-foreground">Service Ticket • Created on {new Date(ticket.createdAt).toLocaleDateString()}</p>
        </div>
        <div className="ml-auto space-x-2 flex items-center">
          <span className={`text-sm font-bold mr-4 ${ticket.priority === 'HIGH' || ticket.priority === 'URGENT' ? 'text-red-600' : 'text-slate-600'}`}>
            {ticket.priority} Priority
          </span>
          <StatusBadge label={ticket.status} category={ticket.status === 'NEW' ? 'error' : 'info'} />
        </div>
      </div>

      {/* Status Transition Ribbon */}
      <Card className="bg-slate-50">
        <CardContent className="p-6">
          <div className="flex items-center justify-between relative before:absolute before:inset-0 before:top-1/2 before:-translate-y-1/2 before:h-0.5 before:w-full before:bg-slate-200">
            <div className="relative z-10 flex flex-col items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center border-4 border-white shadow-sm">
                <span className="text-xs font-bold">1</span>
              </div>
              <span className="text-xs font-bold text-primary">Open</span>
            </div>
            <div className="relative z-10 flex flex-col items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-slate-200 text-slate-500 flex items-center justify-center border-4 border-white shadow-sm">
                <span className="text-xs font-bold">2</span>
              </div>
              <span className="text-xs font-medium text-slate-500">Assigned</span>
            </div>
            <div className="relative z-10 flex flex-col items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-slate-200 text-slate-500 flex items-center justify-center border-4 border-white shadow-sm">
                <span className="text-xs font-bold">3</span>
              </div>
              <span className="text-xs font-medium text-slate-500">In-Progress</span>
            </div>
            <div className="relative z-10 flex flex-col items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-slate-200 text-slate-500 flex items-center justify-center border-4 border-white shadow-sm">
                <span className="text-xs font-bold">4</span>
              </div>
              <span className="text-xs font-medium text-slate-500">Resolved</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Issue Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-orange-50 text-orange-800 p-4 rounded-md border border-orange-100 text-sm">
                <span className="font-bold">Symptoms Reported:</span> 
                <p className="mt-1">Customer reported that the AC turns on, but throws warm air. Display shows Error Code E4.</p>
              </div>
              <div className="grid grid-cols-2 gap-y-4 text-sm pt-2">
                <span className="text-muted-foreground">Appliance:</span>
                <span className="font-medium">LG Split AC (1.5 Ton)</span>
                <span className="text-muted-foreground">Warranty Status:</span>
                <span className="font-medium text-red-600">Out of Warranty</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Activity Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-300 before:to-transparent">
                <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white bg-blue-100 text-blue-600 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
                    <UserCog className="w-4 h-4" />
                  </div>
                  <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded border border-slate-200 bg-white shadow-sm">
                    <div className="flex items-center justify-between space-x-2 mb-1">
                      <div className="font-bold text-slate-900 text-sm">Ticket Created</div>
                      <time className="font-mono text-xs text-slate-500">10:20 AM</time>
                    </div>
                    <div className="text-slate-500 text-xs">By System via Call Log CALL-101</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Customer Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center">
                  <User className="h-5 w-5 text-slate-500" />
                </div>
                <div>
                  <p className="text-sm font-medium">{ticket.customer?.name || 'Unknown'}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Assignment</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center p-6 border-2 border-dashed border-slate-200 rounded-lg">
                {ticket.assignedToUser || ticket.assignedToVendor ? (
                  <p className="text-sm font-medium mb-4">Assigned to: {ticket.assignedToUser?.name || ticket.assignedToVendor?.name}</p>
                ) : (
                  <p className="text-sm text-muted-foreground mb-4">No technician assigned yet.</p>
                )}
                <Button className="w-full" onClick={() => router.push('/dashboard/dispatch')}>Go to Dispatch Board</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
