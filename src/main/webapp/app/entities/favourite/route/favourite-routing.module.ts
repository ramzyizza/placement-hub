import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { FavouriteComponent } from '../list/favourite.component';
import { FavouriteDetailComponent } from '../detail/favourite-detail.component';
import { FavouriteUpdateComponent } from '../update/favourite-update.component';
import { FavouriteRoutingResolveService } from './favourite-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const favouriteRoute: Routes = [
  {
    path: '',
    component: FavouriteComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: FavouriteDetailComponent,
    resolve: {
      favourite: FavouriteRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: FavouriteUpdateComponent,
    resolve: {
      favourite: FavouriteRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: FavouriteUpdateComponent,
    resolve: {
      favourite: FavouriteRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(favouriteRoute)],
  exports: [RouterModule],
})
export class FavouriteRoutingModule {}
