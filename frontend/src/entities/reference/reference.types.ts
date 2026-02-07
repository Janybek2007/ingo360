import type { PaginationParams, SortDirection } from '#/shared/types/global';

export interface IItem {
  name: string;
  id: number;
  full_name?: string;
  ims_name?: string;
}
export interface IReferenceItem extends IItem {
  indicator: string;
  address: string;
  facility_type: string;
  country: IItem;
  region: IItem;
  settlement: IItem;
  district: IItem;
  promotion_type: IItem;
  product_group: IItem;
  brand: IItem;
  company: IItem;
  dosage_form: IItem;
  dosage: IItem;
  segment: IItem;
  position: IItem;
  responsible_employee: IItem;
  medical_facility: IItem;
  speciality: IItem;
  client_category: IItem;
  pharmacy_network: IItem;
  geo_indicator: IItem;
  distributor: IItem;
}

export type IGetReferencesResponse = IReferenceItem[];

export type IGetReferencesParams = {
  sort_by?: string;
  sort_order?: SortDirection;
} & PaginationParams;
