import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { CalendarComponent } from '../list/calendar.component';
import { CalendarDetailComponent } from '../detail/calendar-detail.component';
import { CalendarUpdateComponent } from '../update/calendar-update.component';
import { CalendarRoutingResolveService } from './calendar-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const calendarRoute: Routes = [
  {
    path: '',
    component: CalendarComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: CalendarDetailComponent,
    resolve: {
      calendar: CalendarRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: CalendarUpdateComponent,
    resolve: {
      calendar: CalendarRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: CalendarUpdateComponent,
    resolve: {
      calendar: CalendarRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(calendarRoute)],
  exports: [RouterModule],
})
export class CalendarRoutingModule {}
