import dayjs from 'dayjs/esm';
import { IUser } from 'app/entities/user/user.model';
import { ICalendar } from 'app/entities/calendar/calendar.model';
import { Color } from 'app/entities/enumerations/color.model';
import { EventType } from 'app/entities/enumerations/event-type.model';
import { RepeatType } from 'app/entities/enumerations/repeat-type.model';

export interface IEvent {
  id: number;
  eventName?: string | null;
  eventDescription?: string | null;
  eventColor?: Color | null;
  eventType?: EventType | null;
  eventStart?: dayjs.Dayjs | null;
  eventEnd?: dayjs.Dayjs | null;
  eventRepeat?: RepeatType | null;
  eventLocation?: string | null;
  appUser?: Pick<IUser, 'id'> | null;
  calendar?: Pick<ICalendar, 'id'> | null;
}

export type NewEvent = Omit<IEvent, 'id'> & { id: null };
