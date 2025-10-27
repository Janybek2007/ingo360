import { routePaths } from '../router';

export const headerTitle: Record<string, string> = {
  [routePaths.profile]: 'Профиль',

  [routePaths.customer.primarySales]: 'Первичные продажи',
  [routePaths.customer.tertiarySales]: 'Третичные продажи',
  [routePaths.customer.secondarySales]: 'Вторичные продажи',
  [routePaths.customer.marketDevelopment]: 'Развитие рынков КР',
  [routePaths.customer.visitActivity]: 'Анализ визитной активности',

  [routePaths.administrator.customerAccounts]:
    'Управление уч. записями клиентов',
  [routePaths.administrator.companyManagement]: 'Управление компаниями',

  [routePaths.operator.dbWork]: 'Работа с базами данных',
  [routePaths.operator.referenceWork]: 'Работа со справочниками',
  [routePaths.operator.reportLogs]: 'Логи отчетов',
};
