import dayjs from 'dayjs/esm';

import { IDocument, NewDocument } from './document.model';

export const sampleWithRequiredData: IDocument = {
  id: 70614,
  title: 'Planner Borders',
  lastEdit: dayjs('2024-03-05T00:34'),
};

export const sampleWithPartialData: IDocument = {
  id: 61321,
  title: 'Home Berkshire Future',
  lastEdit: dayjs('2024-03-05T16:36'),
};

export const sampleWithFullData: IDocument = {
  id: 75263,
  title: 'next California',
  content: '../fake-data/blob/hipster.txt',
  lastEdit: dayjs('2024-03-05T14:04'),
};

export const sampleWithNewData: NewDocument = {
  title: 'Cambridgeshire',
  lastEdit: dayjs('2024-03-04T19:09'),
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
