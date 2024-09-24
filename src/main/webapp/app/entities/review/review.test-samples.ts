import { IReview, NewReview } from './review.model';

export const sampleWithRequiredData: IReview = {
  id: 33078,
  companyName: 'Account navigate',
  role: 'transmitting',
  rating: 78773,
  review: 'bandwidth non-volatile synthesize',
  recommend: false,
};

export const sampleWithPartialData: IReview = {
  id: 27084,
  companyName: 'info-mediaries',
  role: 'generation',
  rating: 24338,
  review: 'migration SAS',
  recommend: true,
};

export const sampleWithFullData: IReview = {
  id: 85594,
  companyName: 'Personal District',
  role: 'Kansas synthesize',
  rating: 51992,
  review: 'Frozen auxiliary',
  recommend: true,
};

export const sampleWithNewData: NewReview = {
  companyName: 'incubate Generic Supervisor',
  role: 'Fresh circuit',
  rating: 18783,
  review: 'Fantastic',
  recommend: false,
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
