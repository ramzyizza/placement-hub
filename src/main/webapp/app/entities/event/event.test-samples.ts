import dayjs from 'dayjs/esm';

import { Color } from 'app/entities/enumerations/color.model';
import { EventType } from 'app/entities/enumerations/event-type.model';
import { RepeatType } from 'app/entities/enumerations/repeat-type.model';

import { IEvent, NewEvent } from './event.model';

export const sampleWithRequiredData: IEvent = {
  id: 63022,
  eventName: 'Cotton',
  eventType: EventType['INTERVIEW'],
  eventStart: dayjs('2024-03-05T15:24'),
  eventEnd: dayjs('2024-03-05T18:01'),
  eventRepeat: RepeatType['DAILY'],
};

export const sampleWithPartialData: IEvent = {
  id: 72471,
  eventName: 'transform one-to-one',
  eventType: EventType['AC'],
  eventStart: dayjs('2024-03-05T02:17'),
  eventEnd: dayjs('2024-03-05T15:17'),
  eventRepeat: RepeatType['MONTHLY'],
};

export const sampleWithFullData: IEvent = {
  id: 981,
  eventName: 'generating Tuna coherent',
  eventDescription: 'virtual',
  eventColor: Color['PINK'],
  eventType: EventType['AC'],
  eventStart: dayjs('2024-03-04T22:51'),
  eventEnd: dayjs('2024-03-05T03:03'),
  eventRepeat: RepeatType['WEEKLY'],
  eventLocation: 'hacking',
};

export const sampleWithNewData: NewEvent = {
  eventName: 'Plastic mint Locks',
  eventType: EventType['AC'],
  eventStart: dayjs('2024-03-05T00:43'),
  eventEnd: dayjs('2024-03-05T07:40'),
  eventRepeat: RepeatType['DAILY'],
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
