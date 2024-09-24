import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { IVideo, NewVideo } from '../video.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IVideo for edit and NewVideoFormGroupInput for create.
 */
type VideoFormGroupInput = IVideo | PartialWithRequiredKeyOf<NewVideo>;

/**
 * Type that converts some properties for forms.
 */
type FormValueOf<T extends IVideo | NewVideo> = Omit<T, 'createdAt'> & {
  createdAt?: string | null;
};

type VideoFormRawValue = FormValueOf<IVideo>;

type NewVideoFormRawValue = FormValueOf<NewVideo>;

type VideoFormDefaults = Pick<NewVideo, 'id' | 'createdAt'>;

type VideoFormGroupContent = {
  id: FormControl<VideoFormRawValue['id'] | NewVideo['id']>;
  videoTitle: FormControl<VideoFormRawValue['videoTitle']>;
  description: FormControl<VideoFormRawValue['description']>;
  contentType: FormControl<VideoFormRawValue['contentType']>;
  thumbnail: FormControl<VideoFormRawValue['thumbnail']>;
  thumbnailContentType: FormControl<VideoFormRawValue['thumbnailContentType']>;
  createdAt: FormControl<VideoFormRawValue['createdAt']>;
  sourceURL: FormControl<VideoFormRawValue['sourceURL']>;
};

export type VideoFormGroup = FormGroup<VideoFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class VideoFormService {
  createVideoFormGroup(video: VideoFormGroupInput = { id: null }): VideoFormGroup {
    const videoRawValue = this.convertVideoToVideoRawValue({
      ...this.getFormDefaults(),
      ...video,
    });
    return new FormGroup<VideoFormGroupContent>({
      id: new FormControl(
        { value: videoRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      videoTitle: new FormControl(videoRawValue.videoTitle, {
        validators: [Validators.required],
      }),
      description: new FormControl(videoRawValue.description),
      contentType: new FormControl(videoRawValue.contentType, {
        validators: [Validators.required],
      }),
      thumbnail: new FormControl(videoRawValue.thumbnail, {
        validators: [Validators.required],
      }),
      thumbnailContentType: new FormControl(videoRawValue.thumbnailContentType),
      createdAt: new FormControl(videoRawValue.createdAt, {
        validators: [Validators.required],
      }),
      sourceURL: new FormControl(videoRawValue.sourceURL, {
        validators: [Validators.required],
      }),
    });
  }

  getVideo(form: VideoFormGroup): IVideo | NewVideo {
    return this.convertVideoRawValueToVideo(form.getRawValue() as VideoFormRawValue | NewVideoFormRawValue);
  }

  resetForm(form: VideoFormGroup, video: VideoFormGroupInput): void {
    const videoRawValue = this.convertVideoToVideoRawValue({ ...this.getFormDefaults(), ...video });
    form.reset(
      {
        ...videoRawValue,
        id: { value: videoRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): VideoFormDefaults {
    const currentTime = dayjs();

    return {
      id: null,
      createdAt: currentTime,
    };
  }

  private convertVideoRawValueToVideo(rawVideo: VideoFormRawValue | NewVideoFormRawValue): IVideo | NewVideo {
    return {
      ...rawVideo,
      createdAt: dayjs(rawVideo.createdAt, DATE_TIME_FORMAT),
    };
  }

  private convertVideoToVideoRawValue(
    video: IVideo | (Partial<NewVideo> & VideoFormDefaults)
  ): VideoFormRawValue | PartialWithRequiredKeyOf<NewVideoFormRawValue> {
    return {
      ...video,
      createdAt: video.createdAt ? video.createdAt.format(DATE_TIME_FORMAT) : undefined,
    };
  }
}
