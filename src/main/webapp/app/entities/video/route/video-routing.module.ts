import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { VideoComponent } from '../list/video.component';
import { VideoDetailComponent } from '../detail/video-detail.component';
import { VideoUpdateComponent } from '../update/video-update.component';
import { VideoRoutingResolveService } from './video-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const videoRoute: Routes = [
  {
    path: '',
    component: VideoComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: VideoDetailComponent,
    resolve: {
      video: VideoRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: VideoUpdateComponent,
    resolve: {
      video: VideoRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: VideoUpdateComponent,
    resolve: {
      video: VideoRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(videoRoute)],
  exports: [RouterModule],
})
export class VideoRoutingModule {}
