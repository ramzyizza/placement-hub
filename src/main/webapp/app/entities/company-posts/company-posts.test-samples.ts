import dayjs from 'dayjs/esm';

import { ICompanyPosts, NewCompanyPosts } from './company-posts.model';

export const sampleWithRequiredData: ICompanyPosts = {
  id: 94328,
  postContent: 'deliverables Account redefine',
  createdAt: dayjs('2024-03-04T21:48'),
};

export const sampleWithPartialData: ICompanyPosts = {
  id: 17122,
  postContent: 'Table Nuevo',
  postImage: '../fake-data/blob/hipster.png',
  postImageContentType: 'unknown',
  createdAt: dayjs('2024-03-04T22:00'),
};

export const sampleWithFullData: ICompanyPosts = {
  id: 1559,
  postContent: 'firewall THX',
  postImage: '../fake-data/blob/hipster.png',
  postImageContentType: 'unknown',
  createdAt: dayjs('2024-03-04T20:47'),
};

export const sampleWithNewData: NewCompanyPosts = {
  postContent: 'Awesome',
  createdAt: dayjs('2024-03-05T02:52'),
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
