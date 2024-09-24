import dayjs from 'dayjs/esm';
import { IUser } from 'app/entities/user/user.model';
import { IArticle } from 'app/entities/article/article.model';
import { IVideo } from 'app/entities/video/video.model';

export interface IFavourite {
  id: number;
  createdAt?: dayjs.Dayjs | null;
  appUser?: Pick<IUser, 'id'> | null;
  article?: Pick<IArticle, 'id'> | null;
  video?: Pick<IVideo, 'id'> | null;
}

export type NewFavourite = Omit<IFavourite, 'id'> & { id: null };
