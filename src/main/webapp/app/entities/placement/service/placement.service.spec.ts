import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IPlacement } from '../placement.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../placement.test-samples';

import { PlacementService, RestPlacement } from './placement.service';

const requireRestSample: RestPlacement = {
  ...sampleWithRequiredData,
  applicationDeadline: sampleWithRequiredData.applicationDeadline?.toJSON(),
};

describe('Placement Service', () => {
  let service: PlacementService;
  let httpMock: HttpTestingController;
  let expectedResult: IPlacement | IPlacement[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(PlacementService);
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

    it('should create a Placement', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const placement = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(placement).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Placement', () => {
      const placement = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(placement).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Placement', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Placement', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a Placement', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addPlacementToCollectionIfMissing', () => {
      it('should add a Placement to an empty array', () => {
        const placement: IPlacement = sampleWithRequiredData;
        expectedResult = service.addPlacementToCollectionIfMissing([], placement);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(placement);
      });

      it('should not add a Placement to an array that contains it', () => {
        const placement: IPlacement = sampleWithRequiredData;
        const placementCollection: IPlacement[] = [
          {
            ...placement,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addPlacementToCollectionIfMissing(placementCollection, placement);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Placement to an array that doesn't contain it", () => {
        const placement: IPlacement = sampleWithRequiredData;
        const placementCollection: IPlacement[] = [sampleWithPartialData];
        expectedResult = service.addPlacementToCollectionIfMissing(placementCollection, placement);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(placement);
      });

      it('should add only unique Placement to an array', () => {
        const placementArray: IPlacement[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const placementCollection: IPlacement[] = [sampleWithRequiredData];
        expectedResult = service.addPlacementToCollectionIfMissing(placementCollection, ...placementArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const placement: IPlacement = sampleWithRequiredData;
        const placement2: IPlacement = sampleWithPartialData;
        expectedResult = service.addPlacementToCollectionIfMissing([], placement, placement2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(placement);
        expect(expectedResult).toContain(placement2);
      });

      it('should accept null and undefined values', () => {
        const placement: IPlacement = sampleWithRequiredData;
        expectedResult = service.addPlacementToCollectionIfMissing([], null, placement, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(placement);
      });

      it('should return initial array if no Placement is added', () => {
        const placementCollection: IPlacement[] = [sampleWithRequiredData];
        expectedResult = service.addPlacementToCollectionIfMissing(placementCollection, undefined, null);
        expect(expectedResult).toEqual(placementCollection);
      });
    });

    describe('comparePlacement', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.comparePlacement(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.comparePlacement(entity1, entity2);
        const compareResult2 = service.comparePlacement(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.comparePlacement(entity1, entity2);
        const compareResult2 = service.comparePlacement(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.comparePlacement(entity1, entity2);
        const compareResult2 = service.comparePlacement(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
