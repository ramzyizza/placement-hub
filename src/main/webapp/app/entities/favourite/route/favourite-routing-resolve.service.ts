import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IFavourite } from '../favourite.model';
import { FavouriteService } from '../service/favourite.service';

@Injectable({ providedIn: 'root' })
export class FavouriteRoutingResolveService implements Resolve<IFavourite | null> {
  constructor(protected service: FavouriteService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IFavourite | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((favourite: HttpResponse<IFavourite>) => {
          if (favourite.body) {
            return of(favourite.body);
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
