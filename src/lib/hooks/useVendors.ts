import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient, ApiSuccessEnvelope, ApiErrorEnvelope } from '../api/client';
import { AxiosError } from 'axios';

export interface Vendor {
  _id: string;
  companyName: string;
  contactPersons: { name: string; mobile: string; role?: string }[];
  serviceAreas?: { pinCodes: string[] };
  gst?: string;
  pan?: string;
  active: boolean;
  blacklisted: boolean;
}

export function useVendors() {
  return useQuery({
    queryKey: ['vendors'],
    queryFn: async () => {
      const res = await apiClient.get<ApiSuccessEnvelope<Vendor[]>>('/vendors');
      return res.data.data;
    },
  });
}

export function useVendorsCount(params?: { active?: boolean; blacklisted?: boolean }) {
  return useQuery({
    queryKey: ['vendors', 'count', params],
    queryFn: async () => {
      const res = await apiClient.get<ApiSuccessEnvelope<Vendor[]>>('/vendors', { params: { ...params, limit: 1 } });
      return res.data.meta?.total ?? 0;
    },
  });
}

export interface CreateVendorInput {
  companyName: string;
  contactPersons?: { name: string; mobile: string; role?: string }[];
  serviceAreas?: { pinCodes: string[] };
}

export function useCreateVendor() {
  const queryClient = useQueryClient();
  return useMutation<Vendor, AxiosError<ApiErrorEnvelope>, CreateVendorInput>({
    mutationFn: async (input) => {
      const res = await apiClient.post<ApiSuccessEnvelope<Vendor>>('/vendors', input);
      return res.data.data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['vendors'] }),
  });
}
