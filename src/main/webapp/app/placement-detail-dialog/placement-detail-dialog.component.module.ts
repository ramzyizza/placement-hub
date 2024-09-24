import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { PLACEMENT_DETAIL_ROUTE } from './placement-detail-dialog.component.route';
import { PlacementDetailDialogComponent } from './placement-detail-dialog.component';
import { MatInputModule } from '@angular/material/input';
import { MatDialogModule } from '@angular/material/dialog';

@NgModule({
  imports: [SharedModule, RouterModule.forChild([PLACEMENT_DETAIL_ROUTE]), MatInputModule, MatDialogModule],
  declarations: [PlacementDetailDialogComponent],
})
export class PlacementDetailDialogComponentModule {}
