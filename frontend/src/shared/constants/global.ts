export const ROLES = ['admin', 'manager', 'user'] as const;
export const STATUSES = ['active', 'inactive'] as const;

export const ROLES_OBJECT = {
  admin: 'Администратор',
  manager: 'Менеджер',
  user: 'Пользователь',
} as const;

export const STATUSES_OBJECT = {
  active: 'Активен',
  inactive: 'Неактивен',
} as const;
