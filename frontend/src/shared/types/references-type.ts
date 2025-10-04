export type ReferencesType =
  | 'geography'
  | 'geography/countries'
  | 'geography/settlements'
  | 'geography/regions'
  | 'geography/districts'
  | 'products'
  | 'products/product-groups'
  | 'products/promotion-types'
  | 'products/brands'
  | 'products/dosage-forms'
  | 'products/segments'
  | 'products/skus'
  | 'employees'
  | 'employees/positions'
  | 'employees/employees'
  | 'clients'
  | 'clients/distributors'
  | 'clients/medical-facilities'
  | 'clients/specialities'
  | 'clients/client-categories'
  | 'clients/doctors'
  | 'clients/pharmacies';

export type ReferencesTypeWithMain = Exclude<
  ReferencesType,
  'geography' | 'products' | 'employees' | 'clients'
>;

export type ReferencesTypeWithDepUrls = Exclude<
  ReferencesTypeWithMain,
  | 'geography/countries'
  | 'products/promotion-types'
  | 'products/dosage-forms'
  | 'products/segments'
  | 'employees/positions'
  | 'clients/distributors'
  | 'clients/specialities'
  | 'clients/client-categories'
  | 'geography'
  | 'products'
  | 'employees'
  | 'clients'
>;
