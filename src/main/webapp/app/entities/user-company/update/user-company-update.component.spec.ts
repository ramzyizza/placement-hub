import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { UserCompanyFormService } from './user-company-form.service';
import { UserCompanyService } from '../service/user-company.service';
import { IUserCompany } from '../user-company.model';

import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/user.service';

import { UserCompanyUpdateComponent } from './user-company-update.component';

describe('UserCompany Management Update Component', () => {
  let comp: UserCompanyUpdateComponent;
  let fixture: ComponentFixture<UserCompanyUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let userCompanyFormService: UserCompanyFormService;
  let userCompanyService: UserCompanyService;
  let userService: UserService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [UserCompanyUpdateComponent],
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
      .overrideTemplate(UserCompanyUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(UserCompanyUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    userCompanyFormService = TestBed.inject(UserCompanyFormService);
    userCompanyService = TestBed.inject(UserCompanyService);
    userService = TestBed.inject(UserService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call User query and add missing value', () => {
      const userCompany: IUserCompany = { id: 456 };
      const appUser: IUser = { id: 78525 };
      userCompany.appUser = appUser;

      const userCollection: IUser[] = [{ id: 45457 }];
      jest.spyOn(userService, 'query').mockReturnValue(of(new HttpResponse({ body: userCollection })));
      const additionalUsers = [appUser];
      const expectedCollection: IUser[] = [...additionalUsers, ...userCollection];
      jest.spyOn(userService, 'addUserToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ userCompany });
      comp.ngOnInit();

      expect(userService.query).toHaveBeenCalled();
      expect(userService.addUserToCollectionIfMissing).toHaveBeenCalledWith(
        userCollection,
        ...additionalUsers.map(expect.objectContaining)
      );
      expect(comp.usersSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const userCompany: IUserCompany = { id: 456 };
      const appUser: IUser = { id: 95529 };
      userCompany.appUser = appUser;

      activatedRoute.data = of({ userCompany });
      comp.ngOnInit();

      expect(comp.usersSharedCollection).toContain(appUser);
      expect(comp.userCompany).toEqual(userCompany);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IUserCompany>>();
      const userCompany = { id: 123 };
      jest.spyOn(userCompanyFormService, 'getUserCompany').mockReturnValue(userCompany);
      jest.spyOn(userCompanyService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ userCompany });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: userCompany }));
      saveSubject.complete();

      // THEN
      expect(userCompanyFormService.getUserCompany).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(userCompanyService.update).toHaveBeenCalledWith(expect.objectContaining(userCompany));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IUserCompany>>();
      const userCompany = { id: 123 };
      jest.spyOn(userCompanyFormService, 'getUserCompany').mockReturnValue({ id: null });
      jest.spyOn(userCompanyService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ userCompany: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: userCompany }));
      saveSubject.complete();

      // THEN
      expect(userCompanyFormService.getUserCompany).toHaveBeenCalled();
      expect(userCompanyService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IUserCompany>>();
      const userCompany = { id: 123 };
      jest.spyOn(userCompanyService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ userCompany });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(userCompanyService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareUser', () => {
      it('Should forward to userService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(userService, 'compareUser');
        comp.compareUser(entity, entity2);
        expect(userService.compareUser).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
