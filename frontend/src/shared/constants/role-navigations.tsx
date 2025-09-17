import { routePaths } from '#/shared/router';

import {
  HomeIcon,
  MarketDevelopmentIcon,
  PrimarySalesIcon,
  SecondarySalesIcon,
  VisitActivityIcon,
} from '../components/icons';
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
      icon: <HomeIcon />,
    },
    {
      href: routePaths.customer.primarySales,
      label: 'Первичные продажи',
      icon: <PrimarySalesIcon />,
    },
    {
      href: routePaths.customer.secondarySales,
      label: 'Третичные продажи',
      icon: <SecondarySalesIcon />,
    },
    {
      href: routePaths.customer.marketDevelopment,
      label: 'Развитие рынков КР',
      icon: <MarketDevelopmentIcon />,
    },
    {
      href: routePaths.customer.visitActivity,
      label: 'Анализ визитной активности',
      icon: <VisitActivityIcon />,
    },
  ],
  administrator: [
    {
      href: routePaths.administrator.ingoAccounts,
      label: 'Учетные записи Индиго',
      icon: <Icon name="mdi:account-multiple" />,
    },
    {
      href: routePaths.administrator.clientAccounts,
      label: 'Учетные записи Клиентов',
      icon: <Icon name="mdi:account-group" />,
    },
    {
      href: routePaths.administrator.companyManagement,
      label: 'Управление компаниями',
      icon: <Icon name="mdi:office-building" />,
    },
    {
      href: routePaths.administrator.settingsAdmin,
      label: 'Настройки',
      icon: <Icon name="mdi:cog" />,
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
    {
      href: routePaths.operator.settingsOperator,
      label: 'Настройки',
      icon: <Icon name="mdi:cog" />,
    },
  ],
};
