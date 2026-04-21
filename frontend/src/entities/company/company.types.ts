import type { PaginationParams, SortParams } from '#/shared/types/global';

export interface ICompanyItem {
  id: number;
  name: string;
  ims_name: string;
  active_users_limit: number;
  active_users: number;
  can_primary_sales: boolean;
  can_secondary_sales: boolean;
  can_tertiary_sales: boolean;
  can_visits: boolean;
  can_market_analysis: boolean;
  contract_number: string;
  contract_end_date: string;
  is_active: boolean;
  address: string;
}

export type GetCompaniesResponse = ICompanyItem[];

export type GetCompaniesParams = {
  search?: string;
} & PaginationParams &
  SortParams;
