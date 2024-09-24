import { Route } from '@angular/router';

import { RatingsDisplayComponent } from './ratings-display.component';

export const RATINGSDISPLAY_ROUTE: Route = {
  path: '',
  component: RatingsDisplayComponent,
  data: {
    pageTitle: 'Ratings Display',
  },
};
