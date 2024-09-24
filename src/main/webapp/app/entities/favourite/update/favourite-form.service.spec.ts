import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../favourite.test-samples';

import { FavouriteFormService } from './favourite-form.service';

describe('Favourite Form Service', () => {
  let service: FavouriteFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FavouriteFormService);
  });

  describe('Service methods', () => {
    describe('createFavouriteFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createFavouriteFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            createdAt: expect.any(Object),
            appUser: expect.any(Object),
            article: expect.any(Object),
            video: expect.any(Object),
          })
        );
      });

      it('passing IFavourite should create a new form with FormGroup', () => {
        const formGroup = service.createFavouriteFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            createdAt: expect.any(Object),
            appUser: expect.any(Object),
            article: expect.any(Object),
            video: expect.any(Object),
          })
        );
      });
    });

    describe('getFavourite', () => {
      it('should return NewFavourite for default Favourite initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createFavouriteFormGroup(sampleWithNewData);

        const favourite = service.getFavourite(formGroup) as any;

        expect(favourite).toMatchObject(sampleWithNewData);
      });

      it('should return NewFavourite for empty Favourite initial value', () => {
        const formGroup = service.createFavouriteFormGroup();

        const favourite = service.getFavourite(formGroup) as any;

        expect(favourite).toMatchObject({});
      });

      it('should return IFavourite', () => {
        const formGroup = service.createFavouriteFormGroup(sampleWithRequiredData);

        const favourite = service.getFavourite(formGroup) as any;

        expect(favourite).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IFavourite should not enable id FormControl', () => {
        const formGroup = service.createFavouriteFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewFavourite should disable id FormControl', () => {
        const formGroup = service.createFavouriteFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
