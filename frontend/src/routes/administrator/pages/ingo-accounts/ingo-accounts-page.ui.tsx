import type { ColumnDef } from '@tanstack/react-table';
import React, { useEffect, useMemo, useState } from 'react';

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
  ROLES,
  ROLES_OBJECT,
  STATUSES,
  STATUSES_OBJECT,
} from '#/shared/constants/global';
import { useStringState } from '#/shared/hooks/use-string-state';
import { generateMocks, randomId } from '#/shared/utils/mock';

interface ClientRow {
  id: string;
  fullName: string;
  role: string;
  status: string;
}

const IngoAccountsPage: React.FC = () => {
  const [search, setSearch] = useState('');
  const [open, { set, clear }] = useStringState(['create', 'edit']);
  const [editData, setEditData] = useState<ClientRow | null>(null);
  const [data, setData] = useState<ClientRow[]>([]);

  const allColumns = useMemo(
    (): ColumnDef<ClientRow>[] => [
      { accessorKey: 'fullName', header: 'ФИО', size: 345 },
      {
        accessorKey: 'role',
        header: 'Роль',
        size: 345,
        cell(props) {
          return ROLES_OBJECT[props.getValue() as 'admin'];
        },
      },
      {
        accessorKey: 'status',
        header: 'Статус',
        size: 200,
        cell(props) {
          return STATUSES_OBJECT[props.getValue() as 'active'];
        },
      },
      {
        accessorKey: 'actions',
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

  useEffect(() => {
    const mocks = generateMocks(5, {
      id: () => randomId('client'),
      fullName: ['Иван', 'Пётр', 'Сергей', 'Мария', 'Анна'],
      role: ROLES,
      status: STATUSES,
    });
    const filteredData = mocks.filter(
      row =>
        row.fullName.toLowerCase().includes(search.toLowerCase()) ||
        row.role.toLowerCase().includes(search.toLowerCase()) ||
        row.status.toLowerCase().includes(search.toLowerCase())
    );
    setData(filteredData);
  }, [search]);

  return (
    <main>
      {open === 'edit' && editData && <EditUserModal onClose={clear} />}
      {open === 'create' && <AddUserModal onClose={clear} />}
      <PageSection
        title="Учетные записи Инго"
        headerEnd={
          <div className="flex items-center gap-4 relative z-100">
            <SearchInput saveValue={setSearch} />
            <ExportToExcelButton data={data} fileName="clients.xlsx" />
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
          data={data}
          maxHeight={500}
          rounded="none"
        />
      </PageSection>
    </main>
  );
};

export default IngoAccountsPage;
