import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { UserCompanyComponent } from './list/user-company.component';
import { UserCompanyDetailComponent } from './detail/user-company-detail.component';
import { UserCompanyUpdateComponent } from './update/user-company-update.component';
import { UserCompanyDeleteDialogComponent } from './delete/user-company-delete-dialog.component';
import { UserCompanyRoutingModule } from './route/user-company-routing.module';

@NgModule({
  imports: [SharedModule, UserCompanyRoutingModule],
  declarations: [UserCompanyComponent, UserCompanyDetailComponent, UserCompanyUpdateComponent, UserCompanyDeleteDialogComponent],
})
export class UserCompanyModule {}
