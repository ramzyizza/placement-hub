import dayjs from 'dayjs/esm';
import { ContentType } from 'app/entities/enumerations/content-type.model';

export interface IVideo {
  id: number;
  videoTitle?: string | null;
  description?: string | null;
  contentType?: ContentType | null;
  thumbnail?: string | null;
  thumbnailContentType?: string | null;
  createdAt?: dayjs.Dayjs | null;
  sourceURL?: string | null;
}

export type NewVideo = Omit<IVideo, 'id'> & { id: null };
