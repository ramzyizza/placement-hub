import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { ICompanyPosts } from '../company-posts.model';
import { CompanyPostsService } from '../service/company-posts.service';

@Injectable({ providedIn: 'root' })
export class CompanyPostsRoutingResolveService implements Resolve<ICompanyPosts | null> {
  constructor(protected service: CompanyPostsService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<ICompanyPosts | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((companyPosts: HttpResponse<ICompanyPosts>) => {
          if (companyPosts.body) {
            return of(companyPosts.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(null);
  }
}
