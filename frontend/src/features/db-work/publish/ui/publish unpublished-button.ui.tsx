import React from 'react';

import { Button } from '#/shared/components/ui/button';
import type { DbType } from '#/shared/types/db.type';

import { usePublishMutation } from '../publish.mutation';

export const PublishUnpublishedButton: React.FC<{
  ids: number[];
  type: DbType;
  disabled?: boolean;
}> = React.memo(({ ids, type, disabled }) => {
  const mutation = usePublishMutation(type, false);
  return (
    <Button
      disabled={disabled}
      className="px-4 py-2 rounded-full"
      onClick={() => mutation.mutateAsync(ids)}
    >
      Опубликовать неопубликованные
    </Button>
  );
});

PublishUnpublishedButton.displayName = '_PublishUnpublishedButton_';
