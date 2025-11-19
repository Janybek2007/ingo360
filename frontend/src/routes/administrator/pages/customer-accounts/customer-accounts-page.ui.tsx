import { useQuery } from '@tanstack/react-query';
import React, { useMemo, useState } from 'react';

import { UserQueries } from '#/entities/user/user.queries';
import type { IUserItem } from '#/entities/user/user.types';
import { AddCustomerModal } from '#/features/customer/add';
import { EditCustomerModal } from '#/features/customer/edit';
import { AsyncBoundary } from '#/shared/components/async-boundry';
import { ExportToExcelButton } from '#/shared/components/export-to-excel';
import { LucidePlusIcon } from '#/shared/components/icons';
import { PageSection } from '#/shared/components/page-section';
import { RowActions } from '#/shared/components/row-actions';
import { SearchInput } from '#/shared/components/search-input';
import { Table } from '#/shared/components/table';
import { Button } from '#/shared/components/ui/button';
import { commonColumns } from '#/shared/constants/common-columns';
import { useGenerateColumns } from '#/shared/hooks/use-generate-columns';
import { useStringState } from '#/shared/hooks/use-string-state';
import { filterBySearch } from '#/shared/utils/search';
import { transformHeaderKeys } from '#/shared/utils/transform';

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

  const filteredData = useMemo((): CustomerRow[] => {
    if (!customersQuery.data) return [];

    const normalized = customersQuery.data.map((customer: IUserItem) => ({
      ...customer,
      fullName:
        `${customer.last_name} ${customer.first_name} ${customer.patronymic || ''}`.trim(),
      position: (customer as { position?: string }).position || 'Не указана',
      companyName: customer.company?.name || 'Не указана',
    })) as CustomerRow[];

    return filterBySearch<CustomerRow>(normalized, search, [
      'first_name',
      'last_name',
      'patronymic',
      'position',
      'email',
      'role',
    ]);
  }, [customersQuery.data, search]);

  const allColumns = useGenerateColumns<CustomerRow>({
    data: filteredData,
    columns: [
      commonColumns.userFullName(),
      commonColumns.customerPosition(),
      commonColumns.customerCompany(290, customersQuery.data || []),
      commonColumns.userEmail(),
      commonColumns.status(150, 'statusDisplay'),
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
        <EditCustomerModal onClose={clear} customerData={editData} />
      )}
      {open === 'create' && <AddCustomerModal onClose={clear} />}
      <PageSection
        title="Управление учетными записями клиентов"
        headerEnd={
          <div className="flex items-center gap-4 relative z-100">
            <SearchInput saveValue={setSearch} />
            <ExportToExcelButton
              formatHeader={transformHeaderKeys(allColumns)}
              selectKeys={Object.keys(transformHeaderKeys(allColumns))}
              data={filteredData}
              fileName="Аккаунты клиентов"
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
        <AsyncBoundary
          isLoading={customersQuery.isLoading}
          queryError={customersQuery.error}
        >
          <Table
            columns={allColumns}
            data={filteredData}
            maxHeight={500}
            rounded="none"
          />
        </AsyncBoundary>
      </PageSection>
    </main>
  );
};

export default CustomerAccountsPage;
