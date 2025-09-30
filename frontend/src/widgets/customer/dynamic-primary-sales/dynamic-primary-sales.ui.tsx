import React from 'react';

import { PageSection } from '#/shared/components/page-section';
import { Icon } from '#/shared/components/ui/icon';
import { Select } from '#/shared/components/ui/select';
import { allMonths } from '#/shared/constants/months';

import { DynamicPrimarySalesAsLine } from './ui/as-line.ui';
import { DynamicPrimarySalesAsMixed } from './ui/as-mixed.ui';

const AsLegends = {
  line: [{ label: 'Первичные продажи', fill: '#0B5A7C' }],
  mixed: [
    { label: 'Третичка', fill: '#0B5A7C' },
    { label: 'Остаток', fill: '#FFC000' },
    { label: 'Товарный запас', fill: '#888888' },
  ],
};

export const DynamicPrimarySales: React.FC<{ as?: 'line' | 'mixed' }> =
  React.memo(({ as = 'line' }) => {
    return (
      <PageSection
        title="Динамика первычных продаж в деньгах"
        titleBadge={
          as == 'line' ? { label: '↗ 41.67%', color: '#1CC741' } : undefined
        }
        legends={AsLegends[as]}
        headerEnd={
          <div className="flex items-center gap-4">
            <Select<true, string>
              value={['brand', 'group']}
              setValue={() => {}}
              checkbox
              items={[
                { value: 'brand', label: 'Бренд' },
                { value: 'group', label: 'Группа' },
              ]}
              triggerText="Бренд/Группа"
            />{' '}
            <Select<true, number>
              triggerText={'Год'}
              items={[2024, 2025].map(y => ({ label: String(y), value: y }))}
              value={[2024]}
              checkbox
              setValue={() => {}}
              rightIcon={<Icon name="lucide:chevron-down" size={18} />}
              classNames={{
                trigger: 'gap-4 rounded-full min-w-[120px] justify-between',
                menu: 'w-full right-0',
              }}
            />
            <Select<true, string>
              triggerText={'Месяц'}
              items={allMonths.map(m => ({ label: String(m), value: m }))}
              value={allMonths as unknown as string[]}
              checkbox
              setValue={() => {}}
              rightIcon={<Icon name="lucide:chevron-down" size={18} />}
              classNames={{
                trigger: 'gap-4 rounded-full min-w-[120px] justify-between',
                menu: 'w-[140px] right-0',
              }}
            />
            <Select<true, number>
              triggerText={'Квартал'}
              items={[1, 2, 3, 4].map(q => ({
                label: `Квартал ${q}`,
                value: q,
              }))}
              value={[1, 2]}
              checkbox
              setValue={() => {}}
              rightIcon={<Icon name="lucide:chevron-down" size={18} />}
              classNames={{
                trigger: 'gap-4 rounded-full min-w-[120px] justify-between',
                menu: 'w-[160px] right-0',
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
