import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { PLACEMENT_LISTING_ROUTE } from './placement-listing.component.route';
import { PlacementListingComponent } from './placement-listing.component';
import { MatInputModule } from '@angular/material/input';

@NgModule({
  imports: [SharedModule, RouterModule.forChild([PLACEMENT_LISTING_ROUTE]), MatInputModule],
  declarations: [PlacementListingComponent],
})
export class PlacementListingComponentModule {}
