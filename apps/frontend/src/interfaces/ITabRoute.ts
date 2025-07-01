import { URLSearchParamsInit } from 'react-router-dom';

export declare type TabClickEventType = (
  path: string | null,
  replace?: boolean | undefined,
  params?: URLSearchParamsInit | undefined,
  nestedPath?: string
) => void | undefined;

export interface ITabClick {
  handleTabClick?: TabClickEventType;
}
