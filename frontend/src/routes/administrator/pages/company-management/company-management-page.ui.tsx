import type { ColumnDef } from '@tanstack/react-table';
import React, { useMemo, useState } from 'react';

import { AddCompanyWrapper } from '#/features/company/add';
import { EditCompanyModal } from '#/features/company/edit';
import { ExportToExcelButton } from '#/shared/components/export-to-excel';
import { PageSection } from '#/shared/components/page-section';
import { SearchInput } from '#/shared/components/search-input';
import { Table } from '#/shared/components/table';
import { Dropdown } from '#/shared/components/ui/dropdown';
import { Icon } from '#/shared/components/ui/icon';
import { useToggle } from '#/shared/hooks/use-toggle';
import { cn } from '#/shared/utils/cn';
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
const STATUSES = ['active', 'inactive'] as const;

const CompanyManagementPage: React.FC = () => {
  const [search, setSearch] = useState('');
  const [open, { toggle, set }] = useToggle();

  const allColumns = useMemo(
    (): ColumnDef<CompanyRow>[] => [
      { accessorKey: 'company', header: 'Компания', size: 177 },
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
          return props.getValue() === 'active' ? 'Активна' : 'Неактивен';
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
                    label: 'Настройки доступа',
                    icon: {
                      name: 'material-symbols-light:admin-panel-settings-rounded',
                      size: 22,
                    },
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
                classNames={{ menu: 'min-w-[240px] -ml-[200px]' }}
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
      {open && <EditCompanyModal onClose={() => set(false)} />}
      <PageSection
        title="Все Компании"
        headerEnd={
          <div className="flex items-center gap-4 relative z-100">
            <SearchInput saveValue={setSearch} />
            <ExportToExcelButton data={data} fileName="companies.xlsx" />
            <AddCompanyWrapper />
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
