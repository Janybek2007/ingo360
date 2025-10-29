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
import { STATUSES_OBJECT } from '#/shared/constants/roles_statuses';
import { useStringState } from '#/shared/hooks/use-string-state';
import { selectFilter, stringFilter } from '#/shared/utils/filter';
import { filterBySearch } from '#/shared/utils/search';

interface CustomerRow extends IUserItem {
  fullName: string;
  position: string;
  companyName: string;
  statusDisplay: string;
}

const CustomerAccountsPage: React.FC = () => {
  const [search, setSearch] = useState('');
  const [open, { set, clear }] = useStringState(['create', 'edit']);
  const [editData, setEditData] = useState<CustomerRow | null>(null);

  const customersQuery = useQuery(UserQueries.GetCustomersQuery());

  const allData = useMemo((): CustomerRow[] => {
    if (!customersQuery.data) return [];

    return customersQuery.data.map((customer: IUserItem) => {
      return {
        ...customer,
        fullName:
          `${customer.last_name} ${customer.first_name} ${customer.patronymic || ''}`.trim(),
        position: (customer as { position?: string }).position || 'Не указана',
        companyName: customer.company?.name || 'Не указана',
        statusDisplay: customer.is_active ? 'active' : 'inactive',
      } as CustomerRow;
    });
  }, [customersQuery.data]);

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
        accessorKey: 'position',
        header: 'Должность',
        size: 200,
        enableColumnFilter: true,
        filterFn: stringFilter(),
        filterType: 'string',
      },
      {
        accessorKey: 'companyName',
        header: 'Компания',
        size: 290,
        enableColumnFilter: true,
        filterFn: selectFilter(),
        filterType: 'select',
        selectOptions: Array.from(
          new Set(allData.map(item => item.companyName))
        ).map(company => ({
          label: company,
          value: company,
        })),
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
        enableColumnFilter: true,
        filterFn: selectFilter(),
        filterType: 'select',
        selectOptions: [
          { label: 'Активный', value: 'active' },
          { label: 'Неактивный', value: 'inactive' },
        ],
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
              ]}
            />
          );
        },
      },
    ],
    [set, allData]
  );

  const filteredData = useMemo(() => {
    if (!allData) return [];

    return filterBySearch<CustomerRow>(allData, search, [
      'first_name',
      'last_name',
      'patronymic',
      'position',
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
              data={filteredData.map(item => ({
                ФИО: item.fullName,
                Должность: item.position,
                Компания: item.companyName,
                'Электронная почта': item.email,
                Статус:
                  item.statusDisplay === 'active' ? 'Активный' : 'Неактивный',
              }))}
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
          isLoading={customersQuery.isLoading}
          maxHeight={500}
          rounded="none"
        />
      </PageSection>
    </main>
  );
};

export default CustomerAccountsPage;
