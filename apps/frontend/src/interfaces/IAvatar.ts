export interface NameInitialsAvatarProps {
  name: string;
  suffixClassName?: string;
  bgClassName?: string;
  showName?: boolean;
  size?: number;
}

export interface IGroupedAvatarData {
  data: Array<NameInitialsAvatarProps>;
  maxAvatar?: number;
}

export interface IUser {
  slug?: string;
  id?: number | string;
  first_name?: string;
  last_name?: string;
  company_name?: string;
  email: string;
  roles: Array<number>;

  is_active?: boolean;
  is_staff?: boolean;
  is_superuser?: boolean;

  is_admin?: boolean;
  is_tenant?: boolean;
  is_subscription_staff?: boolean;
  purchased_subscription?: number;

  last_login?: string;
  mobile_number: string;
  other_information?: string;
  secondary_email?: string;
  telephone_number?: string;
  date_joined?: string;
  username: string;
}

export interface IRoles {
  id?: string | number;
  name: string;
  description?: string;
  groups: Array<number>;
}

export interface ICurrentUser extends IUser {
  groups?: Array<number>;
  group_names: Array<string>;
  permissions: Array<number>;
}
