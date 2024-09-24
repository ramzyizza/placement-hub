import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { FavouriteComponent } from './list/favourite.component';
import { FavouriteDetailComponent } from './detail/favourite-detail.component';
import { FavouriteUpdateComponent } from './update/favourite-update.component';
import { FavouriteDeleteDialogComponent } from './delete/favourite-delete-dialog.component';
import { FavouriteRoutingModule } from './route/favourite-routing.module';

@NgModule({
  imports: [SharedModule, FavouriteRoutingModule],
  declarations: [FavouriteComponent, FavouriteDetailComponent, FavouriteUpdateComponent, FavouriteDeleteDialogComponent],
})
export class FavouriteModule {}
