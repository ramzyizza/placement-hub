import dayjs from 'dayjs/esm';

import { IFavourite, NewFavourite } from './favourite.model';

export const sampleWithRequiredData: IFavourite = {
  id: 5094,
  createdAt: dayjs('2024-03-04T23:27'),
};

export const sampleWithPartialData: IFavourite = {
  id: 75403,
  createdAt: dayjs('2024-03-05T04:40'),
};

export const sampleWithFullData: IFavourite = {
  id: 42272,
  createdAt: dayjs('2024-03-05T14:55'),
};

export const sampleWithNewData: NewFavourite = {
  createdAt: dayjs('2024-03-05T05:28'),
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
