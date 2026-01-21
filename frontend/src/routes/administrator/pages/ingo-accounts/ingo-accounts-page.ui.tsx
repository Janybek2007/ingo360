import { useQuery } from '@tanstack/react-query';
import React, { useMemo, useState } from 'react';

import { type IUserItem, UserQueries } from '#/entities/user';
import { AddUserModal } from '#/features/users/add';
import { EditUserModal } from '#/features/users/edit';
import { LucidePlusIcon } from '#/shared/assets/icons';
import { AsyncBoundary } from '#/shared/components/async-boundry';
import { ExportToExcelButton } from '#/shared/components/export-to-excel';
import { PageSection } from '#/shared/components/page-section';
import { RowActions } from '#/shared/components/row-actions';
import { SearchInput } from '#/shared/components/search-input';
import { Table } from '#/shared/components/table';
import { Button } from '#/shared/components/ui/button';
import { commonColumns } from '#/shared/constants/common-columns';
import { ROLES, ROLES_OBJECT } from '#/shared/constants/roles_statuses';
import { useGenerateColumns } from '#/shared/hooks/use-generate-columns';
import { useStringState } from '#/shared/hooks/use-string-state';
import { filterBySearch } from '#/shared/utils/search';
import { transformHeaderKeys } from '#/shared/utils/transform';

const IngoAccountsPage: React.FC = () => {
  const [search, setSearch] = useState('');
  const [open, { set, clear }] = useStringState(['create', 'edit']);
  const [editData, setEditData] = useState<IUserItem | null>(null);
  const queryData = useQuery(UserQueries.GetAdminOperatorsQuery());

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

  const allColumns = useGenerateColumns<IUserItem>({
    data: filteredData,
    columns: [
      commonColumns.userFullName(),
      commonColumns.userRole(280, ROLES.slice(0, 2), ROLES_OBJECT),
      commonColumns.userEmail(),
      commonColumns.status(),
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
        <EditUserModal onClose={clear} userData={editData} />
      )}
      {open === 'create' && <AddUserModal onClose={clear} />}
      <PageSection
        title="Учетные записи INDIGO"
        headerEnd={
          <div className="flex items-center gap-4 relative z-100">
            <SearchInput saveValue={setSearch} />
            <ExportToExcelButton
              formatHeader={transformHeaderKeys(allColumns)}
              selectKeys={Object.keys(transformHeaderKeys(allColumns))}
              data={filteredData}
              fileName="Учетные записи INDIGO"
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
        <AsyncBoundary
          isLoading={queryData.isLoading}
          queryError={queryData.error}
        >
          <Table
            columns={allColumns}
            data={filteredData}
            maxHeight={700}
            rounded="none"
          />
        </AsyncBoundary>
      </PageSection>
    </main>
  );
};

export default IngoAccountsPage;
