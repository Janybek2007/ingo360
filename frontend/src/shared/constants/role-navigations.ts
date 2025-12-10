import { routePaths } from '#/shared/router';

import type { SessionRole } from '../types';

export interface INavigationItem {
  href: string;
  label: string;
}

export const roleNavigations: Record<SessionRole, INavigationItem[]> = {
  customer: [
    {
      href: routePaths.customer.home,
      label: 'Главная',
    },
    {
      href: routePaths.customer.primarySales,
      label: 'Первичные продажи',
    },
    {
      href: routePaths.customer.secondarySales,
      label: 'Вторичные продажи',
    },
    {
      href: routePaths.customer.tertiarySales,
      label: 'Третичные продажи',
    },
    {
      href: routePaths.customer.marketDevelopment,
      label: 'Развитие рынков КР',
    },
    {
      href: routePaths.customer.visitActivity,
      label: 'Анализ визитной активности',
    },
  ],
  administrator: [
    {
      href: routePaths.administrator.ingoAccounts,
      label: 'Учетные записи Инго',
    },
    {
      href: routePaths.administrator.customerAccounts,
      label: 'Учетные записи Клиентов',
    },
    {
      href: routePaths.administrator.companyManagement,
      label: 'Управление компаниями',
    },
  ],
  operator: [
    {
      href: routePaths.operator.dbWork,
      label: 'Работа с БД',
    },
    {
      href: routePaths.operator.referenceWork,
      label: 'Работа со справочниками',
    },
    {
      href: routePaths.operator.reportLogs,
      label: 'Посмотреть логи отчетов',
    },
  ],
  superuser: [],
};
