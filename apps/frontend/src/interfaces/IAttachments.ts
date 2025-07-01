import { MouseEventHandler, ReactNode } from 'react';

import { IUser } from './IAvatar';

export declare type ModuleType =
  | 'dashboard'
  | 'properties'
  | 'units'
  | 'unit-types'
  | 'associations'
  | 'vendors'
  | 'rental-applications'
  | 'tenants'
  | 'business-information'
  | 'notes'
  | 'emails'
  | 'signatures'
  | 'announcements'
  | 'purchase-orders'
  | 'charges'
  | 'service-requests'
  | 'bank-accounts'
  | 'payments'
  | 'projects';

export interface IFileIDs {
  id: number;
  file: File;
}

export interface IFileInfo {
  unique_name: string;
  name: string;
  ext: string;
  file: File;
}

export interface IFileAttachment {
  minified?: boolean;
  file: File | IAttachments;
  backgroundClass?: string;
  onRemove?: MouseEventHandler<HTMLButtonElement> | undefined;
  children?: ReactNode;
  progress?: string | number;
}

export interface IFilePreview {
  name: string;
  fileType: string;
  bg?: 'light' | 'secondary';
  onClick?: MouseEventHandler<HTMLParagraphElement>;
  preview?: string;
  iconSize?: string;
  className?: string;
  size?: number;
}

export interface IAttachments {
  id?: number;
  name: string;
  created_by?: IUser;
  file: string;
  file_type: string;
  updated_at?: string;
}

export interface IUploadProgress {
  progress?: number;
  file_id: string;
}
