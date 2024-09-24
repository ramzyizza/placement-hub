import { Route } from '@angular/router';
import { RatingsHomeComponent } from './ratings-home.component';
import { UserRouteAccessService } from '../core/auth/user-route-access.service';

export const RATINGSHOME_ROUTE: Route = {
  path: '',
  component: RatingsHomeComponent,
  data: {
    pageTitle: 'Ratings Home',
    // authorities: ['ROLE_USER'],
  },
  // canActivate: [UserRouteAccessService],
};
