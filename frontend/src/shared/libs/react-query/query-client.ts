import { QueryClient } from '@tanstack/react-query';

import { getResponseError } from '#/shared/utils/get-error';

import { toast } from '../toast/toasts';

export const QueryOnError = async (error: any) => {
  try {
    const responseError = error?.response;
    const fallbackMessage = error?.message || 'Неизвестная ошибка';
    const data = responseError
      ? await getResponseError(responseError)
      : fallbackMessage;
    toast({
      message: 'Произошла ошибка',
      description: data || 'Неизвестная ошибка',
      type: 'error',
    });
  } catch (e) {
    console.error('Ошибка разбора ответа', e);
    toast({
      message: 'Произошла ошибка',
      description: JSON.stringify(e),
      type: 'error',
    });
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
