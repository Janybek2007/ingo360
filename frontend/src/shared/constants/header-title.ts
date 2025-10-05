import { routePaths } from '../router';

export const headerTitle: Record<string, string> = {
  [routePaths.profile]: 'Профиль',

  [routePaths.customer.home]: 'Добро пожаловать 👋🏻',
  [routePaths.customer.primarySales]: 'Первичные продажи',
  [routePaths.customer.tertiarySales]: 'Вторичные продажи',
  [routePaths.customer.secondarySales]: 'Третичные продажи',
  [routePaths.customer.marketDevelopment]: 'Развитие рынков КР',
  [routePaths.customer.visitActivity]: 'Анализ визитной активности',

  [routePaths.administrator.ingoAccounts]: 'Учетные записи Инго',
  [routePaths.administrator.customerAccounts]:
    'Управление уч. записями клиентов',
  [routePaths.administrator.companyManagement]: 'Управление компаниями',

  [routePaths.operator.dbWork]: 'Работа с базами данных',
  [routePaths.operator.referenceWork]: 'Работа со справочниками',
  [routePaths.operator.logs]: 'Просмотреть логи отчетов',
};
