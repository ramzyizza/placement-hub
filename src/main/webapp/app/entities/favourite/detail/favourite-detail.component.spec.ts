import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { FavouriteDetailComponent } from './favourite-detail.component';

describe('Favourite Management Detail Component', () => {
  let comp: FavouriteDetailComponent;
  let fixture: ComponentFixture<FavouriteDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FavouriteDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ favourite: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(FavouriteDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(FavouriteDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load favourite on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.favourite).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
