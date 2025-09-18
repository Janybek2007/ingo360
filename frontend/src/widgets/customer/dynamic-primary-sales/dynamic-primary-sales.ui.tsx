import React, { useState } from 'react';

import { PageSection } from '#/shared/components/page-section';

import { DynamicPrimarySalesAsLine } from './ui/as-line.ui';
import { DynamicPrimarySalesAsMixed } from './ui/as-mixed.ui';

const AsLegends = {
  line: [{ label: 'Первичные продажи', fill: '#0B5A7C' }],
  mixed: [
    { label: 'Третичка', fill: '#00B050' },
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
          <select
            className="border px-3 py-1 rounded cursor-pointer"
            value={selectedYear}
            onChange={e => setSelectedYear(Number(e.target.value))}
          >
            {years.map(year => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        }
        background="white"
        variant={as === 'mixed' ? 'border' : 'background'}
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
