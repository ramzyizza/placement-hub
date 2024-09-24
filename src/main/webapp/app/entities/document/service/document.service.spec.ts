import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IDocument } from '../document.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../document.test-samples';

import { DocumentService, RestDocument } from './document.service';

const requireRestSample: RestDocument = {
  ...sampleWithRequiredData,
  lastEdit: sampleWithRequiredData.lastEdit?.toJSON(),
};

describe('Document Service', () => {
  let service: DocumentService;
  let httpMock: HttpTestingController;
  let expectedResult: IDocument | IDocument[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(DocumentService);
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

    it('should create a Document', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const document = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(document).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Document', () => {
      const document = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(document).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Document', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Document', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a Document', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addDocumentToCollectionIfMissing', () => {
      it('should add a Document to an empty array', () => {
        const document: IDocument = sampleWithRequiredData;
        expectedResult = service.addDocumentToCollectionIfMissing([], document);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(document);
      });

      it('should not add a Document to an array that contains it', () => {
        const document: IDocument = sampleWithRequiredData;
        const documentCollection: IDocument[] = [
          {
            ...document,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addDocumentToCollectionIfMissing(documentCollection, document);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Document to an array that doesn't contain it", () => {
        const document: IDocument = sampleWithRequiredData;
        const documentCollection: IDocument[] = [sampleWithPartialData];
        expectedResult = service.addDocumentToCollectionIfMissing(documentCollection, document);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(document);
      });

      it('should add only unique Document to an array', () => {
        const documentArray: IDocument[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const documentCollection: IDocument[] = [sampleWithRequiredData];
        expectedResult = service.addDocumentToCollectionIfMissing(documentCollection, ...documentArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const document: IDocument = sampleWithRequiredData;
        const document2: IDocument = sampleWithPartialData;
        expectedResult = service.addDocumentToCollectionIfMissing([], document, document2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(document);
        expect(expectedResult).toContain(document2);
      });

      it('should accept null and undefined values', () => {
        const document: IDocument = sampleWithRequiredData;
        expectedResult = service.addDocumentToCollectionIfMissing([], null, document, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(document);
      });

      it('should return initial array if no Document is added', () => {
        const documentCollection: IDocument[] = [sampleWithRequiredData];
        expectedResult = service.addDocumentToCollectionIfMissing(documentCollection, undefined, null);
        expect(expectedResult).toEqual(documentCollection);
      });
    });

    describe('compareDocument', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareDocument(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareDocument(entity1, entity2);
        const compareResult2 = service.compareDocument(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareDocument(entity1, entity2);
        const compareResult2 = service.compareDocument(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareDocument(entity1, entity2);
        const compareResult2 = service.compareDocument(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
