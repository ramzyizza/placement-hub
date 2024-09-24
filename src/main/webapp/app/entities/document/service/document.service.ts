import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IDocument, NewDocument } from '../document.model';

export type PartialUpdateDocument = Partial<IDocument> & Pick<IDocument, 'id'>;

type RestOf<T extends IDocument | NewDocument> = Omit<T, 'lastEdit'> & {
  lastEdit?: string | null;
};

export type RestDocument = RestOf<IDocument>;

export type NewRestDocument = RestOf<NewDocument>;

export type PartialUpdateRestDocument = RestOf<PartialUpdateDocument>;

export type EntityResponseType = HttpResponse<IDocument>;
export type EntityArrayResponseType = HttpResponse<IDocument[]>;

@Injectable({ providedIn: 'root' })
export class DocumentService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/documents');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(document: NewDocument): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(document);
    return this.http
      .post<RestDocument>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(document: IDocument): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(document);
    return this.http
      .put<RestDocument>(`${this.resourceUrl}/${this.getDocumentIdentifier(document)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(document: PartialUpdateDocument): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(document);
    return this.http
      .patch<RestDocument>(`${this.resourceUrl}/${this.getDocumentIdentifier(document)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestDocument>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestDocument[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getDocumentIdentifier(document: Pick<IDocument, 'id'>): number {
    return document.id;
  }

  compareDocument(o1: Pick<IDocument, 'id'> | null, o2: Pick<IDocument, 'id'> | null): boolean {
    return o1 && o2 ? this.getDocumentIdentifier(o1) === this.getDocumentIdentifier(o2) : o1 === o2;
  }

  addDocumentToCollectionIfMissing<Type extends Pick<IDocument, 'id'>>(
    documentCollection: Type[],
    ...documentsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const documents: Type[] = documentsToCheck.filter(isPresent);
    if (documents.length > 0) {
      const documentCollectionIdentifiers = documentCollection.map(documentItem => this.getDocumentIdentifier(documentItem)!);
      const documentsToAdd = documents.filter(documentItem => {
        const documentIdentifier = this.getDocumentIdentifier(documentItem);
        if (documentCollectionIdentifiers.includes(documentIdentifier)) {
          return false;
        }
        documentCollectionIdentifiers.push(documentIdentifier);
        return true;
      });
      return [...documentsToAdd, ...documentCollection];
    }
    return documentCollection;
  }

  protected convertDateFromClient<T extends IDocument | NewDocument | PartialUpdateDocument>(document: T): RestOf<T> {
    return {
      ...document,
      lastEdit: document.lastEdit?.toJSON() ?? null,
    };
  }

  protected convertDateFromServer(restDocument: RestDocument): IDocument {
    return {
      ...restDocument,
      lastEdit: restDocument.lastEdit ? dayjs(restDocument.lastEdit) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestDocument>): HttpResponse<IDocument> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestDocument[]>): HttpResponse<IDocument[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }
}
