import { useQuery } from '@tanstack/react-query';
import type { ColumnDef } from '@tanstack/react-table';
import React, { useMemo, useState } from 'react';

import { UserQueries } from '#/entities/user/user.queries';
import { AddCustomerModal } from '#/features/customer/add';
import { EditCustomerModal } from '#/features/customer/edit';
import { ExportToExcelButton } from '#/shared/components/export-to-excel';
import { PageSection } from '#/shared/components/page-section';
import { RowActions } from '#/shared/components/row-actions';
import { SearchInput } from '#/shared/components/search-input';
import { Table } from '#/shared/components/table';
import { Button } from '#/shared/components/ui/button';
import { Icon } from '#/shared/components/ui/icon';
import { ROLES, STATUSES, STATUSES_OBJECT } from '#/shared/constants/global';
import { useStringState } from '#/shared/hooks/use-string-state';
import { selectFilter } from '#/shared/utils/filter';
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

const COMPANIES = ['ОСО', 'Ингосстрах', 'Альфа'] as const;
const EMAILS = [
  'ivan@example.com',
  'petr@example.com',
  'maria@example.com',
  'sergey@example.com',
] as const;

const POSITIONS = ['Менеджер', 'Старший менеджер', 'Специалист'] as const;

const CustomerAccountsPage: React.FC = () => {
  const [search, setSearch] = useState('');
  const [open, { set, clear }] = useStringState(['create', 'edit']);

  const queryData = useQuery(UserQueries.GetUsersQuery());

  console.log(queryData.data);

  const allColumns = useMemo(
    (): ColumnDef<CustomerRow>[] => [
      { accessorKey: 'fullName', header: 'ФИО', size: 290 },
      {
        accessorKey: 'position',
        header: 'Должность',
        size: 290,
        enableColumnFilter: true,
        filterFn: selectFilter(),
        type: 'select',
        selectOptions: POSITIONS.map(position => ({
          label: position,
          value: position,
        })),
      },
      {
        accessorKey: 'company',
        header: 'Компания',
        size: 290,
        enableColumnFilter: true,
        filterFn: selectFilter(),
        type: 'select',
        selectOptions: COMPANIES.map(company => ({
          label: company,
          value: company,
        })),
      },
      { accessorKey: 'email', header: 'Email', size: 290 },
      {
        accessorKey: 'status',
        header: 'Статус',
        size: 290,
        cell(props) {
          return STATUSES_OBJECT[props.getValue() as 'active'];
        },
      },
      {
        accessorKey: 'actions',
        header: '',
        size: 80,
        cell() {
          return (
            <RowActions
              items={[
                { type: 'edit', onSelect: () => set('edit') },
                { type: 'reset_password', onSelect: () => {} },
              ]}
            />
          );
        },
      },
    ],
    [set]
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
      {open === 'edit' && <EditCustomerModal onClose={clear} />}
      {open === 'create' && <AddCustomerModal onClose={clear} />}
      <PageSection
        title="Управление уч. записями клиентов"
        headerEnd={
          <div className="flex items-center gap-4 relative z-100">
            <SearchInput saveValue={setSearch} />
            <ExportToExcelButton data={data} fileName="customers.xlsx" />
            <Button
              onClick={() => set('create')}
              className="px-4 py-3 rounded-full flex items-center gap-1"
            >
              <Icon name="lucide:plus" />
              Добавить уч. запись
            </Button>{' '}
          </div>
        }
      >
        <Table
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
