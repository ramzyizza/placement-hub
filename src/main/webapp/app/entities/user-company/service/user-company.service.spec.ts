import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IUserCompany } from '../user-company.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../user-company.test-samples';

import { UserCompanyService } from './user-company.service';

const requireRestSample: IUserCompany = {
  ...sampleWithRequiredData,
};

describe('UserCompany Service', () => {
  let service: UserCompanyService;
  let httpMock: HttpTestingController;
  let expectedResult: IUserCompany | IUserCompany[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(UserCompanyService);
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

    it('should create a UserCompany', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const userCompany = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(userCompany).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a UserCompany', () => {
      const userCompany = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(userCompany).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a UserCompany', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of UserCompany', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a UserCompany', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addUserCompanyToCollectionIfMissing', () => {
      it('should add a UserCompany to an empty array', () => {
        const userCompany: IUserCompany = sampleWithRequiredData;
        expectedResult = service.addUserCompanyToCollectionIfMissing([], userCompany);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(userCompany);
      });

      it('should not add a UserCompany to an array that contains it', () => {
        const userCompany: IUserCompany = sampleWithRequiredData;
        const userCompanyCollection: IUserCompany[] = [
          {
            ...userCompany,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addUserCompanyToCollectionIfMissing(userCompanyCollection, userCompany);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a UserCompany to an array that doesn't contain it", () => {
        const userCompany: IUserCompany = sampleWithRequiredData;
        const userCompanyCollection: IUserCompany[] = [sampleWithPartialData];
        expectedResult = service.addUserCompanyToCollectionIfMissing(userCompanyCollection, userCompany);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(userCompany);
      });

      it('should add only unique UserCompany to an array', () => {
        const userCompanyArray: IUserCompany[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const userCompanyCollection: IUserCompany[] = [sampleWithRequiredData];
        expectedResult = service.addUserCompanyToCollectionIfMissing(userCompanyCollection, ...userCompanyArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const userCompany: IUserCompany = sampleWithRequiredData;
        const userCompany2: IUserCompany = sampleWithPartialData;
        expectedResult = service.addUserCompanyToCollectionIfMissing([], userCompany, userCompany2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(userCompany);
        expect(expectedResult).toContain(userCompany2);
      });

      it('should accept null and undefined values', () => {
        const userCompany: IUserCompany = sampleWithRequiredData;
        expectedResult = service.addUserCompanyToCollectionIfMissing([], null, userCompany, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(userCompany);
      });

      it('should return initial array if no UserCompany is added', () => {
        const userCompanyCollection: IUserCompany[] = [sampleWithRequiredData];
        expectedResult = service.addUserCompanyToCollectionIfMissing(userCompanyCollection, undefined, null);
        expect(expectedResult).toEqual(userCompanyCollection);
      });
    });

    describe('compareUserCompany', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareUserCompany(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareUserCompany(entity1, entity2);
        const compareResult2 = service.compareUserCompany(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareUserCompany(entity1, entity2);
        const compareResult2 = service.compareUserCompany(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareUserCompany(entity1, entity2);
        const compareResult2 = service.compareUserCompany(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
