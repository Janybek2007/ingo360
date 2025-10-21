import {
  LucideRefreshCcwIcon,
  MdiDeleteIcon,
  MdiPencilIcon,
  MslAdminPanelSettingsRounded,
} from '../icons';
import type { IRowActionType } from './row-actions.types';

export const DEFAULT_ROW_ACTION_TYPE_ITEM: Record<
  IRowActionType,
  { label: string; icon: React.ReactNode }
> = {
  edit: {
    label: 'Редактировать',
    icon: <MdiPencilIcon className="size-[1.125rem]" />,
  },
  delete: {
    label: 'Удалить',
    icon: <MdiDeleteIcon className="size-[1.125rem]" />,
  },
  access_settings: {
    label: 'Настройки доступа',
    icon: <MslAdminPanelSettingsRounded className="size-[1.125rem]" />,
  },
  reset_password: {
    label: 'Сбросить пароль',
    icon: <LucideRefreshCcwIcon className="size-[1.125rem]" />,
  },
};
