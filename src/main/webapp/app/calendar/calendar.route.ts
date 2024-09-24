import { Route } from '@angular/router';
import { CalendarComponent } from './calendar.component';
import { UserRouteAccessService } from '../core/auth/user-route-access.service';

export const CALENDAR_ROUTE: Route = {
  path: '',
  component: CalendarComponent,
  data: {
    pageTitle: 'Calendar',
    authorities: ['ROLE_USER'],
  },
  canActivate: [UserRouteAccessService],
};
