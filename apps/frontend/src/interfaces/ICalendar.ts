import { NavigateAction, View, Views, stringOrDate } from 'react-big-calendar';

import { IParentOwner } from 'interfaces/IPeoples';
import { IParentProperty } from 'interfaces/IProperties';
import { IParentTenant } from 'interfaces/ITenant';
import { IParentUnit } from 'interfaces/IUnits';

import { IUpcomingActivities } from './IUpcomingActivities';

export type Keys = keyof typeof Views;
export declare type CalendarViewType = (typeof Views)[Keys];
export declare type CalendarFilterModule = 'Property' | 'Unit' | 'Owner' | 'Tenant' | '';

export interface CalendarReturnProps {
  view: (typeof Views)[Keys];
  setView: (view: (typeof Views)[Keys]) => void;
  date: stringOrDate;
  setDate: (newDate: Date, view: View, action: NavigateAction) => void;
  onTodayClick: () => void;
}
export declare type CalendarEvents = IParentUnit | IParentOwner | IParentProperty | IParentTenant;
export interface ICalendar extends IUpcomingActivities {
  day?: number;
  month?: number;
  module?: CalendarFilterModule;
  year?: number;
  parent_property?: string | number;
  parent_property_name?: string;
  unit?: string | number;
  unit_name?: string;
  owner?: string | number;
  owner_first_name?: string;
  owner_last_name?: string;
  tenant?: string | number;
  tenant_first_name?: string;
  tenant_last_name?: string;
}

export declare type ICalendarAPI = ICalendar & (IParentUnit | IParentOwner | IParentProperty | IParentTenant);
export declare interface ICalendarList extends ICalendar {
  allDay: boolean;
  start: stringOrDate;
  end: stringOrDate;
}
