import { useQuery } from '@tanstack/react-query';
import type { ColumnDef } from '@tanstack/react-table';
import React, { useMemo, useState } from 'react';

import { UserQueries } from '#/entities/user/user.queries';
import type { IUserItem } from '#/entities/user/user.types';
import { AddCustomerModal } from '#/features/customer/add';
import { EditCustomerModal } from '#/features/customer/edit';
import { ExportToExcelButton } from '#/shared/components/export-to-excel';
import { LucidePlusIcon } from '#/shared/components/icons';
import { PageSection } from '#/shared/components/page-section';
import { RowActions } from '#/shared/components/row-actions';
import { SearchInput } from '#/shared/components/search-input';
import { Table } from '#/shared/components/table';
import { Button } from '#/shared/components/ui/button';
import {
  ROLES,
  ROLES_OBJECT,
  STATUSES_OBJECT,
} from '#/shared/constants/roles_statuses';
import { useStringState } from '#/shared/hooks/use-string-state';
import { selectFilter, stringFilter } from '#/shared/utils/filter';
import { filterBySearch } from '#/shared/utils/search';

interface CustomerRow extends IUserItem {
  fullName: string;
  companyName: string;
  statusDisplay: string;
}

const CustomerAccountsPage: React.FC = () => {
  const [search, setSearch] = useState('');
  const [open, { set, clear }] = useStringState(['create', 'edit']);
  const [editData, setEditData] = useState<CustomerRow | null>(null);

  const customersQuery = useQuery(UserQueries.GetCustomersQuery());

  const allColumns = useMemo(
    (): ColumnDef<CustomerRow>[] => [
      {
        accessorKey: 'fullName',
        header: 'ФИО',
        size: 290,
        enableColumnFilter: true,
        filterFn: stringFilter(),
        filterType: 'string',
      },
      {
        accessorKey: 'role',
        accessorFn: row => ROLES_OBJECT[row.role],
        header: 'Роль',
        size: 280,
        enableColumnFilter: true,
        filterFn: selectFilter(),
        filterType: 'select',
        selectOptions: ROLES.slice(1).map(role => ({
          value: role,
          label: ROLES_OBJECT[role],
        })),
      },
      {
        accessorKey: 'companyName',
        header: 'Компания',
        size: 290,
        enableColumnFilter: true,
        filterFn: selectFilter(),
        filterType: 'select',
        selectOptions: [],
      },
      {
        accessorKey: 'email',
        header: 'Электронная почта',
        size: 290,
        enableColumnFilter: true,
        filterFn: stringFilter(),
        filterType: 'string',
      },
      {
        accessorKey: 'statusDisplay',
        header: 'Статус',
        size: 150,
        cell(props) {
          return STATUSES_OBJECT[props.getValue() as 'active'];
        },
      },
      {
        id: 'actions',
        header: '',
        size: 120,
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
                { type: 'reset_password', onSelect: () => {} },
              ]}
            />
          );
        },
      },
    ],
    [set]
  );

  const allData = useMemo((): CustomerRow[] => {
    if (!customersQuery.data) return [];

    return customersQuery.data.map((customer: IUserItem) => {
      return {
        ...customer,
        fullName:
          `${customer.last_name} ${customer.first_name} ${customer.patronymic || ''}`.trim(),
        companyName: customer.company?.name || 'Не указана',
        statusDisplay: customer.is_active ? 'active' : 'inactive',
      } as CustomerRow;
    });
  }, [customersQuery.data]);

  const filteredData = useMemo(() => {
    if (!allData) return [];

    return filterBySearch<IUserItem>(allData, search, [
      'first_name',
      'last_name',
      'patronymic',
      'email',
      'role',
    ]);
  }, [search, allData]);

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
            <ExportToExcelButton
              data={filteredData}
              fileName="customers.xlsx"
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
        <Table
          columns={allColumns}
          data={filteredData}
          isScrollbar
          isLoading={customersQuery.isLoading}
          maxHeight={500}
          rounded="none"
        />
      </PageSection>
    </main>
  );
};

export default CustomerAccountsPage;
