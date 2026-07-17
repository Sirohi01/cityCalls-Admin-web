'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BarChart4, PieChart, TrendingUp, Download, Calendar } from 'lucide-react';

export default function ReportsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Reports Catalog</h1>
          <p className="text-muted-foreground">Access standard system reports and export analytics data.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2"><Calendar className="w-4 h-4"/> Last 30 Days</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        <Card className="hover:border-primary/50 transition-colors cursor-pointer group">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <div className="p-2 bg-blue-50 text-blue-600 rounded-md group-hover:bg-blue-600 group-hover:text-white transition-colors">
                <BarChart4 className="w-5 h-5" />
              </div>
              Daily Operations Report
            </CardTitle>
            <CardDescription>Summary of daily service requests, closed tickets, and open backlog.</CardDescription>
          </CardHeader>
          <CardContent className="flex justify-between items-center pt-4 border-t">
            <span className="text-sm font-medium text-slate-500">Last Generated: Today</span>
            <Button size="sm" variant="ghost" className="gap-2 text-primary"><Download className="w-4 h-4"/> Export CSV</Button>
          </CardContent>
        </Card>

        <Card className="hover:border-primary/50 transition-colors cursor-pointer group">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <div className="p-2 bg-green-50 text-green-600 rounded-md group-hover:bg-green-600 group-hover:text-white transition-colors">
                <TrendingUp className="w-5 h-5" />
              </div>
              Agent Performance (SLA)
            </CardTitle>
            <CardDescription>Metrics on response times, resolution times, and SLA breaches by technician.</CardDescription>
          </CardHeader>
          <CardContent className="flex justify-between items-center pt-4 border-t">
            <span className="text-sm font-medium text-slate-500">Last Generated: Yesterday</span>
            <Button size="sm" variant="ghost" className="gap-2 text-primary"><Download className="w-4 h-4"/> Export CSV</Button>
          </CardContent>
        </Card>

        <Card className="hover:border-primary/50 transition-colors cursor-pointer group">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <div className="p-2 bg-purple-50 text-purple-600 rounded-md group-hover:bg-purple-600 group-hover:text-white transition-colors">
                <PieChart className="w-5 h-5" />
              </div>
              Financial Summary
            </CardTitle>
            <CardDescription>Overview of billed amounts, collected payments, and pending invoices.</CardDescription>
          </CardHeader>
          <CardContent className="flex justify-between items-center pt-4 border-t">
            <span className="text-sm font-medium text-slate-500">Last Generated: 1 min ago</span>
            <Button size="sm" variant="ghost" className="gap-2 text-primary"><Download className="w-4 h-4"/> Export PDF</Button>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}
