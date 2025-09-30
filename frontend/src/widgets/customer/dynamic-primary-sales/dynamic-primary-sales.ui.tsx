import React, { useState } from 'react';

import { PageSection } from '#/shared/components/page-section';
import { Icon } from '#/shared/components/ui/icon';
import { Select } from '#/shared/components/ui/select';

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
    const years = [2024, 2025];
    const [selectedYear, setSelectedYear] = useState(2024);

    return (
      <PageSection
        title="Динамика первычных продаж"
        titleBadge={
          as == 'line' ? { label: '↗ 41.67%', color: '#1CC741' } : undefined
        }
        legends={AsLegends[as]}
        headerEnd={
          <div>
            <Select<false, number>
              triggerText={'Год'}
              items={years.map(y => ({ label: String(y), value: String(y) }))}
              value={selectedYear}
              setValue={newValue => setSelectedYear(newValue)}
              rightIcon={<Icon name="lucide:chevron-down" size={18} />}
              classNames={{
                trigger: 'gap-4 rounded-full min-w-[120px] justify-between',
                menu: 'w-full right-0',
              }}
            />
          </div>
        }
      >
        {as == 'line' ? (
          <DynamicPrimarySalesAsLine year={selectedYear} />
        ) : (
          <DynamicPrimarySalesAsMixed />
        )}
      </PageSection>
    );
  });

DynamicPrimarySales.displayName = '_DynamicPrimarySales_';
