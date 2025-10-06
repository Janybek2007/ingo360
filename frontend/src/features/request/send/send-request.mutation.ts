import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import type { HTTPError } from 'ky';
import { useForm } from 'react-hook-form';

import { http } from '#/shared/api';
import { getError } from '#/shared/utils/get-error';

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
          body: JSON.stringify(parsedBody),
        })
        .json<{ id: number }>();
    },
    onSuccess: async response => {
      const { toast } = await import('sonner');
      if (response.id) {
        callback?.();
        toast.success('Заявка отправлена');
      }
    },
    onError: async (error: HTTPError) => {
      try {
        const data = await getError(error.response);
        setError('root', {
          type: 'manual',
          message: data,
        });
      } catch (e) {
        console.error('Ошибка разбора ответа', e);
      }
    },
  });

  const onSubmit = handleSubmit(async vars => {
    await mutateAsync(vars);
  });

  return {
    onSubmit,
    register,
    status,
    errors,
  };
};
