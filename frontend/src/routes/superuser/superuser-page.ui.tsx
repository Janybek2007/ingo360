import React from 'react';

import { LazySection, SectionSkeleton } from '#/shared/components/lazy-section';
import { CheckSession } from '#/shared/session';
import { UsersList } from '#/widgets/users-list';

const SuperUserPage: React.FC = () => {
  return (
    <CheckSession>
      <div className="w-full h-full">
        <LazySection fallback={<SectionSkeleton hasSection={false} />}>
          <UsersList />
        </LazySection>
      </div>
    </CheckSession>
  );
};

export default SuperUserPage;
