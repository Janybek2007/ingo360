import type { CColumn } from '../hooks/use-generate-columns';
import { formatDateInUTC } from '../utils/format-date-in-utc';
import { columnHeaderNames } from './column-header-names';
import { allMonths } from './months';
import { ROLES_OBJECT } from './roles';

export const commonColumns = {
  sku: (pinned = true, skipFirstFilterOption = false): CColumn<any> => ({
    id: 'sku_id',
    key: 'sku_name',
    optionKey: 'products_skus',
    header: columnHeaderNames.sku,
    size: 350,
    type: 'select',
    pinned,
    groupDimension: 'sku',
    skipFirstFilterOption,
  }),
  brand: (skipFirstFilterOption = false): CColumn<any> => ({
    id: 'brand_id',
    key: 'brand_name',
    optionKey: 'products_brands',
    header: columnHeaderNames.brand,
    size: 150,
    type: 'select',
    groupDimension: 'brand',
    skipFirstFilterOption,
  }),
  promotion: (skipFirstFilterOption = false): CColumn<any> => ({
    id: 'promotion_type_id',
    key: 'promotion_type_name',
    optionKey: 'products_promotion_types',
    header: columnHeaderNames.promotion,
    size: 200,
    type: 'select',
    groupDimension: 'promotion_type',
    skipFirstFilterOption,
  }),
  group: (
    key = 'product_group_name',
    skipFirstFilterOption = false
  ): CColumn<any> => ({
    id: 'product_group_id',
    key,
    optionKey: 'products_product_groups',
    header: columnHeaderNames.group,
    size: 150,
    type: 'select',
    groupDimension: 'product_group',
    custom: {
      accessor: row => row[key] || '-',
    },
    skipFirstFilterOption,
  }),
  responsible_employee: (skipFirstFilterOption = false): CColumn<any> => ({
    id: 'responsible_employee_id',
    key: 'responsible_employee_name',
    optionKey: 'employees_employees',
    header: columnHeaderNames.responsibleEmployee,
    size: 260,
    type: 'select',
    groupDimension: 'responsible_employee',
    custom: { accessor: row => row.responsible_employee_name || '-' },
    skipFirstFilterOption,
  }),
  position: (skipFirstFilterOption = false): CColumn<any> => ({
    id: 'position_id',
    key: 'position',
    optionKey: 'employees_positions',
    header: columnHeaderNames.position,
    size: 200,
    type: 'select',
    groupDimension: 'position',
    skipFirstFilterOption,
  }),
  doctor: (skipFirstFilterOption = false): CColumn<any> => ({
    id: 'doctor_id',
    key: 'doctor_full_name',
    optionKey: 'clients_doctors',
    header: columnHeaderNames.doctor,
    size: 200,
    type: 'select',
    groupDimension: 'doctor',
    custom: { accessor: row => row.doctor_full_name || '-' },
    skipFirstFilterOption,
  }),
  speciality: (skipFirstFilterOption = false): CColumn<any> => ({
    id: 'speciality_id',
    key: 'speciality_name',
    optionKey: 'clients_specialities',
    header: columnHeaderNames.speciality,
    size: 200,
    type: 'select',
    groupDimension: 'speciality',
    custom: { accessor: row => row.speciality_name || '-' },
    skipFirstFilterOption,
  }),
  segment: (skipFirstFilterOption = false): CColumn<any> => ({
    id: 'segment_id',
    key: 'segment_name',
    optionKey: 'products_segments',
    header: columnHeaderNames.segment,
    size: 200,
    type: 'select',
    groupDimension: 'segment',
    skipFirstFilterOption,
  }),
  distributor: (skipFirstFilterOption = false): CColumn<any> => ({
    id: 'distributor_id',
    key: 'distributor_name',
    optionKey: 'clients_distributors',
    header: columnHeaderNames.distributor,
    size: 150,
    type: 'select',
    groupDimension: 'distributor',
    custom: {
      accessor: row => row['distributor_name'] || '-',
    },
    skipFirstFilterOption,
  }),
  indicator: (skipFirstFilterOption = false): CColumn<any> => ({
    id: 'indicator_id',
    key: 'indicator_name',
    optionKey: 'clients_geo_indicators',
    header: columnHeaderNames.indicator,
    size: 150,
    type: 'select',
    groupDimension: 'indicator',
    custom: {
      accessor: row => row['indicator_name'] || '-',
    },
    skipFirstFilterOption,
  }),
  geo_indicator: (
    headerName: string = columnHeaderNames.geoIndicator
  ): CColumn<any> => ({
    id: 'geo_indicator_id',
    key: 'geo_indicator_name',
    optionKey: 'clients_geo_indicators',
    header: headerName,
    size: 150,
    type: 'select',
    groupDimension: 'geo_indicator',
    custom: {
      accessor: row => row['geo_indicator_name'] || '-',
    },
  }),
  pharmacy: (
    key = 'pharmacy',
    skipFirstFilterOption = false
  ): CColumn<any> => ({
    id: 'pharmacy_id',
    key: key,
    optionKey: 'clients_pharmacies',
    header: columnHeaderNames.pharmacy,
    size: 300,
    type: 'select',
    groupDimension: 'pharmacy',
    custom: {
      accessor: row => row[key] || '-',
    },
    skipFirstFilterOption,
  }),
  medical_facility: (
    size = 150,
    skipFirstFilterOption = false
  ): CColumn<any> => ({
    id: 'medical_facility_id',
    key: 'medical_facility',
    optionKey: 'clients_medical_facilities',
    header: columnHeaderNames.medicalFacility,
    size,
    type: 'select',
    groupDimension: 'medical_facility',
    custom: {
      accessor: row => row['medical_facility'] || '-',
    },
    skipFirstFilterOption,
  }),
  employee: (skipFirstFilterOption = false): CColumn<any> => ({
    id: 'employee_id',
    key: 'employee',
    optionKey: 'employees_employees',
    header: columnHeaderNames.employee,
    type: 'select',
    groupDimension: 'employee',
    custom: {
      accessor: row => row['employee'] || '-',
    },
    skipFirstFilterOption,
  }),
  year: (filter = true): CColumn<any> => ({
    id: 'year',
    key: 'year',
    optionKey: 'employees_employees',
    header: columnHeaderNames.year,
    size: 140,
    type: filter ? 'number' : undefined,
    custom: {
      cell: ({ row }) => row.original.year ?? '-',
    },
  }),
  month: (filter = true): CColumn<any> => ({
    id: 'month',
    key: 'month',
    header: columnHeaderNames.month,
    size: 140,
    type: filter ? 'select' : undefined,
    custom: {
      cell: ({ row }) => allMonths[row.original.month - 1] ?? '-',
      options: allMonths.map((month, index) => ({
        label: month,
        value: index + 1,
      })),
    },
  }),
  status: (size = 280, key = 'is_active'): CColumn<any> => ({
    id: 'is_active',
    key,
    header: columnHeaderNames.status,
    size,
    type: 'select',
    custom: {
      options: [
        { label: 'Активен', value: 'true' },
        { label: 'Неактивен', value: 'false' },
      ],
      cell: ({ getValue }) => {
        const isActive = getValue() == 'true' || getValue() === true;
        return isActive ? 'Активен' : 'Неактивен';
      },
    },
  }),
  imsName: (size = 200): CColumn<any> => ({
    id: 'ims_name',
    key: 'ims_name',
    header: columnHeaderNames.ims_name,
    size,
    custom: {
      cell: ({ row }) => row.original?.ims_name || '-',
    },
  }),
  companyName: (size = 200): CColumn<any> => ({
    id: 'name',
    key: 'name',
    header: columnHeaderNames.companyName,
    size,
  }),
  companyActiveUsersLimit: (size = 227): CColumn<any> => ({
    id: 'active_users_limit',
    key: 'active_users_limit',
    header: columnHeaderNames.companyActiveUsersLimit,
    size,
    type: 'number',
  }),
  companyActiveUsers: (size = 220): CColumn<any> => ({
    id: 'active_users',
    key: 'active_users',
    header: columnHeaderNames.companyActiveUsers,
    size,
  }),
  companyContractNumber: (size = 213): CColumn<any> => ({
    id: 'contract_number',
    key: 'contract_number',
    header: columnHeaderNames.companyContractNumber,
    size,
  }),
  companyContractEndDate: (size = 273): CColumn<any> => ({
    id: 'contract_end_date',
    key: 'contract_end_date',
    header: columnHeaderNames.companyContractEndDate,
    size,
  }),
  userFullName: (size = 280): CColumn<any> => ({
    id: 'full_name',
    key: 'full_name',
    header: columnHeaderNames.fullName,
    size,
    type: 'string',
    custom: {
      accessor: row =>
        `${row.last_name} ${row.first_name} ${row.patronymic || ''}`.trim() ||
        '-',
      cell: ({ row }) => {
        const user = row.original;
        return (
          `${user.last_name} ${user.first_name} ${user.patronymic || ''}`.trim() ||
          '-'
        );
      },
    },
  }),
  userRole: (size = 280): CColumn<any> => ({
    id: 'role',
    key: 'role',
    header: columnHeaderNames.role,
    size,
    type: 'string',
    custom: {
      accessor(row) {
        if (row.is_admin) return ROLES_OBJECT.administrator;
        if (row.is_operator) return ROLES_OBJECT.operator;
        return '';
      },
    },
  }),
  userEmail: (size = 280): CColumn<any> => ({
    id: 'email',
    key: 'email',
    header: columnHeaderNames.email,
    size,
    type: 'string',
  }),
  customerPosition: (size = 200): CColumn<any> => ({
    id: 'position',
    header: columnHeaderNames.customerPosition,
    size,
    type: 'string',
    custom: {
      accessor: row => (row as { position?: string }).position || 'Не указана',
    },
  }),
  customerCompany: (size = 290): CColumn<any> => ({
    id: 'company_id',
    key: 'company.name',
    header: columnHeaderNames.companyName,
    size,
    type: 'select',
    optionKey: 'companies_companies',
    custom: {
      accessor: row => row.company?.name || 'Не указана',
    },
  }),
  // Report Logs columns
  reportLogId: (): CColumn<any> => ({
    id: 'id',
    key: 'id',
    header: columnHeaderNames.logId,
    size: 80,
  }),
  reportLogUserFullName: (): CColumn<any> => ({
    id: 'user_full_name',
    key: 'user_full_name',
    header: columnHeaderNames.fullName,
    size: 200,
    type: 'string',
    custom: {
      accessor: row =>
        `${row.user_last_name} ${row.user_first_name}`.trim() || '-',
    },
  }),
  reportLogTargetTable: (): CColumn<any> => ({
    id: 'target_table',
    key: 'target_table',
    header: columnHeaderNames.targetTable,
    size: 180,
    type: 'string',
  }),
  reportLogRecordsCount: (): CColumn<any> => ({
    id: 'records_count',
    key: 'records_count',
    header: columnHeaderNames.recordsCount,
    size: 150,
    type: 'number',
    aggregate: 'sum',
  }),
  reportLogImportedCount: (): CColumn<any> => ({
    id: 'imported_count',
    key: 'imported_count',
    header: columnHeaderNames.importedCount,
    size: 130,
    type: 'number',
    aggregate: 'sum',
    custom: { cell: ({ row }) => row.original.imported_count ?? '—' },
  }),
  reportLogInsertedCount: (): CColumn<any> => ({
    id: 'inserted_count',
    key: 'inserted_count',
    header: columnHeaderNames.insertedCount,
    size: 120,
    type: 'number',
    aggregate: 'sum',
    custom: { cell: ({ row }) => row.original.inserted_count ?? '—' },
  }),
  reportLogUpdatedCount: (): CColumn<any> => ({
    id: 'updated_count',
    key: 'updated_count',
    header: columnHeaderNames.updatedCount,
    size: 120,
    type: 'number',
    aggregate: 'sum',
    custom: { cell: ({ row }) => row.original.updated_count ?? '—' },
  }),
  reportLogSkippedCount: (): CColumn<any> => ({
    id: 'skipped_count',
    key: 'skipped_count',
    header: columnHeaderNames.skippedCount,
    size: 120,
    type: 'number',
    aggregate: 'sum',
    custom: { cell: ({ row }) => row.original.skipped_count ?? '—' },
  }),
  reportLogDeduplicatedCount: (): CColumn<any> => ({
    id: 'deduplicated_count',
    key: 'deduplicated_count',
    header: columnHeaderNames.deduplicatedCount,
    size: 130,
    type: 'number',
    aggregate: 'sum',
    custom: { cell: ({ row }) => row.original.deduplicated_count ?? '—' },
  }),
  reportLogCreatedAt: (): CColumn<any> => ({
    id: 'created_at',
    key: 'created_at',
    header: columnHeaderNames.createdAt,
    size: 180,
    custom: {
      cell: ({ row }) => {
        return formatDateInUTC(row.original.created_at);
      },
    },
  }),
  // Specialist Coverage columns
  specialistCoverageMedicalFacility: (): CColumn<any> => ({
    id: 'medical_facility_id',
    key: 'medical_facility_name',
    optionKey: 'clients_medical_facilities',
    header: columnHeaderNames.medicalFacility,
    size: 224,
    type: 'select',
    groupDimension: 'medical_facility',
    custom: {
      accessor: row => row.medical_facility_name || '-',
    },
    skipFirstFilterOption: true,
  }),
  specialistCoverageSpeciality: (): CColumn<any> => ({
    id: 'speciality_id',
    key: 'speciality_name',
    optionKey: 'clients_specialities',
    header: columnHeaderNames.speciality,
    size: 230,
    type: 'select',
    groupDimension: 'speciality',
    custom: {
      accessor: row => row.speciality_name || '-',
    },
    skipFirstFilterOption: true,
  }),
  specialistCoveragePercentage: (): CColumn<any> => ({
    id: 'coverage_percentage',
    key: 'coverage_percentage',
    header: columnHeaderNames.coveragePercentage,
    size: 230,
    type: 'number',
    custom: {
      accessor: row => `${row.coverage_percentage.toFixed(0)}%`,
    },
  }),
  specialistCoverageTotalDoctors: (): CColumn<any> => ({
    id: 'total_doctors',
    key: 'total_doctors',
    header: columnHeaderNames.coverageTotalDoctors,
    size: 230,
    type: 'number',
    aggregate: 'sum',
  }),
  specialistCoverageDoctorsWithVisits: (): CColumn<any> => ({
    id: 'doctors_with_visits',
    key: 'doctors_with_visits',
    header: columnHeaderNames.coverageDoctorsWithVisits,
    size: 300,
    type: 'number',
    aggregate: 'sum',
  }),
  // Market Insights columns
  marketInsightsCompany: (): CColumn<any> => ({
    id: 'company',
    key: 'company',
    header: columnHeaderNames.companyName,
    type: 'string',
    groupDimension: 'company',
  }),
  marketInsightsBrand: (): CColumn<any> => ({
    id: 'brand',
    key: 'brand',
    header: columnHeaderNames.brand,
    type: 'string',
    groupDimension: 'brand',
  }),
  marketInsightsSegment: (): CColumn<any> => ({
    id: 'segment',
    key: 'segment',
    header: columnHeaderNames.segment,
    type: 'string',
    groupDimension: 'segment',
  }),
  marketInsightsDosageForm: (): CColumn<any> => ({
    id: 'dosage_form',
    key: 'dosage_form',
    header: columnHeaderNames.dosageForm,
    type: 'string',
    groupDimension: 'dosage_form',
  }),
  marketInsightsDosage: (): CColumn<any> => ({
    id: 'dosage',
    key: 'dosage',
    header: columnHeaderNames.dosage,
    type: 'string',
    groupDimension: 'dosage',
  }),
  marketMolecule: (): CColumn<any> => ({
    id: 'molecule',
    key: 'molecule',
    header: columnHeaderNames.molecule,
    type: 'string',
    groupDimension: 'molecule',
  }),
};

