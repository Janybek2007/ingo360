import { useQuery } from '@tanstack/react-query';
import type { ColumnDef } from '@tanstack/react-table';
import React, { useMemo, useState } from 'react';

import { CompanyQueries, type ICompanyItem } from '#/entities/company';
import { AccessCompanyModal } from '#/features/company/access';
import { AddCompanyModal } from '#/features/company/add';
import { EditCompanyModal } from '#/features/company/edit';
import { ExportToExcelButton } from '#/shared/components/export-to-excel';
import { LucidePlusIcon } from '#/shared/components/icons';
import { PageSection } from '#/shared/components/page-section';
import { RowActions } from '#/shared/components/row-actions';
import { SearchInput } from '#/shared/components/search-input';
import { Table } from '#/shared/components/table';
import { Button } from '#/shared/components/ui/button';
import { STATUSES_OBJECT } from '#/shared/constants/roles_statuses';
import { useStringState } from '#/shared/hooks/use-string-state';
import { numberFilter } from '#/shared/utils/filter';

const CompanyManagementPage: React.FC = () => {
  const [search, setSearch] = useState('');

  const [open, { set, clear }] = useStringState(['create', 'edit']);
  const [openAccess, setOpenAccess] = useState(false);
  const [editData, setEditData] = useState<ICompanyItem | null>(null);
  const [accessData, setAccessData] = useState<ICompanyItem | null>(null);
  const queryData = useQuery(CompanyQueries.GetCompaniesQuery());

  const filteredData = useMemo(() => {
    if (!search.trim()) return queryData.data || [];

    // Нормализация для корректной работы с кириллицей
    const normalizeText = (text: string) =>
      text
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '');

    const normalizedSearch = normalizeText(search);

    return (queryData.data || []).filter(
      (row: ICompanyItem) =>
        normalizeText(row.name || '').includes(normalizedSearch) ||
        normalizeText(row.ims_name || '').includes(normalizedSearch) ||
        normalizeText(row.contract_number || '').includes(normalizedSearch) ||
        normalizeText(String(row.active_users_limit || '')).includes(
          normalizedSearch
        ) ||
        normalizeText(String(row.active_users || '')).includes(
          normalizedSearch
        ) ||
        normalizeText(row.contract_end_date || '').includes(normalizedSearch) ||
        normalizeText(row.is_active ? 'активный' : 'неактивный').includes(
          normalizedSearch
        )
    );
  }, [search, queryData.data]);

  const allColumns = useMemo(
    (): ColumnDef<ICompanyItem>[] => [
      {
        accessorKey: 'name',
        header: 'Компания',
        size: 177,
      },
      {
        accessorKey: 'active_users_limit',
        header: 'Лимит учетных записей',
        size: 227,
        enableColumnFilter: true,
        filterFn: numberFilter(),
        type: 'number',
      },
      {
        accessorKey: 'active_users',
        header: 'Активные пользователи',
        size: 220,
      },
      { accessorKey: 'contract_number', header: '№ Договора', size: 213 },
      {
        accessorKey: 'contract_end_date',
        header: 'Срок окончания договора',
        size: 273,
      },
      {
        accessorKey: 'is_active',
        header: 'Статус',
        size: 180,
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
                {
                  type: 'access_settings',
                  onSelect: () => {
                    setAccessData(props.row.original);
                    setOpenAccess(true);
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
        <EditCompanyModal
          onClose={clear}
          companyData={editData as unknown as Record<string, unknown>}
        />
      )}
      {open === 'create' && <AddCompanyModal onClose={clear} />}
      {openAccess && accessData && (
        <AccessCompanyModal
          onClose={() => {
            setOpenAccess(false);
            setAccessData(null);
          }}
          companyData={accessData}
        />
      )}
      <PageSection
        title="Все Компании"
        headerEnd={
          <div className="flex items-center gap-4 relative z-100">
            <SearchInput saveValue={setSearch} />
            <ExportToExcelButton
              data={filteredData}
              fileName="companies.xlsx"
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
        <Table
          columns={allColumns}
          data={filteredData}
          isScrollbar
          isLoading={queryData.isLoading}
          maxHeight={500}
          rounded="none"
        />
      </PageSection>
    </main>
  );
};

export default CompanyManagementPage;
