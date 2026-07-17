import { useQuery } from '@tanstack/react-query';
import { apiClient, ApiSuccessEnvelope } from '../api/client';

export function useBranches() {
  return useQuery({
    queryKey: ['branches'],
    queryFn: async () => {
      const res = await apiClient.get<ApiSuccessEnvelope<any[]>>('/branches');
      return res.data.data;
    },
  });
}

export function useSubBranches() {
  return useQuery({
    queryKey: ['sub-branches'],
    queryFn: async () => {
      const res = await apiClient.get<ApiSuccessEnvelope<any[]>>('/sub-branches');
      return res.data.data;
    },
  });
}

export function useTeams() {
  return useQuery({
    queryKey: ['teams'],
    queryFn: async () => {
      const res = await apiClient.get<ApiSuccessEnvelope<any[]>>('/teams');
      return res.data.data;
    },
  });
}
