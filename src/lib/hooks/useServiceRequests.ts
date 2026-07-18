import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient, ApiSuccessEnvelope, ApiErrorEnvelope } from '../api/client';
import { AxiosError } from 'axios';

export interface ServiceRequestAddress {
  line1: string;
  line2?: string;
  landmark?: string;
  city: string;
  state: string;
  pinCode: string;
  country: string;
}

export interface ServiceRequest {
  _id: string;
  number: string;
  status: string;
  priority: string;
  createdAt: string;
  completedAt?: string;
  symptoms?: string[];
  notes?: string;
  addressSnapshot?: ServiceRequestAddress;
  customerId?: string;
  serviceId?: string;
  assigneeType?: string;
  assigneeId?: string;
  isEscalated?: boolean;
  customer?: { name: string };
  assignedToUser?: { name: string };
  assignedToVendor?: { name: string };
}

interface ListParams {
  status?: string;
  status_in?: string;
  branchId?: string;
  assigneeId?: string;
  limit?: number;
}

// Every status except CLOSED/CANCELLED — the list endpoint only supports
// $in filtering (status_in), not $nin, so "open" is spelled out explicitly.
export const OPEN_SERVICE_REQUEST_STATUSES = [
  'NEW', 'NEEDS_MANUAL_BRANCH_ASSIGNMENT', 'ASSIGNED_TO_BRANCH', 'ASSIGNED_TO_SUB_BRANCH',
  'ASSIGNED_TO_TEAM', 'ASSIGNED_TO_EMPLOYEE', 'ASSIGNED_TO_VENDOR', 'OUTSOURCED',
  'REASSIGNMENT_REQUIRED', 'ACCEPTED', 'APPOINTMENT_SCHEDULED', 'RESCHEDULED',
  'CUSTOMER_UNAVAILABLE', 'TECHNICIAN_EN_ROUTE', 'TECHNICIAN_ARRIVED', 'INSPECTION_STARTED',
  'INSPECTION_COMPLETED', 'ESTIMATE_PENDING', 'ESTIMATE_SHARED', 'AWAITING_CUSTOMER_APPROVAL',
  'ESTIMATE_APPROVED', 'ESTIMATE_REJECTED', 'PARTS_PENDING', 'WORK_STARTED', 'WORK_IN_PROGRESS',
  'ON_HOLD', 'SERVICE_COMPLETED', 'CUSTOMER_CONFIRMATION_PENDING', 'PAYMENT_PENDING',
  'PARTIALLY_PAID', 'PAID', 'FOLLOW_UP_PENDING', 'HAPPY_CALL_PENDING', 'REOPENED',
].join(',');

export function useServiceRequests(params?: ListParams) {
  return useQuery({
    queryKey: ['service-requests', params],
    queryFn: async () => {
      const res = await apiClient.get<ApiSuccessEnvelope<ServiceRequest[]>>('/service-requests', { params: { limit: 100, ...params } });
      return res.data.data;
    },
  });
}

export function useServiceRequestsCount(params?: ListParams) {
  return useQuery({
    queryKey: ['service-requests', 'count', params],
    queryFn: async () => {
      const res = await apiClient.get<ApiSuccessEnvelope<ServiceRequest[]>>('/service-requests', { params: { ...params, limit: 1 } });
      return res.data.meta?.total ?? 0;
    },
  });
}

export function useServiceRequest(id: string) {
  return useQuery({
    queryKey: ['service-request', id],
    queryFn: async () => {
      const res = await apiClient.get<ApiSuccessEnvelope<ServiceRequest>>(`/service-requests/${id}`);
      return res.data.data;
    },
    enabled: !!id,
  });
}

export interface CreateServiceRequestInput {
  customerId: string;
  customerProductId?: string;
  addressSnapshot: ServiceRequestAddress;
  serviceId: string;
  symptoms?: string[];
  notes?: string;
  priority?: string;
  source: 'CUSTOMER_APP' | 'CALL' | 'LEAD_CONVERSION' | 'WALK_IN';
}

export function useCreateServiceRequest() {
  const queryClient = useQueryClient();

  return useMutation<ServiceRequest, AxiosError<ApiErrorEnvelope>, CreateServiceRequestInput>({
    mutationFn: async (input) => {
      const res = await apiClient.post<ApiSuccessEnvelope<ServiceRequest>>('/service-requests', input);
      return res.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['service-requests'] });
    },
  });
}

export function useAssignServiceRequest() {
  const queryClient = useQueryClient();

  return useMutation<unknown, AxiosError<ApiErrorEnvelope>, { id: string; assigneeType: string; assigneeId: string }>({
    mutationFn: async ({ id, assigneeType, assigneeId }) => {
      const res = await apiClient.post(`/service-requests/${id}/assign`, {
        assigneeType,
        assigneeId,
        method: 'MANUAL',
      });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['service-requests'] });
    },
  });
}
