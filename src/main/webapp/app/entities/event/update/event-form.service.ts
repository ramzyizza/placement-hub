import { Injectable } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { IEvent, NewEvent } from '../event.model';
import { RepeatType } from '../../enumerations/repeat-type.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IEvent for edit and NewEventFormGroupInput for create.
 */
type EventFormGroupInput = IEvent | PartialWithRequiredKeyOf<NewEvent>;

/**
 * Type that converts some properties for forms.
 */
type FormValueOf<T extends IEvent | NewEvent> = Omit<T, 'eventStart' | 'eventEnd'> & {
  eventStart?: string | null;
  eventEnd?: string | null;
};

type EventFormRawValue = FormValueOf<IEvent>;

type NewEventFormRawValue = FormValueOf<NewEvent>;

type EventFormDefaults = Pick<NewEvent, 'id' | 'eventStart' | 'eventEnd'>;

type EventFormGroupContent = {
  id: FormControl<EventFormRawValue['id'] | NewEvent['id']>;
  eventName: FormControl<EventFormRawValue['eventName']>;
  eventDescription: FormControl<EventFormRawValue['eventDescription']>;
  eventColor: FormControl<EventFormRawValue['eventColor']>;
  eventType: FormControl<EventFormRawValue['eventType']>;
  eventStart: FormControl<EventFormRawValue['eventStart']>;
  eventEnd: FormControl<EventFormRawValue['eventEnd']>;
  eventRepeat: FormControl<EventFormRawValue['eventRepeat']>;
  eventLocation: FormControl<EventFormRawValue['eventLocation']>;
  appUser: FormControl<EventFormRawValue['appUser']>;
  calendar: FormControl<EventFormRawValue['calendar']>;
};

export type EventFormGroup = FormGroup<EventFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class EventFormService {
  createEventFormGroup(event: EventFormGroupInput = { id: null }): EventFormGroup {
    const eventRawValue = this.convertEventToEventRawValue({
      ...this.getFormDefaults(),
      ...event,
      eventRepeat: RepeatType.NA,
    });
    return new FormGroup<EventFormGroupContent>({
      id: new FormControl(
        { value: eventRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      eventName: new FormControl(eventRawValue.eventName, {
        validators: [Validators.required],
      }),
      eventDescription: new FormControl(eventRawValue.eventDescription),
      eventColor: new FormControl(eventRawValue.eventColor),
      eventType: new FormControl(eventRawValue.eventType, {
        validators: [Validators.required],
      }),
      eventStart: new FormControl(eventRawValue.eventStart, {
        validators: [Validators.required],
      }),
      eventEnd: new FormControl(eventRawValue.eventEnd, {
        validators: [Validators.required],
      }),
      eventRepeat: new FormControl(eventRawValue.eventRepeat, {
        //validators: [Validators.required],
      }),
      eventLocation: new FormControl(eventRawValue.eventLocation),
      appUser: new FormControl(eventRawValue.appUser),
      calendar: new FormControl(eventRawValue.calendar),
    });
  }

  getEvent(form: EventFormGroup): IEvent | NewEvent {
    return this.convertEventRawValueToEvent(form.getRawValue() as EventFormRawValue | NewEventFormRawValue);
  }

  resetForm(form: EventFormGroup, event: EventFormGroupInput): void {
    const eventRawValue = this.convertEventToEventRawValue({ ...this.getFormDefaults(), ...event });
    form.reset(
      {
        ...eventRawValue,
        id: { value: eventRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): EventFormDefaults {
    const currentTime = dayjs();

    return {
      id: null,
      eventStart: currentTime,
      eventEnd: currentTime,
    };
  }

  private convertEventRawValueToEvent(rawEvent: EventFormRawValue | NewEventFormRawValue): IEvent | NewEvent {
    return {
      ...rawEvent,
      eventStart: dayjs(rawEvent.eventStart, DATE_TIME_FORMAT),
      eventEnd: dayjs(rawEvent.eventEnd, DATE_TIME_FORMAT),
    };
  }

  private convertEventToEventRawValue(
    event: IEvent | (Partial<NewEvent> & EventFormDefaults)
  ): EventFormRawValue | PartialWithRequiredKeyOf<NewEventFormRawValue> {
    return {
      ...event,
      eventStart: event.eventStart ? event.eventStart.format(DATE_TIME_FORMAT) : undefined,
      eventEnd: event.eventEnd ? event.eventEnd.format(DATE_TIME_FORMAT) : undefined,
    };
  }
}
