import type { ColumnFiltersState, SortingState } from '@tanstack/react-table';
import React from 'react';
import useLocalStorageState from 'use-local-storage-state';

import { DbQueries, type IGetDBItemResponse } from '#/entities/db';
import { AsyncBoundary } from '#/shared/components/async-boundry';
import { Pagination } from '#/shared/components/pagination';
import { Tabs } from '#/shared/components/ui/tabs';
import { WORK_FILTER_KEY_MAP } from '#/shared/constants/filters-key-map';
import { FiltersContext } from '#/shared/context/filters';
import { useKeepQuery } from '#/shared/hooks/use-keep-query';
import { usePagination } from '#/shared/hooks/use-pagination';
import type { DbType } from '#/shared/types/db.type';
import type { PaginationResponse } from '#/shared/types/global';
import {
  transformColumnFiltersToPayload,
  transformSortingToPayload,
} from '#/shared/utils/transform';
import { DbWork } from '#/widgets/operator/db-work';

import { tabsItems } from './constants';

const DEFAULT_LIMIT = 500;
const DEFAULT_DATA = {
  hasNext: false,
  hasPrev: false,
  result: [],
  count: 0,
};

const DatabaseWorkPage: React.FC = () => {
  const [filters, setFilters] = React.useState<ColumnFiltersState>([]);
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const { setLimit, ...pagination } = usePagination({
    defaultLimit: DEFAULT_LIMIT,
    defaultOffset: 0,
  });

  const [data, setData] =
    React.useState<PaginationResponse<IGetDBItemResponse>>(DEFAULT_DATA);
  const [current, setCurrent] = useLocalStorageState('db-work-tab', {
    defaultValue: 'sales_primary',
  });
  const [groupBy, setGroupBy] = React.useState<string[]>(() =>
    getDefaultGroupBy(current)
  );

  const previousCurrentReference = React.useRef(current);
  const tabChangingReference = React.useRef(false);

  const queryData = useKeepQuery(
    DbQueries.GetDbItemsQuery<PaginationResponse<IGetDBItemResponse>>(
      [current.replace('_', '/') as DbType],
      {
        limit: pagination.limit,
        offset: pagination.offset,
        group_by_dimensions: groupBy,
        ...transformColumnFiltersToPayload(filters, WORK_FILTER_KEY_MAP),
        ...transformSortingToPayload(sorting, WORK_FILTER_KEY_MAP),
        method: 'POST',
      }
    )
  );

  if (previousCurrentReference.current !== current) {
    previousCurrentReference.current = current;
    tabChangingReference.current = true;
  }

  if (tabChangingReference.current && !queryData.isFetching) {
    tabChangingReference.current = false;
  }

  const isTabChange = tabChangingReference.current;

  React.useEffect(() => {
    setFilters([]);
    setSorting([]);
    setData(DEFAULT_DATA);
    setLimit(DEFAULT_LIMIT);
  }, [current, setLimit]);

  React.useEffect(() => {
    if (queryData.isFetching || queryData.isLoading || !queryData.data?.[0])
      return;
    setData(queryData.data[0]);
  }, [queryData.data, queryData.isFetching, queryData.isLoading]);

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
          defaultLimit={DEFAULT_LIMIT}
          currentData={data.result}
          rowsCount={pagination.limit}
          setRowsCount={setLimit}
          onGroupChange={setGroupBy}
          boundary={children => (
            <AsyncBoundary
              isLoading={
                isTabChange ? queryData.isFetching : queryData.isLoading
              }
              queryError={queryData.error}
            >
              {children}
            </AsyncBoundary>
          )}
          pagination={
            data.count > pagination.limit && (
              <Pagination
                hasNext={data.hasNext}
                hasPrev={data.hasPrev}
                count={data.count}
                limit={pagination.limit}
                offset={pagination.offset}
                onNext={pagination.next}
                onPrev={pagination.prev}
              />
            )
          }
        />
      </FiltersContext.Provider>
    </main>
  );
};

export default DatabaseWorkPage;

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
