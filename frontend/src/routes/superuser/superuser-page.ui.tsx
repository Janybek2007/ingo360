import React from 'react';

import { LogoutButton } from '#/features/session/logout';
import { LazySection, SectionSkeleton } from '#/shared/components/lazy-section';
import { CheckSession } from '#/shared/session';
import { UsersList } from '#/widgets/users-list';

const SuperUserPage: React.FC = () => {
  return (
    <CheckSession>
      <div className="relative container mx-auto h-full w-full max-w-2xl">
        <div className="absolute top-5 right-6">
          <LogoutButton className="p-0 [&_span]:text-base [&_svg]:size-[1.25rem]" />
        </div>
        <LazySection fallback={<SectionSkeleton hasSection={false} />}>
          <UsersList />
        </LazySection>
      </div>
    </CheckSession>
  );
};

export default SuperUserPage;
