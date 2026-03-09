import type { ColumnFiltersState, SortingState } from '@tanstack/react-table';
import React from 'react';
import useLocalStorageState from 'use-local-storage-state';

import {
  type IGetReferencesResponse,
  ReferenceQueries,
} from '#/entities/reference';
import { AsyncBoundary } from '#/shared/components/async-boundry';
import { Pagination } from '#/shared/components/pagination';
import { Tabs } from '#/shared/components/ui/tabs';
import { WORK_FILTER_KEY_MAP } from '#/shared/constants/filters-key-map';
import { FiltersContext } from '#/shared/context/filters';
import { useKeepQuery } from '#/shared/hooks/use-keep-query';
import { usePagination } from '#/shared/hooks/use-pagination';
import type { PaginationResponse } from '#/shared/types/global';
import type { ReferencesType } from '#/shared/types/references.type';
import {
  transformColumnFiltersToPayload,
  transformSortingToPayload,
} from '#/shared/utils/transform';
import { ReferenceWork } from '#/widgets/operator/reference-work';

import { tabsItems } from './constants';

const DEFAULT_LIMIT = 250;
const DEFAULT_DATA = {
  hasNext: false,
  hasPrev: false,
  result: [],
  count: 0,
};

const ReferenceWorkPage: React.FC = () => {
  const [filters, setFilters] = React.useState<ColumnFiltersState>([]);
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const { setLimit, ...pagination } = usePagination({
    defaultLimit: DEFAULT_LIMIT,
    defaultOffset: 0,
  });

  const [data, setData] =
    React.useState<PaginationResponse<IGetReferencesResponse>>(DEFAULT_DATA);
  const [current, setCurrent] = useLocalStorageState('reference-work-tab', {
    defaultValue: 'geography/countries',
  });

  const previousCurrentReference = React.useRef(current);
  const tabChangingReference = React.useRef(false);

  const queryData = useKeepQuery(
    ReferenceQueries.GetReferencesQuery<
      PaginationResponse<IGetReferencesResponse>
    >([current], {
      limit: pagination.limit,
      offset: pagination.offset,
      ...transformColumnFiltersToPayload(filters, WORK_FILTER_KEY_MAP),
      ...transformSortingToPayload(sorting, WORK_FILTER_KEY_MAP),
      method: 'POST',
    })
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
          defaultLimit={DEFAULT_LIMIT}
          currentData={data.result}
          current={current as ReferencesType}
          rowsCount={pagination.limit}
          setRowsCount={setLimit}
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
        />{' '}
      </FiltersContext.Provider>
    </main>
  );
};

export default ReferenceWorkPage;
