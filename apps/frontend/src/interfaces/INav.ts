import { MouseEventHandler, ReactNode } from 'react';

export interface INavDropdown {
  Icon: ReactNode;
  items: Array<INavDropdownItems>;
  DropdownTitle?: string;
}

export interface INavDropdownItems {
  divider?: boolean;
  innerHtml: string | ReactNode;
  onClick?: MouseEventHandler<HTMLButtonElement> | undefined;
  permission?: string;
}
