import {
  keepPreviousData,
  type QueryKey,
  useQuery,
  type UseQueryOptions,
  type UseQueryResult,
} from '@tanstack/react-query';
import { useEffect } from 'react';

let fetchingCount = 0;
let prevCursor: string | null = null;

export function useKeepQuery<
  TQueryFnData = unknown,
  TError = unknown,
  TData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey,
>(
  options: UseQueryOptions<TQueryFnData, TError, TData, TQueryKey>
): UseQueryResult<TData, TError> {
  const queryData = useQuery<TQueryFnData, TError, TData, TQueryKey>({
    ...options,
    placeholderData: keepPreviousData,
  });

  useEffect(() => {
    if (!queryData.isFetching) return;

    fetchingCount += 1;

    if (fetchingCount === 1) {
      prevCursor = document.body.style.cursor || '';
      document.body.style.cursor = 'wait'; // или 'wait'
    }

    return () => {
      fetchingCount = Math.max(0, fetchingCount - 1);
      if (fetchingCount === 0) {
        document.body.style.cursor = prevCursor ?? '';
        prevCursor = null;
      }
    };
  }, [queryData.isFetching]);

  return queryData;
}
