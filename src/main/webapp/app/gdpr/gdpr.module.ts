import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SharedModule } from 'app/shared/shared.module';
import { GDPR_ROUTE } from './gdpr.route';

@NgModule({
  imports: [SharedModule, RouterModule.forChild([GDPR_ROUTE])],
})
export class GDPRModule {}
