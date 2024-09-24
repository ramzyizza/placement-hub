import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IDocument } from '../document.model';
import { DocumentService } from '../service/document.service';

@Injectable({ providedIn: 'root' })
export class DocumentRoutingResolveService implements Resolve<IDocument | null> {
  constructor(protected service: DocumentService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IDocument | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((document: HttpResponse<IDocument>) => {
          if (document.body) {
            return of(document.body);
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
