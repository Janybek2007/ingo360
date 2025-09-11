import { routePaths } from '#/shared/router';
import {
	HomeIcon,
	MarketDevelopmentKRIcon,
	PrimarySalesIcon,
	SecondarySalesIcon,
	VisitActivityIcon
} from '../components/icons';

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
			icon: <HomeIcon />
		},
		{
			href: routePaths.customer.primarySales,
			label: 'Первичные продажи',
			icon: <PrimarySalesIcon />
		},
		{
			href: routePaths.customer.secondarySales,
			label: 'Третичные продажи',
			icon: <SecondarySalesIcon />
		},
		{
			href: routePaths.customer.marketDevelopmentKR,
			label: 'Развитие рынков КР',
			icon: <MarketDevelopmentKRIcon />
		},
		{
			href: routePaths.customer.visitActivity,
			label: 'Анализ визитной активности',
			icon: <VisitActivityIcon />
		}
	],
	administrator: [
		{
			href: routePaths.administrator.ingoAccounts,
			label: 'Учетные записи Индиго',
			icon: 'mdi:account-multiple'
		},
		{
			href: routePaths.administrator.clientAccounts,
			label: 'Учетные записи Клиентов',
			icon: 'mdi:account-group'
		},
		{
			href: routePaths.administrator.companyManagement,
			label: 'Управление компаниями',
			icon: 'mdi:office-building'
		},
		{
			href: routePaths.administrator.settingsAdmin,
			label: 'Настройки',
			icon: 'mdi:cog'
		}
	],
	operator: [
		{
			href: routePaths.operator.dbWork,
			label: 'Работа с БД',
			icon: 'mdi:database'
		},
		{
			href: routePaths.operator.referenceWork,
			label: 'Работа со справочниками',
			icon: 'mdi:book-open-page-variant'
		},
		{
			href: routePaths.operator.logs,
			label: 'Посмотреть логи от...',
			icon: 'mdi:file-document-outline'
		},
		{
			href: routePaths.operator.settingsOperator,
			label: 'Настройки',
			icon: 'mdi:cog'
		}
	]
};