//

// ---- Parsing ----
type Period =
  | { type: 'month'; year: number; order: number }
  | { type: 'quarter'; year: number; order: number }
  | { type: 'year'; year: number; order: number }
  | { type: 'unknown'; year: 0; order: 0 };

class MarketInsightsDynamicPeriods {
  private staticKeys = [
    'company',
    'brand',
    'segment',
    'dosage_form',
    'dosage',
    'molecule',
  ];

  // ---- Parsing ----
  private parsePeriod(key: string): Period {
    if (/^\d{4}-\d{2}$/.test(key)) {
      const [year, month] = key.split('-').map(Number);
      return { type: 'month', year, order: month };
    }
    if (/^\d{4}-Q\d$/.test(key)) {
      const [yearPart, quarterPart] = key.split('-Q');
      return {
        type: 'quarter',
        year: Number(yearPart),
        order: Number(quarterPart),
      };
    }
    if (/^\d{4}$/.test(key)) {
      return { type: 'year', year: Number(key), order: 1 };
    }
    return { type: 'unknown', year: 0, order: 0 };
  }

  // ---- Format Header ----
  private formatHeader(key: string): string {
    const p = this.parsePeriod(key);
    switch (p.type) {
      case 'month': {
        return `${p.year}-${String(p.order).padStart(2, '0')}`;
      }
      case 'quarter': {
        return `${p.year}-Q${p.order}`;
      }
      case 'year': {
        return `${p.year}`;
      }
      default: {
        return key;
      }
    }
  }

