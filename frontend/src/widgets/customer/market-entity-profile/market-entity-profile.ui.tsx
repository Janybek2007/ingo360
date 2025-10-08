import type { ColumnDef } from '@tanstack/react-table';
import React, { useMemo, useState } from 'react';

import { PageSection } from '#/shared/components/page-section';
import { Table } from '#/shared/components/table';
import { Select } from '#/shared/components/ui/select';
import { Tabs } from '#/shared/components/ui/tabs';
import { generateMocks, randomId } from '#/shared/utils/mock';

type ETabs = 'companies' | 'brands' | 'segments';

interface TableRow {
  place: number;
  company: string;
  sales: number;
}

const COMPANIES = [
  'Google',
  'Apple',
  'Microsoft',
  'Amazon',
  'Tesla',
  'Meta',
  'Adobe',
  'Samsung',
  'Nike',
  'Coca-Cola',
] as const;

const BRANDS = [
  'iPhone',
  'Galaxy',
  'Pixel',
  'Surface',
  'MacBook',
  'ThinkPad',
  'PlayStation',
  'Xbox',
  'Nintendo',
  'Kindle',
] as const;

const SEGMENTS = [
  'Электроника',
  'Одежда',
  'Продукты',
  'Автомобили',
  'Мебель',
  'Косметика',
  'Спорт',
  'Книги',
  'Игрушки',
  'Бытовая техника',
] as const;

const tabItems: { value: ETabs; label: string }[] = [
  { value: 'companies', label: 'Компании' },
  { value: 'brands', label: 'Бренды' },
  { value: 'segments', label: 'Сегменты' },
];

const PERIOD_MULTIPLIERS = {
  mat: 1.0, // MAT (Moving Annual Total) - полная годовая сумма
  ytd: 0.75, // YTD (Year To Date) - 75% от года (примерно 9 месяцев)
  month: 0.083, // Месяц - 1/12 от года
  year: 1.0, // Год - полная сумма
};

export const MarketEntityProfile: React.FC = React.memo(() => {
  const [activeTab, setActiveTab] = useState<ETabs>('companies');
  const [filterPeriod, setFilterPeriod] = useState<
    'mat' | 'ytd' | 'month' | 'year'
  >('mat');
  const [filterTop, setFilterTop] = useState<'all' | 'top5' | 'top10'>('all');

  const allData = useMemo(() => {
    const companiesData = generateMocks(100, {
      place: i => i + 1,
      id: () => randomId('company'),
      company: COMPANIES,
    });

    const brandsData = generateMocks(100, {
      place: i => i + 1,
      id: () => randomId('brand'),
      company: BRANDS,
    });

    const segmentsData = generateMocks(100, {
      place: i => i + 1,
      id: () => randomId('segment'),
      company: SEGMENTS,
    });

    return {
      companies: companiesData,
      brands: brandsData,
      segments: segmentsData,
    };
  }, []);

  const data = useMemo(() => {
    let currentData: TableRow[] = allData[activeTab] as unknown as TableRow[];

    const periodMultiplier = PERIOD_MULTIPLIERS[filterPeriod];
    currentData = currentData.map(item => ({
      ...item,
      sales: Math.round(item.sales * periodMultiplier),
    })) as TableRow[];

    currentData = [...currentData].sort((a, b) => b.sales - a.sales);

    currentData = currentData.map((item, index) => ({
      ...item,
      place: index + 1,
    })) as TableRow[];

    if (filterTop === 'top5') {
      return currentData.slice(0, 5);
    } else if (filterTop === 'top10') {
      return currentData.slice(0, 10);
    }

    return currentData;
  }, [allData, activeTab, filterPeriod, filterTop]);

  const columns = useMemo<ColumnDef<TableRow>[]>(
    () => [
      { accessorKey: 'place', header: 'Место', size: 350 },
      { accessorKey: 'company', header: 'Компания', size: 400 },
      { accessorKey: 'sales', header: 'Сумма продаж', size: 400 },
    ],
    []
  );

  return (
    <PageSection
      title="Профайл компании, бренда или сегмента"
      headerEnd={
        <div className="flex gap-4 items-center relative z-100">
          <Select<false, typeof filterPeriod>
            value={filterPeriod}
            setValue={setFilterPeriod}
            items={[
              { value: 'mat', label: 'MAT' },
              { value: 'ytd', label: 'YTD' },
              { value: 'month', label: 'Месяц' },
              { value: 'year', label: 'Год' },
            ]}
            triggerText="Тип периода"
            classNames={{ menu: 'min-w-[7.5rem] right-0' }}
          />
          <Select<false, typeof filterTop>
            value={filterTop}
            setValue={setFilterTop}
            items={[
              { value: 'all', label: 'Все' },
              { value: 'top5', label: 'Топ 5' },
              { value: 'top10', label: 'Топ 10' },
            ]}
            triggerText="Топ 10"
            classNames={{ menu: 'min-w-[7.5rem] right-0' }}
          />
        </div>
      }
      classNames={{ wrapper: 'gap-3' }}
      afterHeader={
        <Tabs
          saveCurrent={current => setActiveTab(current as ETabs)}
          classNames={{ tabs: 'p-0 rounded-none border-none' }}
          items={tabItems}
        />
      }
    >
      <div className="flex items justify-between h-full font-inter">
        <div className="max-w-[25rem] min-w-[25rem] flex flex-col justify-between text-[#131313]">
          <h4 className="font-semibold text-xl leading-full -tracking-[0.0125rem]">
            Рейтинг{' '}
            {activeTab === 'companies'
              ? 'компаний'
              : activeTab === 'brands'
                ? 'брендов'
                : 'сегментов'}
          </h4>
          <div>
            <div className="flex flex-col items-center w-full gap-[1.125rem]">
              <span className="font-medium text-5xl leading-full -tracking-[0.0125rem]">
                34
              </span>
              <p className="font-normal text-base leading-full -tracking-[0.0125rem]">
                Ваше место в рейтинге
              </p>
            </div>
          </div>
          <div></div>
        </div>
        <div className="w-full">
          <Table
            highlightRow={row =>
              row.place === 34 ? 'bg-yellow-100 font-bold' : ''
            }
            pinnedRow={row => row.place === 34}
            columns={columns}
            maxHeight={400}
            data={data}
          />
        </div>
      </div>
    </PageSection>
  );
});

MarketEntityProfile.displayName = '_MarketEntityProfile_';
