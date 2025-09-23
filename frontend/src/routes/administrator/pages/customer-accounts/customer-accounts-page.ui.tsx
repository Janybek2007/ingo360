import type { ColumnDef } from '@tanstack/react-table';
import React, { useMemo, useState } from 'react';

import { ExportToExcelButton } from '#/shared/components/export-to-excel';
import { PageSection } from '#/shared/components/page-section';
import { SearchInput } from '#/shared/components/search-input';
import { Table } from '#/shared/components/table';
import { Button } from '#/shared/components/ui/button';
import { Dropdown } from '#/shared/components/ui/dropdown';
import { Icon } from '#/shared/components/ui/icon';
import { cn } from '#/shared/utils/cn';
import { generateMocks, randomId } from '#/shared/utils/mock';

interface CustomerRow {
  id: string;
  fullName: string;
  position: string;
  company: string;
  role: string;
  email: string;
  status: string;
}

const ROLES = ['Администратор', 'Менеджер', 'Пользователь'] as const;
const POSITIONS = ['Менеджер', 'Старший менеджер', 'Специалист'] as const;
const COMPANIES = ['ОСО', 'Ингосстрах', 'Альфа'] as const;
const EMAILS = [
  'ivan@example.com',
  'petr@example.com',
  'maria@example.com',
  'sergey@example.com',
] as const;
const STATUSES = ['active', 'inactive'] as const;

const CustomerAccountsPage: React.FC = () => {
  const [search, setSearch] = useState('');

  const allColumns = useMemo(
    (): ColumnDef<CustomerRow>[] => [
      { accessorKey: 'fullName', header: 'ФИО', size: 160 },
      { accessorKey: 'position', header: 'Должность', size: 174 },
      { accessorKey: 'company', header: 'Компания', size: 174 },
      { accessorKey: 'role', header: 'Роль', size: 160 },
      { accessorKey: 'email', header: 'Email', size: 220 },
      {
        accessorKey: 'status',
        header: 'Статус',
        size: 180,
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
                  },
                  {
                    label: 'Сбросить пароль',
                    icon: { name: 'lucide:refresh-ccw', size: 18 },
                  },
                ]}
                trigger={({ toggle }) => (
                  <button
                    onClick={toggle}
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
                classNames={{ menu: 'min-w-[220px] right-0' }}
              />
            </div>
          );
        },
      },
    ],
    []
  );

  const allData = useMemo(
    () =>
      generateMocks(10, {
        id: () => randomId('customer'),
        fullName: ['Иван', 'Пётр', 'Сергей', 'Мария', 'Анна'],
        position: POSITIONS,
        company: COMPANIES,
        role: ROLES,
        email: EMAILS,
        status: STATUSES,
      }),
    []
  );

  const data = useMemo(
    () =>
      allData.filter(
        row =>
          row.fullName.toLowerCase().includes(search.toLowerCase()) ||
          row.position.toLowerCase().includes(search.toLowerCase()) ||
          row.company.toLowerCase().includes(search.toLowerCase()) ||
          row.role.toLowerCase().includes(search.toLowerCase()) ||
          row.email.toLowerCase().includes(search.toLowerCase()) ||
          row.status.toLowerCase().includes(search.toLowerCase())
      ),
    [search, allData]
  );

  return (
    <main>
      <PageSection
        title="Все клиенты"
        headerEnd={
          <div className="flex items-center gap-4 relative z-100">
            <SearchInput saveValue={setSearch} />
            <ExportToExcelButton data={data} fileName="customers.xlsx" />
            <Button className="px-4 py-3 rounded-full flex items-center gap-1">
              <Icon name="lucide:plus" />
              Добавить уч. запись
            </Button>
          </div>
        }
      >
        <Table<CustomerRow>
          columns={allColumns}
          data={data}
          isScrollbar
          maxHeight={500}
          rounded="none"
        />
      </PageSection>
    </main>
  );
};

export default CustomerAccountsPage;
