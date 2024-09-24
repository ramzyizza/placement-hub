import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { errorRoute } from './layouts/error/error.route';
import { navbarRoute } from './layouts/navbar/navbar.route';
import { DEBUG_INFO_ENABLED } from 'app/app.constants';
import { Authority } from 'app/config/authority.constants';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';

@NgModule({
  imports: [
    RouterModule.forRoot(
      [
        {
          path: 'admin',
          data: {
            authorities: [Authority.ADMIN],
          },
          canActivate: [UserRouteAccessService],
          loadChildren: () => import('./admin/admin-routing.module').then(m => m.AdminRoutingModule),
        },
        {
          path: 'account',
          loadChildren: () => import('./account/account.module').then(m => m.AccountModule),
        },
        {
          path: 'login',
          loadChildren: () => import('./login/login.module').then(m => m.LoginModule),
        },
        {
          path: 'calendar-component',
          loadChildren: () => import('./calendar/calendar.module').then(m => m.CalendarModule),
        },

        {
          path: 'notes',
          loadChildren: () => import('./notes/notes.module').then(m => m.NotesModule),
        },

        {
          path: 'tracker',
          loadChildren: () => import('./tracker/tracker.module').then(m => m.TrackerModule),
        },
        {
          path: 'gdpr',
          loadChildren: () => import('./gdpr/gdpr.module').then(m => m.GDPRModule),
        },
        {
          path: 'article-component',
          loadChildren: () => import('./article/article.module').then(m => m.ArticleModule),
        },
        {
          path: 'ratings-form',
          loadChildren: () => import('./ratings/ratings.module').then(m => m.RatingsModule),
        },
        {
          path: 'ratings-all',
          loadChildren: () => import('./ratings-display/ratings-display.module').then(m => m.RatingsDisplayModule),
        },
        {
          path: 'placement-listing',
          loadChildren: () => import('./placement-listing/placement-listing.component.module').then(m => m.PlacementListingComponentModule),
        },
        {
          path: 'company-profile',
          loadChildren: () => import('./company-profile/company-profile.module').then(m => m.CompanyProfileModule),
        },
        {
          path: 'ratings',
          loadChildren: () => import('./ratings-home/ratings-home.module').then(m => m.RatingsHomeModule),
        },
        {
          path: 'about',
          loadChildren: () => import('./about/about.module').then(m => m.AboutModule),
        },
        {
          path: '',
          loadChildren: () => import(`./entities/entity-routing.module`).then(m => m.EntityRoutingModule),
        },

        navbarRoute,
        ...errorRoute,
      ],
      { enableTracing: DEBUG_INFO_ENABLED }
    ),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
