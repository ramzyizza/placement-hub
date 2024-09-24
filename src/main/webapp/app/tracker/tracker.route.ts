import { Route } from '@angular/router';
import { TrackerComponent } from './tracker.component';
import { UserRouteAccessService } from '../core/auth/user-route-access.service';
import { CardRoutingResolveService } from '../entities/card/route/card-routing-resolve.service';
export const TRACKER_ROUTE: Route = {
  path: '',
  component: TrackerComponent,
  data: {
    pageTitle: 'Tracker',
    authorities: ['ROLE_USER'],
  },
  resolve: {
    card: CardRoutingResolveService,
  },
  canActivate: [UserRouteAccessService],
};
