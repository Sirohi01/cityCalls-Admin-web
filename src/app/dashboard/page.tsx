'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCallsCount } from "@/lib/hooks/useCalls";
import { useLeadsCount } from "@/lib/hooks/useLeads";
import { useServiceRequests, useServiceRequestsCount, OPEN_SERVICE_REQUEST_STATUSES } from "@/lib/hooks/useServiceRequests";
import { useVendorsCount } from "@/lib/hooks/useVendors";

export default function DashboardPage() {
  const { data: totalCalls, isLoading: callsLoading } = useCallsCount();
  const { data: incomingCalls } = useCallsCount({ direction: 'INCOMING' });

  const { data: totalLeads, isLoading: leadsLoading } = useLeadsCount();
  const { data: followUpLeads } = useLeadsCount({ stage: 'FOLLOW_UP' });

  const { data: openSrCount, isLoading: srLoading } = useServiceRequestsCount({ status_in: OPEN_SERVICE_REQUEST_STATUSES });
  const { data: openSrSample } = useServiceRequests({ status_in: OPEN_SERVICE_REQUEST_STATUSES, limit: 100 });
  const escalatedInSample = (openSrSample || []).filter((sr) => sr.isEscalated).length;

  const { data: activeVendors, isLoading: vendorsLoading } = useVendorsCount({ active: true });
  const { data: blacklistedVendors } = useVendorsCount({ blacklisted: true });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Overview of CityCalls operations.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Calls Logged</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{callsLoading ? '—' : totalCalls}</div>
            <p className="text-xs text-muted-foreground">{incomingCalls ?? 0} incoming</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Leads</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{leadsLoading ? '—' : totalLeads}</div>
            <p className="text-xs text-muted-foreground">{followUpLeads ?? 0} require follow up</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Open Service Requests</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{srLoading ? '—' : openSrCount}</div>
            <p className="text-xs text-muted-foreground">{escalatedInSample} escalated (of latest {openSrSample?.length ?? 0} shown)</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Vendors</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{vendorsLoading ? '—' : activeVendors}</div>
            <p className="text-xs text-muted-foreground">{blacklistedVendors ?? 0} blacklisted</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
