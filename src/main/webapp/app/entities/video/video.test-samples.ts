import dayjs from 'dayjs/esm';

import { ContentType } from 'app/entities/enumerations/content-type.model';

import { IVideo, NewVideo } from './video.model';

export const sampleWithRequiredData: IVideo = {
  id: 25330,
  videoTitle: 'users',
  contentType: ContentType['TRANSPORT'],
  thumbnail: '../fake-data/blob/hipster.png',
  thumbnailContentType: 'unknown',
  createdAt: dayjs('2024-03-05T09:57'),
  sourceURL: 'silver withdrawal',
};

export const sampleWithPartialData: IVideo = {
  id: 13168,
  videoTitle: 'Cambridgeshire feed',
  contentType: ContentType['ENGINEERING'],
  thumbnail: '../fake-data/blob/hipster.png',
  thumbnailContentType: 'unknown',
  createdAt: dayjs('2024-03-05T13:10'),
  sourceURL: 'secured',
};

export const sampleWithFullData: IVideo = {
  id: 17921,
  videoTitle: 'Fresh application Car',
  description: 'compress modular compressing',
  contentType: ContentType['CHEMICAL'],
  thumbnail: '../fake-data/blob/hipster.png',
  thumbnailContentType: 'unknown',
  createdAt: dayjs('2024-03-05T16:23'),
  sourceURL: 'primary synthesizing hack',
};

export const sampleWithNewData: NewVideo = {
  videoTitle: 'primary',
  contentType: ContentType['LAW'],
  thumbnail: '../fake-data/blob/hipster.png',
  thumbnailContentType: 'unknown',
  createdAt: dayjs('2024-03-05T16:43'),
  sourceURL: 'Michigan',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
