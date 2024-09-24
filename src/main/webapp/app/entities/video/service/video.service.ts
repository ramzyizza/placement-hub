import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IVideo, NewVideo } from '../video.model';

export type PartialUpdateVideo = Partial<IVideo> & Pick<IVideo, 'id'>;

type RestOf<T extends IVideo | NewVideo> = Omit<T, 'createdAt'> & {
  createdAt?: string | null;
};

export type RestVideo = RestOf<IVideo>;

export type NewRestVideo = RestOf<NewVideo>;

export type PartialUpdateRestVideo = RestOf<PartialUpdateVideo>;

export type EntityResponseType = HttpResponse<IVideo>;
export type EntityArrayResponseType = HttpResponse<IVideo[]>;

@Injectable({ providedIn: 'root' })
export class VideoService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/videos');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(video: NewVideo): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(video);
    return this.http.post<RestVideo>(this.resourceUrl, copy, { observe: 'response' }).pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(video: IVideo): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(video);
    return this.http
      .put<RestVideo>(`${this.resourceUrl}/${this.getVideoIdentifier(video)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(video: PartialUpdateVideo): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(video);
    return this.http
      .patch<RestVideo>(`${this.resourceUrl}/${this.getVideoIdentifier(video)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestVideo>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestVideo[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getVideoIdentifier(video: Pick<IVideo, 'id'>): number {
    return video.id;
  }

  compareVideo(o1: Pick<IVideo, 'id'> | null, o2: Pick<IVideo, 'id'> | null): boolean {
    return o1 && o2 ? this.getVideoIdentifier(o1) === this.getVideoIdentifier(o2) : o1 === o2;
  }

  addVideoToCollectionIfMissing<Type extends Pick<IVideo, 'id'>>(
    videoCollection: Type[],
    ...videosToCheck: (Type | null | undefined)[]
  ): Type[] {
    const videos: Type[] = videosToCheck.filter(isPresent);
    if (videos.length > 0) {
      const videoCollectionIdentifiers = videoCollection.map(videoItem => this.getVideoIdentifier(videoItem)!);
      const videosToAdd = videos.filter(videoItem => {
        const videoIdentifier = this.getVideoIdentifier(videoItem);
        if (videoCollectionIdentifiers.includes(videoIdentifier)) {
          return false;
        }
        videoCollectionIdentifiers.push(videoIdentifier);
        return true;
      });
      return [...videosToAdd, ...videoCollection];
    }
    return videoCollection;
  }

  protected convertDateFromClient<T extends IVideo | NewVideo | PartialUpdateVideo>(video: T): RestOf<T> {
    return {
      ...video,
      createdAt: video.createdAt?.toJSON() ?? null,
    };
  }

  protected convertDateFromServer(restVideo: RestVideo): IVideo {
    return {
      ...restVideo,
      createdAt: restVideo.createdAt ? dayjs(restVideo.createdAt) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestVideo>): HttpResponse<IVideo> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestVideo[]>): HttpResponse<IVideo[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }
}
