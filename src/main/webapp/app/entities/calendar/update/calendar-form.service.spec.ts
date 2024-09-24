import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../calendar.test-samples';

import { CalendarFormService } from './calendar-form.service';

describe('Calendar Form Service', () => {
  let service: CalendarFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CalendarFormService);
  });

  describe('Service methods', () => {
    describe('createCalendarFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createCalendarFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            calendarName: expect.any(Object),
            calendarDescription: expect.any(Object),
            calendarColor: expect.any(Object),
            appUser: expect.any(Object),
          })
        );
      });

      it('passing ICalendar should create a new form with FormGroup', () => {
        const formGroup = service.createCalendarFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            calendarName: expect.any(Object),
            calendarDescription: expect.any(Object),
            calendarColor: expect.any(Object),
            appUser: expect.any(Object),
          })
        );
      });
    });

    describe('getCalendar', () => {
      it('should return NewCalendar for default Calendar initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createCalendarFormGroup(sampleWithNewData);

        const calendar = service.getCalendar(formGroup) as any;

        expect(calendar).toMatchObject(sampleWithNewData);
      });

      it('should return NewCalendar for empty Calendar initial value', () => {
        const formGroup = service.createCalendarFormGroup();

        const calendar = service.getCalendar(formGroup) as any;

        expect(calendar).toMatchObject({});
      });

      it('should return ICalendar', () => {
        const formGroup = service.createCalendarFormGroup(sampleWithRequiredData);

        const calendar = service.getCalendar(formGroup) as any;

        expect(calendar).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing ICalendar should not enable id FormControl', () => {
        const formGroup = service.createCalendarFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewCalendar should disable id FormControl', () => {
        const formGroup = service.createCalendarFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
