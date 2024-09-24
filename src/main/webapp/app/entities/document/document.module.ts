import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { DocumentComponent } from './list/document.component';
import { DocumentDetailComponent } from './detail/document-detail.component';
import { DocumentUpdateComponent } from './update/document-update.component';
import { DocumentDeleteDialogComponent } from './delete/document-delete-dialog.component';
import { DocumentRoutingModule } from './route/document-routing.module';

@NgModule({
  imports: [SharedModule, DocumentRoutingModule],
  declarations: [DocumentComponent, DocumentDetailComponent, DocumentUpdateComponent, DocumentDeleteDialogComponent],
})
export class DocumentModule {}
