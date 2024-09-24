import dayjs from 'dayjs/esm';
import { ContentType } from 'app/entities/enumerations/content-type.model';

export interface IArticle {
  id: number;
  articleName?: string | null;
  contentType?: ContentType | null;
  sourceLink?: string | null;
  thumbnail?: string | null;
  thumbnailContentType?: string | null;
  createdAt?: dayjs.Dayjs | null;
}

export type NewArticle = Omit<IArticle, 'id'> & { id: null };
