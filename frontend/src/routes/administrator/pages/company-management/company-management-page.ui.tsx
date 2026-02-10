import type { ColumnFiltersState, SortingState } from '@tanstack/react-table';
import React, { useState } from 'react';

import { CompanyQueries, type ICompanyItem } from '#/entities/company';
import { AccessCompanyModal } from '#/features/company/access';
import { AddCompanyModal } from '#/features/company/add';
import { EditCompanyModal } from '#/features/company/edit';
import { ExportToExcelButton } from '#/features/export-excel';
import { LucidePlusIcon } from '#/shared/assets/icons';
import { AsyncBoundary } from '#/shared/components/async-boundry';
import { PageSection } from '#/shared/components/page-section';
import { RowActions } from '#/shared/components/row-actions';
import { SearchInput } from '#/shared/components/search-input';
import { Table } from '#/shared/components/table';
import { Button } from '#/shared/components/ui/button';
import { commonColumns } from '#/shared/constants/common-columns';
import { COMMON_COLUMNS_FILTER_KEY_MAP } from '#/shared/constants/filters-key-map';
import { FiltersContext } from '#/shared/context/filters';
import { useGenerateColumns } from '#/shared/hooks/use-generate-columns';
import { useKeepQuery } from '#/shared/hooks/use-keep-query';
import { useStringState } from '#/shared/hooks/use-string-state';
import {
  transformColumnFiltersToPayload,
  transformHeaderKeys,
  transformSortingToPayload,
} from '#/shared/utils/transform';

const CompanyManagementPage: React.FC = () => {
  const [filters, setFilters] = React.useState<ColumnFiltersState>([]);
  const [sorting, setSorting] = React.useState<SortingState>([]);

  const [search, setSearch] = useState('');

  const [open, { set, clear }] = useStringState(['create', 'edit']);
  const [openAccess, setOpenAccess] = useState(false);
  const [selectData, setSelectData] = useState<ICompanyItem | null>(null);
  const queryData = useKeepQuery(
    CompanyQueries.GetCompaniesQuery({
      search,
      ...transformColumnFiltersToPayload(
        filters,
        COMMON_COLUMNS_FILTER_KEY_MAP
      ),
      ...transformSortingToPayload(sorting, COMMON_COLUMNS_FILTER_KEY_MAP),
    })
  );

  const allColumns = useGenerateColumns<ICompanyItem>({
    filterOptions: {},
    columns: [
      commonColumns.companyName(),
      commonColumns.imsName(),
      commonColumns.companyActiveUsersLimit(),
      commonColumns.companyActiveUsers(),
      commonColumns.companyContractNumber(),
      commonColumns.companyContractEndDate(),
      commonColumns.status(),
      {
        id: 'actions',
        header: 'Действия',
        size: 120,
        custom: {
          cell(props) {
            return (
              <RowActions
                items={[
                  {
                    type: 'edit',
                    onSelect: () => {
                      setSelectData(props.row.original);
                      setTimeout(() => set('edit'), 0);
                    },
                  },
                  {
                    type: 'access_settings',
                    onSelect: () => {
                      setSelectData(props.row.original);
                      setOpenAccess(true);
                    },
                  },
                ]}
              />
            );
          },
        },
      },
    ],
  });

  return (
    <main>
      {open === 'edit' && selectData && (
        <EditCompanyModal onClose={clear} companyData={selectData} />
      )}
      {open === 'create' && <AddCompanyModal onClose={clear} />}
      {openAccess && selectData && (
        <AccessCompanyModal
          onClose={() => {
            setOpenAccess(false);
            setSelectData(null);
          }}
          companyData={selectData}
        />
      )}
      <PageSection
        title="Все Компании"
        headerEnd={
          <div className="flex items-center gap-4 relative z-100">
            <SearchInput saveValue={setSearch} />
            <ExportToExcelButton<ICompanyItem>
              headerMap={transformHeaderKeys(allColumns)}
              url="/companies"
              fileName="Компании"
              booleanMap={{ is_active: ['Неактивный', 'Активный'] }}
            />
            <Button
              onClick={() => set('create')}
              className="px-3 py-2 rounded-full flex items-center gap-1"
            >
              <LucidePlusIcon className="size-6" />
              Добавить компанию
            </Button>{' '}
          </div>
        }
      >
        <AsyncBoundary
          isLoading={queryData.isLoading}
          queryError={queryData.error}
        >
          <FiltersContext.Provider
            value={{ filters, setFilters, sorting, setSorting }}
          >
            <Table
              columns={allColumns}
              data={queryData.data ?? []}
              maxHeight={700}
              rounded="none"
            />
          </FiltersContext.Provider>
        </AsyncBoundary>
      </PageSection>
    </main>
  );
};

export default CompanyManagementPage;
