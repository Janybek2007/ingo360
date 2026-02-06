export const COMMON_COLUMNS_FILTER_KEY_MAP: Record<string, string> = {
  sku_id: 'skus',
  brand_id: 'brands',
  promotion_type_id: 'promotion_types',
  product_group_id: 'product_groups',
  responsible_employee_id: 'responsible_employees',
  segment_id: 'segments',
  distributor_id: 'distributors',
  indicator_id: 'indicators',
  geo_indicator_id: 'geo_indicators',
  pharmacy_id: 'pharmacies',
  medical_facility_id: 'medical_facilities',
  employee_id: 'employees',
};

export const REFERENCE_WORK_FILTER_KEY_MAP: Record<string, string> = {
  'distributor.id': 'distributors',
  'product_group.id': 'product_groups',
  'client_category.id': 'client_categories',
  'speciality.id': 'specialities',
  'medical_facility.id': 'medical_facilities',
  'responsible_employee.id': 'responsible_employees',
  'district.id': 'districts',
  'settlement.id': 'settlements',
  'region.id': 'regions',
  'country.id': 'countries',
  'company.id': 'companies',
  'promotion_type.id': 'promotion_types',
  'brand.id': 'brands',
  'position.id': 'positions',
  'dosage_form.id': 'dosage_forms',
  'dosage.id': 'dosages',
  'segment.id': 'segments',
};

export const DB_WORK_FILTER_KEY_MAP: Record<string, string> = {
  'pharmacy.id': 'pharmacies',
  'employee.id': 'employees',
  'product_group.id': 'product_groups',
  'medical_facility.id': 'medical_facilities',
  'doctor.id': 'doctors',
};
