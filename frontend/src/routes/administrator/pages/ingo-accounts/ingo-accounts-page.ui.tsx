import { useQuery } from '@tanstack/react-query';
import type { ColumnFiltersState, SortingState } from '@tanstack/react-table';
import React, { useState } from 'react';

import { type IUserItem, UserQueries } from '#/entities/user';
import { ExportToExcelButton } from '#/features/excel/export';
import { AddUserModal } from '#/features/users/add';
import { EditUserModal } from '#/features/users/edit';
import { LucidePlusIcon } from '#/shared/assets/icons';
import { AsyncBoundary } from '#/shared/components/async-boundry';
import { PageSection } from '#/shared/components/page-section';
import { RowActions } from '#/shared/components/row-actions';
import { SearchInput } from '#/shared/components/search-input';
import { Table } from '#/shared/components/table';
import { Button } from '#/shared/components/ui/button';
import { commonColumns } from '#/shared/constants/common-columns';
import { COMMON_COLUMNS_FILTER_KEY_MAP } from '#/shared/constants/filters-key-map';
import { ROLES_OBJECT } from '#/shared/constants/roles_statuses';
import { FiltersContext } from '#/shared/context/filters';
import { useGenerateColumns } from '#/shared/hooks/use-generate-columns';
import { useStringState } from '#/shared/hooks/use-string-state';
import {
  transformColumnFiltersToPayload,
  transformHeaderKeys,
  transformSortingToPayload,
} from '#/shared/utils/transform';

const IngoAccountsPage: React.FC = () => {
  const [filters, setFilters] = React.useState<ColumnFiltersState>([]);
  const [sorting, setSorting] = React.useState<SortingState>([]);

  const [search, setSearch] = useState('');
  const [open, { set, clear }] = useStringState(['create', 'edit']);
  const [editData, setEditData] = useState<IUserItem | null>(null);
  const queryData = useQuery(
    UserQueries.GetAdminOperatorsQuery({
      search,
      ...transformColumnFiltersToPayload(
        filters,
        COMMON_COLUMNS_FILTER_KEY_MAP
      ),
      ...transformSortingToPayload(sorting, COMMON_COLUMNS_FILTER_KEY_MAP),
    })
  );

  const allColumns = useGenerateColumns<IUserItem>({
    filterOptions: {},
    columns: [
      commonColumns.userFullName(),
      commonColumns.userRole(280),
      commonColumns.userEmail(),
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
        <EditUserModal onClose={clear} userData={editData} />
      )}
      {open === 'create' && <AddUserModal onClose={clear} />}
      <PageSection
        title="Учетные записи INDIGO"
        headerEnd={
          <div className="flex items-center gap-4 relative z-100">
            <SearchInput saveValue={setSearch} />
            <ExportToExcelButton<IUserItem>
              headerMap={transformHeaderKeys(allColumns)}
              url="/users/admins-operators"
              fieldsMap={{ full_name: '{first_name} {last_name}' }}
              booleanMap={{ is_active: ['Неактивный', 'Активный'] }}
              customMap={{
                role: {
                  is_operator: ROLES_OBJECT.operator,
                  is_admin: ROLES_OBJECT.administrator,
                },
              }}
              fileName="Учетные записи INDIGO"
            />
            <Button
              onClick={() => set('create')}
              className="px-3 py-2 rounded-full flex items-center gap-1"
            >
              <LucidePlusIcon className="size-6" />
              Добавить пользователя
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

export default IngoAccountsPage;
