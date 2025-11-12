export interface EntityRow {
  rank: number;
  entity: string;
  sales: number;
  is_user_company: boolean;
}

export interface IMSMetricsRow {
  sales: number;
  market_sales: number;
  market_share: number;
  growth_vs_previous: number;
  market_growth: number;
  growth_vs_market: number;
}

export type ISMGroupColumn = 'company' | 'brand' | 'segment';
