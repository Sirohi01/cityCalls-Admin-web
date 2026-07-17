import { useQuery } from '@tanstack/react-query';
import { apiClient, ApiSuccessEnvelope } from '../api/client';

export interface Master {
  id: string;
  masterType: string;
  key: string;
  label: string;
  active: boolean;
}

export function useMasters(types: string[]) {
  return useQuery({
    queryKey: ['masters', types],
    queryFn: async () => {
      const promises = types.map((type) =>
        apiClient.get<ApiSuccessEnvelope<Master[]>>(`/masters/${type}`)
      );
      const responses = await Promise.all(promises);
      const allMasters = responses.flatMap((res) => res.data.data);
      return allMasters;
    },
  });
}
