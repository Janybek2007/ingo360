import React from 'react';

import { PageSection } from '#/shared/components/page-section';
import { PeriodFilters } from '#/shared/components/period-filters';
import { Select } from '#/shared/components/ui/select';
import { UsedFilter } from '#/shared/components/used-filter';
import { usePeriodFilter } from '#/shared/hooks/use-period-filter';
import { getPeriodLabel } from '#/shared/utils/get-period-label';
import { getUsedItems } from '#/shared/utils/get-used-items';

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
    const [moneyType, setMoneyType] = React.useState<'money' | 'packaging'>(
      'money'
    );
    const [brand, setBrand] = React.useState<string>('');
    const [group, setGroup] = React.useState<string>('');
    const periodFilter = usePeriodFilter();

    const usedItems = React.useMemo(() => {
      const brandItems = [
        { value: 'brand1', label: 'Бренд 1' },
        { value: 'brand2', label: 'Бренд 2' },
        { value: 'brand3', label: 'Бренд 3' },
      ];

      const groupItems = [
        { value: 'group1', label: 'Группа 1' },
        { value: 'group2', label: 'Группа 2' },
        { value: 'group3', label: 'Группа 3' },
      ];

      return getUsedItems([
        {
          value: Array.isArray(periodFilter.selectedValues)
            ? periodFilter.selectedValues
            : [],
          getLabelFromValue: getPeriodLabel,
          onDelete: value => {
            const newValues = (
              Array.isArray(periodFilter.selectedValues)
                ? periodFilter.selectedValues
                : []
            ).filter(v => v !== value);
            periodFilter.handleValueChange(newValues);
          },
        },
        {
          value: brand,
          items: brandItems,
          onDelete: () => setBrand(''),
        },
        {
          value: group,
          items: groupItems,
          onDelete: () => setGroup(''),
        },
      ]);
    }, [periodFilter, brand, group]);

    const resetFilters = React.useCallback(() => {
      periodFilter.handleValueChange([]);
      setBrand('');
      setGroup('');
    }, [periodFilter]);

    return (
      <PageSection
        title={`Динамика первычных продаж в ${moneyType == 'money' ? 'деньгах' : 'упаковках'}`}
        legends={AsLegends[as]}
        headerEnd={
          <div className="flex items-center gap-4">
            {as == 'mixed' && (
              <Select<false, typeof moneyType>
                value={moneyType}
                setValue={setMoneyType}
                items={[
                  { value: 'money', label: 'Деньги' },
                  { value: 'packaging', label: 'Упаковка' },
                ]}
                triggerText="Деньги/Упаковка"
              />
            )}
            <Select<false, string>
              value={brand}
              setValue={setBrand}
              items={[
                { value: '', label: 'Все' },
                { value: 'brand1', label: 'Бренд 1' },
                { value: 'brand2', label: 'Бренд 2' },
                { value: 'brand3', label: 'Бренд 3' },
              ]}
              triggerText="Бренд"
              classNames={{ menu: 'w-[10rem]' }}
            />
            <Select<false, string>
              value={group}
              setValue={setGroup}
              items={[
                { value: '', label: 'Все' },
                { value: 'group1', label: 'Группа 1' },
                { value: 'group2', label: 'Группа 2' },
                { value: 'group3', label: 'Группа 3' },
              ]}
              triggerText="Группа"
              classNames={{ menu: 'w-[10rem]' }}
            />
            <PeriodFilters {...periodFilter} />
          </div>
        }
      >
        <div className="space-y-4">
          <UsedFilter usedItems={usedItems} resetFilters={resetFilters} />

          {as == 'line' ? (
            <DynamicPrimarySalesAsLine period={periodFilter.period} />
          ) : (
            <DynamicPrimarySalesAsMixed period={periodFilter.period} />
          )}
        </div>
      </PageSection>
    );
  });

DynamicPrimarySales.displayName = '_DynamicPrimarySales_';
