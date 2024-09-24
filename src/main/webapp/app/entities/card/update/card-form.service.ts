import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { ICard, NewCard } from '../card.model';

import { Observable } from 'rxjs';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { ApplicationConfigService } from '../../../core/config/application-config.service';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts ICard for edit and NewCardFormGroupInput for create.
 */
type CardFormGroupInput = ICard | PartialWithRequiredKeyOf<NewCard>;

/**
 * Type that converts some properties for forms.
 */
type FormValueOf<T extends ICard | NewCard> = Omit<T, 'createdDateTime'> & {
  createdDateTime?: string | null;
};

type CardFormRawValue = FormValueOf<ICard>;

type NewCardFormRawValue = FormValueOf<NewCard>;

type CardFormDefaults = Pick<NewCard, 'id' | 'createdDateTime'>;

type CardFormGroupContent = {
  id: FormControl<CardFormRawValue['id'] | NewCard['id']>;
  applicationStatus: FormControl<CardFormRawValue['applicationStatus']>;
  createdDateTime: FormControl<CardFormRawValue['createdDateTime']>;
  companyName: FormControl<CardFormRawValue['companyName']>;
  jobTitle: FormControl<CardFormRawValue['jobTitle']>;
  jobLocation: FormControl<CardFormRawValue['jobLocation']>;
  jobDuration: FormControl<CardFormRawValue['jobDuration']>;
  appUser: FormControl<CardFormRawValue['appUser']>;
};

export type CardFormGroup = FormGroup<CardFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class CardFormService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/cards');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}
  createCardFormGroup(card: CardFormGroupInput = { id: null }): CardFormGroup {
    const cardRawValue = this.convertCardToCardRawValue({
      ...this.getFormDefaults(),
      ...card,
    });
    return new FormGroup<CardFormGroupContent>({
      id: new FormControl(
        { value: cardRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      applicationStatus: new FormControl(cardRawValue.applicationStatus, {
        validators: [Validators.required],
      }),
      createdDateTime: new FormControl(cardRawValue.createdDateTime),
      companyName: new FormControl(cardRawValue.companyName, {
        validators: [Validators.required],
      }),
      jobTitle: new FormControl(cardRawValue.jobTitle, {
        validators: [Validators.required],
      }),
      jobLocation: new FormControl(cardRawValue.jobLocation),
      jobDuration: new FormControl(cardRawValue.jobDuration),
      appUser: new FormControl(cardRawValue.appUser),
    });
  }
  private delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getCard(form: CardFormGroup): ICard | NewCard {
    return this.convertCardRawValueToCard(form.getRawValue() as CardFormRawValue | NewCardFormRawValue);
  }

  resetForm(form: CardFormGroup, card: CardFormGroupInput): void {
    const cardRawValue = this.convertCardToCardRawValue({ ...this.getFormDefaults(), ...card });
    form.reset(
      {
        ...cardRawValue,
        id: { value: cardRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): CardFormDefaults {
    const currentTime = dayjs();

    return {
      id: null,
      createdDateTime: currentTime,
    };
  }

  private convertCardRawValueToCard(rawCard: CardFormRawValue | NewCardFormRawValue): ICard | NewCard {
    return {
      ...rawCard,
      createdDateTime: dayjs(rawCard.createdDateTime, DATE_TIME_FORMAT),
    };
  }

  private convertCardToCardRawValue(
    card: ICard | (Partial<NewCard> & CardFormDefaults)
  ): CardFormRawValue | PartialWithRequiredKeyOf<NewCardFormRawValue> {
    return {
      ...card,
      createdDateTime: card.createdDateTime ? card.createdDateTime.format(DATE_TIME_FORMAT) : undefined,
    };
  }
}
