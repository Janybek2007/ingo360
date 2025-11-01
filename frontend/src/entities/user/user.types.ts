import type { SessionRole } from '#/shared/types';

interface UserCompany {
  id: number;
  name: string;
}

export interface IUserItem {
  id: number;
  email: string;
  is_active: boolean;
  is_superuser: boolean;
  is_verified: boolean;
  first_name: string;
  last_name: string;
  patronymic: string;
  position?: string;
  phone_number: string;
  last_login: string;
  is_operator: boolean;
  is_admin: boolean;
  company_id: number;
  company: UserCompany;
  role: SessionRole;
}

export type GetUserResponse = IUserItem;
export type GetUsersResponse = GetUserResponse[];
