import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { RATINGS_ROUTE } from './ratings.route';
import { RatingsComponent } from './ratings.component';
import { MatInputModule } from '@angular/material/input';

@NgModule({
  imports: [SharedModule, RouterModule.forChild([RATINGS_ROUTE]), MatInputModule],
  declarations: [RatingsComponent],
})
export class RatingsModule {}
