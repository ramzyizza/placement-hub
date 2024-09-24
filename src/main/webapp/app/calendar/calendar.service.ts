// calendar.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CalendarService {
  constructor(private http: HttpClient) {}

  getAllCalendars(): Observable<any[]> {
    return this.http.get<any[]>('/api/calendars');
  }
}
