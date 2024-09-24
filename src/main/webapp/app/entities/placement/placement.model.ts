import dayjs from 'dayjs/esm';
import { IUserCompany } from 'app/entities/user-company/user-company.model';

export interface IPlacement {
  id: number;
  role?: string | null;
  location?: string | null;
  salary?: number | null;
  duration?: number | null;
  industry?: string | null;
  about?: string | null;
  jobDescription?: string | null;
  minimumQualification?: string | null;
  applicationDeadline?: dayjs.Dayjs | null;
  userCompany?: IUserCompany | null;
  link?: string | null;
}

export type NewPlacement = Omit<IPlacement, 'id'> & { id: null };
