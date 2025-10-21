export interface ICompanyItem {
  id: number;
  name: string;
  ims_name: string;
  active_users_limit: 20;
  active_users: 0;
  can_primary_sales: false;
  can_secondary_sales: false;
  can_tertiary_sales: false;
  can_visits: false;
  can_market_analysis: false;
  contract_number: '654241';
  contract_end_date: '2025-10-02';
  is_active: true;
}

export type GetCompanyResponse = ICompanyItem[];
