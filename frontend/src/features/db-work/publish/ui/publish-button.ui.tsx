import React from 'react';

import { MdiPublishIcon } from '#/shared/assets/icons';
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
      className="rounded-full p-1.5 text-green-500 transition hover:bg-green-100"
      title="Опубликовать"
      disabled={mutation.isPending}
      onClick={() => mutation.mutateAsync([id])}
    >
      <MdiPublishIcon className="size-[1.125rem]" />
    </button>
  );
});

PublishButton.displayName = '_PublishButton_';
