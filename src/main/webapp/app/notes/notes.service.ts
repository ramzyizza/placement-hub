import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class NotesService {
  constructor(private http: HttpClient) {}

  getAlldocuments(): Observable<any[]> {
    return this.http.get<any[]>('/api/documents');
  }

  updateDocs(document: any): Observable<any[]> {
    return this.http.put<any[]>('/api/documents/' + document.id, document);
  }
}
