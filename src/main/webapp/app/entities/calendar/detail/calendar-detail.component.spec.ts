import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { CalendarDetailComponent } from './calendar-detail.component';

describe('Calendar Management Detail Component', () => {
  let comp: CalendarDetailComponent;
  let fixture: ComponentFixture<CalendarDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CalendarDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ calendar: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(CalendarDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(CalendarDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load calendar on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.calendar).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
