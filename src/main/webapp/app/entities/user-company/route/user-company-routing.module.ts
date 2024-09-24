import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { UserCompanyComponent } from '../list/user-company.component';
import { UserCompanyDetailComponent } from '../detail/user-company-detail.component';
import { UserCompanyUpdateComponent } from '../update/user-company-update.component';
import { UserCompanyRoutingResolveService } from './user-company-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const userCompanyRoute: Routes = [
  {
    path: '',
    component: UserCompanyComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: UserCompanyDetailComponent,
    resolve: {
      userCompany: UserCompanyRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: UserCompanyUpdateComponent,
    resolve: {
      userCompany: UserCompanyRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: UserCompanyUpdateComponent,
    resolve: {
      userCompany: UserCompanyRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(userCompanyRoute)],
  exports: [RouterModule],
})
export class UserCompanyRoutingModule {}
