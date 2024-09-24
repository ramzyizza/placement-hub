import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { ICompanyPosts } from '../company-posts.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../company-posts.test-samples';

import { CompanyPostsService, RestCompanyPosts } from './company-posts.service';

const requireRestSample: RestCompanyPosts = {
  ...sampleWithRequiredData,
  createdAt: sampleWithRequiredData.createdAt?.toJSON(),
};

describe('CompanyPosts Service', () => {
  let service: CompanyPostsService;
  let httpMock: HttpTestingController;
  let expectedResult: ICompanyPosts | ICompanyPosts[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(CompanyPostsService);
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

    it('should create a CompanyPosts', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const companyPosts = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(companyPosts).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a CompanyPosts', () => {
      const companyPosts = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(companyPosts).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a CompanyPosts', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of CompanyPosts', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a CompanyPosts', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addCompanyPostsToCollectionIfMissing', () => {
      it('should add a CompanyPosts to an empty array', () => {
        const companyPosts: ICompanyPosts = sampleWithRequiredData;
        expectedResult = service.addCompanyPostsToCollectionIfMissing([], companyPosts);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(companyPosts);
      });

      it('should not add a CompanyPosts to an array that contains it', () => {
        const companyPosts: ICompanyPosts = sampleWithRequiredData;
        const companyPostsCollection: ICompanyPosts[] = [
          {
            ...companyPosts,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addCompanyPostsToCollectionIfMissing(companyPostsCollection, companyPosts);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a CompanyPosts to an array that doesn't contain it", () => {
        const companyPosts: ICompanyPosts = sampleWithRequiredData;
        const companyPostsCollection: ICompanyPosts[] = [sampleWithPartialData];
        expectedResult = service.addCompanyPostsToCollectionIfMissing(companyPostsCollection, companyPosts);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(companyPosts);
      });

      it('should add only unique CompanyPosts to an array', () => {
        const companyPostsArray: ICompanyPosts[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const companyPostsCollection: ICompanyPosts[] = [sampleWithRequiredData];
        expectedResult = service.addCompanyPostsToCollectionIfMissing(companyPostsCollection, ...companyPostsArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const companyPosts: ICompanyPosts = sampleWithRequiredData;
        const companyPosts2: ICompanyPosts = sampleWithPartialData;
        expectedResult = service.addCompanyPostsToCollectionIfMissing([], companyPosts, companyPosts2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(companyPosts);
        expect(expectedResult).toContain(companyPosts2);
      });

      it('should accept null and undefined values', () => {
        const companyPosts: ICompanyPosts = sampleWithRequiredData;
        expectedResult = service.addCompanyPostsToCollectionIfMissing([], null, companyPosts, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(companyPosts);
      });

      it('should return initial array if no CompanyPosts is added', () => {
        const companyPostsCollection: ICompanyPosts[] = [sampleWithRequiredData];
        expectedResult = service.addCompanyPostsToCollectionIfMissing(companyPostsCollection, undefined, null);
        expect(expectedResult).toEqual(companyPostsCollection);
      });
    });

    describe('compareCompanyPosts', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareCompanyPosts(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareCompanyPosts(entity1, entity2);
        const compareResult2 = service.compareCompanyPosts(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareCompanyPosts(entity1, entity2);
        const compareResult2 = service.compareCompanyPosts(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareCompanyPosts(entity1, entity2);
        const compareResult2 = service.compareCompanyPosts(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
