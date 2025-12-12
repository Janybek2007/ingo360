import React from 'react';

import { useSession } from '#/shared/session';

export const WelcomeMessage: React.FC = () => {
  const { user, setIsWelcomeShown } = useSession();

  const getRoleText = React.useCallback((role: string) => {
    const roles: Record<string, string> = {
      administrator: 'администратор',
      operator: 'оператор',
      customer: 'пользователь',
    };
    return roles[role] || role;
  }, []);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setIsWelcomeShown(false);
    }, 5000);

    return () => clearTimeout(timer);
  }, [setIsWelcomeShown]);

  if (!user) return null;

  const fullName = [user.last_name, user.first_name, user.patronymic]
    .filter(Boolean)
    .join(' ');

  return (
    <div className="fixed bottom-4 right-4 w-[90dvw] md:w-[30rem] z-[10000]">
      <div className="bg-white rounded-lg shadow-lg p-4 md:p-6 w-full border-l-4 border-blue-500">
        <button
          onClick={() => setIsWelcomeShown(false)}
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 transition-colors"
          aria-label="Закрыть"
        >
          <svg
            className="w-4 h-4 md:w-5 md:h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        <div className="flex items-start space-x-4 w-full">
          <div className="flex-shrink-0">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <svg
                className="w-5 h-5 md:w-6 md:h-6 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"
                />
              </svg>
            </div>
          </div>

          <div className="flex-1 w-full">
            <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-1">
              Добро пожаловать {getRoleText(user.role)}!
            </h3>
            <p className="text-gray-700 mb-2 text-sm md:text-base">
              <span className="font-medium">{fullName}</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
