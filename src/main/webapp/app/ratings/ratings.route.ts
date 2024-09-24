import { Route } from '@angular/router';
import { RatingsComponent } from './ratings.component';
import { UserRouteAccessService } from '../core/auth/user-route-access.service';

export const RATINGS_ROUTE: Route = {
  path: '',
  component: RatingsComponent,
  data: {
    pageTitle: 'Ratings',
    authorities: ['ROLE_USER'],
  },
  canActivate: [UserRouteAccessService],
};
