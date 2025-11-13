import type { CColumn } from '../hooks/use-generate-columns';
import { columnHeaderNames } from './column-header-names';
import { allMonths } from './months';

export const commonColumns = {
  sku: (pinned = true): CColumn<any> => ({
    id: 'sku_id',
    key: 'sku_name',
    header: columnHeaderNames.sku,
    size: 350,
    type: 'select',
    pinned,
    groupDimension: 'sku',
  }),
  brand: (): CColumn<any> => ({
    id: 'brand_id',
    key: 'brand_name',
    header: columnHeaderNames.brand,
    size: 150,
    type: 'select',
    groupDimension: 'brand',
  }),
  promotion: (): CColumn<any> => ({
    id: 'promotion_type_id',
    key: 'promotion_type_name',
    header: columnHeaderNames.promotion,
    size: 200,
    type: 'select',
    groupDimension: 'promotion_type',
  }),
  group: (key = 'product_group_name'): CColumn<any> => ({
    id: 'product_group_id',
    key,
    header: columnHeaderNames.group,
    size: 150,
    type: 'select',
    groupDimension: 'product_group',
    custom: {
      accessor: row => row[key] || '-',
    },
  }),
  responsible_employee: (): CColumn<any> => ({
    id: 'responsible_employee_id',
    key: 'responsible_employee_name',
    header: columnHeaderNames.responsible_employee,
    size: 150,
    type: 'select',
    groupDimension: 'responsible_employee',
    custom: { accessor: row => row.responsible_employee_name || '-' },
  }),
  segment: (): CColumn<any> => ({
    id: 'segment_id',
    key: 'segment_name',
    header: columnHeaderNames.segment,
    size: 200,
    type: 'select',
    groupDimension: 'segment',
  }),
  distributor: (): CColumn<any> => ({
    id: 'distributor_id',
    key: 'distributor_name',
    header: columnHeaderNames.distributor,
    size: 150,
    type: 'select',
    groupDimension: 'distributor',
    custom: {
      accessor: (row: any) => row['distributor_name'] || '-',
    },
  }),
  indicator: (): CColumn<any> => ({
    id: 'indicator_id',
    key: 'indicator_name',
    header: columnHeaderNames.indicator,
    size: 150,
    type: 'select',
    groupDimension: 'indicator',
    custom: {
      accessor: (row: any) => row['indicator_name'] || '-',
    },
  }),
  geo_indicator: (): CColumn<any> => ({
    id: 'geo_indicator_id',
    key: 'geo_indicator_name',
    header: columnHeaderNames.geo_indicator,
    size: 150,
    type: 'select',
    groupDimension: 'geo_indicator',
    custom: {
      accessor: (row: any) => row['geo_indicator_name'] || '-',
    },
  }),
  pharmacy: (): CColumn<any> => ({
    id: 'pharmacy_id',
    key: 'pharmacy',
    header: columnHeaderNames.pharmacy,
    size: 300,
    type: 'select',
    groupDimension: 'pharmacy',
    custom: {
      accessor: (row: any) => row['pharmacy'] || '-',
    },
  }),
  medical_facility: (size = 150): CColumn<any> => ({
    id: 'medical_facility_id',
    key: 'medical_facility',
    header: columnHeaderNames.medicalFacility,
    size,
    type: 'select',
    groupDimension: 'medical_facility',
    custom: {
      accessor: (row: any) => row['medical_facility'] || '-',
    },
  }),
  employee: (): CColumn<any> => ({
    id: 'employee_id',
    key: 'employee',
    header: columnHeaderNames.employee,
    type: 'select',
    groupDimension: 'employee',
    custom: {
      accessor: (row: any) => row['employee'] || '-',
    },
  }),
  year: (): CColumn<any> => ({
    id: 'year',
    key: 'year',
    header: columnHeaderNames.year,
    size: 140,
    type: 'number',
  }),
  month: (): CColumn<any> => ({
    id: 'month',
    key: 'month',
    header: columnHeaderNames.month,
    size: 140,
    type: 'select',
    custom: {
      cell: ({ row }) => allMonths[row.original.month - 1],
      options: allMonths.map((month, i) => ({
        label: month,
        value: i + 1,
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
    id: 'fullName',
    header: columnHeaderNames.fullName,
    size,
    type: 'string',
    custom: {
      accessor: (row: any) =>
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
  userRole: (size = 280, roles?: any[], rolesObject?: any): CColumn<any> => ({
    id: 'role',
    key: 'role',
    header: columnHeaderNames.role,
    size,
    type: 'select',
    custom: {
      accessor: (row: any) => (rolesObject ? rolesObject[row.role] : row.role),
      options: roles
        ? roles.map(role => ({
            label: rolesObject ? rolesObject[role] : role,
            value: role,
          }))
        : undefined,
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
      accessor: (row: any) =>
        (row as { position?: string }).position || 'Не указана',
    },
  }),
  customerCompany: (size = 290, data?: any[]): CColumn<any> => ({
    id: 'companyName',
    header: columnHeaderNames.companyName,
    size,
    type: 'select',
    custom: {
      accessor: (row: any) => row.company?.name || 'Не указана',
      options: data
        ? Array.from(
            new Set(data.map(item => item.company?.name || 'Не указана'))
          ).map(company => ({
            label: company,
            value: company,
          }))
        : undefined,
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
    header: columnHeaderNames.fullName,
    size: 200,
    type: 'select',
    custom: {
      accessor: (row: any) =>
        `${row.user_last_name} ${row.user_first_name}`.trim() || '-',
    },
  }),
  reportLogTargetTable: (): CColumn<any> => ({
    id: 'target_table',
    key: 'target_table',
    header: columnHeaderNames.targetTable,
    size: 180,
    type: 'select',
  }),
  reportLogRecordsCount: (): CColumn<any> => ({
    id: 'records_count',
    key: 'records_count',
    header: columnHeaderNames.recordsCount,
    size: 150,
    type: 'number',
    aggregate: 'sum',
  }),
  reportLogCreatedAt: (): CColumn<any> => ({
    id: 'created_at',
    key: 'created_at',
    header: columnHeaderNames.createdAt,
    size: 180,
    custom: {
      cell: ({ row }) => {
        const date = new Date(row.original.created_at);
        return new Intl.DateTimeFormat('ru-RU', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        }).format(date);
      },
    },
  }),
  // Specialist Coverage columns
  specialistCoverageMedicalFacility: (): CColumn<any> => ({
    id: 'medical_facility_id',
    key: 'medical_facility_name',
    header: columnHeaderNames.medicalFacility,
    size: 224,
    type: 'select',
    custom: {
      accessor: (row: any) => row.medical_facility_name || '-',
    },
  }),
  specialistCoverageDoctor: (): CColumn<any> => ({
    id: 'doctor_id',
    key: 'doctor_name',
    header: columnHeaderNames.doctor,
    size: 224,
    type: 'select',
    custom: {
      accessor: (row: any) => row.doctor_name || '-',
    },
  }),
  specialistCoverageSpeciality: (): CColumn<any> => ({
    id: 'speciality_id',
    key: 'speciality_name',
    header: columnHeaderNames.speciality,
    size: 230,
    type: 'select',
    custom: {
      accessor: (row: any) => row.speciality_name || '-',
    },
  }),
  specialistCoveragePercentage: (): CColumn<any> => ({
    id: 'coverage_percentage',
    key: 'coverage_percentage',
    header: columnHeaderNames.coveragePercentage,
    size: 230,
    type: 'number',
    custom: {
      accessor: (row: any) => `${row.coverage_percentage.toFixed(1)}%`,
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
    type: 'select',
  }),
  marketInsightsBrand: (): CColumn<any> => ({
    id: 'brand',
    key: 'brand',
    header: columnHeaderNames.brand,
    type: 'select',
  }),
  marketInsightsSegment: (): CColumn<any> => ({
    id: 'segment',
    key: 'segment',
    header: columnHeaderNames.segment,
    type: 'select',
  }),
  marketInsightsDosageForm: (): CColumn<any> => ({
    id: 'dosage_form',
    key: 'dosage_form',
    header: columnHeaderNames.dosageForm,
    type: 'select',
  }),
  marketInsightsDosage: (): CColumn<any> => ({
    id: 'dosage',
    key: 'dosage',
    header: columnHeaderNames.dosage,
    type: 'select',
  }),
};
//

export const monthsPreset = <
  TData extends { periods_data?: Record<string, Record<string, number>> },
>(
  indicator: string,
  data: TData[],
  options?: { asPercent?: boolean }
) => {
  const years = new Set<number>();
  data.forEach(row => {
    if (row.periods_data) {
      Object.keys(row.periods_data).forEach(period => {
        const [year] = period.split('-').map(Number);
        if (!isNaN(year)) {
          years.add(year);
        }
      });
    }
  });

  if (years.size === 0) {
    years.add(new Date().getFullYear());
  }

  const allPeriods: string[] = [];
  Array.from(years)
    .sort()
    .forEach(year => {
      for (let month = 1; month <= 12; month++) {
        allPeriods.push(`${year}-${String(month).padStart(2, '0')}`);
      }
    });

  return {
    periods: allPeriods,
    getValue: (row: TData, periodKey: string) => {
      if (!row.periods_data || !row.periods_data[periodKey]) return null;
      return row.periods_data[periodKey][indicator] ?? null;
    },
    asPercent: options?.asPercent,
    indicatorKey: indicator,
  };
};

export const totalPreset = <
  TData extends { periods_data?: Record<string, Record<string, number>> },
>(
  indicator: string,
  asPercent?: boolean
) => ({
  getValue: (row: TData) => {
    if (!row.periods_data) return null;

    let total = 0;
    Object.values(row.periods_data).forEach(periodValues => {
      const value = periodValues[indicator];
      if (value != null) {
        total += value;
      }
    });

    return total;
  },
  asPercent,
  indicatorKey: indicator,
});
