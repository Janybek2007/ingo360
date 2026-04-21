import { useMutation } from '@tanstack/react-query';

import { http } from '#/shared/api';
import { QueryOnError } from '#/shared/libs/react-query';

export const useDownloadExcelMutation = () => {
  return useMutation({
    mutationKey: ['download-excel'],
    mutationFn: async ({ taskId }: { taskId: string }) => {
      return http.get(`exports/${taskId}/download`, {
        headers: {
          BROWSER_CONTENT: 'true',
        },
      });
    },
    onError: QueryOnError,
  });
};
