import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ICalendar, NewCalendar } from '../calendar.model';

export type PartialUpdateCalendar = Partial<ICalendar> & Pick<ICalendar, 'id'>;

export type EntityResponseType = HttpResponse<ICalendar>;
export type EntityArrayResponseType = HttpResponse<ICalendar[]>;

@Injectable({ providedIn: 'root' })
export class CalendarService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/calendars');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(calendar: NewCalendar): Observable<EntityResponseType> {
    return this.http.post<ICalendar>(this.resourceUrl, calendar, { observe: 'response' });
  }

  update(calendar: ICalendar): Observable<EntityResponseType> {
    return this.http.put<ICalendar>(`${this.resourceUrl}/${this.getCalendarIdentifier(calendar)}`, calendar, { observe: 'response' });
  }

  partialUpdate(calendar: PartialUpdateCalendar): Observable<EntityResponseType> {
    return this.http.patch<ICalendar>(`${this.resourceUrl}/${this.getCalendarIdentifier(calendar)}`, calendar, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<ICalendar>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<ICalendar[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getCalendarIdentifier(calendar: Pick<ICalendar, 'id'>): number {
    return calendar.id;
  }

  compareCalendar(o1: Pick<ICalendar, 'id'> | null, o2: Pick<ICalendar, 'id'> | null): boolean {
    return o1 && o2 ? this.getCalendarIdentifier(o1) === this.getCalendarIdentifier(o2) : o1 === o2;
  }

  addCalendarToCollectionIfMissing<Type extends Pick<ICalendar, 'id'>>(
    calendarCollection: Type[],
    ...calendarsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const calendars: Type[] = calendarsToCheck.filter(isPresent);
    if (calendars.length > 0) {
      const calendarCollectionIdentifiers = calendarCollection.map(calendarItem => this.getCalendarIdentifier(calendarItem)!);
      const calendarsToAdd = calendars.filter(calendarItem => {
        const calendarIdentifier = this.getCalendarIdentifier(calendarItem);
        if (calendarCollectionIdentifiers.includes(calendarIdentifier)) {
          return false;
        }
        calendarCollectionIdentifiers.push(calendarIdentifier);
        return true;
      });
      return [...calendarsToAdd, ...calendarCollection];
    }
    return calendarCollection;
  }
}
