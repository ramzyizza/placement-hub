import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { PlacementService } from '../service/placement.service';

import { PlacementComponent } from './placement.component';

describe('Placement Management Component', () => {
  let comp: PlacementComponent;
  let fixture: ComponentFixture<PlacementComponent>;
  let service: PlacementService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([{ path: 'placement', component: PlacementComponent }]), HttpClientTestingModule],
      declarations: [PlacementComponent],
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
      .overrideTemplate(PlacementComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(PlacementComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(PlacementService);

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
    expect(comp.placements?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to placementService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getPlacementIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getPlacementIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
