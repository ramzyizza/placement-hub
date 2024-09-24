import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { ICalendar, NewCalendar } from '../calendar.model';
import { Observable } from 'rxjs';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { ApplicationConfigService } from '../../../core/config/application-config.service';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts ICalendar for edit and NewCalendarFormGroupInput for create.
 */
type CalendarFormGroupInput = ICalendar | PartialWithRequiredKeyOf<NewCalendar>;

type CalendarFormDefaults = Pick<NewCalendar, 'id'>;

type CalendarFormGroupContent = {
  id: FormControl<ICalendar['id'] | NewCalendar['id']>;
  calendarName: FormControl<ICalendar['calendarName']>;
  calendarDescription: FormControl<ICalendar['calendarDescription']>;
  calendarColor: FormControl<ICalendar['calendarColor']>;
  appUser: FormControl<ICalendar['appUser']>;
};

export type CalendarFormGroup = FormGroup<CalendarFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class CalendarFormService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/calendars');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}
  createCalendarFormGroup(calendar: CalendarFormGroupInput = { id: null }): CalendarFormGroup {
    const calendarRawValue = {
      ...this.getFormDefaults(),
      ...calendar,
    };
    return new FormGroup<CalendarFormGroupContent>({
      id: new FormControl(
        { value: calendarRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      calendarName: new FormControl(calendarRawValue.calendarName, {
        validators: [Validators.required],
      }),
      calendarDescription: new FormControl(calendarRawValue.calendarDescription),
      calendarColor: new FormControl(calendarRawValue.calendarColor, {
        validators: [Validators.required],
      }),
      appUser: new FormControl(calendarRawValue.appUser),
    });
  }

  getCalendar(form: CalendarFormGroup): ICalendar | NewCalendar {
    return form.getRawValue() as ICalendar | NewCalendar;
  }

  resetForm(form: CalendarFormGroup, calendar: CalendarFormGroupInput): void {
    const calendarRawValue = { ...this.getFormDefaults(), ...calendar };
    form.reset(
      {
        ...calendarRawValue,
        id: { value: calendarRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): CalendarFormDefaults {
    return {
      id: null,
    };
  }

  private delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }
}
