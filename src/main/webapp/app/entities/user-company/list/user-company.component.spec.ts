import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { UserCompanyService } from '../service/user-company.service';

import { UserCompanyComponent } from './user-company.component';

describe('UserCompany Management Component', () => {
  let comp: UserCompanyComponent;
  let fixture: ComponentFixture<UserCompanyComponent>;
  let service: UserCompanyService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([{ path: 'user-company', component: UserCompanyComponent }]), HttpClientTestingModule],
      declarations: [UserCompanyComponent],
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
      .overrideTemplate(UserCompanyComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(UserCompanyComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(UserCompanyService);

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
    expect(comp.userCompanies?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to userCompanyService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getUserCompanyIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getUserCompanyIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
