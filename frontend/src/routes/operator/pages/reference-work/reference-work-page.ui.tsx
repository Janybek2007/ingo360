import type { ColumnFiltersState, SortingState } from '@tanstack/react-table';
import React from 'react';
import useLocalStorageState from 'use-local-storage-state';

import {
  type IGetReferencesResponse,
  ReferenceQueries,
} from '#/entities/reference';
import { Tabs } from '#/shared/components/ui/tabs';
import { WORK_FILTER_KEY_MAP } from '#/shared/constants/filters-key-map';
import { FiltersContext } from '#/shared/context/filters';
import { useKeepQuery } from '#/shared/hooks/use-keep-query';
import type { ReferencesType } from '#/shared/types/references.type';
import {
  transformColumnFiltersToPayload,
  transformSortingToPayload,
} from '#/shared/utils/transform';
import { ReferenceWork } from '#/widgets/operator/reference-work';

import { tabsItems } from './constants';

const ReferenceWorkPage: React.FC = () => {
  const [filters, setFilters] = React.useState<ColumnFiltersState>([]);
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [data, setData] = React.useState<IGetReferencesResponse>([]);

  const [current, setCurrent] = useLocalStorageState('reference-work-tab', {
    defaultValue: 'geography/countries',
  });
  const [rowsCount, setRowsCount] = React.useState<'all' | number>('all');

  const queryData = useKeepQuery(
    ReferenceQueries.GetReferencesQuery([current], {
      limit: rowsCount === 'all' ? undefined : rowsCount,
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
        saveCurrent={(current: ReferencesType) => setCurrent(current)}
        defaultValue={current}
        items={tabsItems}
      ></Tabs>
      <FiltersContext.Provider
        value={{ filters, setFilters, sorting, setSorting }}
      >
        <ReferenceWork
          currentData={data}
          current={current as ReferencesType}
          rowsCount={rowsCount}
          setRowsCount={setRowsCount}
          isLoading={queryData.isLoading}
          queryError={queryData.error}
        />{' '}
      </FiltersContext.Provider>
    </main>
  );
};

export default ReferenceWorkPage;
