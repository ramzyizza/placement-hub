import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { ArticleService } from '../service/article.service';

import { ArticleComponent } from './article.component';

describe('Article Management Component', () => {
  let comp: ArticleComponent;
  let fixture: ComponentFixture<ArticleComponent>;
  let service: ArticleService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([{ path: 'article', component: ArticleComponent }]), HttpClientTestingModule],
      declarations: [ArticleComponent],
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
      .overrideTemplate(ArticleComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ArticleComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(ArticleService);

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
    expect(comp.articles?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to articleService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getArticleIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getArticleIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
