import React from 'react';

import { PageSection } from '#/shared/components/page-section';
import { Select } from '#/shared/components/ui/select';

import { DynamicPrimarySalesAsLine } from './ui/as-line.ui';
import { DynamicPrimarySalesAsMixed } from './ui/as-mixed.ui';

const AsLegends = {
  line: [],
  mixed: [
    { label: 'Первичка', fill: '#0B5A7C' },
    { label: 'Остаток', fill: '#FFC000' },
    { label: 'Товарный запас', fill: '#888888' },
  ],
};

export const DynamicPrimarySales: React.FC<{ as?: 'line' | 'mixed' }> =
  React.memo(({ as = 'line' }) => {
    const [asMoney, setAsMoney] = React.useState<'money' | 'packaging'>(
      'money'
    );
    return (
      <PageSection
        title={`Динамика первычных продаж в ${asMoney ? 'деньгах' : 'упаковках'}`}
        legends={AsLegends[as]}
        headerEnd={
          <div className="flex items-center gap-4">
            {as == 'mixed' && (
              <Select<false, typeof asMoney>
                value={asMoney}
                setValue={setAsMoney}
                items={[
                  { value: 'money', label: 'Деньги' },
                  { value: 'packaging', label: 'Упаковка' },
                ]}
                triggerText="Деньги/Упаковка"
              />
            )}
            <Select<false, string>
              value={'brand1'}
              setValue={() => {}}
              items={[
                { value: 'brand1', label: 'Бренд 1' },
                { value: 'brand2', label: 'Бренд 2' },
                { value: 'brand3', label: 'Бренд 3' },
              ]}
              triggerText="Бренд"
              classNames={{ menu: 'w-[10rem]' }}
            />
            <Select<false, string>
              value={'group1'}
              setValue={() => {}}
              items={[
                { value: 'group1', label: 'Группа 1' },
                { value: 'group2', label: 'Группа 2' },
                { value: 'group3', label: 'Группа 3' },
              ]}
              triggerText="Группа"
              classNames={{ menu: 'w-[10rem]' }}
            />
            <Select
              triggerText={'Год/Месяц/Квартал'}
              items={[
                { label: 'Год', value: 'year' },
                { label: 'Месяц', value: 'month' },
                { label: 'Квартал', value: 'quarter' },
              ]}
              value={'year'}
              setValue={() => {}}
              classNames={{
                trigger: 'gap-4 rounded-full min-w-[7.5rem] justify-between',
                menu: 'w-full right-0',
              }}
            />
          </div>
        }
      >
        {as == 'line' ? (
          <DynamicPrimarySalesAsLine />
        ) : (
          <DynamicPrimarySalesAsMixed />
        )}
      </PageSection>
    );
  });

DynamicPrimarySales.displayName = '_DynamicPrimarySales_';
