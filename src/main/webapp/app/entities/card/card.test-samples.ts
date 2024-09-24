import dayjs from 'dayjs/esm';

import { CardStatus } from 'app/entities/enumerations/card-status.model';

import { ICard, NewCard } from './card.model';

export const sampleWithRequiredData: ICard = {
  id: 57013,
  applicationStatus: CardStatus['FINAL_STAGE'],
  companyName: 'transmit Wooden Nakfa',
  jobTitle: 'Legacy Factors Designer',
};

export const sampleWithPartialData: ICard = {
  id: 60707,
  applicationStatus: CardStatus['FIRST_STAGE'],
  createdDateTime: dayjs('2024-03-05T10:56'),
  companyName: 'Riel',
  jobTitle: 'Global Security Planner',
  jobDuration: 'Music neural',
};

export const sampleWithFullData: ICard = {
  id: 2356,
  applicationStatus: CardStatus['SUBMITTED'],
  createdDateTime: dayjs('2024-03-05T03:06'),
  companyName: 'programming Dominican',
  jobTitle: 'Future Mobility Manager',
  jobLocation: 'compressing solution-oriented capacitor',
  jobDuration: 'olive process',
};

export const sampleWithNewData: NewCard = {
  applicationStatus: CardStatus['REJECTED'],
  companyName: 'backing Refined grow',
  jobTitle: 'Principal Identity Strategist',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
