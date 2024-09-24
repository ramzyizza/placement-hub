import { Route } from '@angular/router';
import { UserRouteAccessService } from '../core/auth/user-route-access.service';
import { NotesComponent } from './notes.component';

export const NOTES_ROUTE: Route = {
  path: '',
  component: NotesComponent,
  data: {
    pageTitle: 'Notes',
    authorities: ['ROLE_USER'],
  },
  canActivate: [UserRouteAccessService],
};
