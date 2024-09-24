import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CardsService {
  constructor(private http: HttpClient) {}

  getAllCards(): Observable<any[]> {
    return this.http.get<any[]>('/api/cards/');
  }
  UpdateCards(serial: string, id: string): Observable<any[]> {
    // console.log(JSON.parse(serial))
    return this.http.put<any[]>('/api/cards/' + id, JSON.parse(serial));
  }
}
