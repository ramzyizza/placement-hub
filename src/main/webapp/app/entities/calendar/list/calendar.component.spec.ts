import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { CalendarService } from '../service/calendar.service';

import { CalendarComponent } from './calendar.component';

describe('Calendar Management Component', () => {
  let comp: CalendarComponent;
  let fixture: ComponentFixture<CalendarComponent>;
  let service: CalendarService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([{ path: 'calendar', component: CalendarComponent }]), HttpClientTestingModule],
      declarations: [CalendarComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            data: of({
              defaultSort: 'id,asc',
            }),
            queryParamMap: of(
              jest.requireActual('@angular/router').convertToParamMap({
                page: '1',
                size: '1',
                sort: 'id,desc',
              })
            ),
            snapshot: { queryParams: {} },
          },
        },
      ],
    })
      .overrideTemplate(CalendarComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(CalendarComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(CalendarService);

    const headers = new HttpHeaders();
    jest.spyOn(service, 'query').mockReturnValue(
      of(
        new HttpResponse({
          body: [{ id: 123 }],
          headers,
        })
      )
    );
  });

  it('Should call load all on init', () => {
    // WHEN
    comp.ngOnInit();

    // THEN
    expect(service.query).toHaveBeenCalled();
    expect(comp.calendars?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to calendarService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getCalendarIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getCalendarIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
