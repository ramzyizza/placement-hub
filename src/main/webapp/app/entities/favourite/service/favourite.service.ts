import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IFavourite, NewFavourite } from '../favourite.model';

export type PartialUpdateFavourite = Partial<IFavourite> & Pick<IFavourite, 'id'>;

type RestOf<T extends IFavourite | NewFavourite> = Omit<T, 'createdAt'> & {
  createdAt?: string | null;
};

export type RestFavourite = RestOf<IFavourite>;

export type NewRestFavourite = RestOf<NewFavourite>;

export type PartialUpdateRestFavourite = RestOf<PartialUpdateFavourite>;

export type EntityResponseType = HttpResponse<IFavourite>;
export type EntityArrayResponseType = HttpResponse<IFavourite[]>;

@Injectable({ providedIn: 'root' })
export class FavouriteService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/favourites');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(favourite: NewFavourite): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(favourite);
    return this.http
      .post<RestFavourite>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(favourite: IFavourite): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(favourite);
    return this.http
      .put<RestFavourite>(`${this.resourceUrl}/${this.getFavouriteIdentifier(favourite)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(favourite: PartialUpdateFavourite): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(favourite);
    return this.http
      .patch<RestFavourite>(`${this.resourceUrl}/${this.getFavouriteIdentifier(favourite)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestFavourite>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestFavourite[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getFavouriteIdentifier(favourite: Pick<IFavourite, 'id'>): number {
    return favourite.id;
  }

  compareFavourite(o1: Pick<IFavourite, 'id'> | null, o2: Pick<IFavourite, 'id'> | null): boolean {
    return o1 && o2 ? this.getFavouriteIdentifier(o1) === this.getFavouriteIdentifier(o2) : o1 === o2;
  }

  addFavouriteToCollectionIfMissing<Type extends Pick<IFavourite, 'id'>>(
    favouriteCollection: Type[],
    ...favouritesToCheck: (Type | null | undefined)[]
  ): Type[] {
    const favourites: Type[] = favouritesToCheck.filter(isPresent);
    if (favourites.length > 0) {
      const favouriteCollectionIdentifiers = favouriteCollection.map(favouriteItem => this.getFavouriteIdentifier(favouriteItem)!);
      const favouritesToAdd = favourites.filter(favouriteItem => {
        const favouriteIdentifier = this.getFavouriteIdentifier(favouriteItem);
        if (favouriteCollectionIdentifiers.includes(favouriteIdentifier)) {
          return false;
        }
        favouriteCollectionIdentifiers.push(favouriteIdentifier);
        return true;
      });
      return [...favouritesToAdd, ...favouriteCollection];
    }
    return favouriteCollection;
  }

  protected convertDateFromClient<T extends IFavourite | NewFavourite | PartialUpdateFavourite>(favourite: T): RestOf<T> {
    return {
      ...favourite,
      createdAt: favourite.createdAt?.toJSON() ?? null,
    };
  }

  protected convertDateFromServer(restFavourite: RestFavourite): IFavourite {
    return {
      ...restFavourite,
      createdAt: restFavourite.createdAt ? dayjs(restFavourite.createdAt) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestFavourite>): HttpResponse<IFavourite> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestFavourite[]>): HttpResponse<IFavourite[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }
}
