import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IVideo } from '../video.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../video.test-samples';

import { VideoService, RestVideo } from './video.service';

const requireRestSample: RestVideo = {
  ...sampleWithRequiredData,
  createdAt: sampleWithRequiredData.createdAt?.toJSON(),
};

describe('Video Service', () => {
  let service: VideoService;
  let httpMock: HttpTestingController;
  let expectedResult: IVideo | IVideo[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(VideoService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  describe('Service methods', () => {
    it('should find an element', () => {
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.find(123).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should create a Video', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const video = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(video).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Video', () => {
      const video = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(video).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Video', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Video', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a Video', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addVideoToCollectionIfMissing', () => {
      it('should add a Video to an empty array', () => {
        const video: IVideo = sampleWithRequiredData;
        expectedResult = service.addVideoToCollectionIfMissing([], video);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(video);
      });

      it('should not add a Video to an array that contains it', () => {
        const video: IVideo = sampleWithRequiredData;
        const videoCollection: IVideo[] = [
          {
            ...video,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addVideoToCollectionIfMissing(videoCollection, video);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Video to an array that doesn't contain it", () => {
        const video: IVideo = sampleWithRequiredData;
        const videoCollection: IVideo[] = [sampleWithPartialData];
        expectedResult = service.addVideoToCollectionIfMissing(videoCollection, video);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(video);
      });

      it('should add only unique Video to an array', () => {
        const videoArray: IVideo[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const videoCollection: IVideo[] = [sampleWithRequiredData];
        expectedResult = service.addVideoToCollectionIfMissing(videoCollection, ...videoArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const video: IVideo = sampleWithRequiredData;
        const video2: IVideo = sampleWithPartialData;
        expectedResult = service.addVideoToCollectionIfMissing([], video, video2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(video);
        expect(expectedResult).toContain(video2);
      });

      it('should accept null and undefined values', () => {
        const video: IVideo = sampleWithRequiredData;
        expectedResult = service.addVideoToCollectionIfMissing([], null, video, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(video);
      });

      it('should return initial array if no Video is added', () => {
        const videoCollection: IVideo[] = [sampleWithRequiredData];
        expectedResult = service.addVideoToCollectionIfMissing(videoCollection, undefined, null);
        expect(expectedResult).toEqual(videoCollection);
      });
    });

    describe('compareVideo', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareVideo(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareVideo(entity1, entity2);
        const compareResult2 = service.compareVideo(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareVideo(entity1, entity2);
        const compareResult2 = service.compareVideo(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareVideo(entity1, entity2);
        const compareResult2 = service.compareVideo(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
