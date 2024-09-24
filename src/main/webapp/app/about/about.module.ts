import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SharedModule } from 'app/shared/shared.module';
import { ABOUT_ROUTE } from './about.route';

@NgModule({
  imports: [SharedModule, RouterModule.forChild([ABOUT_ROUTE])],
})
export class AboutModule {}
