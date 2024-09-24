import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { FavouriteService } from '../service/favourite.service';

import { FavouriteComponent } from './favourite.component';

describe('Favourite Management Component', () => {
  let comp: FavouriteComponent;
  let fixture: ComponentFixture<FavouriteComponent>;
  let service: FavouriteService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([{ path: 'favourite', component: FavouriteComponent }]), HttpClientTestingModule],
      declarations: [FavouriteComponent],
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
      .overrideTemplate(FavouriteComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(FavouriteComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(FavouriteService);

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
    expect(comp.favourites?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to favouriteService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getFavouriteIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getFavouriteIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
