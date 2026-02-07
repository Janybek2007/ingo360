import type { CColumn } from '../hooks/use-generate-columns';
import { columnHeaderNames } from './column-header-names';
import { allMonths } from './months';

export const commonColumns = {
  sku: (pinned = true): CColumn<any> => ({
    id: 'sku_id',
    key: 'sku_name',
    optionKey: 'products_skus',
    header: columnHeaderNames.sku,
    size: 350,
    type: 'select',
    pinned,
    groupDimension: 'sku',
  }),
  brand: (): CColumn<any> => ({
    id: 'brand_id',
    key: 'brand_name',
    optionKey: 'products_brands',
    header: columnHeaderNames.brand,
    size: 150,
    type: 'select',
    groupDimension: 'brand',
  }),
  promotion: (): CColumn<any> => ({
    id: 'promotion_type_id',
    key: 'promotion_type_name',
    optionKey: 'products_promotion_types',
    header: columnHeaderNames.promotion,
    size: 200,
    type: 'select',
    groupDimension: 'promotion_type',
  }),
  group: (key = 'product_group_name'): CColumn<any> => ({
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
  }),
  responsible_employee: (): CColumn<any> => ({
    id: 'responsible_employee_id',
    key: 'responsible_employee_name',
    optionKey: 'employees_employees',
    header: columnHeaderNames.responsibleEmployee,
    size: 260,
    type: 'select',
    groupDimension: 'responsible_employee',
    custom: { accessor: row => row.responsible_employee_name || '-' },
  }),
  segment: (): CColumn<any> => ({
    id: 'segment_id',
    key: 'segment_name',
    optionKey: 'products_segments',
    header: columnHeaderNames.segment,
    size: 200,
    type: 'select',
    groupDimension: 'segment',
  }),
  distributor: (): CColumn<any> => ({
    id: 'distributor_id',
    key: 'distributor_name',
    optionKey: 'clients_distributors',
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
    optionKey: 'clients_geo_indicators',
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
    optionKey: 'clients_geo_indicators',
    header: columnHeaderNames.geoIndicator,
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
    optionKey: 'clients_pharmacies',
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
    optionKey: 'clients_medical_facilities',
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
    optionKey: 'employees_employees',
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
    optionKey: 'employees_employees',
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
  userRole: (size = 280): CColumn<any> => ({
    id: 'role',
    key: 'role',
    header: columnHeaderNames.role,
    size,
    type: 'string',
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
    optionKey: 'companies_companies',
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
        const date = new Date(row.original.created_at + 'Z');

        return new Intl.DateTimeFormat('ru-RU', {
          timeZone: 'Asia/Bishkek',
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
    optionKey: 'clients_medical_facilities',
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
    optionKey: 'clients_doctors',
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
    optionKey: 'clients_specialities',
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
      accessor: (row: any) => `${row.coverage_percentage.toFixed(0)}%`,
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
  }),
  marketInsightsBrand: (): CColumn<any> => ({
    id: 'brand',
    key: 'brand',
    header: columnHeaderNames.brand,
    type: 'string',
  }),
  marketInsightsSegment: (): CColumn<any> => ({
    id: 'segment',
    key: 'segment',
    header: columnHeaderNames.segment,
    type: 'string',
  }),
  marketInsightsDosageForm: (): CColumn<any> => ({
    id: 'dosage_form',
    key: 'dosage_form',
    header: columnHeaderNames.dosageForm,
    type: 'string',
  }),
  marketInsightsDosage: (): CColumn<any> => ({
    id: 'dosage',
    key: 'dosage',
    header: columnHeaderNames.dosage,
    type: 'string',
  }),
  marketMolecule: (): CColumn<any> => ({
    id: 'molecule',
    key: 'molecule',
    header: columnHeaderNames.molecule,
    type: 'string',
  }),
};

//

export const marketInsightsDynamicPeriods = (data: any[]): CColumn<any>[] => {
  if (!data || data.length === 0) return [];

  const firstRow = data[0];

  const staticKeys = [
    'company',
    'brand',
    'segment',
    'dosage_form',
    'dosage',
    'molecule',
  ];

  // ---- Parsing ----
  const parsePeriod = (key: string) => {
    // новый формат: YYYY-MM
    if (/^\d{4}-\d{2}$/.test(key)) {
      const [year, month] = key.split('-').map(Number);
      return { type: 'month' as const, year, order: month };
    }

    // квартал: q1-25
    if (key.startsWith('q')) {
      const [, rest] = key.split('q');
      const [q, yy] = rest.split('-').map(Number);
      return { type: 'quarter' as const, year: 2000 + yy, order: q };
    }

    // месяц старого формата: 1-25
    if (/^\d{1,2}-\d{2}$/.test(key)) {
      const [m, yy] = key.split('-').map(Number);
      return { type: 'month' as const, year: 2000 + yy, order: m };
    }

    // год: "25"
    if (/^\d{2}$/.test(key)) {
      return { type: 'year' as const, year: 2000 + Number(key), order: 1 };
    }

    return { type: 'unknown' as const, year: 0, order: 0 };
  };

  // ---- Format Header ----
  const formatHeader = (key: string): string => {
    const p = parsePeriod(key);

    switch (p.type) {
      case 'month':
        return `${p.year}-${String(p.order).padStart(2, '0')}`;

      case 'quarter':
        return `${p.year}-Q${p.order}`;

      case 'year':
        return `${p.year}`;

      default:
        return key;
    }
  };

  // ---- Sorting ----
  const sortPeriods = (a: string, b: string) => {
    const pa = parsePeriod(a);
    const pb = parsePeriod(b);

    if (pa.year !== pb.year) return pa.year - pb.year;
    return pa.order - pb.order;
  };

  const periodKeys = Object.keys(firstRow)
    .filter(key => !staticKeys.includes(key))
    .sort(sortPeriods);

  return periodKeys.map(key => ({
    id: key,
    key,
    header: formatHeader(key),
    aggregate: 'sum' as const,
    custom: {
      cell: ({ row }) => row.original[key],
    },
  }));
};

/*

export const monthsPreset = <
  TData extends { periods_data?: Record<string, Record<string, number>> },
>(
  indicator: string,
  data: TData[],
  options?: { asPercent?: boolean; noFraction?: boolean }
) => {
  const existingPeriods = new Set<string>();

  data.forEach(row => {
    if (!row.periods_data) return;

    Object.keys(row.periods_data).forEach(period => {
      // Проверяем, что в этом периоде есть значение именно по нашему индикатору
      if (row.periods_data![period][indicator] !== undefined) {
        existingPeriods.add(period);
      }
    });
  });

  const periods = Array.from(existingPeriods).sort((a, b) => {
    const [ya, ma] = a.split('-').map(Number);
    const [yb, mb] = b.split('-').map(Number);
    return ya !== yb ? ya - yb : ma - mb;
  });

  return {
    periods,
    getValue: (row: TData, periodKey: string) => {
      if (!row.periods_data?.[periodKey]) return null;
      const value = row.periods_data[periodKey][indicator];
      return value ?? null;
    },
    asPercent: options?.asPercent,
    indicatorKey: indicator,
    noFraction: options?.noFraction,
  };
};

*/

export const monthsPreset = <
  TData extends { periods_data?: Record<string, Record<string, number>> },
>(
  indicator: string,
  data: TData[],
  options?: { asPercent?: boolean; noFraction?: boolean }
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
    noFraction: options?.noFraction,
  };
};

export const totalPreset = <
  TData extends { periods_data?: Record<string, Record<string, number>> },
>(
  indicator: string,
  options: { asPercent?: boolean; periods?: string[] } = {
    asPercent: false,
    periods: [],
  }
) => ({
  getValue: (row: TData) => {
    if (!row.periods_data) return null;

    const periods = options?.periods || [];

    if (periods.length === 0) {
      let total = 0;
      Object.values(row.periods_data).forEach(periodValues => {
        const value = periodValues[indicator];
        if (value != null) {
          total += value;
        }
      });
      return total;
    }

    let total = 0;
    periods.forEach(period => {
      const periodValues = row.periods_data?.[period];
      if (periodValues) {
        const value = periodValues[indicator];
        if (value != null) {
          total += value;
        }
      }
    });

    return total;
  },
  asPercent: options?.asPercent,
  indicatorKey: indicator,
});
