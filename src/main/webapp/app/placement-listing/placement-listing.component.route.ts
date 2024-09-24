import { Route } from '@angular/router';
import { PlacementListingComponent } from './placement-listing.component';
import { UserRouteAccessService } from '../core/auth/user-route-access.service';

export const PLACEMENT_LISTING_ROUTE: Route = {
  path: '',
  component: PlacementListingComponent,
  data: {
    pageTitle: 'Placement Listing',
    authorities: ['ROLE_USER'],
  },
  // canActivate: [UserRouteAccessService],
};
