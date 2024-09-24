import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SharedModule } from 'app/shared/shared.module';
import { NOTES_ROUTE } from './notes.route';
import { NotesComponent } from './notes.component';
import { MatCardModule } from '@angular/material/card';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { QuillModule } from 'ngx-quill';

interface QuillOptions {
  modules: {
    toolbar: any[];
  };
  theme: string;
}
@NgModule({
  imports: [SharedModule, RouterModule.forChild([NOTES_ROUTE]), MatCardModule, DragDropModule, QuillModule /*QuillEditorComponent*/],
  declarations: [NotesComponent],
})
export class NotesModule {}
