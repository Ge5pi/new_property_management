import { ReactElement, ReactNode } from 'react';

import { IUser } from './IAvatar';
import { IIDName } from './IGeneral';

export declare type CustomOptionType = IIDName & { customOption: boolean };

export interface ISelectOption<T = string | number> {
  label: string;
  icon?: JSX.Element | ReactElement;
  value: T;
}

export interface IFilterOption {
  id: string | number;
  value: string | ReactNode;
}

export interface IAuditLogs {
  id?: number;
  created_by?: IUser;
  created_at?: string;
  text: string;
}
