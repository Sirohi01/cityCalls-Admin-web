import { useQuery } from '@tanstack/react-query';
import { apiClient, ApiSuccessEnvelope } from '../api/client';

export interface AuditLog {
  id: string;
  action: string;
  user: string;
  module: string;
  createdAt: string;
}

export function useAuditLogs() {
  return useQuery({
    queryKey: ['auditLogs'],
    queryFn: async () => {
      const res = await apiClient.get<ApiSuccessEnvelope<AuditLog[]>>('/audit/logs');
      return res.data.data;
    },
  });
}
