import dayjs from 'dayjs/esm';

import { IPlacement, NewPlacement } from './placement.model';

export const sampleWithRequiredData: IPlacement = {
  id: 98369,
  role: 'Industrial Associate',
  location: 'Program blockchains',
  salary: 62169,
  duration: 53851,
  industry: 'Sleek Directives',
  about: '../fake-data/blob/hipster.txt',
  jobDescription: '../fake-data/blob/hipster.txt',
  minimumQualification: '../fake-data/blob/hipster.txt',
  applicationDeadline: dayjs('2024-03-05T03:59'),
};

export const sampleWithPartialData: IPlacement = {
  id: 98278,
  role: 'Organic Principal',
  location: 'frame',
  salary: 3154,
  duration: 35131,
  industry: 'Idaho wireless Wooden',
  about: '../fake-data/blob/hipster.txt',
  jobDescription: '../fake-data/blob/hipster.txt',
  minimumQualification: '../fake-data/blob/hipster.txt',
  applicationDeadline: dayjs('2024-03-05T01:13'),
};

export const sampleWithFullData: IPlacement = {
  id: 36287,
  role: 'explicit Cambridgeshire archive',
  location: 'Optimized',
  salary: 29495,
  duration: 58507,
  industry: '4th Sports',
  about: '../fake-data/blob/hipster.txt',
  jobDescription: '../fake-data/blob/hipster.txt',
  minimumQualification: '../fake-data/blob/hipster.txt',
  applicationDeadline: dayjs('2024-03-04T20:51'),
};

export const sampleWithNewData: NewPlacement = {
  role: 'Avon Dam',
  location: 'Concrete',
  salary: 56334,
  duration: 45955,
  industry: 'Checking payment Tasty',
  about: '../fake-data/blob/hipster.txt',
  jobDescription: '../fake-data/blob/hipster.txt',
  minimumQualification: '../fake-data/blob/hipster.txt',
  applicationDeadline: dayjs('2024-03-05T13:40'),
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
