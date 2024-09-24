import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { ICalendar } from '../calendar.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../calendar.test-samples';

import { CalendarService } from './calendar.service';

const requireRestSample: ICalendar = {
  ...sampleWithRequiredData,
};

describe('Calendar Service', () => {
  let service: CalendarService;
  let httpMock: HttpTestingController;
  let expectedResult: ICalendar | ICalendar[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(CalendarService);
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

    it('should create a Calendar', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const calendar = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(calendar).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Calendar', () => {
      const calendar = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(calendar).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Calendar', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Calendar', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a Calendar', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addCalendarToCollectionIfMissing', () => {
      it('should add a Calendar to an empty array', () => {
        const calendar: ICalendar = sampleWithRequiredData;
        expectedResult = service.addCalendarToCollectionIfMissing([], calendar);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(calendar);
      });

      it('should not add a Calendar to an array that contains it', () => {
        const calendar: ICalendar = sampleWithRequiredData;
        const calendarCollection: ICalendar[] = [
          {
            ...calendar,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addCalendarToCollectionIfMissing(calendarCollection, calendar);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Calendar to an array that doesn't contain it", () => {
        const calendar: ICalendar = sampleWithRequiredData;
        const calendarCollection: ICalendar[] = [sampleWithPartialData];
        expectedResult = service.addCalendarToCollectionIfMissing(calendarCollection, calendar);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(calendar);
      });

      it('should add only unique Calendar to an array', () => {
        const calendarArray: ICalendar[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const calendarCollection: ICalendar[] = [sampleWithRequiredData];
        expectedResult = service.addCalendarToCollectionIfMissing(calendarCollection, ...calendarArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const calendar: ICalendar = sampleWithRequiredData;
        const calendar2: ICalendar = sampleWithPartialData;
        expectedResult = service.addCalendarToCollectionIfMissing([], calendar, calendar2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(calendar);
        expect(expectedResult).toContain(calendar2);
      });

      it('should accept null and undefined values', () => {
        const calendar: ICalendar = sampleWithRequiredData;
        expectedResult = service.addCalendarToCollectionIfMissing([], null, calendar, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(calendar);
      });

      it('should return initial array if no Calendar is added', () => {
        const calendarCollection: ICalendar[] = [sampleWithRequiredData];
        expectedResult = service.addCalendarToCollectionIfMissing(calendarCollection, undefined, null);
        expect(expectedResult).toEqual(calendarCollection);
      });
    });

    describe('compareCalendar', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareCalendar(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareCalendar(entity1, entity2);
        const compareResult2 = service.compareCalendar(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareCalendar(entity1, entity2);
        const compareResult2 = service.compareCalendar(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareCalendar(entity1, entity2);
        const compareResult2 = service.compareCalendar(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
