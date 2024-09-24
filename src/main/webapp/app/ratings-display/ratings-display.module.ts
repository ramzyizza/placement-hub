import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { RATINGSDISPLAY_ROUTE } from './ratings-display.route';
import { RatingsDisplayComponent } from './ratings-display.component';
import { MatInputModule } from '@angular/material/input';

@NgModule({
  imports: [SharedModule, RouterModule.forChild([RATINGSDISPLAY_ROUTE]), MatInputModule],
  declarations: [RatingsDisplayComponent],
})
export class RatingsDisplayModule {}
