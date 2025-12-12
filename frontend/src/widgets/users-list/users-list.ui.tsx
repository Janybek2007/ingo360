import { useQuery } from '@tanstack/react-query';
import React from 'react';

import { CompanyListItem } from '#/entities/company';
import { UserListItem, UserQueries } from '#/entities/user';
import { AsyncBoundary } from '#/shared/components/async-boundry';

export const UsersList: React.FC = React.memo(() => {
  const query = useQuery(UserQueries.GetUsersQuery());
  const [selectedCompany, setSelectedCompany] = React.useState<number | null>(
    null
  );

  const usersGroupped = React.useMemo(() => {
    if (!query.data) return [];

    return [...query.data]
      .sort((a, b) => {
        const getRolePriority = (user: typeof a) => {
          if (user.is_superuser) return 0;
          if (user.is_admin) return 1;
          if (user.is_operator) return 2;
          return 3;
        };

        return getRolePriority(a) - getRolePriority(b);
      })
      .filter(user => user.company?.id === selectedCompany);
  }, [query.data, selectedCompany]);

  const companies = React.useMemo(() => {
    if (!query.data) return [];
    const companyMap = new Map();
    query.data.forEach(user => {
      if (user.company) {
        if (!companyMap.has(user.company.id)) {
          companyMap.set(user.company.id, { ...user.company, userCount: 0 });
        }
        companyMap.get(user.company.id).userCount += 1;
      }
    });
    return Array.from(companyMap.values());
  }, [query.data]);

  return (
    <div className="container mx-auto max-w-2xl px-3 py-4">
      <AsyncBoundary isLoading={query.isLoading} queryError={query.error}>
        {!selectedCompany ? (
          <div className="flex flex-col gap-3">
            <h2 className="text-lg font-semibold">Выберите компанию:</h2>
            <div className="flex max-h-[calc(100vh-2rem)] flex-col gap-3 overflow-y-auto">
              {companies.map(company => (
                <CompanyListItem
                  key={company.id}
                  company={company}
                  onClick={() => setSelectedCompany(company.id)}
                />
              ))}
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            <button
              onClick={() => setSelectedCompany(null)}
              className="self-start px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
            >
              Назад к компаниям
            </button>
            <div className="flex max-h-[calc(100vh-2rem)] flex-col gap-3 overflow-y-auto">
              {usersGroupped.map((user, index) => (
                <div
                  key={user.id}
                  className="animate-in fade-in slide-in-from-bottom-2 duration-300"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <UserListItem user={user} />
                </div>
              ))}
            </div>
          </div>
        )}
      </AsyncBoundary>
    </div>
  );
});

UsersList.displayName = '_UsersList_';
