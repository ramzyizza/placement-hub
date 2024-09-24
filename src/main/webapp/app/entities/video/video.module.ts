import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { VideoComponent } from './list/video.component';
import { VideoDetailComponent } from './detail/video-detail.component';
import { VideoUpdateComponent } from './update/video-update.component';
import { VideoDeleteDialogComponent } from './delete/video-delete-dialog.component';
import { VideoRoutingModule } from './route/video-routing.module';

@NgModule({
  imports: [SharedModule, VideoRoutingModule],
  declarations: [VideoComponent, VideoDetailComponent, VideoUpdateComponent, VideoDeleteDialogComponent],
})
export class VideoModule {}
