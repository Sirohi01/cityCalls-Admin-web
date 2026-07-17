import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient, ApiSuccessEnvelope } from '../api/client';

export interface AISettings {
  autoTranscriptionEnabled: boolean;
  sentimentTrackingEnabled: boolean;
  smartDispatchEnabled: boolean;
  autoAssignEnabled: boolean;
  primaryProvider: string;
}

export function useAISettings() {
  return useQuery({
    queryKey: ['aiSettings'],
    queryFn: async () => {
      // Typically settings might be a singleton fetch
      const res = await apiClient.get<ApiSuccessEnvelope<AISettings>>('/ai/settings');
      return res.data.data;
    },
  });
}

export function useUpdateAISettings() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (settings: Partial<AISettings>) => {
      const res = await apiClient.patch<ApiSuccessEnvelope<AISettings>>('/ai/settings', settings);
      return res.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['aiSettings'] });
    }
  });
}
