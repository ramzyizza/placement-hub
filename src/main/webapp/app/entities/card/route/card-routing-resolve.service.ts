import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { ICard } from '../card.model';
import { CardService } from '../service/card.service';

@Injectable({ providedIn: 'root' })
export class CardRoutingResolveService implements Resolve<ICard | null> {
  constructor(protected service: CardService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<ICard | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((card: HttpResponse<ICard>) => {
          if (card.body) {
            return of(card.body);
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
