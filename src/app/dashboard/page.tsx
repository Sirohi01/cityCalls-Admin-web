'use client';

import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Phone, PhoneCall, Target, Ticket, Store, Briefcase, SmilePlus, RefreshCcw,
  IndianRupee, Clock, FileKey, UserSquare2, Upload, BarChart4, TrendingUp,
} from 'lucide-react';
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend,
  FunnelChart, Funnel, LabelList, BarChart, Bar, XAxis, YAxis, CartesianGrid,
} from 'recharts';

import { useMe, usePermission } from '@/lib/hooks/useAuth';
import { useCallsCount } from '@/lib/hooks/useCalls';
import { useLeads, useLeadsCount } from '@/lib/hooks/useLeads';
import {
  useServiceRequestsCount, OPEN_SERVICE_REQUEST_STATUSES,
  stageForStatus, SERVICE_REQUEST_STAGE_NAMES,
} from '@/lib/hooks/useServiceRequests';
import { useVendorsCount } from '@/lib/hooks/useVendors';
import { useEmployees } from '@/lib/hooks/useEmployees';
import { useHappyCalls, assignedToName, serviceRequestNumber } from '@/lib/hooks/useHappyCalls';
import { useReopenRequests } from '@/lib/hooks/useReopenRequests';
import { useCustomers } from '@/lib/hooks/useCustomers';
import { useAuditLogs } from '@/lib/hooks/useAuditLogs';
import { useReport } from '@/lib/hooks/useReports';

const STAGE_COLORS: Record<string, string> = {
  Open: '#f59e0b',
  Assigned: '#6366f1',
  'In Progress': '#0ea5e9',
  Resolved: '#22c55e',
};
const FUNNEL_COLORS = ['#8cc63f', '#65a30d', '#4d7c0f', '#3f6212', '#365314', '#1a2e05'];
const REVENUE_COLORS = ['#22c55e', '#f59e0b'];

function StatCard({
  title, value, sub, icon: Icon, href, color,
}: {
  title: string;
  value: React.ReactNode;
  sub?: React.ReactNode;
  icon: React.ComponentType<{ className?: string }>;
  href?: string;
  color: string;
}) {
  const body = (
    <Card size="sm" className={href ? 'transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md hover:shadow-primary/10 border-l-[3px] overflow-hidden relative group' : 'border-l-[3px] overflow-hidden relative'} style={{ borderLeftColor: color }}>
      <div className="absolute inset-0 bg-gradient-to-br from-transparent to-black/5 opacity-0 group-hover:opacity-100 transition-opacity" />
      <CardContent className="flex items-center gap-2.5 p-3">
        <div className="rounded-lg p-1.5 shrink-0 shadow-sm transition-transform group-hover:scale-110 duration-300" style={{ backgroundColor: `${color}15`, color }}>
          <Icon className="w-4 h-4 drop-shadow-sm" />
        </div>
        <div className="min-w-0 flex-1 space-y-0.5">
          <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider truncate leading-none">{title}</p>
          <div className="text-xl font-medium tracking-tight bg-clip-text text-transparent bg-gradient-to-br from-foreground to-foreground/80 leading-none">{value}</div>
          {sub && <p className="text-[10px] font-medium text-muted-foreground/80 truncate inline-block px-1.5 py-0.5 bg-muted/40 rounded-full">{sub}</p>}
        </div>
      </CardContent>
    </Card>
  );
  return href ? <Link href={href} className="block h-full outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-xl">{body}</Link> : body;
}

