import type { ColumnDef } from '@tanstack/react-table';
import React, { useMemo, useState } from 'react';

import { AddUserWrapper } from '#/features/users/add';
import { EditUserModal } from '#/features/users/edit';
import { ExportToExcelButton } from '#/shared/components/export-to-excel';
import { PageSection } from '#/shared/components/page-section';
import { SearchInput } from '#/shared/components/search-input';
import { Table } from '#/shared/components/table';
import { Dropdown } from '#/shared/components/ui/dropdown';
import { Icon } from '#/shared/components/ui/icon';
import { useToggle } from '#/shared/hooks/use-toggle';
import { cn } from '#/shared/utils/cn';
import { generateMocks, randomId } from '#/shared/utils/mock';

interface ClientRow {
  id: string;
  fullName: string;
  role: string;
  status: string;
}

const ROLES = ['Администратор', 'Менеджер', 'Пользователь'] as const;
const STATUSES = ['active', 'inactive'] as const;

const IngoAccountsPage: React.FC = () => {
  const [search, setSearch] = useState('');
  const [open, { toggle, set }] = useToggle();

  const allColumns = useMemo(
    (): ColumnDef<ClientRow>[] => [
      { accessorKey: 'fullName', header: 'ФИО', size: 345 },
      { accessorKey: 'role', header: 'Роль', size: 345 },
      {
        accessorKey: 'status',
        header: 'Статус',
        size: 200,
        cell(props) {
          return props.getValue() === 'active' ? 'Активен' : 'Неактивен';
        },
      },
      {
        accessorKey: 'actions',
        header: '',
        size: 80,
        cell() {
          return (
            <div className="w-max">
              <Dropdown
                items={[
                  {
                    label: 'Редактировать',
                    icon: { name: 'lucide:pencil', size: 18 },
                    onSelect: toggle,
                  },
                  {
                    label: 'Сбросить пароль',
                    icon: { name: 'lucide:lock', size: 18 },
                  },
                ]}
                trigger={({ onClick }) => (
                  <button
                    onClick={onClick}
                    className={cn(
                      'border border-[#E7EAE9] rounded-full gap-2 p-1',
                      'text-left bg-white gap-1',
                      'flex items-center justify-center cursor-pointer'
                    )}
                  >
                    <Icon
                      color="#94A3B8"
                      size={20}
                      name="lucide:ellipsis-vertical"
                    />
                  </button>
                )}
                classNames={{ menu: 'min-w-[220px] -ml-[180px]' }}
              />
            </div>
          );
        },
      },
    ],
    [toggle]
  );

  const allData = useMemo(
    () =>
      generateMocks(10, {
        id: () => randomId('client'),
        fullName: ['Иван', 'Пётр', 'Сергей', 'Мария', 'Анна'],
        role: ROLES,
        status: STATUSES,
      }),
    []
  );

  const data = useMemo(
    () =>
      allData.filter(
        row =>
          row.fullName.toLowerCase().includes(search.toLowerCase()) ||
          row.role.toLowerCase().includes(search.toLowerCase()) ||
          row.status.toLowerCase().includes(search.toLowerCase())
      ),
    [search, allData]
  );

  return (
    <main>
      {open && <EditUserModal onClose={() => set(false)} />}
      <PageSection
        title="Все клиенты"
        headerEnd={
          <div className="flex items-center gap-4 relative z-100">
            <SearchInput saveValue={setSearch} />
            <ExportToExcelButton data={data} fileName="clients.xlsx" />
            <AddUserWrapper />
          </div>
        }
      >
        <Table<ClientRow>
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
