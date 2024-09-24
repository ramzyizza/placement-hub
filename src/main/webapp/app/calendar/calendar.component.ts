import { Component, OnInit, ViewChild } from '@angular/core';
import { Calendar, CalendarOptions } from '@fullcalendar/core';
import { FullCalendarComponent } from '@fullcalendar/angular';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatCardModule } from '@angular/material/card';
import { NativeDateAdapter } from '@angular/material/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ICalendar } from '../entities/calendar/calendar.model';
import { CalendarService } from './calendar.service';
import { Color } from '../entities/enumerations/color.model';
import { IEvent } from '../entities/event/event.model';
import { EventService } from './event.service';
import { EventDeleteDialogComponent } from '../entities/event/delete/event-delete-dialog.component';
import { filter, switchMap } from 'rxjs';
import { ITEM_DELETED_EVENT } from '../config/navigation.constants';
import { EntityArrayResponseType } from '../entities/event/service/event.service';
import interactionPlugin from '@fullcalendar/interaction';
import dayjs from 'dayjs/esm';

declare var $: any;

type EventType = {
  id: string;
  title: string;
  start: string;
  end: string;
  color: string;
};

@Component({
  selector: 'jhi-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss'],
})
export class CalendarComponent implements OnInit {
  monthHeader: string;
  calendar: Calendar | undefined;
  calendarOptions: CalendarOptions = {
    initialView: 'dayGridMonth',
    views: {
      timeGridWeek: {
        titleFormat: { weekday: 'short', day: 'numeric', omitCommas: true },
        dayHeaderFormat: { weekday: 'short', day: 'numeric', omitCommas: true },
      },
      timeGridDay: {
        dayHeaderFormat: { weekday: 'long', day: 'numeric', omitCommas: true },
      },
    },
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,timeGridDay',
    },
    plugins: [dayGridPlugin, timeGridPlugin],
    navLinks: true,
    navLinkDayClick: 'timeGridDay',
    themeSystem: '#calendar',
    eventClick: this.editEvent.bind(this),
    //events: [ {title: "Trial event", start: '2024-03-13T14:00:00Z', end: '2024-03-13T16:00:00Z', color: 'blue'}, {title: "Another", start: '2024-03-24'}]
  };
  currentDate = new Date();
  selected: Date = new Date();
  userId: number;
  calendars: ICalendar[] = [];
  events: IEvent[] = [];
  interviewEvents: IEvent[] = [];
  acEvents: IEvent[] = [];
  eventsFormatted: EventType[] = [];
  selectedCalendars: number[] = [];
  constructor(
    private modalService: NgbModal,
    private router: Router,
    private http: HttpClient,
    private calendarService: CalendarService,
    private eventService: EventService
  ) {
    this.monthHeader = '';
    this.userId = 0;
  }

  ngOnInit(): void {
    this.updateCardHeader();
    this.initializeFullCalendar();
    this.http.get<any>('/api/account').subscribe(
      response => {
        this.userId = response.id;
      },
      error => {
        console.error('Error fetching user information:', error);
      }
    );
    this.calendarService.getAllCalendars().subscribe(calendars => {
      this.calendars = calendars.filter(calendar => calendar.appUser?.id === this.userId);
      this.selectedCalendars = calendars.map(calendar => calendar.id);
    });
    this.eventService.getAllEvents().subscribe(events => {
      this.events = events.filter(event => event.appUser.id === this.userId);
      this.parseEvents();
      this.calendarOptions.events = this.eventsFormatted;
      this.initializeFullCalendar();
      this.filterInterviews();
    });
  }

  updateCardHeader(): void {
    const currentDate = new Date();
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];

    const day = dayNames[currentDate.getDay()];
    const month = monthNames[currentDate.getMonth()];
    const dayNum = currentDate.getDate();
    const formattedDate = `${day}, ${month} ${dayNum}`;

    this.monthHeader = formattedDate;
  }

  initializeFullCalendar(): void {
    const calendarEl = document.getElementById('calendar')!;
    this.calendar = new Calendar(calendarEl, this.calendarOptions);
    this.calendar.render();
  }

  selectFormat(select: Date): Date {
    const year = select.getFullYear();
    const month = select.getMonth();
    const day = select.getDate();

    const date = new Date(year, month, day);
    return date;
  }

  openCreateCalPopUp(): void {
    this.router.navigate(['/calendar/new']);
  }

  openCreateEventPopUp(): void {
    this.router.navigate(['/event/new']);
  }

  parseEvents(): void {
    for (const event of this.events) {
      const parsedEvent: EventType = {
        id: event.id.toString(),
        title: event.eventName!,
        start: event.eventStart?.toString()!,
        end: event.eventEnd?.toString()!,
        color: this.getColor(event.eventColor?.toString()!),
      };
      this.eventsFormatted.push(parsedEvent);
    }
  }

  filterInterviews(): void {
    this.interviewEvents = this.events.filter(
      event =>
        event.eventType?.toString() === 'INTERVIEW' &&
        (dayjs(event.eventStart).isSame(dayjs(), 'day') || dayjs(event.eventStart).isAfter(dayjs(), 'day'))
    );
    this.acEvents = this.events.filter(
      event =>
        event.eventType?.toString() === 'AC' &&
        (dayjs(event.eventStart).isSame(dayjs(), 'day') || dayjs(event.eventStart).isAfter(dayjs(), 'day'))
    );
  }

  getSelectedCalendars(event: any, calendarId: number): void {
    if (event.target.checked) {
      this.selectedCalendars.push(calendarId);
    } else {
      // if checkbox unchecked
      const index = this.selectedCalendars.indexOf(calendarId);
      if (index !== -1) {
        this.selectedCalendars.splice(index, 1);
      }
    }
    this.reinitializeEvents();
  }

  reinitializeEvents(): void {
    this.eventsFormatted = [];
    this.eventService.getAllEvents().subscribe(events => {
      this.events = events.filter(event => event.appUser.id === this.userId && this.selectedCalendars.includes(event.calendar.id));
      this.parseEvents();
      this.calendarOptions.events = this.eventsFormatted;
      this.initializeFullCalendar();
      this.filterInterviews();
    });
  }

  editEvent(info: any): void {
    const eventId = info.event.id;
    this.router.navigate([`/event/${eventId}/edit`]);
  }

  editCalendar(calendar: any): void {
    const calendarId = calendar.id;
    this.router.navigate([`/calendar/${calendarId}/edit`]);
  }

  getColor(color: string): string {
    if (color === 'RED') {
      return '#BC243C';
    } else if (color === 'ORANGE') {
      return '#FA7A35';
    } else if (color === 'YELLOW') {
      return '#EFC050';
    } else if (color === 'GREEN') {
      return '#009B77';
    } else if (color === 'BLUE') {
      return '#34568B';
    } else if (color === 'PURPLE') {
      return '#6B5B95';
    } else if (color === 'PINK') {
      return '#D65076';
    } else {
      return '#7FCDCD';
    }
  }

  getDateToDisplay(event: IEvent): string {
    const dateStart = dayjs(event.eventStart, 'YYYY-MM-DD HH:mm');
    const dateEnd = dayjs(event.eventEnd, 'YYYY-MM-DD HH:mm');
    const formattedDate = dateStart.format('dddd D MMMM HH:mm');
    const formattedDateEnd = dateEnd.format('HH:mm');
    return `${formattedDate} - ${formattedDateEnd}`;
  }
}
