import dayjs from 'dayjs/esm';
import { IUserCompany } from 'app/entities/user-company/user-company.model';

export interface ICompanyPosts {
  id: number;
  postContent?: string | null;
  postImage?: string | null;
  postImageContentType?: string | null;
  createdAt?: dayjs.Dayjs | null;
  userCompany?: Pick<IUserCompany, 'id'> | null;
}

export type NewCompanyPosts = Omit<ICompanyPosts, 'id'> & { id: null };
