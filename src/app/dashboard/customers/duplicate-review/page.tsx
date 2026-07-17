'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

// Mock duplicate records
const mockDuplicates = [
  {
    id: 'DUP-1',
    matchType: 'Phone Number',
    records: [
      { id: 'CUST-101', name: 'Ramesh Singh', mobile: '9876543210', city: 'Delhi', created: '2026-01-10' },
      { id: 'CUST-102', name: 'Ramesh S.', mobile: '9876543210', city: 'New Delhi', created: '2026-03-15' }
    ]
  },
  {
    id: 'DUP-2',
    matchType: 'Email',
    records: [
      { id: 'CUST-201', name: 'Hotel Taj', email: 'admin@taj.com', city: 'Mumbai', created: '2026-02-12' },
      { id: 'CUST-202', name: 'Taj Palace', email: 'admin@taj.com', city: 'Mumbai', created: '2026-05-20' }
    ]
  }
];

export default function DuplicateReviewPage() {
  const [duplicates, setDuplicates] = useState(mockDuplicates);

  const handleResolve = (dupId: string, action: 'merge' | 'dismiss') => {
    // In a real app, this would call an API
    setDuplicates((prev) => prev.filter(d => d.id !== dupId));
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Duplicate Review</h1>
        <p className="text-muted-foreground">Review and merge potential duplicate customer records.</p>
      </div>

      {duplicates.length === 0 ? (
        <Card>
          <CardContent className="pt-6 text-center text-muted-foreground">
            No potential duplicates found!
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6">
          {duplicates.map((dup) => (
            <Card key={dup.id}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Potential Match: {dup.matchType}</CardTitle>
                  <div className="space-x-2">
                    <Button variant="outline" size="sm" onClick={() => handleResolve(dup.id, 'dismiss')}>Dismiss</Button>
                    <Button size="sm" onClick={() => handleResolve(dup.id, 'merge')}>Merge Records</Button>
                  </div>
                </div>
                <CardDescription>Found {dup.records.length} matching records.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  {dup.records.map((record, idx) => (
                    <div key={record.id} className="rounded-lg border p-4 space-y-2 relative">
                      {idx === 0 && <Badge variant="secondary" className="absolute top-2 right-2">Oldest</Badge>}
                      <div className="font-semibold text-base">{record.name}</div>
                      <div className="text-sm text-muted-foreground">ID: {record.id}</div>
                      <div className="text-sm">Mobile: {(record as any).mobile || 'N/A'}</div>
                      <div className="text-sm">Email: {(record as any).email || 'N/A'}</div>
                      <div className="text-sm">City: {record.city}</div>
                      <div className="text-xs text-muted-foreground pt-2">Created: {record.created}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
