import { useQuery } from '@tanstack/react-query';
import React from 'react';

import { UserListItem, UserQueries } from '#/entities/user';
import { AsyncBoundary } from '#/shared/components/async-boundry';

import { GroupItem } from './ui/group-item.ui';

type SelectedGroup =
  | { type: 'company'; id: number }
  | { type: 'operators' }
  | { type: 'admins' }
  | null;

export const UsersList: React.FC = React.memo(() => {
  const query = useQuery(UserQueries.GetUsersQuery());
  const [selectedGroup, setSelectedGroup] = React.useState<SelectedGroup>(null);

  /**
   * Фильтр пользователей по выбранной группе
   */
  const usersFiltered = React.useMemo(() => {
    if (!query.data || !selectedGroup) return [];

    return [...query.data]
      .filter(user => !user.is_superuser)
      .filter(user => {
        switch (selectedGroup.type) {
          case 'company':
            return user.company?.id === selectedGroup.id;

          case 'operators':
            return user.is_operator;

          case 'admins':
            return user.is_admin;

          default:
            return false;
        }
      });
  }, [query.data, selectedGroup]);

  /**
   * Подсчёты для групп
   */
  const {
    companies = [],
    operatorsCount = 0,
    adminsCount = 0,
  } = React.useMemo(() => {
    if (!query.data) return {};

    const companyMap = new Map<number, any>();
    let operators = 0;
    let admins = 0;

    query.data.forEach(user => {
      if (user.is_operator) operators++;
      if (user.is_admin) admins++;

      if (user.company) {
        if (!companyMap.has(user.company.id)) {
          companyMap.set(user.company.id, {
            ...user.company,
            userCount: 0,
          });
        }
        companyMap.get(user.company.id).userCount += 1;
      }
    });

    return {
      companies: Array.from(companyMap.values()),
      operatorsCount: operators,
      adminsCount: admins,
    };
  }, [query.data]);

  return (
    <div className="container mx-auto max-w-2xl px-3 py-4">
      <AsyncBoundary isLoading={query.isLoading} queryError={query.error}>
        {!selectedGroup ? (
          <div className="flex flex-col gap-6">
            {/* Companies */}
            <div className="space-y-2">
              <h2 className="text-lg font-semibold">Выберите компанию:</h2>

              <div className="flex flex-col gap-2">
                {companies.map(company => (
                  <GroupItem
                    key={company.id}
                    group={{ name: company.name, count: company.userCount }}
                    onClick={() =>
                      setSelectedGroup({ type: 'company', id: company.id })
                    }
                  />
                ))}
              </div>
            </div>

            {/* Other */}
            <div className="space-y-2">
              <h2 className="text-lg font-semibold">Другие:</h2>

              <div className="flex flex-col gap-2">
                <GroupItem
                  group={{ name: 'Операторы', count: operatorsCount }}
                  onClick={() => setSelectedGroup({ type: 'operators' })}
                />
                <GroupItem
                  group={{ name: 'Админы', count: adminsCount }}
                  onClick={() => setSelectedGroup({ type: 'admins' })}
                />
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            <button
              onClick={() => setSelectedGroup(null)}
              className="self-start rounded-lg bg-gray-500 px-4 py-2 text-white hover:bg-gray-600 transition"
            >
              Назад
            </button>

            <div className="flex max-h-[calc(100vh-2rem)] flex-col gap-3 overflow-y-auto">
              {usersFiltered.map((user, index) => (
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
