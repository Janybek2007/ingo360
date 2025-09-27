import type { SessionRole } from '#/shared/types';

export interface GetUserResponse {
  id: number;
  email: string;
  is_active: boolean;
  is_superuser: boolean;
  is_verified: boolean;
  first_name: string;
  last_name: string;
  patronymic: string;
  phone_number: string;
  last_login: string;
  is_staff: boolean;
  is_admin: boolean;
  role: SessionRole;
}
