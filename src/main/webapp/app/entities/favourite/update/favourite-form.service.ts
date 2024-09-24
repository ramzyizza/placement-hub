import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { IFavourite, NewFavourite } from '../favourite.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IFavourite for edit and NewFavouriteFormGroupInput for create.
 */
type FavouriteFormGroupInput = IFavourite | PartialWithRequiredKeyOf<NewFavourite>;

/**
 * Type that converts some properties for forms.
 */
type FormValueOf<T extends IFavourite | NewFavourite> = Omit<T, 'createdAt'> & {
  createdAt?: string | null;
};

type FavouriteFormRawValue = FormValueOf<IFavourite>;

type NewFavouriteFormRawValue = FormValueOf<NewFavourite>;

type FavouriteFormDefaults = Pick<NewFavourite, 'id' | 'createdAt'>;

type FavouriteFormGroupContent = {
  id: FormControl<FavouriteFormRawValue['id'] | NewFavourite['id']>;
  createdAt: FormControl<FavouriteFormRawValue['createdAt']>;
  appUser: FormControl<FavouriteFormRawValue['appUser']>;
  article: FormControl<FavouriteFormRawValue['article']>;
  video: FormControl<FavouriteFormRawValue['video']>;
};

export type FavouriteFormGroup = FormGroup<FavouriteFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class FavouriteFormService {
  createFavouriteFormGroup(favourite: FavouriteFormGroupInput = { id: null }): FavouriteFormGroup {
    const favouriteRawValue = this.convertFavouriteToFavouriteRawValue({
      ...this.getFormDefaults(),
      ...favourite,
    });
    return new FormGroup<FavouriteFormGroupContent>({
      id: new FormControl(
        { value: favouriteRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      createdAt: new FormControl(favouriteRawValue.createdAt, {
        validators: [Validators.required],
      }),
      appUser: new FormControl(favouriteRawValue.appUser),
      article: new FormControl(favouriteRawValue.article),
      video: new FormControl(favouriteRawValue.video),
    });
  }

  getFavourite(form: FavouriteFormGroup): IFavourite | NewFavourite {
    return this.convertFavouriteRawValueToFavourite(form.getRawValue() as FavouriteFormRawValue | NewFavouriteFormRawValue);
  }

  resetForm(form: FavouriteFormGroup, favourite: FavouriteFormGroupInput): void {
    const favouriteRawValue = this.convertFavouriteToFavouriteRawValue({ ...this.getFormDefaults(), ...favourite });
    form.reset(
      {
        ...favouriteRawValue,
        id: { value: favouriteRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): FavouriteFormDefaults {
    const currentTime = dayjs();

    return {
      id: null,
      createdAt: currentTime,
    };
  }

  private convertFavouriteRawValueToFavourite(rawFavourite: FavouriteFormRawValue | NewFavouriteFormRawValue): IFavourite | NewFavourite {
    return {
      ...rawFavourite,
      createdAt: dayjs(rawFavourite.createdAt, DATE_TIME_FORMAT),
    };
  }

  private convertFavouriteToFavouriteRawValue(
    favourite: IFavourite | (Partial<NewFavourite> & FavouriteFormDefaults)
  ): FavouriteFormRawValue | PartialWithRequiredKeyOf<NewFavouriteFormRawValue> {
    return {
      ...favourite,
      createdAt: favourite.createdAt ? favourite.createdAt.format(DATE_TIME_FORMAT) : undefined,
    };
  }
}
