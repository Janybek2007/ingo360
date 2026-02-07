import type { ColumnFiltersState, SortingState } from '@tanstack/react-table';
import React from 'react';
import useLocalStorageState from 'use-local-storage-state';

import { DbQueries, type IGetDBItemResponse } from '#/entities/db';
import { Tabs } from '#/shared/components/ui/tabs';
import { WORK_FILTER_KEY_MAP } from '#/shared/constants/filters-key-map';
import { FiltersContext } from '#/shared/context/filters';
import { useKeepQuery } from '#/shared/hooks/use-keep-query';
import type { DbType } from '#/shared/types/db.type';
import {
  transformColumnFiltersToPayload,
  transformSortingToPayload,
} from '#/shared/utils/transform';
import { DbWork } from '#/widgets/operator/db-work';

import { tabsItems } from './constants';

const DbWorkPage: React.FC = () => {
  const [filters, setFilters] = React.useState<ColumnFiltersState>([]);
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [data, setData] = React.useState<IGetDBItemResponse>([]);

  const [rowsCount, setRowsCount] = React.useState<'all' | number>('all');
  const [current, setCurrent] = useLocalStorageState('db-work-tab', {
    defaultValue: 'sales_primary',
  });

  const [groupBy, setGroupBy] = React.useState<string[]>(() =>
    getDefaultGroupBy(current)
  );

  const queryData = useKeepQuery(
    DbQueries.GetDbItemsQuery([current.replace('_', '/') as DbType], {
      limit: rowsCount === 'all' ? undefined : rowsCount,
      group_by_dimensions: groupBy,
      ...transformColumnFiltersToPayload(filters, WORK_FILTER_KEY_MAP),
      ...transformSortingToPayload(sorting, WORK_FILTER_KEY_MAP),
      method: 'POST',
    })
  );

  React.useEffect(() => {
    setFilters([]);
    setSorting([]);
    setData([]);
    setRowsCount('all');
  }, [current]);

  React.useEffect(() => {
    if (queryData.isLoading || !queryData.data?.[0]) return;

    setData(queryData.data[0]);
  }, [queryData.data, queryData.isLoading]);

  return (
    <main>
      <Tabs
        items={tabsItems}
        defaultValue={current}
        saveCurrent={value => {
          setCurrent(value);
          setGroupBy(getDefaultGroupBy(value));
        }}
      />
      <FiltersContext.Provider
        value={{ filters, setFilters, sorting, setSorting }}
      >
        <DbWork
          current={current}
          currentData={data}
          rowsCount={rowsCount}
          setRowsCount={setRowsCount}
          groupBy={groupBy}
          onGroupChange={setGroupBy}
          isLoading={queryData.isFetching}
          queryError={queryData.error}
        />
      </FiltersContext.Provider>
    </main>
  );
};

export default DbWorkPage;

function getDefaultGroupBy(current: string) {
  if (current === 'sales_primary') {
    return ['distributor', 'brand', 'sku'];
  }

  if (['sales_secondary', 'sales_tertiary'].includes(current)) {
    return ['distributor', 'brand', 'sku', 'pharmacy'];
  }

  if (current === 'visits') {
    return [
      'pharmacy',
      'employee',
      'product_group',
      'medical_facility',
      'doctor',
      'client_type',
    ];
  }

  return [];
}
