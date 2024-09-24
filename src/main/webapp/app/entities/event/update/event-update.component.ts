import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { EventFormService, EventFormGroup } from './event-form.service';
import { IEvent } from '../event.model';
import { EventService } from '../service/event.service';
import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/user.service';
import { ICalendar } from 'app/entities/calendar/calendar.model';
import { CalendarService } from 'app/entities/calendar/service/calendar.service';
import { Color } from 'app/entities/enumerations/color.model';
import { EventType } from 'app/entities/enumerations/event-type.model';
import { RepeatType } from 'app/entities/enumerations/repeat-type.model';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { EventDeleteDialogComponent } from '../delete/event-delete-dialog.component';
import { ITEM_DELETED_EVENT } from '../../../config/navigation.constants';
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'jhi-event-update',
  templateUrl: './event-update.component.html',
  styleUrls: ['./event-update.component.scss'],
})
export class EventUpdateComponent implements OnInit {
  isSaving = false;
  event: IEvent | null = null;
  colorValues = Object.keys(Color);
  eventTypeValues = Object.keys(EventType);
  repeatTypeValues = Object.keys(RepeatType);

  usersSharedCollection: IUser[] = [];
  calendarsSharedCollection: ICalendar[] = [];

  editForm: EventFormGroup = this.eventFormService.createEventFormGroup();
  userId: number;

  colorOptions = Object.entries(Color).map(([key, value]) => ({ key, value }));
  eventTypeOptions = Object.entries(EventType).map(([key, value]) => ({ key, value }));
  repeatTypeOptions = Object.entries(RepeatType).map(([key, value]) => ({ key, value }));

  constructor(
    protected eventService: EventService,
    protected eventFormService: EventFormService,
    protected userService: UserService,
    protected calendarService: CalendarService,
    protected activatedRoute: ActivatedRoute,
    private modalService: NgbModal,
    private http: HttpClient
  ) {
    this.userId = 0;
  }

  compareUser = (o1: IUser | null, o2: IUser | null): boolean => this.userService.compareUser(o1, o2);

  compareCalendar = (o1: ICalendar | null, o2: ICalendar | null): boolean => this.calendarService.compareCalendar(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ event }) => {
      this.event = event;
      if (event) {
        this.updateForm(event);
      }

      this.loadRelationshipsOptions();
    });
    this.http.get<any>('/api/account').subscribe(
      response => {
        this.userId = response.id;
      },
      error => {
        console.error('Error fetching user information:', error);
      }
    );
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const event = this.eventFormService.getEvent(this.editForm);
    if (event.id !== null) {
      this.subscribeToSaveResponse(this.eventService.update(event));
    } else {
      this.subscribeToSaveResponse(this.eventService.create(event));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IEvent>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(event: IEvent): void {
    this.event = event;
    this.eventFormService.resetForm(this.editForm, event);

    this.usersSharedCollection = this.userService.addUserToCollectionIfMissing<IUser>(this.usersSharedCollection, event.appUser);
    this.calendarsSharedCollection = this.calendarService.addCalendarToCollectionIfMissing<ICalendar>(
      this.calendarsSharedCollection,
      event.calendar
    );
  }

  protected loadRelationshipsOptions(): void {
    this.userService
      .query()
      .pipe(map((res: HttpResponse<IUser[]>) => res.body ?? []))
      .pipe(map((users: IUser[]) => this.userService.addUserToCollectionIfMissing<IUser>(users, this.event?.appUser)))
      .subscribe((users: IUser[]) => {
        this.usersSharedCollection = users;
        this.usersSharedCollection = this.usersSharedCollection.filter(user => user.id === this.userId);
      });

    this.calendarService
      .query()
      .pipe(map((res: HttpResponse<ICalendar[]>) => res.body ?? []))
      .pipe(
        map((calendars: ICalendar[]) => this.calendarService.addCalendarToCollectionIfMissing<ICalendar>(calendars, this.event?.calendar))
      )
      .subscribe((calendars: ICalendar[]) => {
        this.calendarsSharedCollection = calendars;
        this.calendarsSharedCollection = this.calendarsSharedCollection.filter(calendar => calendar.appUser?.id === this.userId);
      });
  }

  protected deleteEvent(): void {
    const modalRef = this.modalService.open(EventDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.event = this.event;
    modalRef.result.then(result => {
      if (result === ITEM_DELETED_EVENT) {
        this.previousState();
      }
    });
  }

  protected checkNew(): boolean {
    if (this.event === null) {
      return true;
    }
    return false;
  }

  protected checkUser(): boolean {
    if (this.userId === 1) {
      return true;
    } else {
      return false;
    }
  }
}
