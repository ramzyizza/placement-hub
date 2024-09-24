import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IUserCompany, NewUserCompany } from '../user-company.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IUserCompany for edit and NewUserCompanyFormGroupInput for create.
 */
type UserCompanyFormGroupInput = IUserCompany | PartialWithRequiredKeyOf<NewUserCompany>;

type UserCompanyFormDefaults = Pick<NewUserCompany, 'id'>;

type UserCompanyFormGroupContent = {
  id: FormControl<IUserCompany['id'] | NewUserCompany['id']>;
  name: FormControl<IUserCompany['name']>;
  logo: FormControl<IUserCompany['logo']>;
  logoContentType: FormControl<IUserCompany['logoContentType']>;
  profileImageBackground: FormControl<IUserCompany['profileImageBackground']>;
  profileImageBackgroundContentType: FormControl<IUserCompany['profileImageBackgroundContentType']>;
  companySize: FormControl<IUserCompany['companySize']>;
  industry: FormControl<IUserCompany['industry']>;
  totalLocation: FormControl<IUserCompany['totalLocation']>;
  appUser: FormControl<IUserCompany['appUser']>;
};

export type UserCompanyFormGroup = FormGroup<UserCompanyFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class UserCompanyFormService {
  createUserCompanyFormGroup(userCompany: UserCompanyFormGroupInput = { id: null }): UserCompanyFormGroup {
    const userCompanyRawValue = {
      ...this.getFormDefaults(),
      ...userCompany,
    };
    return new FormGroup<UserCompanyFormGroupContent>({
      id: new FormControl(
        { value: userCompanyRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      name: new FormControl(userCompanyRawValue.name, {
        validators: [Validators.required],
      }),
      logo: new FormControl(userCompanyRawValue.logo),
      logoContentType: new FormControl(userCompanyRawValue.logoContentType),
      profileImageBackground: new FormControl(userCompanyRawValue.profileImageBackground),
      profileImageBackgroundContentType: new FormControl(userCompanyRawValue.profileImageBackgroundContentType),
      companySize: new FormControl(userCompanyRawValue.companySize, {
        validators: [Validators.required],
      }),
      industry: new FormControl(userCompanyRawValue.industry, {
        validators: [Validators.required],
      }),
      totalLocation: new FormControl(userCompanyRawValue.totalLocation, {
        validators: [Validators.required],
      }),
      appUser: new FormControl(userCompanyRawValue.appUser),
    });
  }

  getUserCompany(form: UserCompanyFormGroup): IUserCompany | NewUserCompany {
    return form.getRawValue() as IUserCompany | NewUserCompany;
  }

  resetForm(form: UserCompanyFormGroup, userCompany: UserCompanyFormGroupInput): void {
    const userCompanyRawValue = { ...this.getFormDefaults(), ...userCompany };
    form.reset(
      {
        ...userCompanyRawValue,
        id: { value: userCompanyRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): UserCompanyFormDefaults {
    return {
      id: null,
    };
  }
}