  // ---- Sorting ----
  private sortPeriods(a: string, b: string): number {
    const pa = this.parsePeriod(a);
    const pb = this.parsePeriod(b);

    if (pa.year !== pb.year) return pa.year - pb.year;
    return pa.order - pb.order;
  }

  // ---- Generate Columns ----
  public generate = (data: any[]): CColumn<any>[] => {
    if (!data || data.length === 0) return [];

    const firstRow = data[0];

    const periodKeys = Object.keys(firstRow)
      .filter(key => !this.staticKeys.includes(key))
      .toSorted((a, b) => this.sortPeriods(a, b));

    return periodKeys.map(key => ({
      id: key,
      key,
      header: this.formatHeader(key),
      aggregate: 'sum' as const,
      custom: {
        cell: ({ row }: any) => {
          const value = row.original[key];
          return typeof value === 'number'
            ? value.toLocaleString('ru-RU', {
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
              })
            : value;
        },
      },
    }));
  };
}

export const marketInsightsDynamicPeriods =
  new MarketInsightsDynamicPeriods().generate.bind(
    MarketInsightsDynamicPeriods
  );

export const monthsPreset = <
  TData extends { periods_data?: Record<string, Record<string, number>> },
>(
  indicator: string,
  data: TData[],
  options?: { asPercent?: boolean; noFraction?: boolean }
) => {
  const years = new Set<number>();
  for (const row of data) {
    if (row.periods_data) {
      for (const period of Object.keys(row.periods_data)) {
        const [year] = period.split('-').map(Number);
        if (!Number.isNaN(year)) {
          years.add(year);
        }
      }
    }
  }

  if (years.size === 0) {
    years.add(new Date().getFullYear());
  }

  const allPeriods: string[] = [];
  for (const year of [...years].toSorted((a, b) => a - b)) {
    for (let month = 1; month <= 12; month++) {
      allPeriods.push(`${year}-${String(month).padStart(2, '0')}`);
    }
  }

  return {
    periods: allPeriods,
    getValue: (row: TData, periodKey: string) => {
      if (!row.periods_data || !row.periods_data[periodKey]) return null;
      return row.periods_data[periodKey][indicator] ?? null;
    },
    asPercent: options?.asPercent,
    indicatorKey: indicator,
    noFraction: options?.noFraction,
  };
};

const DEFAULT_TOTAL_OPTIONS: {
  asPercent?: boolean;
  periods?: string[];
  noFraction?: boolean;
} = {
  asPercent: false,
  periods: [],
  noFraction: false,
};

export const totalPreset = <
  TData extends { periods_data?: Record<string, Record<string, number>> },
>(
  indicator: string,
  options: typeof DEFAULT_TOTAL_OPTIONS = DEFAULT_TOTAL_OPTIONS
) => ({
  getValue: (row: TData) => {
    if (!row.periods_data) return null;

    const periods = options?.periods || [];

    if (periods.length === 0) {
      let total = 0;
      for (const periodValues of Object.values(row.periods_data)) {
        const value = periodValues[indicator];
        if (value != null) {
          total += value;
        }
      }
      return total;
    }

    let total = 0;
    for (const period of periods) {
      const periodValues = row.periods_data?.[period];
      if (periodValues) {
        const value = periodValues[indicator];
        if (value != null) {
          total += value;
        }
      }
    }

    return total;
  },
  noFraction: options.noFraction,
  asPercent: options?.asPercent,
  indicatorKey: indicator,
});
