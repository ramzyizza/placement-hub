import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { CardComponent } from './list/card.component';
import { CardDetailComponent } from './detail/card-detail.component';
import { CardUpdateComponent } from './update/card-update.component';
import { CardDeleteDialogComponent } from './delete/card-delete-dialog.component';
import { CardRoutingModule } from './route/card-routing.module';

@NgModule({
  imports: [SharedModule, CardRoutingModule],
  declarations: [CardComponent, CardDetailComponent, CardUpdateComponent, CardDeleteDialogComponent],
})
export class CardModule {}
