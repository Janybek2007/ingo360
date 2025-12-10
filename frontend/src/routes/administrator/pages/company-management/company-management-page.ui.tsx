import { useQuery } from '@tanstack/react-query';
import React, { useMemo, useState } from 'react';

import { CompanyQueries, type ICompanyItem } from '#/entities/company';
import { AccessCompanyModal } from '#/features/company/access';
import { AddCompanyModal } from '#/features/company/add';
import { EditCompanyModal } from '#/features/company/edit';
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

const CompanyManagementPage: React.FC = () => {
  const [search, setSearch] = useState('');

  const [open, { set, clear }] = useStringState(['create', 'edit']);
  const [openAccess, setOpenAccess] = useState(false);
  const [selectData, setSelectData] = useState<ICompanyItem | null>(null);
  const queryData = useQuery(CompanyQueries.GetCompaniesQuery());

  const filteredData = useMemo(() => {
    const data = queryData.data || [];
    if (!search.trim()) return data;

    return filterBySearch<ICompanyItem>(data, search, [
      'name',
      'ims_name',
      'contract_number',
      'active_users_limit',
      'active_users',
      'contract_end_date',
      'is_active',
    ]);
  }, [search, queryData.data]);

  const allColumns = useGenerateColumns<ICompanyItem>({
    data: filteredData,
    columns: [
      commonColumns.companyName(),
      commonColumns.companyActiveUsersLimit(),
      commonColumns.companyActiveUsers(),
      commonColumns.companyContractNumber(),
      commonColumns.companyContractEndDate(),
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
                      setSelectData(props.row.original);
                      setTimeout(() => set('edit'), 0);
                    },
                  },
                  {
                    type: 'access_settings',
                    onSelect: () => {
                      setSelectData(props.row.original);
                      setOpenAccess(true);
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
      {open === 'edit' && selectData && (
        <EditCompanyModal onClose={clear} companyData={selectData} />
      )}
      {open === 'create' && <AddCompanyModal onClose={clear} />}
      {openAccess && selectData && (
        <AccessCompanyModal
          onClose={() => {
            setOpenAccess(false);
            setSelectData(null);
          }}
          companyData={selectData}
        />
      )}
      <PageSection
        title="Все Компании"
        headerEnd={
          <div className="flex items-center gap-4 relative z-100">
            <SearchInput saveValue={setSearch} />
            <ExportToExcelButton
              formatHeader={transformHeaderKeys(allColumns)}
              selectKeys={Object.keys(transformHeaderKeys(allColumns))}
              data={filteredData}
              fileName="Компании"
            />
            <Button
              onClick={() => set('create')}
              className="px-3 py-2 rounded-full flex items-center gap-1"
            >
              <LucidePlusIcon className="size-6" />
              Добавить компанию
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

export default CompanyManagementPage;
