import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../document.test-samples';

import { DocumentFormService } from './document-form.service';

describe('Document Form Service', () => {
  let service: DocumentFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DocumentFormService);
  });

  describe('Service methods', () => {
    describe('createDocumentFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createDocumentFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            title: expect.any(Object),
            content: expect.any(Object),
            lastEdit: expect.any(Object),
            appUser: expect.any(Object),
          })
        );
      });

      it('passing IDocument should create a new form with FormGroup', () => {
        const formGroup = service.createDocumentFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            title: expect.any(Object),
            content: expect.any(Object),
            lastEdit: expect.any(Object),
            appUser: expect.any(Object),
          })
        );
      });
    });

    describe('getDocument', () => {
      it('should return NewDocument for default Document initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createDocumentFormGroup(sampleWithNewData);

        const document = service.getDocument(formGroup) as any;

        expect(document).toMatchObject(sampleWithNewData);
      });

      it('should return NewDocument for empty Document initial value', () => {
        const formGroup = service.createDocumentFormGroup();

        const document = service.getDocument(formGroup) as any;

        expect(document).toMatchObject({});
      });

      it('should return IDocument', () => {
        const formGroup = service.createDocumentFormGroup(sampleWithRequiredData);

        const document = service.getDocument(formGroup) as any;

        expect(document).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IDocument should not enable id FormControl', () => {
        const formGroup = service.createDocumentFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewDocument should disable id FormControl', () => {
        const formGroup = service.createDocumentFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
