import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import type { HTTPError } from 'ky';
import { useForm } from 'react-hook-form';

import { http } from '#/shared/api';
import { toast } from '#/shared/libs/toast/toasts';
import { getResponseError } from '#/shared/utils/get-error';

import type { TSendRequestContract } from './send-request.contract';
import { SendRequestContract } from './send-request.contract';

export const useSendRequestMutation = (callback?: VoidFunction) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<TSendRequestContract>({
    resolver: zodResolver(SendRequestContract),
  });
  const { mutateAsync, status } = useMutation({
    mutationKey: ['send-request'],
    mutationFn: (parsedBody: TSendRequestContract) => {
      return http
        .post('companies/registration-application', {
          json: parsedBody,
        })
        .json<{ id: number }>();
    },
    onSuccess: async response => {
      if (response.id) {
        callback?.();
        toast({ message: 'Заявка отправлена' });
      }
    },
    onError: async (error: HTTPError) => {
      try {
        const data = await getResponseError(error.response);
        setError('root', {
          type: 'manual',
          message: data,
        });
      } catch (error_) {
        console.error('Ошибка разбора ответа', error_);
      }
    },
  });

  const onSubmit = handleSubmit(async variables => {
    await mutateAsync(variables);
  });

  return {
    onSubmit,
    register,
    status,
    errors,
  };
};
