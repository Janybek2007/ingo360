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
      icon: <Icon className="size-[1.25rem]" name="lucide:layout-dashboard" />,
    },
    {
      href: routePaths.customer.primarySales,
      label: 'Первичные продажи',
      icon: <Icon className="size-[1.25rem]" name="solar:chart-2-bold" />,
    },
    {
      href: routePaths.customer.secondarySales,
      label: 'Вторичные продажи',
      icon: <Icon className="size-[1.25rem]" name="charm:chart-bar" />,
    },
    {
      href: routePaths.customer.tertiarySales,
      label: 'Третичные продажи',
      icon: (
        <Icon
          className="size-[1.25rem]"
          name="fluent:arrow-trending-lines-24-regular"
        />
      ),
    },
    {
      href: routePaths.customer.marketDevelopment,
      label: 'Развитие рынков КР',
      icon: (
        <Icon
          className="size-[1.25rem]"
          name="fluent:data-trending-16-regular"
        />
      ),
    },
    {
      href: routePaths.customer.visitActivity,
      label: 'Анализ визитной активности',
      icon: (
        <Icon
          className="size-[1.25rem]"
          name="material-symbols:analytics-rounded"
        />
      ),
    },
  ],
  administrator: [
    {
      href: routePaths.administrator.ingoAccounts,
      label: 'Учетные записи Инго',
      icon: <Icon className="size-[1.25rem]" name="mdi:account-multiple" />,
    },
    {
      href: routePaths.administrator.customerAccounts,
      label: 'Учетные записи Клиентов',
      icon: <Icon className="size-[1.25rem]" name="mdi:account-group" />,
    },
    {
      href: routePaths.administrator.companyManagement,
      label: 'Управление компаниями',
      icon: <Icon className="size-[1.25rem]" name="mdi:office-building" />,
    },
    {
      href: routePaths.administrator.logs,
      label: 'Посмотреть логи отчетов',
      icon: (
        <Icon className="size-[1.25rem]" name="mdi:file-document-outline" />
      ),
    },
  ],
  operator: [
    {
      href: routePaths.operator.dbWork,
      label: 'Работа с БД',
      icon: <Icon className="size-[1.25rem]" name="mdi:database" />,
    },
    {
      href: routePaths.operator.referenceWork,
      label: 'Работа со справочниками',
      icon: (
        <Icon className="size-[1.25rem]" name="mdi:book-open-page-variant" />
      ),
    },
  ],
};
