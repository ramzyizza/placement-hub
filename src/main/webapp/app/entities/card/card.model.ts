import dayjs from 'dayjs/esm';
import { IUser } from 'app/entities/user/user.model';
import { CardStatus } from 'app/entities/enumerations/card-status.model';

export interface ICard {
  id: number;
  applicationStatus?: CardStatus | null;
  createdDateTime?: dayjs.Dayjs | null;
  companyName?: string | null;
  jobTitle?: string | null;
  jobLocation?: string | null;
  jobDuration?: string | null;
  appUser?: Pick<IUser, 'id'> | null;
}

export type NewCard = Omit<ICard, 'id'> & { id: null };
