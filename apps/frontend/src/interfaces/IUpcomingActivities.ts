import { IUser } from './IAvatar';
import { GeneralLabels } from './ISettings';

export interface IUpcomingActivities {
  id?: number | string;
  description: string;
  title: string;
  date: string;
  start_time?: string;
  end_time?: string;
  label?: GeneralLabels | number;
  label_name?: string;
  assign_to_first_name?: string;
  assign_to_last_name?: string;
  assign_to_username?: string;
  assign_to?: IUser | number;
  status?: boolean;
}
