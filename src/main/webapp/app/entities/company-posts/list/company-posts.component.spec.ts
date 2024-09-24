import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { CompanyPostsService } from '../service/company-posts.service';

import { CompanyPostsComponent } from './company-posts.component';

describe('CompanyPosts Management Component', () => {
  let comp: CompanyPostsComponent;
  let fixture: ComponentFixture<CompanyPostsComponent>;
  let service: CompanyPostsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([{ path: 'company-posts', component: CompanyPostsComponent }]), HttpClientTestingModule],
      declarations: [CompanyPostsComponent],
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
      .overrideTemplate(CompanyPostsComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(CompanyPostsComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(CompanyPostsService);

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
    expect(comp.companyPosts?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to companyPostsService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getCompanyPostsIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getCompanyPostsIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