function DonutWithCenter({ data, colors, centerLabel, centerValue }: {
  data: { name: string; value: number }[];
  colors: string[];
  centerLabel: string;
  centerValue: React.ReactNode;
}) {
  const hasData = data.some((d) => d.value > 0);
  return (
    <div className="flex items-center gap-3">
      <div className="relative w-[110px] h-[110px] shrink-0">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={hasData ? data : [{ name: 'None', value: 1 }]} dataKey="value" nameKey="name" innerRadius={34} outerRadius={50} paddingAngle={2} strokeWidth={0}>
              {(hasData ? data : [{ name: 'None', value: 1 }]).map((entry, i) => (
                <Cell key={entry.name} fill={hasData ? colors[i % colors.length] : '#e5e7eb'} />
              ))}
            </Pie>
            {hasData && <Tooltip />}
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-lg font-bold">{centerValue}</span>
          <span className="text-[10px] text-muted-foreground">{centerLabel}</span>
        </div>
      </div>
      <div className="space-y-1 flex-1 min-w-0">
        {data.map((d, i) => (
          <div key={d.name} className="flex items-center justify-between text-xs gap-2">
            <span className="flex items-center gap-1.5 min-w-0">
              <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: colors[i % colors.length] }} />
              <span className="truncate">{d.name}</span>
            </span>
            <span className="font-semibold shrink-0">{d.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const { data: me } = useMe();

  const canCalls = usePermission('calls');
  const canCreateCalls = usePermission('calls', 'create');
  const canLeads = usePermission('leads');
  const canImportLeads = usePermission('leads', 'import');
  const canSR = usePermission('serviceRequests');
  const canVendors = usePermission('vendors');
  const canEmployees = usePermission('employees');
  const canHappyCalls = usePermission('happyCalls');
  const canFinance = usePermission('finance');
  const canCustomers = usePermission('customers');
  const canCreateCustomers = usePermission('customers', 'create');
  const canAudit = usePermission('config', 'manageSettings');
  const canReports = usePermission('reports');

  // --- KPI row ---
  const { data: totalCalls, isLoading: callsLoading } = useCallsCount(undefined, { enabled: canCalls });
  const { data: incomingCalls } = useCallsCount({ direction: 'INCOMING' }, { enabled: canCalls });

  const { data: totalLeads, isLoading: leadsLoading } = useLeadsCount(undefined, { enabled: canLeads });
  const { data: followUpLeads } = useLeadsCount({ stage: 'FOLLOW_UP' }, { enabled: canLeads });

  const { data: openSrCount, isLoading: srLoading } = useServiceRequestsCount({ status_in: OPEN_SERVICE_REQUEST_STATUSES }, { enabled: canSR });

  const { data: activeVendors, isLoading: vendorsLoading } = useVendorsCount({ active: true }, { enabled: canVendors });
  const { data: blacklistedVendors } = useVendorsCount({ blacklisted: true }, { enabled: canVendors });

  const { data: employees, isLoading: employeesLoading } = useEmployees({ enabled: canEmployees });
  const activeEmployeeCount = (employees || []).filter((e) => e.active).length;

  const { data: happyCalls, isLoading: happyCallsLoading } = useHappyCalls({ enabled: canHappyCalls });
  const pendingHappyCalls = (happyCalls || []).filter((h) => h.status === 'PENDING');

  const { data: reopenRequests } = useReopenRequests({ enabled: canHappyCalls });

  // --- Reports-backed widgets (needs reports.view) ---
  const { data: srSummary, isLoading: srSummaryLoading } = useReport('service-request-summary', {}, { enabled: canReports && canSR });
  const { data: leadFunnel, isLoading: leadFunnelLoading } = useReport('lead-funnel', {}, { enabled: canReports && canLeads });
  const { data: revenue, isLoading: revenueLoading } = useReport('revenue-summary', {}, { enabled: canReports && canFinance });
  const { data: technicianPerf } = useReport('technician-performance', {}, { enabled: canReports && canEmployees });

  const stageCounts = SERVICE_REQUEST_STAGE_NAMES.map((stage) => ({
    name: stage,
    value: (srSummary?.byStatus ?? []).reduce((sum, row) => (stageForStatus(row.status) === stage ? sum + row.count : sum), 0),
  }));

  const funnelData = (leadFunnel?.byStage ?? [])
    .slice()
    .sort((a, b) => b.count - a.count)
    .map((s) => ({ name: s.stage.replace(/_/g, ' '), value: s.count }));

  const topTechnicians = (technicianPerf ?? [])
    .slice()
    .sort((a, b) => b.assigned - a.assigned)
    .slice(0, 5)
    .map((row) => ({
      ...row,
      name: employees?.find((e) => e._id === row.employeeId)?.userId?.name ?? 'Unknown',
    }));
  const technicianChartData = topTechnicians.map((t) => ({ name: t.name.split(' ')[0], Assigned: t.assigned, Completed: t.completed }));

  // --- Follow-ups ---
  const { data: followUpLeadsList, isLoading: followUpListLoading } = useLeads({ stage: 'FOLLOW_UP', limit: 5 }, { enabled: canLeads });

  // --- Recent activity ---
  const { data: auditPage, isLoading: auditLoading } = useAuditLogs({ limit: 6 }, { enabled: canAudit });

  // --- Service area waitlist ---
  const { data: waitlistCustomers, isLoading: waitlistLoading } = useCustomers({ tag: 'waitlist' }, { enabled: canCustomers });
  const waitlistByPincode = (waitlistCustomers || []).reduce<Record<string, number>>((acc, c) => {
    const pincodeTag = c.tags?.find((t) => t.startsWith('waitlist-'))?.replace('waitlist-', '');
    if (pincodeTag) acc[pincodeTag] = (acc[pincodeTag] || 0) + 1;
    return acc;
  }, {});
  const topWaitlistPincodes = Object.entries(waitlistByPincode).sort((a, b) => b[1] - a[1]).slice(0, 3);

  return (
    <div className="space-y-3 animate-in fade-in duration-500">
      <div className="pb-1 mb-1.5 border-b border-border/50">
        <h1 className="text-lg font-medium tracking-tight text-foreground">
          Welcome back, <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/80">{me?.name ?? '...'}</span>
        </h1>
        <p className="text-[13px] text-muted-foreground">Here&apos;s what&apos;s happening across CityCalls today.</p>
      </div>

      {/* KPI row */}
      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
        {canCalls && (
          <StatCard title="Total Calls Logged" icon={Phone} href="/dashboard/calls" color="#3b82f6"
            value={callsLoading ? '—' : totalCalls} sub={`${incomingCalls ?? 0} incoming`} />
        )}
        {canLeads && (
          <StatCard title="Total Leads" icon={Target} href="/dashboard/leads" color="#8b5cf6"
            value={leadsLoading ? '—' : totalLeads} sub={`${followUpLeads ?? 0} need follow-up`} />
        )}
        {canSR && (
          <StatCard title="Open Service Requests" icon={Ticket} href="/dashboard/service-requests" color="#f43f5e"
            value={srLoading ? '—' : openSrCount}
            sub={srSummaryLoading ? undefined : `${srSummary?.totals.escalated ?? 0} escalated · ${srSummary?.totals.slaBreached ?? 0} SLA breached`} />
        )}
        {canVendors && (
          <StatCard title="Active Vendors" icon={Store} href="/dashboard/vendors" color="#f59e0b"
            value={vendorsLoading ? '—' : activeVendors} sub={`${blacklistedVendors ?? 0} blacklisted`} />
        )}
        {canEmployees && (
          <StatCard title="Active Employees" icon={Briefcase} href="/dashboard/employees" color="#0ea5e9"
            value={employeesLoading ? '—' : activeEmployeeCount} sub={`${employees?.length ?? 0} total on roster`} />
        )}
        {canHappyCalls && (
          <StatCard title="Happy Calls Pending" icon={SmilePlus} href="/dashboard/happy-calls" color="#ec4899"
            value={happyCallsLoading ? '—' : pendingHappyCalls.length} sub={`of latest ${happyCalls?.length ?? 0} shown`} />
        )}
        {canHappyCalls && (
          <StatCard title="Recent Reopens" icon={RefreshCcw} href="/dashboard/reopen-requests" color="#fb923c"
            value={reopenRequests?.length ?? '—'} sub="service requests reopened" />
        )}
        {canFinance && (
          <StatCard title="Revenue Collected" icon={IndianRupee} href="/dashboard/finance/invoices" color="#22c55e"
            value={revenueLoading ? '—' : `₹${(revenue?.collected ?? 0).toLocaleString('en-IN')}`}
            sub={revenue ? `of ₹${revenue.invoiced.toLocaleString('en-IN')} invoiced` : undefined} />
        )}
      </div>

      {(canSR || canLeads) && canReports && (
        <div className="grid gap-3 lg:grid-cols-2">
          {canSR && (
            <Card size="sm" className="overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300">
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Ticket className="w-4 h-4" /> Service Request Pipeline</CardTitle>
                <CardDescription>{srSummary?.totals.total ?? 0} requests, by stage</CardDescription>
              </CardHeader>
              <CardContent>
                {srSummaryLoading ? (
                  <p className="text-sm text-muted-foreground">Loading...</p>
                ) : (
                  <DonutWithCenter
                    data={stageCounts}
                    colors={stageCounts.map((s) => STAGE_COLORS[s.name] ?? '#94a3b8')}
                    centerLabel="Total"
                    centerValue={srSummary?.totals.total ?? 0}
                  />
                )}
              </CardContent>
            </Card>
          )}
          {canLeads && (
            <Card size="sm" className="overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300">
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><TrendingUp className="w-4 h-4" /> Lead Funnel</CardTitle>
                <CardDescription>
                  {leadFunnel?.total ?? 0} leads · {leadFunnel ? Math.round(leadFunnel.conversionRate * 100) : 0}% converted
                </CardDescription>
              </CardHeader>
              <CardContent>
                {leadFunnelLoading ? (
                  <p className="text-sm text-muted-foreground">Loading...</p>
                ) : funnelData.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No leads yet.</p>
                ) : (
                  <ResponsiveContainer width="100%" height={190}>
                    <FunnelChart>
                      <Tooltip />
                      <Funnel dataKey="value" data={funnelData} isAnimationActive>
                        <LabelList position="right" dataKey="name" fill="#111827" stroke="none" fontSize={11} />
                        <LabelList position="center" dataKey="value" fill="#fff" stroke="none" fontSize={12} fontWeight={700} />
                        {funnelData.map((entry, i) => (
                          <Cell key={entry.name} fill={FUNNEL_COLORS[i % FUNNEL_COLORS.length]} />
                        ))}
                      </Funnel>
                    </FunnelChart>
                  </ResponsiveContainer>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {(canFinance || canEmployees) && canReports && (
        <div className="grid gap-3 lg:grid-cols-2">
          {canFinance && (
            <Card size="sm" className="overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300">
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><IndianRupee className="w-4 h-4" /> Revenue Snapshot</CardTitle>
                <CardDescription>Across all invoices</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {revenueLoading ? (
                  <p className="text-sm text-muted-foreground">Loading...</p>
                ) : (
                  <>
                    <DonutWithCenter
                      data={[{ name: 'Collected', value: revenue?.collected ?? 0 }, { name: 'Outstanding', value: revenue?.outstanding ?? 0 }]}
                      colors={REVENUE_COLORS}
                      centerLabel="Invoiced"
                      centerValue={`₹${((revenue?.invoiced ?? 0) / 1000).toFixed(0)}k`}
                    />
                    <div className="space-y-1.5 pt-2 border-t">
                      {(revenue?.byStatus ?? []).map((s) => (
                        <div key={s.status} className="flex justify-between text-xs">
                          <span className="text-muted-foreground">{s.status} ({s.count})</span>
                          <span className="font-medium">₹{s.total.toLocaleString('en-IN')}</span>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          )}
          {canEmployees && (
            <Card size="sm" className="overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300">
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Briefcase className="w-4 h-4" /> Top Technicians</CardTitle>
                <CardDescription>By assigned service requests</CardDescription>
              </CardHeader>
              <CardContent>
                {topTechnicians.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No assignment data yet.</p>
                ) : (
                  <ResponsiveContainer width="100%" height={190}>
                    <BarChart data={technicianChartData} layout="vertical" margin={{ left: 8, right: 16 }}>
                      <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                      <XAxis type="number" allowDecimals={false} tick={{ fontSize: 11 }} />
                      <YAxis type="category" dataKey="name" width={70} tick={{ fontSize: 11 }} />
                      <Tooltip />
                      <Legend wrapperStyle={{ fontSize: 11 }} />
                      <Bar dataKey="Assigned" fill="#c7d2fe" radius={[0, 4, 4, 0]} />
                      <Bar dataKey="Completed" fill="#6366f1" radius={[0, 4, 4, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {(canLeads || canHappyCalls || canAudit) && (
        <div className="grid gap-3 lg:grid-cols-2">
          {(canLeads || canHappyCalls) && (
            <Card size="sm" className="overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300">
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Clock className="w-4 h-4" /> Today&apos;s Follow-ups</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {canLeads && (
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground mb-2">LEADS</p>
                    {followUpListLoading ? (
                      <p className="text-sm text-muted-foreground">Loading...</p>
                    ) : !followUpLeadsList || followUpLeadsList.length === 0 ? (
                      <p className="text-sm text-muted-foreground">No leads awaiting follow-up.</p>
                    ) : (
                      <div className="space-y-2 max-h-[160px] overflow-y-auto pr-2 [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-muted-foreground/20 [&::-webkit-scrollbar-thumb]:rounded-full">
                        {followUpLeadsList.map((l) => (
                          <Link key={l._id} href={`/dashboard/leads/${l._id}`} className="flex justify-between text-sm hover:underline py-0.5">
                            <span className="truncate pr-2">{l.contactName || l.number}</span>
                            <span className="text-muted-foreground shrink-0">{l.followUpDate ? new Date(l.followUpDate).toLocaleDateString() : '—'}</span>
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                )}
                {canHappyCalls && (
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground mb-2">HAPPY CALLS</p>
                    {happyCallsLoading ? (
                      <p className="text-sm text-muted-foreground">Loading...</p>
                    ) : pendingHappyCalls.length === 0 ? (
                      <p className="text-sm text-muted-foreground">No happy calls pending.</p>
                    ) : (
                      <div className="space-y-2 max-h-[160px] overflow-y-auto pr-2 [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-muted-foreground/20 [&::-webkit-scrollbar-thumb]:rounded-full">
                        {pendingHappyCalls.slice(0, 5).map((h) => (
                          <div key={h._id} className="flex justify-between text-sm py-0.5">
                            <span>SR {serviceRequestNumber(h)}</span>
                            <span className="text-muted-foreground truncate max-w-[120px] text-right">{assignedToName(h)}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {canAudit && (
            <Card size="sm" className="overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300">
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><FileKey className="w-4 h-4" /> Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                {auditLoading ? (
                  <p className="text-sm text-muted-foreground">Loading...</p>
                ) : !auditPage || auditPage.items.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No recent activity.</p>
                ) : (
                  <div className="space-y-2 max-h-[220px] overflow-y-auto pr-2 [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-muted-foreground/20 [&::-webkit-scrollbar-thumb]:rounded-full">
                    {auditPage.items.map((log) => (
                      <div key={log.id} className="flex justify-between text-sm py-0.5 border-b border-border/50 last:border-0 pb-1.5 last:pb-0.5">
                        <span className="truncate pr-2">
                          <span className="font-medium">{log.user}</span>{' '}
                          <span className="text-muted-foreground text-xs">{log.action.toLowerCase().replace(/_/g, ' ')} {log.entityType.toLowerCase()}</span>
                        </span>
                        <span className="text-[10px] text-muted-foreground shrink-0">{new Date(log.createdAt).toLocaleString(undefined, { hour: '2-digit', minute: '2-digit', month: 'short', day: 'numeric' })}</span>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {(canCustomers || canCreateCalls || canCreateCustomers || canImportLeads || canReports) && (
        <div className="grid gap-3 lg:grid-cols-2">
          {canCustomers && (
            <Card size="sm" className="overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300">
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Clock className="w-4 h-4" /> Service Area Waitlist</CardTitle>
                <CardDescription>Callers we can&apos;t serve yet</CardDescription>
              </CardHeader>
              <CardContent>
                {waitlistLoading ? (
                  <p className="text-sm text-muted-foreground">Loading...</p>
                ) : (waitlistCustomers?.length ?? 0) === 0 ? (
                  <p className="text-sm text-muted-foreground">No one is waiting right now.</p>
                ) : (
                  <div className="space-y-2">
                    <p className="text-sm font-medium">{waitlistCustomers?.length} people waiting</p>
                    <div className="space-y-1.5 max-h-[140px] overflow-y-auto pr-2 [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-muted-foreground/20 [&::-webkit-scrollbar-thumb]:rounded-full">
                      {topWaitlistPincodes.map(([pincode, count]) => (
                        <div key={pincode} className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Pincode {pincode}</span>
                          <span className="font-medium">{count}</span>
                        </div>
                      ))}
                    </div>
                    <Link href="/dashboard/customers/waitlist" className="text-xs text-primary hover:underline block pt-1">View all →</Link>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          <Card size="sm" className="overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300">
            <CardHeader className="bg-muted/30">
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-3">
              {canCreateCalls && (
                <Link href="/dashboard/calls/entry"><Button size="sm" variant="outline" className="w-full justify-start gap-2 shadow-sm hover:shadow-md transition-all hover:-translate-y-px"><PhoneCall className="w-3.5 h-3.5 text-blue-500" /> Log New Call</Button></Link>
              )}
              {canCreateCustomers && (
                <Link href="/dashboard/customers/create"><Button size="sm" variant="outline" className="w-full justify-start gap-2 shadow-sm hover:shadow-md transition-all hover:-translate-y-px"><UserSquare2 className="w-3.5 h-3.5 text-emerald-500" /> Add Customer</Button></Link>
              )}
              {canImportLeads && (
                <Link href="/dashboard/leads/import"><Button size="sm" variant="outline" className="w-full justify-start gap-2 shadow-sm hover:shadow-md transition-all hover:-translate-y-px"><Upload className="w-3.5 h-3.5 text-purple-500" /> Import Leads</Button></Link>
              )}
              {canReports && (
                <Link href="/dashboard/reports"><Button size="sm" variant="outline" className="w-full justify-start gap-2 shadow-sm hover:shadow-md transition-all hover:-translate-y-px"><BarChart4 className="w-3.5 h-3.5 text-orange-500" /> View Reports</Button></Link>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
