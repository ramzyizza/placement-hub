import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SharedModule } from 'app/shared/shared.module';
import { HOME_ROUTE } from './home.route';
import { HomeComponent } from './home.component';
import { CapitalizeFirstPipe } from '../capitalize-first.pipe';

@NgModule({
  imports: [NgbModule, SharedModule, RouterModule.forChild([HOME_ROUTE])],
  declarations: [HomeComponent, CapitalizeFirstPipe],
})
export class HomeModule {}
