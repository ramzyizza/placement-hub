import { CompanySize } from 'app/entities/enumerations/company-size.model';
import { Industry } from 'app/entities/enumerations/industry.model';

import { IUserCompany, NewUserCompany } from './user-company.model';

export const sampleWithRequiredData: IUserCompany = {
  id: 875,
  name: 'GB sensor',
  companySize: CompanySize['BETWEEN_500_AND_1000'],
  industry: Industry['Food_Service'],
  totalLocation: 711,
};

export const sampleWithPartialData: IUserCompany = {
  id: 25969,
  name: 'HDD',
  logo: '../fake-data/blob/hipster.png',
  logoContentType: 'unknown',
  profileImageBackground: '../fake-data/blob/hipster.png',
  profileImageBackgroundContentType: 'unknown',
  companySize: CompanySize['MORE_THAN_10000'],
  industry: Industry['Agriculture'],
  totalLocation: 73143,
};

export const sampleWithFullData: IUserCompany = {
  id: 99278,
  name: 'Buckinghamshire Throughway Crossroad',
  logo: '../fake-data/blob/hipster.png',
  logoContentType: 'unknown',
  profileImageBackground: '../fake-data/blob/hipster.png',
  profileImageBackgroundContentType: 'unknown',
  companySize: CompanySize['MORE_THAN_10000'],
  industry: Industry['Construction'],
  totalLocation: 89451,
};

export const sampleWithNewData: NewUserCompany = {
  name: 'Avon',
  companySize: CompanySize['BETWEEN_500_AND_1000'],
  industry: Industry['Hospitality'],
  totalLocation: 31017,
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
