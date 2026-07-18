import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient, ApiSuccessEnvelope, ApiErrorEnvelope } from '../api/client';
import { AxiosError } from 'axios';

export interface CatalogService {
  _id: string;
  name: string;
  categoryId?: string;
  symptomIds?: string[];
  pricing?: { basePrice: number; visitingCharge: number; inspectionCharge: number; emergencyCharge: number };
  warrantyPeriodDays?: number;
  slaMinutes?: number;
  active: boolean;
}

export function useCatalogServices() {
  return useQuery({
    queryKey: ['catalogServices'],
    queryFn: async () => {
      const res = await apiClient.get<ApiSuccessEnvelope<CatalogService[]>>('/services', { params: { limit: 100 } });
      return res.data.data;
    },
  });
}

export function useCatalogService(id: string) {
  return useQuery({
    queryKey: ['catalogService', id],
    queryFn: async () => {
      const res = await apiClient.get<ApiSuccessEnvelope<CatalogService>>(`/services/${id}`);
      return res.data.data;
    },
    enabled: !!id,
  });
}

export interface CreateCatalogServiceInput {
  name: string;
  categoryId: string;
  pricing?: { basePrice?: number; visitingCharge?: number; inspectionCharge?: number; emergencyCharge?: number };
  warrantyPeriodDays?: number;
}

export function useCreateCatalogService() {
  const queryClient = useQueryClient();
  return useMutation<CatalogService, AxiosError<ApiErrorEnvelope>, CreateCatalogServiceInput>({
    mutationFn: async (input) => {
      const res = await apiClient.post<ApiSuccessEnvelope<CatalogService>>('/services', input);
      return res.data.data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['catalogServices'] }),
  });
}

export function useUpdateCatalogService(id: string) {
  const queryClient = useQueryClient();
  return useMutation<CatalogService, AxiosError<ApiErrorEnvelope>, Partial<CreateCatalogServiceInput> & { symptomIds?: string[] }>({
    mutationFn: async (input) => {
      const res = await apiClient.patch<ApiSuccessEnvelope<CatalogService>>(`/services/${id}`, input);
      return res.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['catalogService', id] });
      queryClient.invalidateQueries({ queryKey: ['catalogServices'] });
    },
  });
}
