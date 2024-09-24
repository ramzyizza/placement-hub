import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IPlacement, NewPlacement } from '../placement.model';

export type PartialUpdatePlacement = Partial<IPlacement> & Pick<IPlacement, 'id'>;

type RestOf<T extends IPlacement | NewPlacement> = Omit<T, 'applicationDeadline'> & {
  applicationDeadline?: string | null;
};

export type RestPlacement = RestOf<IPlacement>;

export type NewRestPlacement = RestOf<NewPlacement>;

export type PartialUpdateRestPlacement = RestOf<PartialUpdatePlacement>;

export type EntityResponseType = HttpResponse<IPlacement>;
export type EntityArrayResponseType = HttpResponse<IPlacement[]>;

@Injectable({ providedIn: 'root' })
export class PlacementService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/placements');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(placement: NewPlacement): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(placement);
    return this.http
      .post<RestPlacement>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(placement: IPlacement): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(placement);
    return this.http
      .put<RestPlacement>(`${this.resourceUrl}/${this.getPlacementIdentifier(placement)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(placement: PartialUpdatePlacement): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(placement);
    return this.http
      .patch<RestPlacement>(`${this.resourceUrl}/${this.getPlacementIdentifier(placement)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestPlacement>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestPlacement[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getPlacementIdentifier(placement: Pick<IPlacement, 'id'>): number {
    return placement.id;
  }

  comparePlacement(o1: Pick<IPlacement, 'id'> | null, o2: Pick<IPlacement, 'id'> | null): boolean {
    return o1 && o2 ? this.getPlacementIdentifier(o1) === this.getPlacementIdentifier(o2) : o1 === o2;
  }

  addPlacementToCollectionIfMissing<Type extends Pick<IPlacement, 'id'>>(
    placementCollection: Type[],
    ...placementsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const placements: Type[] = placementsToCheck.filter(isPresent);
    if (placements.length > 0) {
      const placementCollectionIdentifiers = placementCollection.map(placementItem => this.getPlacementIdentifier(placementItem)!);
      const placementsToAdd = placements.filter(placementItem => {
        const placementIdentifier = this.getPlacementIdentifier(placementItem);
        if (placementCollectionIdentifiers.includes(placementIdentifier)) {
          return false;
        }
        placementCollectionIdentifiers.push(placementIdentifier);
        return true;
      });
      return [...placementsToAdd, ...placementCollection];
    }
    return placementCollection;
  }

  protected convertDateFromClient<T extends IPlacement | NewPlacement | PartialUpdatePlacement>(placement: T): RestOf<T> {
    return {
      ...placement,
      applicationDeadline: placement.applicationDeadline?.toJSON() ?? null,
    };
  }

  protected convertDateFromServer(restPlacement: RestPlacement): IPlacement {
    return {
      ...restPlacement,
      applicationDeadline: restPlacement.applicationDeadline ? dayjs(restPlacement.applicationDeadline) : null,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestPlacement>): HttpResponse<IPlacement> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestPlacement[]>): HttpResponse<IPlacement[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }

  searchPlacements(searchTerm: string): Observable<EntityArrayResponseType> {
    return this.http.get<IPlacement[]>(`${this.resourceUrl}/search`, { params: { searchTerm }, observe: 'response' });
  }
}
