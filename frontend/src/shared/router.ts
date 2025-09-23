export const routePaths = {
  // Общие
  page404: '/404/',

  // Auth
  auth: {
    login: '/auth/login',
    forgot: '/auth/forgot',
    resetPass: '/auth/reset-pass',
  },

  // Customer
  customer: {
    home: '/',
    primarySales: '/primary-sales',
    tertiarySales: '/tertiary-sales',
    secondarySales: '/secondary-sales',
    marketDevelopment: '/market-development',
    visitActivity: '/visit-activity',
  },

  // Administrator
  administrator: {
    ingoAccounts: '/ingo-accounts',
    customerAccounts: '/customer-accounts',
    companyManagement: '/company-management',
    settingsAdmin: '/a/settings',
  },

  // Operator
  operator: {
    dbWork: '/db-work',
    referenceWork: '/reference-work',
    logs: '/logs',
    settingsOperator: '/o/settings',
  },
};
