import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { FavouriteFormService, FavouriteFormGroup } from './favourite-form.service';
import { IFavourite } from '../favourite.model';
import { FavouriteService } from '../service/favourite.service';
import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/user.service';
import { IArticle } from 'app/entities/article/article.model';
import { ArticleService } from 'app/entities/article/service/article.service';
import { IVideo } from 'app/entities/video/video.model';
import { VideoService } from 'app/entities/video/service/video.service';

@Component({
  selector: 'jhi-favourite-update',
  templateUrl: './favourite-update.component.html',
  styleUrls: ['./favourite-update.component.scss'],
})
export class FavouriteUpdateComponent implements OnInit {
  isSaving = false;
  favourite: IFavourite | null = null;

  usersSharedCollection: IUser[] = [];
  articlesSharedCollection: IArticle[] = [];
  videosSharedCollection: IVideo[] = [];

  editForm: FavouriteFormGroup = this.favouriteFormService.createFavouriteFormGroup();

  constructor(
    protected favouriteService: FavouriteService,
    protected favouriteFormService: FavouriteFormService,
    protected userService: UserService,
    protected articleService: ArticleService,
    protected videoService: VideoService,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareUser = (o1: IUser | null, o2: IUser | null): boolean => this.userService.compareUser(o1, o2);

  compareArticle = (o1: IArticle | null, o2: IArticle | null): boolean => this.articleService.compareArticle(o1, o2);

  compareVideo = (o1: IVideo | null, o2: IVideo | null): boolean => this.videoService.compareVideo(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ favourite }) => {
      this.favourite = favourite;
      if (favourite) {
        this.updateForm(favourite);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const favourite = this.favouriteFormService.getFavourite(this.editForm);
    if (favourite.id !== null) {
      this.subscribeToSaveResponse(this.favouriteService.update(favourite));
    } else {
      this.subscribeToSaveResponse(this.favouriteService.create(favourite));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IFavourite>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(favourite: IFavourite): void {
    this.favourite = favourite;
    this.favouriteFormService.resetForm(this.editForm, favourite);

    this.usersSharedCollection = this.userService.addUserToCollectionIfMissing<IUser>(this.usersSharedCollection, favourite.appUser);
    this.articlesSharedCollection = this.articleService.addArticleToCollectionIfMissing<IArticle>(
      this.articlesSharedCollection,
      favourite.article
    );
    this.videosSharedCollection = this.videoService.addVideoToCollectionIfMissing<IVideo>(this.videosSharedCollection, favourite.video);
  }

  protected loadRelationshipsOptions(): void {
    this.userService
      .query()
      .pipe(map((res: HttpResponse<IUser[]>) => res.body ?? []))
      .pipe(map((users: IUser[]) => this.userService.addUserToCollectionIfMissing<IUser>(users, this.favourite?.appUser)))
      .subscribe((users: IUser[]) => (this.usersSharedCollection = users));

    this.articleService
      .query()
      .pipe(map((res: HttpResponse<IArticle[]>) => res.body ?? []))
      .pipe(map((articles: IArticle[]) => this.articleService.addArticleToCollectionIfMissing<IArticle>(articles, this.favourite?.article)))
      .subscribe((articles: IArticle[]) => (this.articlesSharedCollection = articles));

    this.videoService
      .query()
      .pipe(map((res: HttpResponse<IVideo[]>) => res.body ?? []))
      .pipe(map((videos: IVideo[]) => this.videoService.addVideoToCollectionIfMissing<IVideo>(videos, this.favourite?.video)))
      .subscribe((videos: IVideo[]) => (this.videosSharedCollection = videos));
  }
}
