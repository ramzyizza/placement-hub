import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../company-posts.test-samples';

import { CompanyPostsFormService } from './company-posts-form.service';

describe('CompanyPosts Form Service', () => {
  let service: CompanyPostsFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CompanyPostsFormService);
  });

  describe('Service methods', () => {
    describe('createCompanyPostsFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createCompanyPostsFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            postContent: expect.any(Object),
            postImage: expect.any(Object),
            createdAt: expect.any(Object),
            userCompany: expect.any(Object),
          })
        );
      });

      it('passing ICompanyPosts should create a new form with FormGroup', () => {
        const formGroup = service.createCompanyPostsFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            postContent: expect.any(Object),
            postImage: expect.any(Object),
            createdAt: expect.any(Object),
            userCompany: expect.any(Object),
          })
        );
      });
    });

    describe('getCompanyPosts', () => {
      it('should return NewCompanyPosts for default CompanyPosts initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createCompanyPostsFormGroup(sampleWithNewData);

        const companyPosts = service.getCompanyPosts(formGroup) as any;

        expect(companyPosts).toMatchObject(sampleWithNewData);
      });

      it('should return NewCompanyPosts for empty CompanyPosts initial value', () => {
        const formGroup = service.createCompanyPostsFormGroup();

        const companyPosts = service.getCompanyPosts(formGroup) as any;

        expect(companyPosts).toMatchObject({});
      });

      it('should return ICompanyPosts', () => {
        const formGroup = service.createCompanyPostsFormGroup(sampleWithRequiredData);

        const companyPosts = service.getCompanyPosts(formGroup) as any;

        expect(companyPosts).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing ICompanyPosts should not enable id FormControl', () => {
        const formGroup = service.createCompanyPostsFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewCompanyPosts should disable id FormControl', () => {
        const formGroup = service.createCompanyPostsFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
