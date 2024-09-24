import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { ICompanyPosts, NewCompanyPosts } from '../company-posts.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts ICompanyPosts for edit and NewCompanyPostsFormGroupInput for create.
 */
type CompanyPostsFormGroupInput = ICompanyPosts | PartialWithRequiredKeyOf<NewCompanyPosts>;

/**
 * Type that converts some properties for forms.
 */
type FormValueOf<T extends ICompanyPosts | NewCompanyPosts> = Omit<T, 'createdAt'> & {
  createdAt?: string | null;
};

type CompanyPostsFormRawValue = FormValueOf<ICompanyPosts>;

type NewCompanyPostsFormRawValue = FormValueOf<NewCompanyPosts>;

type CompanyPostsFormDefaults = Pick<NewCompanyPosts, 'id' | 'createdAt'>;

type CompanyPostsFormGroupContent = {
  id: FormControl<CompanyPostsFormRawValue['id'] | NewCompanyPosts['id']>;
  postContent: FormControl<CompanyPostsFormRawValue['postContent']>;
  postImage: FormControl<CompanyPostsFormRawValue['postImage']>;
  postImageContentType: FormControl<CompanyPostsFormRawValue['postImageContentType']>;
  createdAt: FormControl<CompanyPostsFormRawValue['createdAt']>;
  userCompany: FormControl<CompanyPostsFormRawValue['userCompany']>;
};

export type CompanyPostsFormGroup = FormGroup<CompanyPostsFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class CompanyPostsFormService {
  createCompanyPostsFormGroup(companyPosts: CompanyPostsFormGroupInput = { id: null }): CompanyPostsFormGroup {
    const companyPostsRawValue = this.convertCompanyPostsToCompanyPostsRawValue({
      ...this.getFormDefaults(),
      ...companyPosts,
    });
    return new FormGroup<CompanyPostsFormGroupContent>({
      id: new FormControl(
        { value: companyPostsRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      postContent: new FormControl(companyPostsRawValue.postContent, {
        validators: [Validators.required],
      }),
      postImage: new FormControl(companyPostsRawValue.postImage),
      postImageContentType: new FormControl(companyPostsRawValue.postImageContentType),
      createdAt: new FormControl(companyPostsRawValue.createdAt, {
        validators: [Validators.required],
      }),
      userCompany: new FormControl(companyPostsRawValue.userCompany),
    });
  }

  getCompanyPosts(form: CompanyPostsFormGroup): ICompanyPosts | NewCompanyPosts {
    return this.convertCompanyPostsRawValueToCompanyPosts(form.getRawValue() as CompanyPostsFormRawValue | NewCompanyPostsFormRawValue);
  }

  resetForm(form: CompanyPostsFormGroup, companyPosts: CompanyPostsFormGroupInput): void {
    const companyPostsRawValue = this.convertCompanyPostsToCompanyPostsRawValue({ ...this.getFormDefaults(), ...companyPosts });
    form.reset(
      {
        ...companyPostsRawValue,
        id: { value: companyPostsRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): CompanyPostsFormDefaults {
    const currentTime = dayjs();

    return {
      id: null,
      createdAt: currentTime,
    };
  }

  private convertCompanyPostsRawValueToCompanyPosts(
    rawCompanyPosts: CompanyPostsFormRawValue | NewCompanyPostsFormRawValue
  ): ICompanyPosts | NewCompanyPosts {
    return {
      ...rawCompanyPosts,
      createdAt: dayjs(rawCompanyPosts.createdAt, DATE_TIME_FORMAT),
    };
  }

  private convertCompanyPostsToCompanyPostsRawValue(
    companyPosts: ICompanyPosts | (Partial<NewCompanyPosts> & CompanyPostsFormDefaults)
  ): CompanyPostsFormRawValue | PartialWithRequiredKeyOf<NewCompanyPostsFormRawValue> {
    return {
      ...companyPosts,
      createdAt: companyPosts.createdAt ? companyPosts.createdAt.format(DATE_TIME_FORMAT) : undefined,
    };
  }
}
