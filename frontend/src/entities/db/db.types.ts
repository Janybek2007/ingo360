import type { UsePeriodType } from '#/shared/hooks/use-period-filter';
import type {
  IndicatorType,
  PaginationParams,
  SortDirection,
} from '#/shared/types/global';
import type { ISMGroupColumn } from '#/shared/types/ims';

export interface IDbName {
  id: number;
  name: string;
}
export interface IDbItem {
  id: number;
  month: number | string;
  quarter: number;
  year: number;
  indicator: string;
  packages: number;
  amount: number;
  published: boolean;
  city: string;
  //
  distributor: IDbName;
  sku: IDbName & { brand: IDbName };
  pharmacy: IDbName & { distributor: IDbName };
  product_group: IDbName;
  employee: { id: number; full_name: string };
  doctor: null | IDbName;
  client_type: string;
  medical_facility: null | IDbName;
  //
  company: string;
  brand: 'string';
  segment: string;
  dosage: string;
  dosage_form: string;
  period: string;
  molecule: string;
}

export type TDbItem = {
  id: number;
  //
  sku_id: number;
  sku_name: string;
  //
  brand_id: number;
  brand_name: string;
  //
  promotion_type_id: number;
  promotion_type_name: string;
  //
  distributor_id: number;
  distributor_name: string;
  //
  product_group_id: number;
  product_group_name: string;
  product_group: string;
  //
  segment_id: string;
  segment_name: string;
  //
  medical_facility_id: null;
  medical_facility: string;
  medical_facility_name: string;
  //
  pharmacy_id: number;
  pharmacy_name: string;
  pharmacy: string;
  //
  responsible_employee_id: number;
  responsible_employee_name: string;
  //
  employee_id: number;
  employee_name: string;
  employee: string;
  //
  indicator_id: string;
  indicator_name: string;
  //
  speciality_id: number;
  speciality: string;
  speciality_name: string;
  //
  geo_indicator_name: string;
  geo_indicator_id: number;
  //
  doctor_id: number;
  doctor_name: string;
  //
  year: number;
  quarter: number;
  month: number;
  packages: number;
  amount: number;
  amount_share_percent: number;
  periods_data: Record<string, Record<IndicatorType | string, number>>;
};

export type IGetDBItemResponse = IDbItem[];

export interface IGetDBItemsParams extends PaginationParams {
  sort_by?: string;
  sort_order?: SortDirection;

  method?: 'GET' | 'POST';
  //
  years?: number[];
  months?: number[];
  quarters?: number[];
  //
  brand_ids?: (string | number)[];
  distributor_ids?: (string | number)[];
  product_group_ids?: (string | number)[];
  search?: string;
  promo_type_ids?: (string | number)[];
  sku_ids?: (string | number)[];
  geo_indicators_ids?: (string | number)[];
  medical_facility_ids?: (string | number)[];
  group_by_period?: UsePeriodType;
  period_values?: string[];
  periods?: string[];
  group_column?: ISMGroupColumn;
  group_by_dimensions?: string[];
  indicator?: string;
  enabled?: boolean;
  segment_name?: string;
  brand_name?: string;
}
