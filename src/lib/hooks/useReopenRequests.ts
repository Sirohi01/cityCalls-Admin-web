import { useQuery } from '@tanstack/react-query';
import { apiClient, ApiSuccessEnvelope } from '../api/client';

export interface ReopenRequest {
  id: string;
  originalServiceRequestId: string;
  customerName: string;
  reason: string;
  status: string;
  reopenedAt: string;
}

export function useReopenRequests() {
  return useQuery({
    queryKey: ['reopenRequests'],
    queryFn: async () => {
      // Trying to fetch from a generic endpoint, adjust if backend expects differently
      const res = await apiClient.get<ApiSuccessEnvelope<ReopenRequest[]>>('/reopen-requests');
      return res.data.data;
    },
  });
}
