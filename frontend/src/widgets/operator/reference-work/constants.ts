import type { ColumnDef } from '@tanstack/react-table';

import type { IReferenceItem } from '#/entities/reference';
import type {
  FilterOptionsObject,
  FilterOptionsReferencesKey,
} from '#/shared/components/db-filters';
import { columnHeaderNames } from '#/shared/constants/column-header-names';
import type { ReferencesTypeWithMain } from '#/shared/types/references.type';
import { selectFilter, stringFilter } from '#/shared/utils/filter';

export function getReferenceTypeDeps(
  current: ReferencesTypeWithMain
): FilterOptionsReferencesKey[] {
  switch (current) {
    case 'geography/settlements': {
      return ['geography/regions'];
    }

    case 'geography/regions': {
      return ['geography/countries'];
    }

    case 'geography/districts': {
      return [
        'companies_companies',
        'geography/settlements',
        'geography/regions',
      ];
    }

    case 'products/product-groups': {
      return ['companies_companies'];
    }

    case 'products/brands': {
      return [
        'companies_companies',
        'products/promotion-types',
        'products/product-groups',
      ];
    }

    case 'products/skus': {
      return [
        'companies_companies',
        'products/brands',
        'products/promotion-types',
        'products/product-groups',
        'products/dosage-forms',
        'products/dosages',
        'products/segments',
        'clients/geo-indicators',
      ];
    }

    case 'employees/employees': {
      return [
        'companies_companies',
        'employees/positions',
        'products/product-groups',
        'geography/regions',
        'geography/districts',
      ];
    }

    case 'clients/medical-facilities': {
      return [
        'clients_medical_facility_types',
        'geography/settlements',
        'geography/districts',
        'clients/geo-indicators',
      ];
    }

    case 'clients/doctors': {
      return [
        'employees/employees',
        'clients/medical-facilities',
        'clients/specialities',
        'clients/client-categories',
        'products/product-groups',
        'companies_companies',
      ];
    }

    case 'clients/pharmacies': {
      return [
        'companies_companies',
        'clients/distributors',
        'employees/employees',
        'geography/settlements',
        'geography/districts',
        'clients/client-categories',
        'clients/geo-indicators',
        'products/product-groups',
      ];
    }

    default: {
      return [];
    }
  }
}

