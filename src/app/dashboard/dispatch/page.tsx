'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { User, MapPin, Wrench } from 'lucide-react';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { toast } from 'sonner';

import { useServiceRequests, useAssignServiceRequest } from '@/lib/hooks/useServiceRequests';
import { useUsers } from '@/lib/hooks/useUsers';

export default function DispatchBoardPage() {
  const [selectedRequest, setSelectedRequest] = useState<string | null>(null);

  const { data: allRequests, isLoading: loadingReqs } = useServiceRequests();
  const { data: allUsers, isLoading: loadingUsers } = useUsers('TECHNICIAN');
  const assignRequest = useAssignServiceRequest();

  const unassignedRequests = allRequests?.filter(req => req.status === 'NEW' || req.status.includes('ASSIGNED') || req.status === 'OPEN') || [];
  const availableTechnicians = allUsers || [];

  const handleAssign = (techId: string) => {
    if (!selectedRequest) return;
    
    assignRequest.mutate({ id: selectedRequest, assigneeId: techId }, {
      onSuccess: () => {
        toast.success('Technician assigned successfully');
        setSelectedRequest(null);
      },
      onError: (err) => {
        toast.error(err.response?.data?.errors?.[0]?.message || 'Failed to assign technician');
      }
    });
  };



  return (
    <div className="space-y-6 h-[calc(100vh-8rem)] flex flex-col">
      <div className="flex items-center justify-between shrink-0">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dispatch Board</h1>
          <p className="text-muted-foreground">Assign open service requests to available technicians.</p>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6 min-h-0">
        {/* Left Pane: Unassigned Requests */}
        <Card className="flex flex-col h-full shadow-sm">
          <CardHeader className="border-b bg-slate-50/50 pb-4 shrink-0">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg flex items-center gap-2">
                <StatusBadge label="Unassigned" category="error" />
                Service Requests
              </CardTitle>
              <Badge variant="secondary">{unassignedRequests.length} pending</Badge>
            </div>
          </CardHeader>
          <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
            {unassignedRequests.map(req => (
              <div 
                key={req.id} 
                onClick={() => setSelectedRequest(req.id)}
                className={`p-4 rounded-lg border-2 cursor-pointer transition-colors ${selectedRequest === req.id ? 'border-primary bg-primary/5' : 'border-slate-200 hover:border-primary/50'}`}
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="font-bold text-slate-900">{req.number}</h4>
                    <p className="text-sm font-medium">{req.customer?.name || 'Unknown'}</p>
                  </div>
                  <Badge variant={req.priority === 'HIGH' ? 'destructive' : 'secondary'}>{req.priority}</Badge>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-500 mt-2">
                  <MapPin className="w-3 h-3" /> Area missing
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
                  <Wrench className="w-3 h-3" /> Service ID: {req.id}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Right Pane: Available Technicians */}
        <Card className="flex flex-col h-full shadow-sm">
          <CardHeader className="border-b bg-slate-50/50 pb-4 shrink-0">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg flex items-center gap-2">
                <User className="w-5 h-5 text-slate-500" />
                Available Technicians
              </CardTitle>
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">{availableTechnicians.length} Online</Badge>
            </div>
          </CardHeader>
          <CardContent className="flex-1 overflow-y-auto p-4 space-y-4 relative">
            {!selectedRequest && (
              <div className="absolute inset-0 z-10 bg-white/80 backdrop-blur-[1px] flex items-center justify-center">
                <div className="bg-white p-4 rounded-lg shadow border text-sm font-medium text-slate-600">
                  Select a Service Request to view matching technicians.
                </div>
              </div>
            )}
            
            {availableTechnicians.map(tech => (
              <div key={tech.id} className="p-4 rounded-lg border border-slate-200 hover:border-slate-300 bg-white">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center">
                      <User className="w-5 h-5 text-slate-600" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900">{tech.name}</h4>
                      <p className="text-xs text-slate-500">{tech.id}</p>
                    </div>
                  </div>
                  <Button 
                    size="sm" 
                    className="bg-primary hover:bg-primary/90"
                    onClick={() => handleAssign(tech.id)}
                    disabled={!selectedRequest || assignRequest.isPending}
                  >
                    Assign
                  </Button>
                </div>
                
                <div className="grid grid-cols-2 gap-2 text-xs border-t pt-3">
                  <div>
                    <span className="text-slate-500 block">Current Load</span>
                    <span className="font-semibold text-slate-900">0 Active Jobs</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Email</span>
                    <span className="font-semibold text-slate-900">{tech.email}</span>
                  </div>
                </div>
                <div className="mt-3 flex flex-wrap gap-1">
                  <Badge variant="secondary" className="text-[10px] bg-slate-100">Technician</Badge>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
