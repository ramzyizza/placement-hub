import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ICard, NewCard } from '../card.model';

export type PartialUpdateCard = Partial<ICard> & Pick<ICard, 'id'>;

type RestOf<T extends ICard | NewCard> = Omit<T, 'createdDateTime'> & {
  createdDateTime?: string | null;
};

export type RestCard = RestOf<ICard>;

export type NewRestCard = RestOf<NewCard>;

export type PartialUpdateRestCard = RestOf<PartialUpdateCard>;

export type EntityResponseType = HttpResponse<ICard>;
export type EntityArrayResponseType = HttpResponse<ICard[]>;

@Injectable({ providedIn: 'root' })
export class CardService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/cards');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(card: NewCard): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(card);
    return this.http.post<RestCard>(this.resourceUrl, copy, { observe: 'response' }).pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(card: ICard): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(card);
    return this.http
      .put<RestCard>(`${this.resourceUrl}/${this.getCardIdentifier(card)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(card: PartialUpdateCard): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(card);
    return this.http
      .patch<RestCard>(`${this.resourceUrl}/${this.getCardIdentifier(card)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestCard>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  // query(req?: any): Observable<EntityArrayResponseType> {
  //   const options = createRequestOption(req);
  //   return this.http
  //     .get<RestCard[]>(this.resourceUrl, { params: options, observe: 'response' })
  //     .pipe(map(res => this.convertResponseArrayFromServer(res)));
  // }

  query(req?: any): Observable<HttpResponse<ICard[]>> {
    const options = createRequestOption(req);
    return this.http
      .get<RestCard[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: HttpResponse<RestCard[]>) => this.convertResponseArrayFromServer(res)));
  }

  private convertResponseArrayFromServer(res: HttpResponse<RestCard[]>): HttpResponse<ICard[]> {
    if (res.body) {
      const body: ICard[] = res.body.map((restCard: RestCard) => this.convertCardFromServer(restCard));
      return res.clone({ body });
    } else {
      return res.clone({ body: [] });
    }
  }

  private convertCardFromServer(restCard: RestCard): ICard {
    return {
      ...restCard,
      createdDateTime: restCard.createdDateTime ? dayjs(restCard.createdDateTime) : undefined,
    };
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getCardIdentifier(card: Pick<ICard, 'id'>): number {
    return card.id;
  }

  compareCard(o1: Pick<ICard, 'id'> | null, o2: Pick<ICard, 'id'> | null): boolean {
    return o1 && o2 ? this.getCardIdentifier(o1) === this.getCardIdentifier(o2) : o1 === o2;
  }

  queryByUser(userId: number): Observable<EntityArrayResponseType> {
    return this.http.get<ICard[]>(`${this.resourceUrl}/by-user/${userId}`, { observe: 'response' });
  }

  addCardToCollectionIfMissing<Type extends Pick<ICard, 'id'>>(
    cardCollection: Type[],
    ...cardsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const cards: Type[] = cardsToCheck.filter(isPresent);
    if (cards.length > 0) {
      const cardCollectionIdentifiers = cardCollection.map(cardItem => this.getCardIdentifier(cardItem)!);
      const cardsToAdd = cards.filter(cardItem => {
        const cardIdentifier = this.getCardIdentifier(cardItem);
        if (cardCollectionIdentifiers.includes(cardIdentifier)) {
          return false;
        }
        cardCollectionIdentifiers.push(cardIdentifier);
        return true;
      });
      return [...cardsToAdd, ...cardCollection];
    }
    return cardCollection;
  }

  protected convertDateFromClient<T extends ICard | NewCard | PartialUpdateCard>(card: T): RestOf<T> {
    return {
      ...card,
      createdDateTime: card.createdDateTime?.toJSON() ?? null,
    };
  }

  protected convertDateFromServer(restCard: RestCard): ICard {
    return {
      ...restCard,
      createdDateTime: restCard.createdDateTime ? dayjs(restCard.createdDateTime) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestCard>): HttpResponse<ICard> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  getCardStatusCountsForCurrentUser(): Observable<{ [key: string]: number }> {
    return this.http.get<{ [key: string]: number }>(`${this.resourceUrl}/status-counts`);
  }
}
