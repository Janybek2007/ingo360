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

export type IGetDBItemResponse = IDbItem[];
