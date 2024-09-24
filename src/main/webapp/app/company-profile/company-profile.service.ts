import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CompanyProfileService {
  constructor(private http: HttpClient) {}
  getAllPosts(): Observable<any[]> {
    return this.http.get<any[]>('/api/company-posts');
  }
  getAllUserCompany(): Observable<any[]> {
    return this.http.get<any[]>('/api/user-companies');
  }
  getAllPlacements(): Observable<any[]> {
    return this.http.get<any[]>('/api/placements');
  }
  getCurrentUser(): Observable<any> {
    return this.http.get<any>('/api/account');
  }
}
