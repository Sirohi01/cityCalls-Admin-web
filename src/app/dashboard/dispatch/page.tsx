'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { User, MapPin, Wrench } from 'lucide-react';
import { StatusBadge } from '@/components/ui/StatusBadge';

import { useServiceRequests, useAssignServiceRequest, useUpdateServiceRequestStatus, ServiceRequest } from '@/lib/hooks/useServiceRequests';
import { useEmployees } from '@/lib/hooks/useEmployees';

// Statuses where the job is still active (counts toward a technician's
// current load) — mirrors the "not yet CLOSED/CANCELLED" idea without
// hardcoding every one of the 37 statuses individually.
const CLOSED_STATUSES = new Set(['CLOSED', 'CANCELLED']);
const DIRECT_TO_EMPLOYEE_STATUSES = new Set(['ASSIGNED_TO_BRANCH', 'ASSIGNED_TO_SUB_BRANCH', 'ASSIGNED_TO_TEAM', 'REASSIGNMENT_REQUIRED']);
const NEEDS_BRANCH_FIRST_STATUSES = new Set(['NEW', 'NEEDS_MANUAL_BRANCH_ASSIGNMENT']);

export default function DispatchBoardPage() {
  const [selectedRequest, setSelectedRequest] = useState<string | null>(null);
  const [assignError, setAssignError] = useState<string | null>(null);

  const { data: allRequests, isLoading: loadingReqs } = useServiceRequests();
  const { data: employees, isLoading: loadingEmployees } = useEmployees();
  const assignRequest = useAssignServiceRequest();
  const updateStatus = useUpdateServiceRequestStatus();
  const isBusy = assignRequest.isPending || updateStatus.isPending;
  const openRequests = allRequests?.filter((req) => !CLOSED_STATUSES.has(req.status)) || [];
  const selectedSr = openRequests.find((r) => r._id === selectedRequest) || null;
  const availableTechnicians = employees?.filter((e) => e.active) || [];

  const loadFor = (employeeId: string) =>
    (allRequests || []).filter((r) => r.assigneeId === employeeId && !CLOSED_STATUSES.has(r.status)).length;

  const handleAssign = async (employeeId: string) => {
    if (!selectedRequest || !selectedSr) return;
    setAssignError(null);
    try {
      if (NEEDS_BRANCH_FIRST_STATUSES.has(selectedSr.status)) {
        if (!selectedSr.branchId) throw new Error('This request has no branch on file — set one before assigning.');
        await assignRequest.mutateAsync({ id: selectedRequest, assigneeType: 'BRANCH', assigneeId: selectedSr.branchId });
      } else if (!DIRECT_TO_EMPLOYEE_STATUSES.has(selectedSr.status)) {
        await updateStatus.mutateAsync({ id: selectedRequest, toStatus: 'REASSIGNMENT_REQUIRED', reason: 'Reassigned via Dispatch Board' });
      }
      await assignRequest.mutateAsync({ id: selectedRequest, assigneeType: 'EMPLOYEE', assigneeId: employeeId });
      setSelectedRequest(null);
    } catch (e) {
      const err = e as { response?: { data?: { message?: string } } };
      setAssignError(err.response?.data?.message ?? (e instanceof Error ? e.message : 'Failed to assign this request.'));
    }
  };

  return (
    <div className="space-y-6 h-[calc(100vh-8rem)] flex flex-col">
      <div className="flex items-center justify-between shrink-0">
        <div>
          <h1 className="text-lg font-medium tracking-tight text-foreground">Dispatch Board</h1>
          <p className="text-[13px] text-muted-foreground">Assign open service requests to available technicians.</p>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6 min-h-0">
        {/* Left Pane: All Open Requests (unassigned or already assigned — reassignable) */}
        <Card className="flex flex-col h-full shadow-sm">
          <CardHeader className="border-b bg-slate-50/50 pb-4 shrink-0">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg flex items-center gap-2">
                Service Requests
              </CardTitle>
              <Badge variant="secondary">{openRequests.length} open</Badge>
            </div>
          </CardHeader>
          <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
            {loadingReqs ? (
              <div className="text-center text-muted-foreground p-8">Loading requests...</div>
            ) : openRequests.length === 0 ? (
              <div className="text-center text-muted-foreground p-8">No open requests.</div>
            ) : (
              openRequests.map((req: ServiceRequest) => (
                <div
                  key={req._id}
                  onClick={() => {
                    setSelectedRequest(req._id);
                    setAssignError(null);
                  }}
                  className={`p-4 rounded-lg border-2 cursor-pointer transition-colors ${selectedRequest === req._id ? 'border-primary bg-primary/5' : 'border-slate-200 hover:border-primary/50'}`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-bold text-slate-900">{req.number}</h4>
                      <p className="text-sm font-medium">{req.customer?.name || 'Unknown'}</p>
                    </div>
                    <Badge variant={req.priority === 'HIGH' || req.priority === 'URGENT' ? 'destructive' : 'secondary'}>{req.priority}</Badge>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-500 mt-2">
                    <MapPin className="w-3 h-3" />
                    {req.addressSnapshot ? `${req.addressSnapshot.city}, ${req.addressSnapshot.pinCode}` : 'No address on file'}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
                    <Wrench className="w-3 h-3" /> Status: {req.status}
                  </div>
                  <div className="mt-2">
                    {req.assignee ? (
                      <StatusBadge label={`Assigned: ${req.assignee.name} (${req.assignee.type.replace(/_/g, ' ')})`} category="info" />
                    ) : (
                      <StatusBadge label="Unassigned" category="error" />
                    )}
                  </div>
                </div>
              ))
            )}
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
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">{availableTechnicians.length} Active</Badge>
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

            {assignError && (
              <div className="p-3 rounded-md bg-red-50 border border-red-100 text-sm text-red-700">{assignError}</div>
            )}

            {loadingEmployees ? (
              <div className="text-center text-muted-foreground p-8">Loading technicians...</div>
            ) : availableTechnicians.length === 0 ? (
              <div className="text-center text-muted-foreground p-8">No active employees found. Add one from the Employees page.</div>
            ) : (
              availableTechnicians.map((tech) => (
                <div key={tech._id} className="p-4 rounded-lg border border-slate-200 hover:border-slate-300 bg-white">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center">
                        <User className="w-5 h-5 text-slate-600" />
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900">{tech.userId?.name ?? 'Unknown'}</h4>
                        <p className="text-xs text-slate-500">{tech.userId?.mobile}</p>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      className="bg-primary hover:bg-primary/90"
                      onClick={() => handleAssign(tech._id)}
                      disabled={!selectedRequest || isBusy}
                    >
                      Assign
                    </Button>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs border-t pt-3">
                    <div>
                      <span className="text-slate-500 block">Current Load</span>
                      <span className="font-semibold text-slate-900">{loadFor(tech._id)} Active Jobs</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Daily Capacity</span>
                      <span className="font-semibold text-slate-900">{tech.dailyCapacity}</span>
                    </div>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-1">
                    {(tech.skills || []).map((skill) => (
                      <Badge key={skill} variant="secondary" className="text-[10px] bg-slate-100">{skill}</Badge>
                    ))}
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
