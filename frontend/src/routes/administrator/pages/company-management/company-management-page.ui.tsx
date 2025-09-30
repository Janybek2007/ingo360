import type { ColumnDef } from '@tanstack/react-table';
import React, { useMemo, useState } from 'react';

import { AddCompanyModal } from '#/features/company/add';
import { EditCompanyModal } from '#/features/company/edit';
import { ExportToExcelButton } from '#/shared/components/export-to-excel';
import { PageSection } from '#/shared/components/page-section';
import { RowActions } from '#/shared/components/row-actions';
import { SearchInput } from '#/shared/components/search-input';
import { Table } from '#/shared/components/table';
import { Button } from '#/shared/components/ui/button';
import { Icon } from '#/shared/components/ui/icon';
import { STATUSES, STATUSES_OBJECT } from '#/shared/constants/global';
import { useCreateEditState } from '#/shared/hooks/use-create-edit-state';
import { numberFilter } from '#/shared/utils/filter';
import { generateMocks, randomId, randomInt } from '#/shared/utils/mock';

interface CompanyRow {
  id: string;
  company: string;
  accountLimit: number;
  registered: number;
  contractNumber: string;
  contractEnd: string;
  status: string;
}

const COMPANIES = ['ОСО', 'Ингосстрах', 'Альфа'] as const;

const CompanyManagementPage: React.FC = () => {
  const [search, setSearch] = useState('');
  const [open, { set, clear }] = useCreateEditState();

  const allColumns = useMemo(
    (): ColumnDef<CompanyRow>[] => [
      {
        accessorKey: 'company',
        header: 'Компания',
        size: 177,
      },
      {
        accessorKey: 'accountLimit',
        header: 'Лимит учетных записей',
        size: 227,
        enableColumnFilter: true,
        filterFn: numberFilter(),
        type: 'number',
      },
      { accessorKey: 'registered', header: 'Зарегистрированные', size: 220 },
      { accessorKey: 'contractNumber', header: '№ Договора', size: 213 },
      {
        accessorKey: 'contractEnd',
        header: 'Срок окончания договора',
        size: 273,
      },
      {
        accessorKey: 'status',
        header: 'Статус',
        size: 180,
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
                { type: 'access_settings', onSelect: () => {} },
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
        id: () => randomId('company'),
        company: COMPANIES,
        accountLimit: () => randomInt(3, 5),
        registered: () => randomInt(0, 5),
        contractNumber: () => '32124',
        contractEnd: () => '03-08-2025',
        status: STATUSES,
      }),
    []
  );

  const data = useMemo(() => {
    return allData.filter(
      row =>
        row.company.toLowerCase().includes(search.toLowerCase()) ||
        row.contractNumber.toLowerCase().includes(search.toLowerCase()) ||
        row.status.toLowerCase().includes(search.toLowerCase())
    );
  }, [search, allData]);

  return (
    <main>
      {open === 'edit' && <EditCompanyModal onClose={clear} />}
      {open === 'create' && <AddCompanyModal onClose={clear} />}
      <PageSection
        title="Все Компании"
        headerEnd={
          <div className="flex items-center gap-4 relative z-100">
            <SearchInput saveValue={setSearch} />
            <ExportToExcelButton data={data} fileName="companies.xlsx" />
            <Button
              onClick={() => set('create')}
              className="px-4 py-3 rounded-full flex items-center gap-1"
            >
              <Icon name="lucide:plus" />
              Добавить компанию
            </Button>{' '}
          </div>
        }
      >
        <Table<CompanyRow>
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

export default CompanyManagementPage;
