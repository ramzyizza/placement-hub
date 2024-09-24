import { IUser } from 'app/entities/user/user.model';
import { CompanySize } from 'app/entities/enumerations/company-size.model';
import { Industry } from 'app/entities/enumerations/industry.model';

export interface IUserCompany {
  id: number;
  name?: string | null;
  logo?: string | null;
  logoContentType?: string | null;
  profileImageBackground?: string | null;
  profileImageBackgroundContentType?: string | null;
  companySize?: CompanySize | null;
  industry?: Industry | null;
  totalLocation?: number | null;
  appUser?: Pick<IUser, 'id'> | null;
}

export type NewUserCompany = Omit<IUserCompany, 'id'> & { id: null };
