import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IReview, NewReview } from '../review.model';

export type PartialUpdateReview = Partial<IReview> & Pick<IReview, 'id'>;

export type EntityResponseType = HttpResponse<IReview>;
export type EntityArrayResponseType = HttpResponse<IReview[]>;

@Injectable({ providedIn: 'root' })
export class ReviewService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/reviews');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(review: NewReview): Observable<EntityResponseType> {
    review.companyName = review.companyName || 'Default Company Name';
    return this.http.post<IReview>(this.resourceUrl, review, { observe: 'response' });
  }

  update(review: IReview): Observable<EntityResponseType> {
    review.companyName = review.companyName || 'Default Company Name';
    return this.http.put<IReview>(`${this.resourceUrl}/${this.getReviewIdentifier(review)}`, review, { observe: 'response' });
  }

  partialUpdate(review: PartialUpdateReview): Observable<EntityResponseType> {
    return this.http.patch<IReview>(`${this.resourceUrl}/${this.getReviewIdentifier(review)}`, review, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IReview>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IReview[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getReviewIdentifier(review: Pick<IReview, 'id'>): number {
    return review.id;
  }

  compareReview(o1: Pick<IReview, 'id'> | null, o2: Pick<IReview, 'id'> | null): boolean {
    return o1 && o2 ? this.getReviewIdentifier(o1) === this.getReviewIdentifier(o2) : o1 === o2;
  }

  addReviewToCollectionIfMissing<Type extends Pick<IReview, 'id'>>(
    reviewCollection: Type[],
    ...reviewsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const reviews: Type[] = reviewsToCheck.filter(isPresent);
    if (reviews.length > 0) {
      const reviewCollectionIdentifiers = reviewCollection.map(reviewItem => this.getReviewIdentifier(reviewItem)!);
      const reviewsToAdd = reviews.filter(reviewItem => {
        const reviewIdentifier = this.getReviewIdentifier(reviewItem);
        if (reviewCollectionIdentifiers.includes(reviewIdentifier)) {
          return false;
        }
        reviewCollectionIdentifiers.push(reviewIdentifier);
        return true;
      });
      return [...reviewsToAdd, ...reviewCollection];
    }
    return reviewCollection;
  }
}
