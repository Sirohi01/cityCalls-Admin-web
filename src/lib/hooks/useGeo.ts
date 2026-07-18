import { useMutation } from '@tanstack/react-query';
import { apiClient, ApiSuccessEnvelope, ApiErrorEnvelope } from '../api/client';
import { AxiosError } from 'axios';

export interface AreaCheckResult {
  serviceable: boolean;
  branchId?: string;
  branchName?: string;
  subBranchId?: string;
  subBranchName?: string;
  city?: string;
  state?: string;
  country?: string;
  district?: string;
}

// A mutation (not a query) even though it's a GET — the call-entry wizard
// triggers this on-demand ("Check Area" button click), not automatically on
// every keystroke, so the imperative mutate() call is the right fit.
export function useCheckPincode() {
  return useMutation<AreaCheckResult, AxiosError<ApiErrorEnvelope>, string>({
    mutationFn: async (pincode) => {
      const res = await apiClient.get<ApiSuccessEnvelope<AreaCheckResult>>(`/geo/pincode/${pincode}`);
      return res.data.data;
    },
  });
}
