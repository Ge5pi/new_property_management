import { URLSearchParamsInit } from 'react-router-dom';

export declare type INavigateParam = {
  path: string | null;
  replace?: boolean | undefined;
  params?: URLSearchParamsInit | undefined;
  nestedPath?: string;
};

export declare type NavigationEventType = (options: INavigateParam) => void | undefined;
export interface INavigationRedirect {
  handleNavigation?: NavigationEventType;
}
