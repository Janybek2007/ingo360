import React from 'react';

import { MdiPublishIcon } from '#/shared/components/icons';
import type { DbType } from '#/shared/types/db.type';

import { usePublishMutation } from '../publish.mutation';

export const PublishButton: React.FC<{
  id: number;
  type: DbType;
  currentStatus: boolean;
}> = React.memo(({ id, type, currentStatus }) => {
  const mutation = usePublishMutation(type, currentStatus);
  return (
    <button
      type="button"
      className="p-1.5 rounded-full text-green-500 hover:bg-green-100 transition"
      title="Опубликовать"
      disabled={mutation.isPending}
      onClick={() => mutation.mutateAsync([id])}
    >
      <MdiPublishIcon className="size-[1.125rem]" />
    </button>
  );
});

PublishButton.displayName = '_PublishButton_';
