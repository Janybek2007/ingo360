import {
  keepPreviousData,
  type QueryKey,
  useQuery,
  type UseQueryOptions,
  type UseQueryResult,
} from '@tanstack/react-query';
import { useEffect } from 'react';

let fetchingCount = 0;

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
      document.body.classList.add('wait-cursor');
    }

    return () => {
      fetchingCount = Math.max(0, fetchingCount - 1);

      if (fetchingCount === 0) {
        document.body.classList.remove('wait-cursor');
      }
    };
  }, [queryData.isFetching]);

  return queryData;
}
