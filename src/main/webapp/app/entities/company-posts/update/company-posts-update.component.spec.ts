import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { CompanyPostsFormService } from './company-posts-form.service';
import { CompanyPostsService } from '../service/company-posts.service';
import { ICompanyPosts } from '../company-posts.model';
import { IUserCompany } from 'app/entities/user-company/user-company.model';
import { UserCompanyService } from 'app/entities/user-company/service/user-company.service';

import { CompanyPostsUpdateComponent } from './company-posts-update.component';

describe('CompanyPosts Management Update Component', () => {
  let comp: CompanyPostsUpdateComponent;
  let fixture: ComponentFixture<CompanyPostsUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let companyPostsFormService: CompanyPostsFormService;
  let companyPostsService: CompanyPostsService;
  let userCompanyService: UserCompanyService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [CompanyPostsUpdateComponent],
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
      .overrideTemplate(CompanyPostsUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(CompanyPostsUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    companyPostsFormService = TestBed.inject(CompanyPostsFormService);
    companyPostsService = TestBed.inject(CompanyPostsService);
    userCompanyService = TestBed.inject(UserCompanyService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call UserCompany query and add missing value', () => {
      const companyPosts: ICompanyPosts = { id: 456 };
      const userCompany: IUserCompany = { id: 98262 };
      companyPosts.userCompany = userCompany;

      const userCompanyCollection: IUserCompany[] = [{ id: 98702 }];
      jest.spyOn(userCompanyService, 'query').mockReturnValue(of(new HttpResponse({ body: userCompanyCollection })));
      const additionalUserCompanies = [userCompany];
      const expectedCollection: IUserCompany[] = [...additionalUserCompanies, ...userCompanyCollection];
      jest.spyOn(userCompanyService, 'addUserCompanyToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ companyPosts });
      comp.ngOnInit();

      expect(userCompanyService.query).toHaveBeenCalled();
      expect(userCompanyService.addUserCompanyToCollectionIfMissing).toHaveBeenCalledWith(
        userCompanyCollection,
        ...additionalUserCompanies.map(expect.objectContaining)
      );
      expect(comp.userCompaniesSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const companyPosts: ICompanyPosts = { id: 456 };
      const userCompany: IUserCompany = { id: 28293 };
      companyPosts.userCompany = userCompany;

      activatedRoute.data = of({ companyPosts });
      comp.ngOnInit();

      expect(comp.userCompaniesSharedCollection).toContain(userCompany);
      expect(comp.companyPosts).toEqual(companyPosts);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ICompanyPosts>>();
      const companyPosts = { id: 123 };
      jest.spyOn(companyPostsFormService, 'getCompanyPosts').mockReturnValue(companyPosts);
      jest.spyOn(companyPostsService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ companyPosts });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: companyPosts }));
      saveSubject.complete();

      // THEN
      expect(companyPostsFormService.getCompanyPosts).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(companyPostsService.update).toHaveBeenCalledWith(expect.objectContaining(companyPosts));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ICompanyPosts>>();
      const companyPosts = { id: 123 };
      jest.spyOn(companyPostsFormService, 'getCompanyPosts').mockReturnValue({ id: null });
      jest.spyOn(companyPostsService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ companyPosts: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: companyPosts }));
      saveSubject.complete();

      // THEN
      expect(companyPostsFormService.getCompanyPosts).toHaveBeenCalled();
      expect(companyPostsService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ICompanyPosts>>();
      const companyPosts = { id: 123 };
      jest.spyOn(companyPostsService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ companyPosts });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(companyPostsService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareUserCompany', () => {
      it('Should forward to userCompanyService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(userCompanyService, 'compareUserCompany');
        comp.compareUserCompany(entity, entity2);
        expect(userCompanyService.compareUserCompany).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
