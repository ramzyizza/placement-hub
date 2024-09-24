import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'user-company',
        data: { pageTitle: 'UserCompanies' },
        loadChildren: () => import('./user-company/user-company.module').then(m => m.UserCompanyModule),
      },
      {
        path: 'calendar',
        data: { pageTitle: 'Calendars' },
        loadChildren: () => import('./calendar/calendar.module').then(m => m.CalendarModule),
      },
      {
        path: 'event',
        data: { pageTitle: 'Events' },
        loadChildren: () => import('./event/event.module').then(m => m.EventModule),
      },
      {
        path: 'card',
        data: { pageTitle: 'Cards' },
        loadChildren: () => import('./card/card.module').then(m => m.CardModule),
      },
      {
        path: 'company-posts',
        data: { pageTitle: 'CompanyPosts' },
        loadChildren: () => import('./company-posts/company-posts.module').then(m => m.CompanyPostsModule),
      },
      {
        path: 'article',
        data: { pageTitle: 'Articles' },
        loadChildren: () => import('./article/article.module').then(m => m.ArticleModule),
      },
      {
        path: 'video',
        data: { pageTitle: 'Videos' },
        loadChildren: () => import('./video/video.module').then(m => m.VideoModule),
      },
      {
        path: 'favourite',
        data: { pageTitle: 'Favourites' },
        loadChildren: () => import('./favourite/favourite.module').then(m => m.FavouriteModule),
      },
      {
        path: 'document',
        data: { pageTitle: 'Documents' },
        loadChildren: () => import('./document/document.module').then(m => m.DocumentModule),
      },
      {
        path: 'placement',
        data: { pageTitle: 'Placements' },
        loadChildren: () => import('./placement/placement.module').then(m => m.PlacementModule),
      },
      {
        path: 'review',
        data: { pageTitle: 'Reviews' },
        loadChildren: () => import('./review/review.module').then(m => m.ReviewModule),
      },
      /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
    ]),
  ],
})
export class EntityRoutingModule {}
