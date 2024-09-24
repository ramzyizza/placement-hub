import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IReview, NewReview } from '../review.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IReview for edit and NewReviewFormGroupInput for create.
 */
type ReviewFormGroupInput = IReview | PartialWithRequiredKeyOf<NewReview>;

type ReviewFormDefaults = Pick<NewReview, 'id' | 'recommend'>;

type ReviewFormGroupContent = {
  id: FormControl<IReview['id'] | NewReview['id']>;
  companyName: FormControl<IReview['companyName']>;
  role: FormControl<IReview['role']>;
  rating: FormControl<IReview['rating']>;
  review: FormControl<IReview['review']>;
  recommend: FormControl<IReview['recommend']>;
  appUser: FormControl<IReview['appUser']>;
  userCompany: FormControl<IReview['userCompany']>;
};

export type ReviewFormGroup = FormGroup<ReviewFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class ReviewFormService {
  createReviewFormGroup(review: ReviewFormGroupInput = { id: null }): ReviewFormGroup {
    const reviewRawValue = {
      ...this.getFormDefaults(),
      ...review,
    };
    return new FormGroup<ReviewFormGroupContent>({
      id: new FormControl(
        { value: reviewRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      companyName: new FormControl(reviewRawValue.companyName, {}),
      role: new FormControl(reviewRawValue.role, {
        validators: [Validators.required],
      }),
      rating: new FormControl(reviewRawValue.rating, {
        validators: [Validators.required],
      }),
      review: new FormControl(reviewRawValue.review, {
        validators: [Validators.required],
      }),
      recommend: new FormControl(reviewRawValue.recommend, {
        validators: [Validators.required],
      }),
      appUser: new FormControl(reviewRawValue.appUser),
      userCompany: new FormControl(reviewRawValue.userCompany),
    });
  }

  getReview(form: ReviewFormGroup): IReview | NewReview {
    return form.getRawValue() as IReview | NewReview;
  }

  resetForm(form: ReviewFormGroup, review: ReviewFormGroupInput): void {
    const reviewRawValue = { ...this.getFormDefaults(), ...review };
    form.reset(
      {
        ...reviewRawValue,
        id: { value: reviewRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): ReviewFormDefaults {
    return {
      id: null,
      recommend: false,
    };
  }
}
