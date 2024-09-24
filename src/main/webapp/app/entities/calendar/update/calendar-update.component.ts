import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { CalendarFormService, CalendarFormGroup } from './calendar-form.service';
import { ICalendar } from '../calendar.model';
import { CalendarService } from '../service/calendar.service';
import { getUserIdentifier, IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/user.service';
import { Color } from 'app/entities/enumerations/color.model';
import { EventDeleteDialogComponent } from '../../event/delete/event-delete-dialog.component';
import { ITEM_DELETED_EVENT } from '../../../config/navigation.constants';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CalendarDeleteDialogComponent } from '../delete/calendar-delete-dialog.component';

@Component({
  selector: 'jhi-calendar-update',
  templateUrl: './calendar-update.component.html',
  styleUrls: ['./calendar-update.component.scss'],
})
export class CalendarUpdateComponent implements OnInit {
  isSaving = false;
  calendar: ICalendar | null = null;
  colorValues = Object.keys(Color);

  usersSharedCollection: IUser[] = [];

  editForm: CalendarFormGroup = this.calendarFormService.createCalendarFormGroup();
  userId: number;

  colorOptions = Object.keys(Color).map(key => ({
    key,
    value: Color[key as keyof typeof Color],
  }));

  constructor(
    protected calendarService: CalendarService,
    protected calendarFormService: CalendarFormService,
    protected userService: UserService,
    protected activatedRoute: ActivatedRoute,
    private http: HttpClient,
    private modalService: NgbModal
  ) {
    this.userId = 0;
  }

  compareUser = (o1: IUser | null, o2: IUser | null): boolean => this.userService.compareUser(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ calendar }) => {
      this.calendar = calendar;
      if (calendar) {
        this.updateForm(calendar);
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
    const calendar = this.calendarFormService.getCalendar(this.editForm);
    if (calendar.id !== null) {
      this.subscribeToSaveResponse(this.calendarService.update(calendar));
    } else {
      this.subscribeToSaveResponse(this.calendarService.create(calendar));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ICalendar>>): void {
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

  protected updateForm(calendar: ICalendar): void {
    this.calendar = calendar;
    this.calendarFormService.resetForm(this.editForm, calendar);

    this.usersSharedCollection = this.userService.addUserToCollectionIfMissing<IUser>(this.usersSharedCollection, calendar.appUser);
  }

  protected loadRelationshipsOptions(): void {
    this.userService
      .query()
      .pipe(map((res: HttpResponse<IUser[]>) => res.body ?? []))
      .pipe(map((users: IUser[]) => this.userService.addUserToCollectionIfMissing<IUser>(users, this.calendar?.appUser)))
      .subscribe((users: IUser[]) => {
        this.usersSharedCollection = users;
        this.usersSharedCollection = this.usersSharedCollection.filter(user => user.id === this.userId);
      });
  }

  protected deleteCalendar(): void {
    const modalRef = this.modalService.open(CalendarDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.calendar = this.calendar;
    modalRef.result.then(result => {
      if (result === ITEM_DELETED_EVENT) {
        this.previousState();
      }
    });
  }

  protected checkNew(): boolean {
    if (this.calendar === null) {
      return true;
    }
    return false;
  }
}
