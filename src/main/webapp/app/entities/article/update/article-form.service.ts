import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { IArticle, NewArticle } from '../article.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IArticle for edit and NewArticleFormGroupInput for create.
 */
type ArticleFormGroupInput = IArticle | PartialWithRequiredKeyOf<NewArticle>;

/**
 * Type that converts some properties for forms.
 */
type FormValueOf<T extends IArticle | NewArticle> = Omit<T, 'createdAt'> & {
  createdAt?: string | null;
};

type ArticleFormRawValue = FormValueOf<IArticle>;

type NewArticleFormRawValue = FormValueOf<NewArticle>;

type ArticleFormDefaults = Pick<NewArticle, 'id' | 'createdAt'>;

type ArticleFormGroupContent = {
  id: FormControl<ArticleFormRawValue['id'] | NewArticle['id']>;
  articleName: FormControl<ArticleFormRawValue['articleName']>;
  contentType: FormControl<ArticleFormRawValue['contentType']>;
  sourceLink: FormControl<ArticleFormRawValue['sourceLink']>;
  thumbnail: FormControl<ArticleFormRawValue['thumbnail']>;
  thumbnailContentType: FormControl<ArticleFormRawValue['thumbnailContentType']>;
  createdAt: FormControl<ArticleFormRawValue['createdAt']>;
};

export type ArticleFormGroup = FormGroup<ArticleFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class ArticleFormService {
  createArticleFormGroup(article: ArticleFormGroupInput = { id: null }): ArticleFormGroup {
    const articleRawValue = this.convertArticleToArticleRawValue({
      ...this.getFormDefaults(),
      ...article,
    });
    return new FormGroup<ArticleFormGroupContent>({
      id: new FormControl(
        { value: articleRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      articleName: new FormControl(articleRawValue.articleName, {
        validators: [Validators.required],
      }),
      contentType: new FormControl(articleRawValue.contentType, {
        validators: [Validators.required],
      }),
      sourceLink: new FormControl(articleRawValue.sourceLink),
      thumbnail: new FormControl(articleRawValue.thumbnail, {
        validators: [Validators.required],
      }),
      thumbnailContentType: new FormControl(articleRawValue.thumbnailContentType),
      createdAt: new FormControl(articleRawValue.createdAt),
    });
  }

  getArticle(form: ArticleFormGroup): IArticle | NewArticle {
    return this.convertArticleRawValueToArticle(form.getRawValue() as ArticleFormRawValue | NewArticleFormRawValue);
  }

  resetForm(form: ArticleFormGroup, article: ArticleFormGroupInput): void {
    const articleRawValue = this.convertArticleToArticleRawValue({ ...this.getFormDefaults(), ...article });
    form.reset(
      {
        ...articleRawValue,
        id: { value: articleRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): ArticleFormDefaults {
    const currentTime = dayjs();

    return {
      id: null,
      createdAt: currentTime,
    };
  }

  private convertArticleRawValueToArticle(rawArticle: ArticleFormRawValue | NewArticleFormRawValue): IArticle | NewArticle {
    return {
      ...rawArticle,
      createdAt: dayjs(rawArticle.createdAt, DATE_TIME_FORMAT),
    };
  }

  private convertArticleToArticleRawValue(
    article: IArticle | (Partial<NewArticle> & ArticleFormDefaults)
  ): ArticleFormRawValue | PartialWithRequiredKeyOf<NewArticleFormRawValue> {
    return {
      ...article,
      createdAt: article.createdAt ? article.createdAt.format(DATE_TIME_FORMAT) : undefined,
    };
  }
}
