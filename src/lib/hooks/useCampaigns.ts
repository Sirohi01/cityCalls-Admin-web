import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient, ApiSuccessEnvelope, ApiErrorEnvelope } from '../api/client';
import { AxiosError } from 'axios';

export type CampaignStatus = 'DRAFT' | 'SCHEDULED' | 'SENDING' | 'COMPLETED' | 'CANCELLED';

export interface Campaign {
  _id: string;
  name: string;
  channel: 'WHATSAPP' | 'EMAIL';
  templateId: string;
  audienceFilter: { tags?: string[]; segments?: string[]; customerType?: string };
  scheduledAt?: string;
  status: CampaignStatus;
  stats: { sent: number; delivered: number; read: number; failed: number };
  createdAt: string;
}

export function useCampaigns() {
  return useQuery({
    queryKey: ['campaigns'],
    queryFn: async () => {
      const res = await apiClient.get<ApiSuccessEnvelope<Campaign[]>>('/campaigns', { params: { limit: 100 } });
      return res.data.data;
    },
  });
}

export interface CreateCampaignInput {
  name: string;
  channel: 'WHATSAPP' | 'EMAIL';
  templateId: string;
  audienceFilter: { tags?: string[]; segments?: string[]; customerType?: string };
  scheduledAt?: string;
}

export function useCreateCampaign() {
  const queryClient = useQueryClient();
  return useMutation<Campaign, AxiosError<ApiErrorEnvelope>, CreateCampaignInput>({
    mutationFn: async (input) => {
      const res = await apiClient.post<ApiSuccessEnvelope<Campaign>>('/campaigns', input);
      return res.data.data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['campaigns'] }),
  });
}

export function useSendCampaign() {
  const queryClient = useQueryClient();
  return useMutation<Campaign, AxiosError<ApiErrorEnvelope>, string>({
    mutationFn: async (id) => {
      const res = await apiClient.post<ApiSuccessEnvelope<Campaign>>(`/campaigns/${id}/send`);
      return res.data.data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['campaigns'] }),
  });
}

export function useUpdateCampaign() {
  const queryClient = useQueryClient();
  return useMutation<Campaign, AxiosError<ApiErrorEnvelope>, Partial<CreateCampaignInput> & { id: string }>({
    mutationFn: async ({ id, ...input }) => {
      const res = await apiClient.patch<ApiSuccessEnvelope<Campaign>>(`/campaigns/${id}`, input);
      return res.data.data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['campaigns'] }),
  });
}

export function useDeleteCampaign() {
  const queryClient = useQueryClient();
  return useMutation<void, AxiosError<ApiErrorEnvelope>, string>({
    mutationFn: async (id) => {
      await apiClient.delete(`/campaigns/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['campaigns'] });
    },
  });
}
