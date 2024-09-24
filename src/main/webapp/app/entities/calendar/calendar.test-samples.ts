import { Color } from 'app/entities/enumerations/color.model';

import { ICalendar, NewCalendar } from './calendar.model';

export const sampleWithRequiredData: ICalendar = {
  id: 70069,
  calendarName: 'Caledonia 24/365 SQL',
  calendarColor: Color['ORANGE'],
};

export const sampleWithPartialData: ICalendar = {
  id: 7362,
  calendarName: 'parse Assurance',
  calendarDescription: 'Massachusetts',
  calendarColor: Color['YELLOW'],
};

export const sampleWithFullData: ICalendar = {
  id: 76397,
  calendarName: 'Implementation Pound Cotton',
  calendarDescription: 'adapter',
  calendarColor: Color['YELLOW'],
};

export const sampleWithNewData: NewCalendar = {
  calendarName: 'Handcrafted Franc Reverse-engineered',
  calendarColor: Color['BLUE'],
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
