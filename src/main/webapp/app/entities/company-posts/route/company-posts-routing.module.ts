import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { CompanyPostsComponent } from '../list/company-posts.component';
import { CompanyPostsDetailComponent } from '../detail/company-posts-detail.component';
import { CompanyPostsUpdateComponent } from '../update/company-posts-update.component';
import { CompanyPostsRoutingResolveService } from './company-posts-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const companyPostsRoute: Routes = [
  {
    path: '',
    component: CompanyPostsComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: CompanyPostsDetailComponent,
    resolve: {
      companyPosts: CompanyPostsRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: CompanyPostsUpdateComponent,
    resolve: {
      companyPosts: CompanyPostsRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: CompanyPostsUpdateComponent,
    resolve: {
      companyPosts: CompanyPostsRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(companyPostsRoute)],
  exports: [RouterModule],
})
export class CompanyPostsRoutingModule {}
