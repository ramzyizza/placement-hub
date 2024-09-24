import dayjs from 'dayjs/esm';

import { ContentType } from 'app/entities/enumerations/content-type.model';

import { IArticle, NewArticle } from './article.model';

export const sampleWithRequiredData: IArticle = {
  id: 61675,
  articleName: 'payment Upgradable',
  contentType: ContentType['CONSTRUCTION'],
  thumbnail: '../fake-data/blob/hipster.png',
  thumbnailContentType: 'unknown',
};

export const sampleWithPartialData: IArticle = {
  id: 16997,
  articleName: 'customer analyzing',
  contentType: ContentType['ASSESSMENT'],
  thumbnail: '../fake-data/blob/hipster.png',
  thumbnailContentType: 'unknown',
};

export const sampleWithFullData: IArticle = {
  id: 68204,
  articleName: 'Berkshire feed',
  contentType: ContentType['RETAIL'],
  sourceLink: 'Data',
  thumbnail: '../fake-data/blob/hipster.png',
  thumbnailContentType: 'unknown',
  createdAt: dayjs('2024-03-05T13:52'),
};

export const sampleWithNewData: NewArticle = {
  articleName: 'Sports Poland program',
  contentType: ContentType['PHARMACEUTICAL'],
  thumbnail: '../fake-data/blob/hipster.png',
  thumbnailContentType: 'unknown',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
