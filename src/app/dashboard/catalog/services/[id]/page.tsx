'use client';

import { use } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { StatusBadge } from '@/components/ui/StatusBadge';

export default function ServiceDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id } = use(params);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Service: {id}</h1>
          <p className="text-muted-foreground">Manage service configuration and pricing.</p>
        </div>
        <div className="ml-auto">
          <StatusBadge label="Active" category="success" />
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Service Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-y-4 text-sm">
              <span className="text-muted-foreground">Name:</span>
              <span className="font-medium">AC Repair</span>
              <span className="text-muted-foreground">Category:</span>
              <span className="font-medium">HVAC</span>
              <span className="text-muted-foreground">Base Price:</span>
              <span className="font-medium">₹499</span>
              <span className="text-muted-foreground">Description:</span>
              <span className="font-medium">Comprehensive AC repair and diagnostics.</span>
            </div>
            <div className="pt-4">
              <Button variant="outline" className="w-full">Edit Details</Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Linked Symptoms</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center justify-between border-b pb-2">
                <span>Cooling Issue</span>
                <Button variant="ghost" size="sm" className="text-destructive h-6">Remove</Button>
              </li>
              <li className="flex items-center justify-between border-b pb-2">
                <span>Water Leakage</span>
                <Button variant="ghost" size="sm" className="text-destructive h-6">Remove</Button>
              </li>
              <li className="flex items-center justify-between border-b pb-2">
                <span>Noise</span>
                <Button variant="ghost" size="sm" className="text-destructive h-6">Remove</Button>
              </li>
            </ul>
            <div className="pt-4">
              <Button variant="outline" className="w-full">Link Symptom</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
