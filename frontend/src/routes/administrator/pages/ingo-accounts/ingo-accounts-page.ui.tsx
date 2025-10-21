import { useQuery } from '@tanstack/react-query';
import type { ColumnDef } from '@tanstack/react-table';
import React, { useMemo, useState } from 'react';

import { UserQueries } from '#/entities/user/user.queries';
import type { IUserItem } from '#/entities/user/user.types';
import { AddUserModal } from '#/features/users/add';
import { EditUserModal } from '#/features/users/edit';
import { ExportToExcelButton } from '#/shared/components/export-to-excel';
import { PageSection } from '#/shared/components/page-section';
import { RowActions } from '#/shared/components/row-actions';
import { SearchInput } from '#/shared/components/search-input';
import { Table } from '#/shared/components/table';
import { Button } from '#/shared/components/ui/button';
import { Icon } from '#/shared/components/ui/icon';
import {
  ROLES_OBJECT,
  STATUSES_OBJECT,
} from '#/shared/constants/roles_statuses';
import { useStringState } from '#/shared/hooks/use-string-state';
import { selectFilter, stringFilter } from '#/shared/utils/filter';

const IngoAccountsPage: React.FC = () => {
  const [search, setSearch] = useState('');
  const [open, { set, clear }] = useStringState(['create', 'edit']);
  const [editData, setEditData] = useState<IUserItem | null>(null);
  const queryData = useQuery(UserQueries.GetUsersQuery());

  const filteredData = useMemo(() => {
    if (!search.trim()) return queryData.data || [];

    // Нормализация для корректной работы с кириллицей
    const normalizeText = (text: string) =>
      text
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '');

    const normalizedSearch = normalizeText(search);

    return (queryData.data || []).filter((row: IUserItem) => {
      const fullName =
        `${row.last_name} ${row.first_name} ${row.patronymic || ''}`.trim();
      return (
        normalizeText(row.first_name || '').includes(normalizedSearch) ||
        normalizeText(row.last_name || '').includes(normalizedSearch) ||
        normalizeText(row.patronymic || '').includes(normalizedSearch) ||
        normalizeText(fullName).includes(normalizedSearch) ||
        normalizeText(row.email || '').includes(normalizedSearch) ||
        normalizeText(row.role || '').includes(normalizedSearch) ||
        normalizeText(ROLES_OBJECT[row.role] || '').includes(normalizedSearch)
      );
    });
  }, [search, queryData.data]);

  const allColumns = useMemo(
    (): ColumnDef<IUserItem>[] => [
      {
        accessorKey: 'fullName',
        header: 'ФИО',
        size: 280,
        cell: ({ row }) => {
          const user = row.original;
          return (
            `${user.last_name} ${user.first_name} ${user.patronymic || ''}`.trim() ||
            'Не указано'
          );
        },
        enableSorting: true,
        enableColumnFilter: true,
        filterFn: stringFilter(),
        type: 'string',
      },
      {
        accessorKey: 'role',
        header: 'Роль',
        size: 280,
        enableSorting: true,
        enableColumnFilter: true,
        filterFn: stringFilter(),
        type: 'string',
        cell(props) {
          return ROLES_OBJECT[props.getValue() as 'administrator'];
        },
      },
      {
        accessorKey: 'email',
        header: 'Электронная почта',
        size: 280,
        enableSorting: true,
        enableColumnFilter: true,
        filterFn: stringFilter(),
        type: 'string',
      },
      {
        accessorKey: 'is_active',
        header: 'Статус',
        enableColumnFilter: true,
        filterFn: selectFilter(),
        type: 'select',
        selectOptions: [
          { label: 'Active', value: 'active' },
          { label: 'InActive', value: 'inactive' },
        ],
        size: 280,
        cell(props) {
          return STATUSES_OBJECT[props.getValue() ? 'active' : 'inactive'];
        },
      },
      {
        id: 'actions',
        header: '',
        size: 80,
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

  return (
    <main>
      {open === 'edit' && <EditUserModal onClose={clear} userData={editData} />}
      {open === 'create' && <AddUserModal onClose={clear} />}
      <PageSection
        title="Учетные записи INDIGO"
        headerEnd={
          <div className="flex items-center gap-4 relative z-100">
            <SearchInput saveValue={setSearch} />
            <ExportToExcelButton data={filteredData} fileName="users.xlsx" />
            <Button
              onClick={() => set('create')}
              className="px-4 py-3 rounded-full flex items-center gap-1"
            >
              <Icon name="lucide:plus" />
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
