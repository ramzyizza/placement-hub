import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { COMPANYPROFILE_ROUTE } from './company-profile.route';
import { CompanyProfileComponent } from './company-profile.component';
import { UserCompanyDisplay } from './userCompanyDisplay/userCompanyDisplay';

@NgModule({
  imports: [SharedModule, RouterModule.forChild(COMPANYPROFILE_ROUTE), UserCompanyDisplay],
  declarations: [CompanyProfileComponent],
})
export class CompanyProfileModule {}
