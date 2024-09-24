import { Route } from '@angular/router';
import { PlacementDetailDialogComponent } from './placement-detail-dialog.component';
import { UserRouteAccessService } from '../core/auth/user-route-access.service';

export const PLACEMENT_DETAIL_ROUTE: Route = {
  path: '',
  component: PlacementDetailDialogComponent,
  data: {
    pageTitle: 'Placement Listing',
    authorities: ['ROLE_USER'],
  },
  // canActivate: [UserRouteAccessService],
};
