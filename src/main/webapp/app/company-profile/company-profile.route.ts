import { Routes } from '@angular/router';
import { CompanyProfileComponent } from './company-profile.component';
import { DetailsComponent } from './details/details.component';
import { CompanyDashboardComponent } from './companyDashboard/companyDashboard.component';

export const COMPANYPROFILE_ROUTE: Routes = [
  {
    path: '',
    component: CompanyProfileComponent,
    data: {
      pageTitle: 'Company Profiles',
    },
  },
  {
    path: 'details/:id',
    component: DetailsComponent,
    data: {
      title: 'Company Profiles',
    },
  },
  {
    path: 'companydashboard/:id',
    component: CompanyDashboardComponent,
    data: {
      title: 'Company Dashboard',
    },
  },
];
