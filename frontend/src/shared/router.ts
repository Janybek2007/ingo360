export const routePaths = {
  // Общие
  page404: '/404/',
  profile: '/profile',
  setPassword: '/set-password',

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
  },

  // Operator
  operator: {
    dbWork: '/db-work',
    referenceWork: '/reference-work',
    logs: '/logs',
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
    routePaths.operator.logs,
    routePaths.profile,
  ],
};
