import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../placement.test-samples';

import { PlacementFormService } from './placement-form.service';

describe('Placement Form Service', () => {
  let service: PlacementFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PlacementFormService);
  });

  describe('Service methods', () => {
    describe('createPlacementFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createPlacementFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            role: expect.any(Object),
            location: expect.any(Object),
            salary: expect.any(Object),
            duration: expect.any(Object),
            industry: expect.any(Object),
            about: expect.any(Object),
            jobDescription: expect.any(Object),
            minimumQualification: expect.any(Object),
            applicationDeadline: expect.any(Object),
            userCompany: expect.any(Object),
            // link: expect.any(Object),
          })
        );
      });

      it('passing IPlacement should create a new form with FormGroup', () => {
        const formGroup = service.createPlacementFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            role: expect.any(Object),
            location: expect.any(Object),
            salary: expect.any(Object),
            duration: expect.any(Object),
            industry: expect.any(Object),
            about: expect.any(Object),
            jobDescription: expect.any(Object),
            minimumQualification: expect.any(Object),
            applicationDeadline: expect.any(Object),
            userCompany: expect.any(Object),
            // link: expect.any(Object),
          })
        );
      });
    });

    describe('getPlacement', () => {
      it('should return NewPlacement for default Placement initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createPlacementFormGroup(sampleWithNewData);

        const placement = service.getPlacement(formGroup) as any;

        expect(placement).toMatchObject(sampleWithNewData);
      });

      it('should return NewPlacement for empty Placement initial value', () => {
        const formGroup = service.createPlacementFormGroup();

        const placement = service.getPlacement(formGroup) as any;

        expect(placement).toMatchObject({});
      });

      it('should return IPlacement', () => {
        const formGroup = service.createPlacementFormGroup(sampleWithRequiredData);

        const placement = service.getPlacement(formGroup) as any;

        expect(placement).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IPlacement should not enable id FormControl', () => {
        const formGroup = service.createPlacementFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewPlacement should disable id FormControl', () => {
        const formGroup = service.createPlacementFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
