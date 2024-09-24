import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { PlacementComponent } from '../list/placement.component';
import { PlacementDetailComponent } from '../detail/placement-detail.component';
import { PlacementUpdateComponent } from '../update/placement-update.component';
import { PlacementRoutingResolveService } from './placement-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const placementRoute: Routes = [
  {
    path: '',
    component: PlacementComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: PlacementDetailComponent,
    resolve: {
      placement: PlacementRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: PlacementUpdateComponent,
    resolve: {
      placement: PlacementRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: PlacementUpdateComponent,
    resolve: {
      placement: PlacementRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(placementRoute)],
  exports: [RouterModule],
})
export class PlacementRoutingModule {}
