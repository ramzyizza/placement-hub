import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { PlacementFormService } from './placement-form.service';
import { PlacementService } from '../service/placement.service';
import { IPlacement } from '../placement.model';
import { IUserCompany } from 'app/entities/user-company/user-company.model';
import { UserCompanyService } from 'app/entities/user-company/service/user-company.service';

import { PlacementUpdateComponent } from './placement-update.component';

describe('Placement Management Update Component', () => {
  let comp: PlacementUpdateComponent;
  let fixture: ComponentFixture<PlacementUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let placementFormService: PlacementFormService;
  let placementService: PlacementService;
  let userCompanyService: UserCompanyService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [PlacementUpdateComponent],
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
      .overrideTemplate(PlacementUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(PlacementUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    placementFormService = TestBed.inject(PlacementFormService);
    placementService = TestBed.inject(PlacementService);
    userCompanyService = TestBed.inject(UserCompanyService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call UserCompany query and add missing value', () => {
      const placement: IPlacement = { id: 456 };
      const userCompany: IUserCompany = { id: 97483 };
      placement.userCompany = userCompany;

      const userCompanyCollection: IUserCompany[] = [{ id: 71859 }];
      jest.spyOn(userCompanyService, 'query').mockReturnValue(of(new HttpResponse({ body: userCompanyCollection })));
      const additionalUserCompanies = [userCompany];
      const expectedCollection: IUserCompany[] = [...additionalUserCompanies, ...userCompanyCollection];
      jest.spyOn(userCompanyService, 'addUserCompanyToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ placement });
      comp.ngOnInit();

      expect(userCompanyService.query).toHaveBeenCalled();
      expect(userCompanyService.addUserCompanyToCollectionIfMissing).toHaveBeenCalledWith(
        userCompanyCollection,
        ...additionalUserCompanies.map(expect.objectContaining)
      );
      expect(comp.userCompaniesSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const placement: IPlacement = { id: 456 };
      const userCompany: IUserCompany = { id: 55828 };
      placement.userCompany = userCompany;

      activatedRoute.data = of({ placement });
      comp.ngOnInit();

      expect(comp.userCompaniesSharedCollection).toContain(userCompany);
      expect(comp.placement).toEqual(placement);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IPlacement>>();
      const placement = { id: 123 };
      jest.spyOn(placementFormService, 'getPlacement').mockReturnValue(placement);
      jest.spyOn(placementService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ placement });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: placement }));
      saveSubject.complete();

      // THEN
      expect(placementFormService.getPlacement).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(placementService.update).toHaveBeenCalledWith(expect.objectContaining(placement));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IPlacement>>();
      const placement = { id: 123 };
      jest.spyOn(placementFormService, 'getPlacement').mockReturnValue({ id: null });
      jest.spyOn(placementService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ placement: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: placement }));
      saveSubject.complete();

      // THEN
      expect(placementFormService.getPlacement).toHaveBeenCalled();
      expect(placementService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IPlacement>>();
      const placement = { id: 123 };
      jest.spyOn(placementService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ placement });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(placementService.update).toHaveBeenCalled();
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
