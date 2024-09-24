import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ICompanyPosts, NewCompanyPosts } from '../company-posts.model';

export type PartialUpdateCompanyPosts = Partial<ICompanyPosts> & Pick<ICompanyPosts, 'id'>;

type RestOf<T extends ICompanyPosts | NewCompanyPosts> = Omit<T, 'createdAt'> & {
  createdAt?: string | null;
};

export type RestCompanyPosts = RestOf<ICompanyPosts>;

export type NewRestCompanyPosts = RestOf<NewCompanyPosts>;

export type PartialUpdateRestCompanyPosts = RestOf<PartialUpdateCompanyPosts>;

export type EntityResponseType = HttpResponse<ICompanyPosts>;
export type EntityArrayResponseType = HttpResponse<ICompanyPosts[]>;

@Injectable({ providedIn: 'root' })
export class CompanyPostsService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/company-posts');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(companyPosts: NewCompanyPosts): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(companyPosts);
    return this.http
      .post<RestCompanyPosts>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(companyPosts: ICompanyPosts): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(companyPosts);
    return this.http
      .put<RestCompanyPosts>(`${this.resourceUrl}/${this.getCompanyPostsIdentifier(companyPosts)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(companyPosts: PartialUpdateCompanyPosts): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(companyPosts);
    return this.http
      .patch<RestCompanyPosts>(`${this.resourceUrl}/${this.getCompanyPostsIdentifier(companyPosts)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestCompanyPosts>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestCompanyPosts[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getCompanyPostsIdentifier(companyPosts: Pick<ICompanyPosts, 'id'>): number {
    return companyPosts.id;
  }

  compareCompanyPosts(o1: Pick<ICompanyPosts, 'id'> | null, o2: Pick<ICompanyPosts, 'id'> | null): boolean {
    return o1 && o2 ? this.getCompanyPostsIdentifier(o1) === this.getCompanyPostsIdentifier(o2) : o1 === o2;
  }

  addCompanyPostsToCollectionIfMissing<Type extends Pick<ICompanyPosts, 'id'>>(
    companyPostsCollection: Type[],
    ...companyPostsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const companyPosts: Type[] = companyPostsToCheck.filter(isPresent);
    if (companyPosts.length > 0) {
      const companyPostsCollectionIdentifiers = companyPostsCollection.map(
        companyPostsItem => this.getCompanyPostsIdentifier(companyPostsItem)!
      );
      const companyPostsToAdd = companyPosts.filter(companyPostsItem => {
        const companyPostsIdentifier = this.getCompanyPostsIdentifier(companyPostsItem);
        if (companyPostsCollectionIdentifiers.includes(companyPostsIdentifier)) {
          return false;
        }
        companyPostsCollectionIdentifiers.push(companyPostsIdentifier);
        return true;
      });
      return [...companyPostsToAdd, ...companyPostsCollection];
    }
    return companyPostsCollection;
  }

  protected convertDateFromClient<T extends ICompanyPosts | NewCompanyPosts | PartialUpdateCompanyPosts>(companyPosts: T): RestOf<T> {
    return {
      ...companyPosts,
      createdAt: companyPosts.createdAt?.toJSON() ?? null,
    };
  }

  protected convertDateFromServer(restCompanyPosts: RestCompanyPosts): ICompanyPosts {
    return {
      ...restCompanyPosts,
      createdAt: restCompanyPosts.createdAt ? dayjs(restCompanyPosts.createdAt) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestCompanyPosts>): HttpResponse<ICompanyPosts> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestCompanyPosts[]>): HttpResponse<ICompanyPosts[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }
}
