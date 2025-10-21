import type { IRowActionType } from './row-actions.types';

export const DEFAULT_ROW_ACTION_TYPE_ITEM: Record<
  IRowActionType,
  { label: string; icon: { name: string; size: number } }
> = {
  edit: { label: 'Редактировать', icon: { name: 'lucide:pencil', size: 18 } },
  delete: { label: 'Удалить', icon: { name: 'lucide:trash', size: 18 } },
  access_settings: {
    label: 'Настройки доступа',
    icon: {
      name: 'lucide:settings',
      size: 18,
    },
  },
  reset_password: {
    label: 'Сбросить пароль',
    icon: {
      name: 'lucide:refresh-ccw',
      size: 18,
    },
  },
};
