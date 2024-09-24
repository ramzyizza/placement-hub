import { Route } from '@angular/router';

import { GDPRComponent } from './gdpr.component';

export const GDPR_ROUTE: Route = {
  path: '',
  component: GDPRComponent,
  data: {
    pageTitle: 'GDPR PlacementHub',
  },
};
