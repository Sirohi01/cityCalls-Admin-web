import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient, ApiSuccessEnvelope, ApiErrorEnvelope } from '../api/client';
import { AxiosError } from 'axios';

export interface CustomerAddress {
  _id?: string;
  label?: string;
  line1: string;
  line2?: string;
  landmark?: string;
  city: string;
  state: string;
  pinCode: string;
  country: string;
  isDefault?: boolean;
}

export interface Customer {
  _id: string;
  name: string;
  businessName?: string;
  email?: string;
  gstin?: string;
  customerType: 'INDIVIDUAL' | 'BUSINESS';
  createdAt: string;
  contacts: { name?: string; mobile: string; isPrimary: boolean }[];
  addresses: CustomerAddress[];
  tags?: string[];
  blacklisted?: boolean;
}

export function useCustomers() {
  return useQuery({
    queryKey: ['customers'],
    queryFn: async () => {
      const res = await apiClient.get<ApiSuccessEnvelope<Customer[]>>('/customers', { params: { limit: 100 } });
      return res.data.data;
    },
  });
}

export function useCustomer(id: string) {
  return useQuery({
    queryKey: ['customer', id],
    queryFn: async () => {
      const res = await apiClient.get<ApiSuccessEnvelope<Customer>>(`/customers/${id}`);
      return res.data.data;
    },
    enabled: !!id,
  });
}

export interface CustomerDuplicate {
  _id: string;
  name: string;
  businessName?: string;
  contacts: { mobile: string }[];
}

// GET /customers/duplicates?mobile=&gstin=&businessName=&name= — matches
// against whichever fields are provided. Used to check a specific new
// customer against existing records, not a standalone "review queue"
// (the backend has no persisted duplicate-review model).
export function useCustomerDuplicateCheck(params: { mobile?: string; gstin?: string; businessName?: string; name?: string }) {
  const hasAnyParam = Boolean(params.mobile || params.gstin || params.businessName || params.name);
  return useQuery({
    queryKey: ['customer-duplicates', params],
    queryFn: async () => {
      const res = await apiClient.get<ApiSuccessEnvelope<CustomerDuplicate[]>>('/customers/duplicates', { params });
      return res.data.data;
    },
    enabled: hasAnyParam,
  });
}

export interface CreateCustomerInput {
  customerType: 'INDIVIDUAL' | 'BUSINESS';
  name: string;
  businessName?: string;
  gstin?: string;
  email?: string;
  contacts: { name?: string; mobile: string; isPrimary: boolean }[];
  addresses?: CustomerAddress[];
  tags?: string[];
}

export function useCreateCustomer() {
  const queryClient = useQueryClient();
  return useMutation<{ customer: Customer; potentialDuplicates: CustomerDuplicate[] }, AxiosError<ApiErrorEnvelope>, CreateCustomerInput>({
    mutationFn: async (input) => {
      const res = await apiClient.post<ApiSuccessEnvelope<{ customer: Customer; potentialDuplicates: CustomerDuplicate[] }>>('/customers', input);
      return res.data.data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['customers'] }),
  });
}

export function useAddCustomerAddress(customerId: string) {
  const queryClient = useQueryClient();
  return useMutation<Customer, AxiosError<ApiErrorEnvelope>, CustomerAddress>({
    mutationFn: async (input) => {
      const res = await apiClient.post<ApiSuccessEnvelope<Customer>>(`/customers/${customerId}/addresses`, input);
      return res.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customer', customerId] });
      queryClient.invalidateQueries({ queryKey: ['customers'] });
    },
  });
}

export interface CustomerProduct {
  _id: string;
  customerId: string;
  brandId: string;
  productTypeId: string;
  modelNumber?: string;
  serialNumber?: string;
  purchaseDate?: string;
  warrantyExpiresAt?: string;
}

export function useCustomerProducts(customerId: string) {
  return useQuery({
    queryKey: ['customer-products', customerId],
    queryFn: async () => {
      const res = await apiClient.get<ApiSuccessEnvelope<CustomerProduct[]>>(`/customers/${customerId}/products`);
      return res.data.data;
    },
    enabled: !!customerId,
  });
}

export interface AddCustomerProductInput {
  brandId: string;
  productTypeId: string;
  modelNumber?: string;
  serialNumber?: string;
}

export function useAddCustomerProduct(customerId: string) {
  const queryClient = useQueryClient();
  return useMutation<CustomerProduct, AxiosError<ApiErrorEnvelope>, AddCustomerProductInput>({
    mutationFn: async (input) => {
      const res = await apiClient.post<ApiSuccessEnvelope<CustomerProduct>>(`/customers/${customerId}/products`, input);
      return res.data.data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['customer-products', customerId] }),
  });
}
