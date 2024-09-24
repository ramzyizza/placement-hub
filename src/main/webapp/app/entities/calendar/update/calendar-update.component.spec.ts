import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { CalendarFormService } from './calendar-form.service';
import { CalendarService } from '../service/calendar.service';
import { ICalendar } from '../calendar.model';

import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/user.service';

import { CalendarUpdateComponent } from './calendar-update.component';

describe('Calendar Management Update Component', () => {
  let comp: CalendarUpdateComponent;
  let fixture: ComponentFixture<CalendarUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let calendarFormService: CalendarFormService;
  let calendarService: CalendarService;
  let userService: UserService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [CalendarUpdateComponent],
      providers: [
        FormBuilder,
        {
          provide: ActivatedRoute,
          useValue: {
            params: from([{}]),
          },
        },
      ],
    })
      .overrideTemplate(CalendarUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(CalendarUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    calendarFormService = TestBed.inject(CalendarFormService);
    calendarService = TestBed.inject(CalendarService);
    userService = TestBed.inject(UserService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call User query and add missing value', () => {
      const calendar: ICalendar = { id: 456 };
      const appUser: IUser = { id: 87192 };
      calendar.appUser = appUser;

      const userCollection: IUser[] = [{ id: 89419 }];
      jest.spyOn(userService, 'query').mockReturnValue(of(new HttpResponse({ body: userCollection })));
      const additionalUsers = [appUser];
      const expectedCollection: IUser[] = [...additionalUsers, ...userCollection];
      jest.spyOn(userService, 'addUserToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ calendar });
      comp.ngOnInit();

      expect(userService.query).toHaveBeenCalled();
      expect(userService.addUserToCollectionIfMissing).toHaveBeenCalledWith(
        userCollection,
        ...additionalUsers.map(expect.objectContaining)
      );
      expect(comp.usersSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const calendar: ICalendar = { id: 456 };
      const appUser: IUser = { id: 79255 };
      calendar.appUser = appUser;

      activatedRoute.data = of({ calendar });
      comp.ngOnInit();

      expect(comp.usersSharedCollection).toContain(appUser);
      expect(comp.calendar).toEqual(calendar);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ICalendar>>();
      const calendar = { id: 123 };
      jest.spyOn(calendarFormService, 'getCalendar').mockReturnValue(calendar);
      jest.spyOn(calendarService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ calendar });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: calendar }));
      saveSubject.complete();

      // THEN
      expect(calendarFormService.getCalendar).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(calendarService.update).toHaveBeenCalledWith(expect.objectContaining(calendar));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ICalendar>>();
      const calendar = { id: 123 };
      jest.spyOn(calendarFormService, 'getCalendar').mockReturnValue({ id: null });
      jest.spyOn(calendarService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ calendar: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: calendar }));
      saveSubject.complete();

      // THEN
      expect(calendarFormService.getCalendar).toHaveBeenCalled();
      expect(calendarService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ICalendar>>();
      const calendar = { id: 123 };
      jest.spyOn(calendarService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ calendar });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(calendarService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareUser', () => {
      it('Should forward to userService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(userService, 'compareUser');
        comp.compareUser(entity, entity2);
        expect(userService.compareUser).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
