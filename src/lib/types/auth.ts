// Local types mirroring citycalls-api's contract, per docs/11-complete-api-contracts.md §1.1.
// Regenerated from the synced OpenAPI spec once openapi/citycalls.yaml exists in this repo
// (see scripts/sync-contracts.sh) — hand-written for now since Phase 1 backend just landed.

export type Role =
  | 'SUPER_ADMIN'
  | 'ADMIN'
  | 'OPERATIONS_ADMIN'
  | 'BRANCH_ADMIN'
  | 'SUB_BRANCH_ADMIN'
  | 'BRANCH_MANAGER'
  | 'TEAM_LEAD'
  | 'EMPLOYEE'
  | 'TECHNICIAN'
  | 'CALL_EXECUTIVE'
  | 'CUSTOMER_SUPPORT_EXECUTIVE'
  | 'HAPPY_CALL_EXECUTIVE'
  | 'SALES_EXECUTIVE'
  | 'MARKETING_EXECUTIVE'
  | 'FINANCE_EXECUTIVE'
  | 'ACCOUNTANT'
  | 'VENDOR_OWNER'
  | 'VENDOR_MANAGER'
  | 'VENDOR_TECHNICIAN'
  | 'OUTSOURCED_PARTNER'
  | 'CUSTOMER'
  | 'BUSINESS_CUSTOMER';

export interface AuthUser {
  id: string;
  name: string;
  role: Role;
  branchId?: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: AuthUser;
}
