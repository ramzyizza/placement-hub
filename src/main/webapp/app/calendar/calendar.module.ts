import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { CALENDAR_ROUTE } from './calendar.route';
import { CalendarComponent } from './calendar.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { FullCalendarModule } from '@fullcalendar/angular';
import { MatSortModule } from '@angular/material/sort';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';

@NgModule({
  imports: [
    SharedModule,
    RouterModule.forChild([CALENDAR_ROUTE]),
    MatDatepickerModule,
    FullCalendarModule,
    MatSortModule,
    MatCardModule,
    MatInputModule,
  ],
  declarations: [CalendarComponent],
})
export class CalendarModule {}
