import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SharedModule } from 'app/shared/shared.module';
import { ARTICLE_ROUTE } from './article.route';
import { ArticleComponent } from './article.component';
import { HOME_ROUTE } from '../home/home.route';
import { HomeComponent } from '../home/home.component';
@NgModule({
  imports: [SharedModule, RouterModule.forChild([ARTICLE_ROUTE])],
  declarations: [ArticleComponent],
})
export class ArticleModule {}
