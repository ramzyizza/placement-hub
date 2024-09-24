import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IFavourite } from '../favourite.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../favourite.test-samples';

import { FavouriteService, RestFavourite } from './favourite.service';

const requireRestSample: RestFavourite = {
  ...sampleWithRequiredData,
  createdAt: sampleWithRequiredData.createdAt?.toJSON(),
};

describe('Favourite Service', () => {
  let service: FavouriteService;
  let httpMock: HttpTestingController;
  let expectedResult: IFavourite | IFavourite[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(FavouriteService);
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

    it('should create a Favourite', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const favourite = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(favourite).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Favourite', () => {
      const favourite = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(favourite).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Favourite', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Favourite', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a Favourite', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addFavouriteToCollectionIfMissing', () => {
      it('should add a Favourite to an empty array', () => {
        const favourite: IFavourite = sampleWithRequiredData;
        expectedResult = service.addFavouriteToCollectionIfMissing([], favourite);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(favourite);
      });

      it('should not add a Favourite to an array that contains it', () => {
        const favourite: IFavourite = sampleWithRequiredData;
        const favouriteCollection: IFavourite[] = [
          {
            ...favourite,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addFavouriteToCollectionIfMissing(favouriteCollection, favourite);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Favourite to an array that doesn't contain it", () => {
        const favourite: IFavourite = sampleWithRequiredData;
        const favouriteCollection: IFavourite[] = [sampleWithPartialData];
        expectedResult = service.addFavouriteToCollectionIfMissing(favouriteCollection, favourite);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(favourite);
      });

      it('should add only unique Favourite to an array', () => {
        const favouriteArray: IFavourite[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const favouriteCollection: IFavourite[] = [sampleWithRequiredData];
        expectedResult = service.addFavouriteToCollectionIfMissing(favouriteCollection, ...favouriteArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const favourite: IFavourite = sampleWithRequiredData;
        const favourite2: IFavourite = sampleWithPartialData;
        expectedResult = service.addFavouriteToCollectionIfMissing([], favourite, favourite2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(favourite);
        expect(expectedResult).toContain(favourite2);
      });

      it('should accept null and undefined values', () => {
        const favourite: IFavourite = sampleWithRequiredData;
        expectedResult = service.addFavouriteToCollectionIfMissing([], null, favourite, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(favourite);
      });

      it('should return initial array if no Favourite is added', () => {
        const favouriteCollection: IFavourite[] = [sampleWithRequiredData];
        expectedResult = service.addFavouriteToCollectionIfMissing(favouriteCollection, undefined, null);
        expect(expectedResult).toEqual(favouriteCollection);
      });
    });

    describe('compareFavourite', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareFavourite(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareFavourite(entity1, entity2);
        const compareResult2 = service.compareFavourite(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareFavourite(entity1, entity2);
        const compareResult2 = service.compareFavourite(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareFavourite(entity1, entity2);
        const compareResult2 = service.compareFavourite(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
