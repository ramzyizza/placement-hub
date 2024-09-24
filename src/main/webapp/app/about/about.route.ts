import { Route } from '@angular/router';

import { AboutComponent } from './about.component';

export const ABOUT_ROUTE: Route = {
  path: '',
  component: AboutComponent,
  data: {
    pageTitle: 'GDPR PlacementHub',
  },
};
