import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { TrackerComponent } from './tracker.component';
import { TRACKER_ROUTE } from './tracker.route';
import { DragDropModule } from '@angular/cdk/drag-drop';
``;
@NgModule({
  imports: [SharedModule, RouterModule.forChild([TRACKER_ROUTE]), DragDropModule],
  declarations: [TrackerComponent],
})
export class TrackerModule {}
