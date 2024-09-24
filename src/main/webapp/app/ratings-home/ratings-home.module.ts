import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { RATINGSHOME_ROUTE } from './ratings-home.route';
import { RatingsHomeComponent } from './ratings-home.component';
import { MatInputModule } from '@angular/material/input';

@NgModule({
  imports: [SharedModule, RouterModule.forChild([RATINGSHOME_ROUTE]), MatInputModule],
  declarations: [RatingsHomeComponent],
})
export class RatingsHomeModule {}
