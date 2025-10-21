import React from 'react';

import { PageSection } from '#/shared/components/page-section';
import { PeriodFilters } from '#/shared/components/period-filters';
import { Select } from '#/shared/components/ui/select';
import { UsedFilter } from '#/shared/components/used-filter';
import { BRANDS, GROUPS } from '#/shared/constants/test_constants';
import { usePeriodFilter } from '#/shared/hooks/use-period-filter';
import { getPeriodLabel } from '#/shared/utils/get-period-label';
import { getUsedFilterItems } from '#/shared/utils/get-used-items';

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

    const usedFilterItems = React.useMemo(() => {
      return getUsedFilterItems([
        {
          value: periodFilter.selectedValues,
          getLabelFromValue: getPeriodLabel,
          onDelete: value => {
            const newValues = periodFilter.selectedValues.filter(
              v => v !== value
            );
            periodFilter.onChange(newValues);
          },
        },
        { value: brand, items: BRANDS, onDelete: () => setBrand('') },
        { value: group, items: GROUPS, onDelete: () => setGroup('') },
      ]);
    }, [periodFilter, brand, group]);

    const resetFilters = React.useCallback(() => {
      periodFilter.onReset();
      setBrand('');
      setGroup('');
      periodFilter.setPeriod('month');
    }, [periodFilter]);

    return (
      <PageSection
        title={`Динамика первичных продаж в ${moneyType == 'money' ? 'деньгах' : 'упаковках'}`}
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
              items={[{ value: '', label: 'Все' }, ...BRANDS]}
              triggerText="Бренд"
              changeTriggerText
              labelTemplate="Бренд: {label}"
              classNames={{ menu: 'w-[10rem]' }}
            />
            <Select<false, string>
              value={group}
              setValue={setGroup}
              items={[{ value: '', label: 'Все' }, ...GROUPS]}
              triggerText="Группа"
              changeTriggerText
              labelTemplate="Группа: {label}"
              classNames={{ menu: 'w-[10rem]' }}
            />
            <PeriodFilters isSelectValues={as == 'mixed'} {...periodFilter} />
          </div>
        }
      >
        <div className="space-y-4">
          <UsedFilter
            usedFilterItems={usedFilterItems}
            resetFilters={resetFilters}
          />

          {as == 'line' ? (
            <DynamicPrimarySalesAsLine period={periodFilter.period} />
          ) : (
            <DynamicPrimarySalesAsMixed
              period={periodFilter.period}
              selectedValues={periodFilter.selectedValues}
            />
          )}
        </div>
      </PageSection>
    );
  });

DynamicPrimarySales.displayName = '_DynamicPrimarySales_';
