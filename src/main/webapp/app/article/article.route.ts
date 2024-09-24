import { Route } from '@angular/router';
import { ArticleComponent } from './article.component';

export const ARTICLE_ROUTE: Route = {
  path: '',
  component: ArticleComponent,
  data: {
    pageTitle: 'Article',
  },
};
