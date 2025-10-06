export const ROLES = ['administrator', 'operator', 'customer'] as const;
export const STATUSES = ['active', 'inactive'] as const;

export const ROLES_OBJECT = {
  administrator: 'Администратор',
  operator: 'Оператор',
  customer: 'Клиент',
} as const;

export const STATUSES_OBJECT = {
  active: 'Активен',
  inactive: 'Неактивен',
} as const;
