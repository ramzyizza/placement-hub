import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IUserCompany } from '../user-company.model';
import { UserCompanyService } from '../service/user-company.service';

@Injectable({ providedIn: 'root' })
export class UserCompanyRoutingResolveService implements Resolve<IUserCompany | null> {
  constructor(protected service: UserCompanyService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IUserCompany | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((userCompany: HttpResponse<IUserCompany>) => {
          if (userCompany.body) {
            return of(userCompany.body);
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
