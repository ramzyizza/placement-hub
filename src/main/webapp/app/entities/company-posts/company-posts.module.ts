import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { CompanyPostsComponent } from './list/company-posts.component';
import { CompanyPostsDetailComponent } from './detail/company-posts-detail.component';
import { CompanyPostsUpdateComponent } from './update/company-posts-update.component';
import { CompanyPostsDeleteDialogComponent } from './delete/company-posts-delete-dialog.component';
import { CompanyPostsRoutingModule } from './route/company-posts-routing.module';

@NgModule({
  imports: [SharedModule, CompanyPostsRoutingModule],
  declarations: [CompanyPostsComponent, CompanyPostsDetailComponent, CompanyPostsUpdateComponent, CompanyPostsDeleteDialogComponent],
})
export class CompanyPostsModule {}