export function getReferenceWorkColumns(
  type: ReferencesTypeWithMain,
  filterOptions: FilterOptionsObject
): ColumnDef<IReferenceItem>[] {
  const columns: ColumnDef<IReferenceItem>[] = [];
  switch (type) {
    case 'geography/countries': {
      columns.push({
        size: 200,
        accessorKey: 'name',
        header: columnHeaderNames.name,
        enableColumnFilter: true,
        filterFn: stringFilter(),
        filterType: 'string',
      });
      break;
    }

    case 'geography/settlements': {
      columns.push(
        {
          accessorKey: 'name',
          size: 200,
          header: columnHeaderNames.name,
          enableColumnFilter: true,
          filterFn: stringFilter(),
          filterType: 'string',
        },
        {
          id: 'region.id',
          accessorKey: 'region.name',
          accessorFn: item => item.region?.name ?? '-',
          header: columnHeaderNames.region,
          size: 200,
          enableColumnFilter: true,
          filterFn: selectFilter(),
          filterType: 'select',
          selectOptions: filterOptions.geography_regions,
        }
      );
      break;
    }

    case 'geography/regions': {
      columns.push(
        {
          accessorKey: 'name',
          size: 200,
          header: columnHeaderNames.name,
          enableColumnFilter: true,
          filterFn: stringFilter(),
          filterType: 'string',
        },
        {
          id: 'country.id',
          accessorKey: 'country.name',
          accessorFn: item => item.country?.name ?? '-',
          header: columnHeaderNames.country,
          size: 200,
          enableColumnFilter: true,
          filterFn: selectFilter(),
          filterType: 'select',
          selectOptions: filterOptions.geography_countries,
        }
      );
      break;
    }

    case 'geography/districts': {
      columns.push(
        {
          accessorKey: 'name',
          size: 180,
          header: columnHeaderNames.name,
          enableColumnFilter: true,
          filterFn: stringFilter(),
          filterType: 'string',
        },
        {
          id: 'company.id',
          accessorKey: 'company.name',
          accessorFn: item => item.company?.name ?? '-',
          header: columnHeaderNames.companyName,
          size: 140,
          enableColumnFilter: true,
          filterFn: selectFilter(),
          filterType: 'select',
          selectOptions: filterOptions.companies_companies,
        },
        {
          id: 'settlement.id',
          accessorKey: 'settlement.name',
          accessorFn: item => item.settlement?.name ?? '-',
          header: columnHeaderNames.settlement,
          size: 180,
          enableColumnFilter: true,
          filterFn: selectFilter(),
          filterType: 'select',
          selectOptions: filterOptions.geography_settlements,
        },
        {
          id: 'region.id',
          accessorKey: 'region.name',
          accessorFn: item => item.region?.name ?? '-',
          header: columnHeaderNames.region,
          size: 180,
          enableColumnFilter: true,
          filterFn: selectFilter(),
          filterType: 'select',
          selectOptions: filterOptions.geography_regions,
        }
      );
      break;
    }

    case 'products/product-groups': {
      columns.push(
        {
          id: 'company.id',
          accessorKey: 'company.name',
          accessorFn: item => item.company?.name ?? '-',
          header: columnHeaderNames.companyName,
          size: 200,
          enableColumnFilter: true,
          filterFn: selectFilter(),
          filterType: 'select',
          selectOptions: filterOptions.companies_companies,
        },
        {
          accessorKey: 'name',
          header: columnHeaderNames.name,
          size: 200,
          enableColumnFilter: true,
          filterFn: stringFilter(),
          filterType: 'string',
        }
      );
      break;
    }

    case 'products/brands': {
      columns.push(
        {
          accessorKey: 'name',
          header: columnHeaderNames.name,
          size: 200,
          enableColumnFilter: true,
          filterFn: stringFilter(),
          filterType: 'string',
        },
        {
          accessorKey: 'ims_name',
          header: columnHeaderNames.imsName,
          accessorFn: item => item.ims_name ?? '-',
          size: 200,
          enableColumnFilter: true,
          filterFn: stringFilter(),
          filterType: 'string',
        },
        {
          id: 'company.id',
          accessorKey: 'company.name',
          accessorFn: item => item.company?.name ?? '-',
          header: columnHeaderNames.companyName,
          size: 200,
          enableColumnFilter: true,
          filterFn: selectFilter(),
          filterType: 'select',
          selectOptions: filterOptions.companies_companies,
        },
        {
          id: 'promotion_type.id',
          accessorKey: 'promotion_type.name',
          accessorFn: item => item.promotion_type?.name ?? '-',
          header: columnHeaderNames.promotion,
          size: 200,
          enableColumnFilter: true,
          filterFn: selectFilter(),
          filterType: 'select',
          selectOptions: filterOptions.products_promotion_types,
        },
        {
          id: 'product_group.id',
          accessorKey: 'product_group.name',
          accessorFn: item => item.product_group?.name ?? '-',
          header: columnHeaderNames.group,
          size: 200,
          enableColumnFilter: true,
          filterFn: selectFilter(),
          filterType: 'select',
          selectOptions: filterOptions.products_product_groups,
        }
      );
      break;
    }

    case 'products/dosages':
    case 'products/dosage-forms':
    case 'products/segments':
    case 'employees/positions':
    case 'clients/distributors':
    case 'clients/geo-indicators':
    case 'clients/specialities':
    case 'products/promotion-types':
    case 'clients/client-categories': {
      columns.push({
        accessorKey: 'name',
        header: columnHeaderNames.name,
        size: 200,
        enableColumnFilter: true,
        filterFn: stringFilter(),
        filterType: 'string',
      });
      break;
    }

    case 'products/skus': {
      columns.push(
        {
          accessorKey: 'name',
          header: columnHeaderNames.name,
          size: 200,
          enableColumnFilter: true,
          filterFn: stringFilter(),
          filterType: 'string',
        },
        {
          id: 'company.id',
          accessorKey: 'company.name',
          accessorFn: item => item.company?.name ?? '-',
          header: columnHeaderNames.companyName,
          size: 200,
          enableColumnFilter: true,
          filterFn: selectFilter(),
          filterType: 'select',
          selectOptions: filterOptions.companies_companies,
        },
        {
          id: 'brand.id',
          accessorKey: 'brand.name',
          accessorFn: item => item.brand?.name ?? '-',
          header: columnHeaderNames.brand,
          size: 200,
          enableColumnFilter: true,
          filterFn: selectFilter(),
          filterType: 'select',
          selectOptions: filterOptions.products_brands,
        },
        {
          id: 'promotion_type.id',
          accessorKey: 'promotion_type.name',
          accessorFn: item => item.promotion_type?.name ?? '-',
          header: columnHeaderNames.promotion,
          size: 200,
          enableColumnFilter: true,
          filterFn: selectFilter(),
          filterType: 'select',
          selectOptions: filterOptions.products_promotion_types,
        },
        {
          id: 'product_group.id',
          accessorKey: 'product_group.name',
          accessorFn: item => item.product_group?.name ?? '-',
          header: columnHeaderNames.group,
          size: 200,
          enableColumnFilter: true,
          filterFn: selectFilter(),
          filterType: 'select',
          selectOptions: filterOptions.products_product_groups,
        },
        {
          id: 'dosage_form.id',
          accessorKey: 'dosage_form.name',
          accessorFn: item => item.dosage_form?.name ?? '-',
          header: columnHeaderNames.dosageForm,
          size: 200,
          enableColumnFilter: true,
          filterFn: selectFilter(),
          filterType: 'select',
          selectOptions: filterOptions.products_dosage_forms,
        },
        {
          id: 'dosage.id',
          accessorKey: 'dosage.name',
          accessorFn: item => item.dosage?.name ?? '-',
          header: columnHeaderNames.dosage,
          size: 200,
          enableColumnFilter: true,
          filterFn: selectFilter(),
          filterType: 'select',
          selectOptions: filterOptions.products_dosages,
        },
        {
          id: 'segment.id',
          accessorKey: 'segment.name',
          accessorFn: item => item.segment?.name ?? '-',
          header: columnHeaderNames.segment,
          size: 200,
          enableColumnFilter: true,
          filterFn: selectFilter(),
          filterType: 'select',
          selectOptions: filterOptions.products_segments,
        }
      );
      break;
    }

    case 'employees/employees': {
      columns.push(
        {
          accessorKey: 'full_name',
          header: columnHeaderNames.fullName,
          size: 200,
          enableColumnFilter: true,
          filterFn: stringFilter(),
          filterType: 'string',
        },
        {
          id: 'company.id',
          accessorKey: 'company.name',
          accessorFn: item => item.company?.name ?? '-',
          header: columnHeaderNames.companyName,
          size: 200,
          enableColumnFilter: true,
          filterFn: selectFilter(),
          filterType: 'select',
          selectOptions: filterOptions.companies_companies,
        },
        {
          id: 'position.id',
          accessorKey: 'position.name',
          accessorFn: item => item.position?.name ?? '-',
          header: columnHeaderNames.customerPosition,
          size: 200,
          enableColumnFilter: true,
          filterFn: selectFilter(),
          filterType: 'select',
          selectOptions: filterOptions.employees_positions,
        },
        {
          id: 'product_group.id',
          accessorKey: 'product_group.name',
          accessorFn: item => item.product_group?.name ?? '-',
          header: columnHeaderNames.group,
          size: 200,
          enableColumnFilter: true,
          filterFn: selectFilter(),
          filterType: 'select',
          selectOptions: filterOptions.products_product_groups,
        },
        {
          id: 'region.id',
          accessorKey: 'region.name',
          accessorFn: item => item.region?.name ?? '-',
          header: columnHeaderNames.region,
          size: 200,
          enableColumnFilter: true,
          filterFn: selectFilter(),
          filterType: 'select',
          selectOptions: filterOptions.geography_regions,
        },
        {
          id: 'district.id',
          accessorKey: 'district.name',
          accessorFn: item => item.district?.name ?? '-',
          header: columnHeaderNames.district,
          size: 200,
          enableColumnFilter: true,
          filterFn: selectFilter(),
          filterType: 'select',
          selectOptions: filterOptions.geography_districts,
        }
      );
      break;
    }

    case 'clients/medical-facilities': {
      columns.push(
        {
          accessorKey: 'name',
          header: columnHeaderNames.name,
          size: 200,
          enableColumnFilter: true,
          filterFn: stringFilter(),
          filterType: 'string',
        },
        {
          id: 'facility_type.id',
          accessorKey: 'facility_type',
          accessorFn: item => item.facility_type ?? '-',
          header: columnHeaderNames.facilityType,
          size: 200,
          enableColumnFilter: true,
          filterFn: selectFilter(),
          filterType: 'select',
          selectOptions: filterOptions.clients_medical_facility_types,
        },
        {
          id: 'settlement.id',
          accessorKey: 'settlement.name',
          accessorFn: item => item.settlement?.name ?? '-',
          header: columnHeaderNames.settlement,
          size: 200,
          enableColumnFilter: true,
          filterFn: selectFilter(),
          filterType: 'select',
          selectOptions: filterOptions.geography_settlements,
        },
        {
          id: 'geo_indicator.id',
          accessorKey: 'geo_indicator.name',
          header: columnHeaderNames.indicator2,
          accessorFn: item => item.geo_indicator?.name ?? '-',
          size: 200,
          enableColumnFilter: true,
          filterFn: selectFilter(),
          filterType: 'select',
          cell: ({ row }) => row.original.geo_indicator?.name || '-',
          selectOptions: filterOptions.clients_geo_indicators,
        },
        {
          id: 'district.id',
          accessorKey: 'district.name',
          accessorFn: item => item.district?.name ?? '-',
          header: columnHeaderNames.district,
          size: 200,
          enableColumnFilter: true,
          filterFn: selectFilter(),
          filterType: 'select',
          selectOptions: filterOptions.geography_districts,
        },
        {
          accessorKey: 'address',
          accessorFn: item => item.address ?? '-',
          header: columnHeaderNames.address,
          size: 200,
          enableColumnFilter: true,
          filterFn: stringFilter(),
          filterType: 'string',
        }
      );
      break;
    }

    case 'clients/doctors': {
      columns.push(
        {
          accessorKey: 'mode',
          header: columnHeaderNames.mode,
          size: 160,
          enableColumnFilter: true,
          filterFn: selectFilter(),
          filterType: 'select',
          accessorFn: item => (item.mode == 'global' ? 'Общий' : 'Компания'),
          selectOptions: [
            { label: 'Общий', value: 'global' },
            { label: 'Компания', value: 'company' },
          ],
        },
        {
          accessorKey: 'full_name',
          header: columnHeaderNames.fullName,
          size: 260,
          enableColumnFilter: true,
          filterFn: stringFilter(),
          filterType: 'string',
        },
        {
          id: 'company.id',
          accessorKey: 'company.name',
          accessorFn: item => item.company?.name ?? '-',
          header: columnHeaderNames.companyName,
          size: 200,
          enableColumnFilter: true,
          filterFn: selectFilter(),
          filterType: 'select',
          selectOptions: filterOptions.companies_companies,
        },
        {
          id: 'responsible_employee.id',
          accessorKey: 'responsible_employee.full_name',
          accessorFn: item => item.responsible_employee?.full_name ?? '-',
          header: columnHeaderNames.responsibleEmployee,
          size: 240,
          enableColumnFilter: true,
          filterFn: selectFilter(),
          filterType: 'select',
          selectOptions: filterOptions.employees_employees,
        },
        {
          id: 'medical_facility.id',
          accessorKey: 'medical_facility.name',
          accessorFn: item => item.medical_facility?.name ?? '-',
          header: columnHeaderNames.medicalFacility,
          size: 300,
          enableColumnFilter: true,
          filterFn: selectFilter(),
          filterType: 'select',
          selectOptions: filterOptions.clients_medical_facilities,
        },
        {
          id: 'speciality.id',
          accessorKey: 'speciality.name',
          accessorFn: item => item.speciality?.name ?? '-',
          header: columnHeaderNames.speciality,
          size: 200,
          enableColumnFilter: true,
          filterFn: selectFilter(),
          filterType: 'select',
          selectOptions: filterOptions.clients_specialities,
        },
        {
          id: 'client_category.id',
          accessorKey: 'client_category.name',
          accessorFn: item => item.client_category?.name ?? '-',
          header: columnHeaderNames.category,
          size: 140,
          enableColumnFilter: true,
          filterFn: selectFilter(),
          filterType: 'select',
          selectOptions: filterOptions.clients_client_categories,
        },
        {
          id: 'product_group.id',
          accessorKey: 'product_group.name',
          accessorFn: item => item.product_group?.name ?? '-',
          header: columnHeaderNames.productGroup,
          size: 150,
          enableColumnFilter: true,
          filterFn: selectFilter(),
          filterType: 'select',
          selectOptions: filterOptions.products_product_groups,
        }
      );
      break;
    }

    case 'clients/pharmacies': {
      columns.push(
        {
          accessorKey: 'name',
          header: columnHeaderNames.name,
          size: 200,
          enableColumnFilter: true,
          filterFn: stringFilter(),
          filterType: 'string',
        },
        {
          id: 'company.id',
          accessorKey: 'company.name',
          accessorFn: item => item.company?.name ?? '-',
          header: columnHeaderNames.companyName,
          size: 200,
          enableColumnFilter: true,
          filterFn: selectFilter(),
          filterType: 'select',
          selectOptions: filterOptions.companies_companies,
        },
        {
          id: 'distributor.id',
          accessorKey: 'distributor.name',
          accessorFn: item => item.distributor?.name ?? '-',
          header: columnHeaderNames.distrbutorAndNetwork,
          size: 200,
          enableColumnFilter: true,
          filterFn: selectFilter(),
          filterType: 'select',
          selectOptions: filterOptions.clients_distributors,
        },
        {
          id: 'responsible_employee.id',
          accessorKey: 'responsible_employee.full_name',
          accessorFn: item => item.responsible_employee?.full_name ?? '-',
          header: columnHeaderNames.responsibleEmployee,
          size: 250,
          enableColumnFilter: true,
          filterFn: selectFilter(),
          filterType: 'select',
          selectOptions: filterOptions.employees_employees,
        },
        {
          id: 'settlement.id',
          accessorKey: 'settlement.name',
          accessorFn: item => item.settlement?.name ?? '-',
          header: columnHeaderNames.settlement,
          size: 200,
          enableColumnFilter: true,
          filterFn: selectFilter(),
          filterType: 'select',
          selectOptions: filterOptions.geography_settlements,
        },
        {
          id: 'district.id',
          accessorKey: 'district.name',
          accessorFn: item => item.district?.name ?? '-',
          header: columnHeaderNames.district,
          size: 200,
          enableColumnFilter: true,
          filterFn: selectFilter(),
          filterType: 'select',
          selectOptions: filterOptions.geography_districts,
        },
        {
          id: 'geo_indicator.id',
          accessorKey: 'geo_indicator.name',
          header: columnHeaderNames.indicator2,
          accessorFn: item => item.geo_indicator?.name ?? '-',
          size: 200,
          enableColumnFilter: true,
          filterFn: selectFilter(),
          filterType: 'select',
          cell: ({ row }) => row.original.geo_indicator?.name || '-',
          selectOptions: filterOptions.clients_geo_indicators,
        },
        {
          id: 'client_category.id',
          accessorKey: 'client_category.name',
          accessorFn: item => item.client_category?.name ?? '-',
          header: columnHeaderNames.category,
          size: 200,
          enableColumnFilter: true,
          filterFn: selectFilter(),
          filterType: 'select',
          selectOptions: filterOptions.clients_client_categories,
        },
        {
          id: 'product_group.id',
          accessorKey: 'product_group.name',
          accessorFn: item => item.product_group?.name ?? '-',
          header: columnHeaderNames.group,
          size: 200,
          enableColumnFilter: true,
          filterFn: selectFilter(),
          filterType: 'select',
          selectOptions: filterOptions.products_product_groups,
        }
      );
      break;
    }

    default: {
      break;
    }
  }

  return columns;
}
