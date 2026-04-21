export const routePaths = {
  // Общие
  page404: '/404/',
  profile: '/profile',
  setPassword: '/users/set-password',

  superuser: '/home',

  // Auth
  auth: {
    login: '/auth/login',
    forgot: '/auth/forgot',
    resetPass: '/auth/reset-password',
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
  },

  // Operator
  operator: {
    dbWork: '/db-work',
    referenceWork: '/reference-work',
    reportLogs: '/report-logs',
  },
};

export const roleAccess = {
  customer: [
    routePaths.customer.home,
    routePaths.customer.primarySales,
    routePaths.customer.secondarySales,
    routePaths.customer.tertiarySales,
    routePaths.customer.marketDevelopment,
    routePaths.customer.visitActivity,
    routePaths.profile,
  ],
  administrator: [
    routePaths.administrator.ingoAccounts,
    routePaths.administrator.customerAccounts,
    routePaths.administrator.companyManagement,
    routePaths.profile,
  ],
  operator: [
    routePaths.operator.dbWork,
    routePaths.operator.referenceWork,
    routePaths.operator.reportLogs,
    routePaths.profile,
  ],
  superuser: [routePaths.superuser],
};
