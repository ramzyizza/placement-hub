import dayjs from 'dayjs/esm';
import { IUser } from 'app/entities/user/user.model';

export interface IDocument {
  id: number;
  title?: string | null;
  content?: string | null;
  lastEdit?: dayjs.Dayjs | null;
  appUser?: Pick<IUser, 'id'> | null;
}

export type NewDocument = Omit<IDocument, 'id'> & { id: null };
