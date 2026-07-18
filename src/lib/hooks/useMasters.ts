import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient, ApiSuccessEnvelope, ApiErrorEnvelope } from '../api/client';
import { AxiosError } from 'axios';

export interface Master {
  _id: string;
  masterType: string;
  key: string;
  label: string;
  active: boolean;
  sortOrder?: number;
}

export function useMasters(types: string[]) {
  return useQuery({
    queryKey: ['masters', types],
    queryFn: async () => {
      // limit=100 — the backend defaults to 20/page, which silently truncated
      // types with more entries (e.g. BRAND/PART at 25) below what was seeded.
      const responses = await Promise.all(
        types.map((type) => apiClient.get<ApiSuccessEnvelope<Master[]>>(`/masters/${type}`, { params: { limit: 100 } }))
      );
      return responses.flatMap((res) => res.data.data);
    },
    enabled: types.length > 0,
  });
}

export interface CreateMasterInput {
  masterType: string;
  key: string;
  label: string;
}

export function useCreateMaster() {
  const queryClient = useQueryClient();
  return useMutation<Master, AxiosError<ApiErrorEnvelope>, CreateMasterInput>({
    mutationFn: async ({ masterType, ...input }) => {
      const res = await apiClient.post<ApiSuccessEnvelope<Master>>(`/masters/${masterType}`, input);
      return res.data.data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['masters'] }),
  });
}
