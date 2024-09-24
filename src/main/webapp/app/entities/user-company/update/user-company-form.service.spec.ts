import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../user-company.test-samples';

import { UserCompanyFormService } from './user-company-form.service';

describe('UserCompany Form Service', () => {
  let service: UserCompanyFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserCompanyFormService);
  });

  describe('Service methods', () => {
    describe('createUserCompanyFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createUserCompanyFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            name: expect.any(Object),
            logo: expect.any(Object),
            profileImageBackground: expect.any(Object),
            companySize: expect.any(Object),
            industry: expect.any(Object),
            totalLocation: expect.any(Object),
            appUser: expect.any(Object),
          })
        );
      });

      it('passing IUserCompany should create a new form with FormGroup', () => {
        const formGroup = service.createUserCompanyFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            name: expect.any(Object),
            logo: expect.any(Object),
            profileImageBackground: expect.any(Object),
            companySize: expect.any(Object),
            industry: expect.any(Object),
            totalLocation: expect.any(Object),
            appUser: expect.any(Object),
          })
        );
      });
    });

    describe('getUserCompany', () => {
      it('should return NewUserCompany for default UserCompany initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createUserCompanyFormGroup(sampleWithNewData);

        const userCompany = service.getUserCompany(formGroup) as any;

        expect(userCompany).toMatchObject(sampleWithNewData);
      });

      it('should return NewUserCompany for empty UserCompany initial value', () => {
        const formGroup = service.createUserCompanyFormGroup();

        const userCompany = service.getUserCompany(formGroup) as any;

        expect(userCompany).toMatchObject({});
      });

      it('should return IUserCompany', () => {
        const formGroup = service.createUserCompanyFormGroup(sampleWithRequiredData);

        const userCompany = service.getUserCompany(formGroup) as any;

        expect(userCompany).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IUserCompany should not enable id FormControl', () => {
        const formGroup = service.createUserCompanyFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewUserCompany should disable id FormControl', () => {
        const formGroup = service.createUserCompanyFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
