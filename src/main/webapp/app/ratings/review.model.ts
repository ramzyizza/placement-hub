import { IUser } from 'app/entities/user/user.model';
import { IUserCompany } from 'app/entities/user-company/user-company.model';

export interface IReview {
  id: number;
  companyName?: string | null;
  role?: string | null;
  rating?: number | null;
  review?: string | null;
  recommend?: boolean | null;
  appUser?: IUser | null;
  userCompany?: Pick<IUserCompany, 'id' | 'name'> | null;
}

export type NewReview = Omit<IReview, 'id'> & { id: null };
