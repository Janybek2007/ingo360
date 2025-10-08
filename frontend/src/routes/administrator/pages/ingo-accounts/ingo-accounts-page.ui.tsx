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
  const [, setSearch] = useState('');
  const [open, { set, clear }] = useStringState(['create', 'edit']);
  const [editData, setEditData] = useState<IUserItem | null>(null);
  const queryData = useQuery(UserQueries.GetUsersQuery());

  const allColumns = useMemo(
    (): ColumnDef<IUserItem>[] => [
      {
        accessorKey: 'first_name',
        header: 'ФИО',
        size: 280,
        cell: ({ row }) => row.original.first_name || 'Отсутсвует имя',
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
                    set('edit');
                    setEditData(props.row.original);
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
      {open === 'edit' && editData && <EditUserModal onClose={clear} />}
      {open === 'create' && <AddUserModal onClose={clear} />}
      <PageSection
        title="Учетные записи indigo"
        headerEnd={
          <div className="flex items-center gap-4 relative z-100">
            <SearchInput saveValue={setSearch} />
            <ExportToExcelButton
              data={queryData.data || []}
              fileName="users.xlsx"
            />
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
          data={queryData.data || []}
          maxHeight={500}
          rounded="none"
        />
      </PageSection>
    </main>
  );
};

export default IngoAccountsPage;
