import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { CardDetailComponent } from './card-detail.component';

describe('Card Management Detail Component', () => {
  let comp: CardDetailComponent;
  let fixture: ComponentFixture<CardDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CardDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ card: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(CardDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(CardDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load card on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.card).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
