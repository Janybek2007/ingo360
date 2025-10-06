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
  sku: IDbName;
  pharmacy: IDbName;
}

export type IDBItemResponse = IDbItem[];
