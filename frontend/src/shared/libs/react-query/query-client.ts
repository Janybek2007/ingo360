import { QueryClient } from '@tanstack/react-query';

import { getResponseError } from '#/shared/utils/get-error';

export const QueryOnError = async (error: any) => {
  const { toast } = await import('sonner');
  try {
    const data = await getResponseError(error.response);
    toast.error(data);
  } catch (e) {
    console.error('Ошибка разбора ответа', e);
  }
};

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 0,
      refetchOnWindowFocus: false,
      staleTime: 1000 * 60 * 3,
    },
    mutations: {
      retry: 0,
      onError: QueryOnError,
    },
  },
});
