import { IUser } from 'app/entities/user/user.model';
import { Color } from 'app/entities/enumerations/color.model';

export interface ICalendar {
  id: number;
  calendarName?: string | null;
  calendarDescription?: string | null;
  calendarColor?: Color | null;
  appUser?: Pick<IUser, 'id'> | null;
}

export type NewCalendar = Omit<ICalendar, 'id'> & { id: null };
