import type { ColumnFiltersState, SortingState } from '@tanstack/react-table';
import React, { useState } from 'react';

import { type IUserItem, UserQueries } from '#/entities/user';
import { AddCustomerModal } from '#/features/customer/add';
import { EditCustomerModal } from '#/features/customer/edit';
import { ExportToExcelButton } from '#/features/excel/export';
import { LucidePlusIcon } from '#/shared/assets/icons';
import { AsyncBoundary } from '#/shared/components/async-boundry';
import { useFilterOptions } from '#/shared/components/db-filters';
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

interface CustomerRow extends IUserItem {
  fullName: string;
  position: string;
  companyName: string;
  statusDisplay: string;
}

const CustomerAccountsPage: React.FC = () => {
  const [filters, setFilters] = React.useState<ColumnFiltersState>([]);
  const [sorting, setSorting] = React.useState<SortingState>([]);

  const [search, setSearch] = useState('');
  const [open, { set, clear }] = useStringState(['create', 'edit']);
  const [editData, setEditData] = useState<CustomerRow | null>(null);
  const filterOptions = useFilterOptions(
    ['companies_companies'],
    'clients_clients'
  );

  const customersQuery = useKeepQuery(
    UserQueries.GetCustomersQuery({
      enabled: !filterOptions.isLoading,
      search,
      ...transformColumnFiltersToPayload(
        filters,
        COMMON_COLUMNS_FILTER_KEY_MAP
      ),
      ...transformSortingToPayload(sorting, COMMON_COLUMNS_FILTER_KEY_MAP),
    })
  );

  const allColumns = useGenerateColumns<CustomerRow>({
    filterOptions: filterOptions.options,
    columns: [
      commonColumns.userFullName(),
      commonColumns.customerPosition(),
      commonColumns.customerCompany(290),
      commonColumns.userEmail(),
      commonColumns.status(150, 'is_active'),
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
                      setEditData(props.row.original);
                      setTimeout(() => set('edit'), 0);
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
      {open === 'edit' && editData && (
        <EditCustomerModal onClose={clear} customerData={editData} />
      )}
      {open === 'create' && <AddCustomerModal onClose={clear} />}
      <PageSection
        title="Управление учетными записями клиентов"
        headerEnd={
          <div className="flex items-center gap-4 relative z-100">
            <SearchInput saveValue={setSearch} />
            <ExportToExcelButton<CustomerRow>
              headerMap={transformHeaderKeys(allColumns)}
              url="/users/clients"
              fieldsMap={{ full_name: '{first_name} {last_name}' }}
              booleanMap={{ is_active: ['Неактивный', 'Активный'] }}
              fileName="Учетные записи Клиентов"
            />
            <Button
              onClick={() => set('create')}
              className="px-3 py-2 rounded-full flex items-center gap-1"
            >
              <LucidePlusIcon className="size-6" />
              Добавить уч. запись
            </Button>{' '}
          </div>
        }
      >
        <AsyncBoundary
          isLoading={customersQuery.isLoading}
          queryError={customersQuery.error}
        >
          <FiltersContext.Provider
            value={{ filters, setFilters, sorting, setSorting }}
          >
            <Table
              columns={allColumns}
              data={customersQuery.data || []}
              maxHeight={700}
              rounded="none"
            />
          </FiltersContext.Provider>
        </AsyncBoundary>
      </PageSection>
    </main>
  );
};

export default CustomerAccountsPage;
