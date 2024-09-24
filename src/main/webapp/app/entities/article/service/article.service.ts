import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IArticle, NewArticle } from '../article.model';

export type PartialUpdateArticle = Partial<IArticle> & Pick<IArticle, 'id'>;

type RestOf<T extends IArticle | NewArticle> = Omit<T, 'createdAt'> & {
  createdAt?: string | null;
};

export type RestArticle = RestOf<IArticle>;

export type NewRestArticle = RestOf<NewArticle>;

export type PartialUpdateRestArticle = RestOf<PartialUpdateArticle>;

export type EntityResponseType = HttpResponse<IArticle>;
export type EntityArrayResponseType = HttpResponse<IArticle[]>;

@Injectable({ providedIn: 'root' })
export class ArticleService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/articles');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(article: NewArticle): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(article);
    return this.http
      .post<RestArticle>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(article: IArticle): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(article);
    return this.http
      .put<RestArticle>(`${this.resourceUrl}/${this.getArticleIdentifier(article)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(article: PartialUpdateArticle): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(article);
    return this.http
      .patch<RestArticle>(`${this.resourceUrl}/${this.getArticleIdentifier(article)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestArticle>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestArticle[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getArticleIdentifier(article: Pick<IArticle, 'id'>): number {
    return article.id;
  }

  compareArticle(o1: Pick<IArticle, 'id'> | null, o2: Pick<IArticle, 'id'> | null): boolean {
    return o1 && o2 ? this.getArticleIdentifier(o1) === this.getArticleIdentifier(o2) : o1 === o2;
  }

  addArticleToCollectionIfMissing<Type extends Pick<IArticle, 'id'>>(
    articleCollection: Type[],
    ...articlesToCheck: (Type | null | undefined)[]
  ): Type[] {
    const articles: Type[] = articlesToCheck.filter(isPresent);
    if (articles.length > 0) {
      const articleCollectionIdentifiers = articleCollection.map(articleItem => this.getArticleIdentifier(articleItem)!);
      const articlesToAdd = articles.filter(articleItem => {
        const articleIdentifier = this.getArticleIdentifier(articleItem);
        if (articleCollectionIdentifiers.includes(articleIdentifier)) {
          return false;
        }
        articleCollectionIdentifiers.push(articleIdentifier);
        return true;
      });
      return [...articlesToAdd, ...articleCollection];
    }
    return articleCollection;
  }

  protected convertDateFromClient<T extends IArticle | NewArticle | PartialUpdateArticle>(article: T): RestOf<T> {
    return {
      ...article,
      createdAt: article.createdAt?.toJSON() ?? null,
    };
  }

  protected convertDateFromServer(restArticle: RestArticle): IArticle {
    return {
      ...restArticle,
      createdAt: restArticle.createdAt ? dayjs(restArticle.createdAt) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestArticle>): HttpResponse<IArticle> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestArticle[]>): HttpResponse<IArticle[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }
}
