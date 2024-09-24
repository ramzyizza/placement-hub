import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { PlacementComponent } from './list/placement.component';
import { PlacementDetailComponent } from './detail/placement-detail.component';
import { PlacementUpdateComponent } from './update/placement-update.component';
import { PlacementDeleteDialogComponent } from './delete/placement-delete-dialog.component';
import { PlacementRoutingModule } from './route/placement-routing.module';

@NgModule({
  imports: [SharedModule, PlacementRoutingModule],
  declarations: [PlacementComponent, PlacementDetailComponent, PlacementUpdateComponent, PlacementDeleteDialogComponent],
})
export class PlacementModule {}
