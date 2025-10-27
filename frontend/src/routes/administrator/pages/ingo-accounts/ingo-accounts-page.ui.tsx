import { useQuery } from '@tanstack/react-query';
import type { ColumnDef } from '@tanstack/react-table';
import React, { useMemo, useState } from 'react';

import { UserQueries } from '#/entities/user/user.queries';
import type { IUserItem } from '#/entities/user/user.types';
import { AddUserModal } from '#/features/users/add';
import { EditUserModal } from '#/features/users/edit';
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
import {
  booleanFilter,
  selectFilter,
  stringFilter,
} from '#/shared/utils/filter';
import { filterBySearch } from '#/shared/utils/search';

const IngoAccountsPage: React.FC = () => {
  const [search, setSearch] = useState('');
  const [open, { set, clear }] = useStringState(['create', 'edit']);
  const [editData, setEditData] = useState<IUserItem | null>(null);
  const queryData = useQuery(UserQueries.GetUsersQuery());

  const filteredData = useMemo(() => {
    if (!queryData.data) return [];

    return filterBySearch<IUserItem>(queryData.data, search, [
      'first_name',
      'last_name',
      'patronymic',
      'email',
      'role',
    ]);
  }, [search, queryData.data]);

  const allColumns = useMemo(
    (): ColumnDef<IUserItem>[] => [
      {
        id: 'fullName',
        accessorFn: (row: IUserItem) => {
          return (
            `${row.last_name} ${row.first_name} ${row.patronymic || ''}`.trim() ||
            'Не указано'
          );
        },
        header: 'ФИО',
        size: 280,
        cell: ({ row }) => {
          const user = row.original;
          return (
            `${user.last_name} ${user.first_name} ${user.patronymic || ''}`.trim() ||
            'Не указано'
          );
        },
        enableColumnFilter: true,
        filterFn: stringFilter(),
        filterType: 'string',
      },
      {
        id: 'role',
        accessorKey: 'role',
        accessorFn: row => ROLES_OBJECT[row.role],
        header: 'Роль',
        size: 280,
        enableColumnFilter: true,
        filterFn: selectFilter(),
        filterType: 'select',
        selectOptions: ROLES.slice(0, 2).map(role => ({
          label: ROLES_OBJECT[role],
          value: role,
        })),
      },
      {
        id: 'email',
        accessorKey: 'email',
        header: 'Электронная почта',
        size: 280,
        enableColumnFilter: true,
        filterFn: stringFilter(),
        filterType: 'string',
      },
      {
        id: 'is_active',
        accessorKey: 'is_active',
        header: 'Статус',
        enableColumnFilter: true,
        filterFn: booleanFilter(),
        filterType: 'select',
        selectOptions: [
          { label: 'Активен', value: 'true' },
          { label: 'Неактивен', value: 'false' },
        ],
        size: 280,
        cell(props) {
          return STATUSES_OBJECT[props.getValue() ? 'active' : 'inactive'];
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
    [set]
  );

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
            <ExportToExcelButton
              data={filteredData.map(item => ({
                email: item.email,
                first_name: item.first_name,
                last_name: item.last_name,
                role:
                  item.role === 'administrator' ? 'Администратор' : 'Оператор',
              }))}
              fileName="users.xlsx"
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
        <Table
          columns={allColumns}
          data={filteredData}
          maxHeight={500}
          rounded="none"
        />
      </PageSection>
    </main>
  );
};

export default IngoAccountsPage;
