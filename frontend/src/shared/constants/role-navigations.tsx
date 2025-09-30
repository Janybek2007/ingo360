import { routePaths } from '#/shared/router';

import { Icon } from '../components/ui/icon';
import type { SessionRole } from '../types';

export interface INavigationItem {
  href: string;
  label: string;
  icon: React.ReactNode;
}

export const roleNavigations: Record<SessionRole, INavigationItem[]> = {
  customer: [
    {
      href: routePaths.customer.home,
      label: 'Главная',
      icon: <Icon name="lucide:layout-dashboard" />,
    },
    {
      href: routePaths.customer.primarySales,
      label: 'Первичные продажи',
      icon: <Icon name="solar:chart-2-bold" />,
    },
    {
      href: routePaths.customer.secondarySales,
      label: 'Вторичные продажи',
      icon: <Icon name="charm:chart-bar" />,
    },
    {
      href: routePaths.customer.tertiarySales,
      label: 'Третичные продажи',
      icon: <Icon name="fluent:arrow-trending-lines-24-regular" />,
    },
    {
      href: routePaths.customer.marketDevelopment,
      label: 'Развитие рынков КР',
      icon: <Icon name="fluent:data-trending-16-regular" />,
    },
    {
      href: routePaths.customer.visitActivity,
      label: 'Анализ визитной активности',
      icon: <Icon name="material-symbols:analytics-rounded" />,
    },
  ],
  administrator: [
    {
      href: routePaths.administrator.ingoAccounts,
      label: 'Учетные записи Инго',
      icon: <Icon name="mdi:account-multiple" />,
    },
    {
      href: routePaths.administrator.customerAccounts,
      label: 'Учетные записи Клиентов',
      icon: <Icon name="mdi:account-group" />,
    },
    {
      href: routePaths.administrator.companyManagement,
      label: 'Управление компаниями',
      icon: <Icon name="mdi:office-building" />,
    },
  ],
  operator: [
    {
      href: routePaths.operator.dbWork,
      label: 'Работа с БД',
      icon: <Icon name="mdi:database" />,
    },
    {
      href: routePaths.operator.referenceWork,
      label: 'Работа со справочниками',
      icon: <Icon name="mdi:book-open-page-variant" />,
    },
    {
      href: routePaths.operator.logs,
      label: 'Посмотреть логи от...',
      icon: <Icon name="mdi:file-document-outline" />,
    },
  ],
};
