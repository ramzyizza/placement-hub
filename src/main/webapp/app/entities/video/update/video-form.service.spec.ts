import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../video.test-samples';

import { VideoFormService } from './video-form.service';

describe('Video Form Service', () => {
  let service: VideoFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VideoFormService);
  });

  describe('Service methods', () => {
    describe('createVideoFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createVideoFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            videoTitle: expect.any(Object),
            description: expect.any(Object),
            contentType: expect.any(Object),
            thumbnail: expect.any(Object),
            createdAt: expect.any(Object),
            sourceURL: expect.any(Object),
          })
        );
      });

      it('passing IVideo should create a new form with FormGroup', () => {
        const formGroup = service.createVideoFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            videoTitle: expect.any(Object),
            description: expect.any(Object),
            contentType: expect.any(Object),
            thumbnail: expect.any(Object),
            createdAt: expect.any(Object),
            sourceURL: expect.any(Object),
          })
        );
      });
    });

    describe('getVideo', () => {
      it('should return NewVideo for default Video initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createVideoFormGroup(sampleWithNewData);

        const video = service.getVideo(formGroup) as any;

        expect(video).toMatchObject(sampleWithNewData);
      });

      it('should return NewVideo for empty Video initial value', () => {
        const formGroup = service.createVideoFormGroup();

        const video = service.getVideo(formGroup) as any;

        expect(video).toMatchObject({});
      });

      it('should return IVideo', () => {
        const formGroup = service.createVideoFormGroup(sampleWithRequiredData);

        const video = service.getVideo(formGroup) as any;

        expect(video).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IVideo should not enable id FormControl', () => {
        const formGroup = service.createVideoFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewVideo should disable id FormControl', () => {
        const formGroup = service.createVideoFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
