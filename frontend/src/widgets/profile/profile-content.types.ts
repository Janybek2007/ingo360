export type TTabType = 'account-settings' | 'help';

export interface IUserSidebarProps {
  activeTab: TTabType;
  setActiveTab: React.Dispatch<React.SetStateAction<TTabType>>;
}
