'use client';

import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AppFormField } from '@/components/ui/AppFormField';

import { useCreateServiceRequest } from '@/lib/hooks/useServiceRequests';
import { useForm } from 'react-hook-form';

export default function CreateServiceRequestPage() {
  const router = useRouter();
  const createReq = useCreateServiceRequest();
  
  // Dummy IDs we generated in the backend seed
  const dummyCustomerId = '6a59ebb91008fc2cf004947e';
  const dummyServiceId = '6a59ebb91008fc2cf0049484';

  const { register, handleSubmit } = useForm();

  const onSubmit = (data: any) => {
    createReq.mutate({
      customerId: dummyCustomerId,
      serviceId: dummyServiceId,
      source: 'CALL',
      priority: data.priority === 'High' ? 'HIGH' : 'NORMAL',
      symptoms: data.symptoms ? [data.symptoms] : [],
      addressSnapshot: {
        line1: '123 Main St',
        city: 'Delhi',
        state: 'Delhi',
        pinCode: '110001'
      }
    }, {
      onSuccess: () => router.push('/dashboard/service-requests')
    });
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Create Service Request</h1>
          <p className="text-muted-foreground">Log a new ticket for a customer.</p>
        </div>
        <Button variant="outline" onClick={() => router.back()}>Cancel</Button>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Card>
        <CardHeader>
          <CardTitle>Customer & Appliance Details</CardTitle>
          <CardDescription>Select the customer and the appliance that needs service.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <AppFormField label="Select Customer" placeholder="Search customer by name or mobile..." />
            <AppFormField label="Select Address" placeholder="Choose registered address..." />
          </div>
          
          <div className="grid grid-cols-2 gap-6 pt-4 border-t">
            <AppFormField label="Select Appliance" placeholder="E.g. LG Split AC" />
            <AppFormField label="Service Type" placeholder="E.g. AC Repair / Installation" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Request Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <AppFormField label="Priority" placeholder="Low / Normal / High / Urgent" {...register('priority')} defaultValue="Normal" />
            <AppFormField label="Preferred Schedule (Optional)" placeholder="Select date and time" />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium leading-none">Symptoms / Issue Description</label>
            <textarea 
              {...register('symptoms')}
              className="flex min-h-[120px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              placeholder="Describe the issue reported by the customer..."
            />
          </div>
        </CardContent>
        <CardFooter className="flex justify-end gap-2 bg-muted/50 p-6">
          <Button type="button" variant="outline" onClick={() => router.back()}>Cancel</Button>
          <Button type="submit" disabled={createReq.isPending}>
            {createReq.isPending ? 'Creating...' : 'Create Request'}
          </Button>
        </CardFooter>
      </Card>
      </form>
    </div>
  );
}
