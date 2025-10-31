import type { PaginationParams } from '#/shared/types/global';

export interface IDbName {
  id: number;
  name: string;
}
export interface IDbItem {
  id: number;
  month: number;
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
  pharmacy: IDbName;
  product_group: IDbName;
  employee: { id: number; full_name: string };
  doctor: null | IDbName;
  client_type: string;
  medical_facility: null | IDbName;
}

export type TDbItem = {
  id: number;
  sku_id: number;
  sku_name: string;
  brand_id: number;
  brand_name: string;
  promotion_type_id: number;
  promotion_type_name: string;
  distributor_id: number;
  distributor_name: string;
  product_group_id: number;
  product_group_name: string;
  segment_id: string;
  segment_name: string;
  pharmacy_id: number;
  pharmacy_name: string;
  responsible_employee_id: number;
  responsible_employee_name: string;
  year: number;
  quarter: number;
  month: number;
};

export type IGetDBItemResponse = IDbItem[];

export interface IGetDBItemsParams extends PaginationParams {
  months?: number[];
  years?: number[];
  quarters?: number[];
  brand_ids?: number[];
  distributor_ids?: number[];
  product_group_ids?: number[];
  promo_type_id?: number[];
  sku_ids?: number[];
  group_by_period?: 'month' | 'quarter' | 'year';
}
