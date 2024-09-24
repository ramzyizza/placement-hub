import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { CalendarComponent } from './list/calendar.component';
import { CalendarDetailComponent } from './detail/calendar-detail.component';
import { CalendarUpdateComponent } from './update/calendar-update.component';
import { CalendarDeleteDialogComponent } from './delete/calendar-delete-dialog.component';
import { CalendarRoutingModule } from './route/calendar-routing.module';

@NgModule({
  imports: [SharedModule, CalendarRoutingModule],
  declarations: [CalendarComponent, CalendarDetailComponent, CalendarUpdateComponent, CalendarDeleteDialogComponent],
})
export class CalendarModule {}
