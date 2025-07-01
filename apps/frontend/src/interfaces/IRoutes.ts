import { IIcons } from './IIcons';

export interface IAuthToken {
  exp: number;
  jti: string;
  token_type: 'access' | 'refresh';
  user_id: number;
}

export interface ISidebarRoutes {
  key?: string;
  subscription?: boolean;
  icon?: (props: IIcons) => JSX.Element;
  title: string;
  path: string;
  subNav?: ISidebarRoutes[];
}

export enum IRole {
  TENANT = 'TENANT',
  ADMIN = 'ADMIN',
}
