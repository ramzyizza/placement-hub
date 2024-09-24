import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { IPlacement, NewPlacement } from '../placement.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IPlacement for edit and NewPlacementFormGroupInput for create.
 */
type PlacementFormGroupInput = IPlacement | PartialWithRequiredKeyOf<NewPlacement>;

/**
 * Type that converts some properties for forms.
 */
type FormValueOf<T extends IPlacement | NewPlacement> = Omit<T, 'applicationDeadline'> & {
  applicationDeadline?: string | null;
};

type PlacementFormRawValue = FormValueOf<IPlacement>;

type NewPlacementFormRawValue = FormValueOf<NewPlacement>;

type PlacementFormDefaults = Pick<NewPlacement, 'id' | 'applicationDeadline'>;

type PlacementFormGroupContent = {
  id: FormControl<PlacementFormRawValue['id'] | NewPlacement['id']>;
  role: FormControl<PlacementFormRawValue['role']>;
  location: FormControl<PlacementFormRawValue['location']>;
  salary: FormControl<PlacementFormRawValue['salary']>;
  duration: FormControl<PlacementFormRawValue['duration']>;
  industry: FormControl<PlacementFormRawValue['industry']>;
  about: FormControl<PlacementFormRawValue['about']>;
  jobDescription: FormControl<PlacementFormRawValue['jobDescription']>;
  minimumQualification: FormControl<PlacementFormRawValue['minimumQualification']>;
  applicationDeadline: FormControl<PlacementFormRawValue['applicationDeadline']>;
  userCompany: FormControl<PlacementFormRawValue['userCompany']>;
  link: FormControl<PlacementFormRawValue['link']>;
};

export type PlacementFormGroup = FormGroup<PlacementFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class PlacementFormService {
  createPlacementFormGroup(placement: PlacementFormGroupInput = { id: null }): PlacementFormGroup {
    const placementRawValue = this.convertPlacementToPlacementRawValue({
      ...this.getFormDefaults(),
      ...placement,
    });
    return new FormGroup<PlacementFormGroupContent>({
      id: new FormControl(
        { value: placementRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      role: new FormControl(placementRawValue.role, {
        validators: [Validators.required],
      }),
      location: new FormControl(placementRawValue.location, {
        validators: [Validators.required],
      }),
      salary: new FormControl(placementRawValue.salary, {
        validators: [Validators.required],
      }),
      duration: new FormControl(placementRawValue.duration, {
        validators: [Validators.required],
      }),
      industry: new FormControl(placementRawValue.industry, {
        validators: [Validators.required],
      }),
      about: new FormControl(placementRawValue.about, {
        validators: [Validators.required],
      }),
      jobDescription: new FormControl(placementRawValue.jobDescription, {
        validators: [Validators.required],
      }),
      minimumQualification: new FormControl(placementRawValue.minimumQualification, {
        validators: [Validators.required],
      }),
      applicationDeadline: new FormControl(placementRawValue.applicationDeadline, {
        validators: [Validators.required],
      }),
      userCompany: new FormControl(placementRawValue.userCompany),
      link: new FormControl(placementRawValue.link, {
        validators: [Validators.required],
      }),
    });
  }

  getPlacement(form: PlacementFormGroup): IPlacement | NewPlacement {
    return this.convertPlacementRawValueToPlacement(form.getRawValue() as PlacementFormRawValue | NewPlacementFormRawValue);
  }

  resetForm(form: PlacementFormGroup, placement: PlacementFormGroupInput): void {
    const placementRawValue = this.convertPlacementToPlacementRawValue({ ...this.getFormDefaults(), ...placement });
    form.reset(
      {
        ...placementRawValue,
        id: { value: placementRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): PlacementFormDefaults {
    const currentTime = dayjs();

    return {
      id: null,
      applicationDeadline: currentTime,
    };
  }

  private convertPlacementRawValueToPlacement(rawPlacement: PlacementFormRawValue | NewPlacementFormRawValue): IPlacement | NewPlacement {
    return {
      ...rawPlacement,
      applicationDeadline: dayjs(rawPlacement.applicationDeadline, DATE_TIME_FORMAT),
    };
  }

  private convertPlacementToPlacementRawValue(
    placement: IPlacement | (Partial<NewPlacement> & PlacementFormDefaults)
  ): PlacementFormRawValue | PartialWithRequiredKeyOf<NewPlacementFormRawValue> {
    return {
      ...placement,
      applicationDeadline: placement.applicationDeadline ? placement.applicationDeadline.format(DATE_TIME_FORMAT) : undefined,
    };
  }
}
