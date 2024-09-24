import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IPlacement } from '../placement.model';
import { PlacementService } from '../service/placement.service';

@Injectable({ providedIn: 'root' })
export class PlacementRoutingResolveService implements Resolve<IPlacement | null> {
  constructor(protected service: PlacementService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IPlacement | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((placement: HttpResponse<IPlacement>) => {
          if (placement.body) {
            return of(placement.body);
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
