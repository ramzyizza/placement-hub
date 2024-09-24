import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IUserCompany, NewUserCompany } from '../user-company.model';

export type PartialUpdateUserCompany = Partial<IUserCompany> & Pick<IUserCompany, 'id'>;

export type EntityResponseType = HttpResponse<IUserCompany>;
export type EntityArrayResponseType = HttpResponse<IUserCompany[]>;

@Injectable({ providedIn: 'root' })
export class UserCompanyService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/user-companies');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(userCompany: NewUserCompany): Observable<EntityResponseType> {
    return this.http.post<IUserCompany>(this.resourceUrl, userCompany, { observe: 'response' });
  }

  update(userCompany: IUserCompany): Observable<EntityResponseType> {
    return this.http.put<IUserCompany>(`${this.resourceUrl}/${this.getUserCompanyIdentifier(userCompany)}`, userCompany, {
      observe: 'response',
    });
  }

  partialUpdate(userCompany: PartialUpdateUserCompany): Observable<EntityResponseType> {
    return this.http.patch<IUserCompany>(`${this.resourceUrl}/${this.getUserCompanyIdentifier(userCompany)}`, userCompany, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IUserCompany>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IUserCompany[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getUserCompanyIdentifier(userCompany: Pick<IUserCompany, 'id'>): number {
    return userCompany.id;
  }

  compareUserCompany(o1: Pick<IUserCompany, 'id'> | null, o2: Pick<IUserCompany, 'id'> | null): boolean {
    return o1 && o2 ? this.getUserCompanyIdentifier(o1) === this.getUserCompanyIdentifier(o2) : o1 === o2;
  }

  addUserCompanyToCollectionIfMissing<Type extends Pick<IUserCompany, 'id'>>(
    userCompanyCollection: Type[],
    ...userCompaniesToCheck: (Type | null | undefined)[]
  ): Type[] {
    const userCompanies: Type[] = userCompaniesToCheck.filter(isPresent);
    if (userCompanies.length > 0) {
      const userCompanyCollectionIdentifiers = userCompanyCollection.map(
        userCompanyItem => this.getUserCompanyIdentifier(userCompanyItem)!
      );
      const userCompaniesToAdd = userCompanies.filter(userCompanyItem => {
        const userCompanyIdentifier = this.getUserCompanyIdentifier(userCompanyItem);
        if (userCompanyCollectionIdentifiers.includes(userCompanyIdentifier)) {
          return false;
        }
        userCompanyCollectionIdentifiers.push(userCompanyIdentifier);
        return true;
      });
      return [...userCompaniesToAdd, ...userCompanyCollection];
    }
    return userCompanyCollection;
  }
}
