import { ReactNode } from 'react';

export declare type IAlertType = 'success' | 'danger' | 'warning' | 'info';
export interface IConfirmation {
  type: IAlertType;
  title?: string;
  description: string | ReactNode;
}

export interface IPleaseWait {
  description?: string | ReactNode;
}
