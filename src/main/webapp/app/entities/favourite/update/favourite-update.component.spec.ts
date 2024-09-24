import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { FavouriteFormService } from './favourite-form.service';
import { FavouriteService } from '../service/favourite.service';
import { IFavourite } from '../favourite.model';

import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/user.service';
import { IArticle } from 'app/entities/article/article.model';
import { ArticleService } from 'app/entities/article/service/article.service';
import { IVideo } from 'app/entities/video/video.model';
import { VideoService } from 'app/entities/video/service/video.service';

import { FavouriteUpdateComponent } from './favourite-update.component';

describe('Favourite Management Update Component', () => {
  let comp: FavouriteUpdateComponent;
  let fixture: ComponentFixture<FavouriteUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let favouriteFormService: FavouriteFormService;
  let favouriteService: FavouriteService;
  let userService: UserService;
  let articleService: ArticleService;
  let videoService: VideoService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [FavouriteUpdateComponent],
      providers: [
        FormBuilder,
        {
          provide: ActivatedRoute,
          useValue: {
            params: from([{}]),
          },
        },
      ],
    })
      .overrideTemplate(FavouriteUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(FavouriteUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    favouriteFormService = TestBed.inject(FavouriteFormService);
    favouriteService = TestBed.inject(FavouriteService);
    userService = TestBed.inject(UserService);
    articleService = TestBed.inject(ArticleService);
    videoService = TestBed.inject(VideoService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call User query and add missing value', () => {
      const favourite: IFavourite = { id: 456 };
      const appUser: IUser = { id: 17871 };
      favourite.appUser = appUser;

      const userCollection: IUser[] = [{ id: 20260 }];
      jest.spyOn(userService, 'query').mockReturnValue(of(new HttpResponse({ body: userCollection })));
      const additionalUsers = [appUser];
      const expectedCollection: IUser[] = [...additionalUsers, ...userCollection];
      jest.spyOn(userService, 'addUserToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ favourite });
      comp.ngOnInit();

      expect(userService.query).toHaveBeenCalled();
      expect(userService.addUserToCollectionIfMissing).toHaveBeenCalledWith(
        userCollection,
        ...additionalUsers.map(expect.objectContaining)
      );
      expect(comp.usersSharedCollection).toEqual(expectedCollection);
    });

    it('Should call Article query and add missing value', () => {
      const favourite: IFavourite = { id: 456 };
      const article: IArticle = { id: 92225 };
      favourite.article = article;

      const articleCollection: IArticle[] = [{ id: 99224 }];
      jest.spyOn(articleService, 'query').mockReturnValue(of(new HttpResponse({ body: articleCollection })));
      const additionalArticles = [article];
      const expectedCollection: IArticle[] = [...additionalArticles, ...articleCollection];
      jest.spyOn(articleService, 'addArticleToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ favourite });
      comp.ngOnInit();

      expect(articleService.query).toHaveBeenCalled();
      expect(articleService.addArticleToCollectionIfMissing).toHaveBeenCalledWith(
        articleCollection,
        ...additionalArticles.map(expect.objectContaining)
      );
      expect(comp.articlesSharedCollection).toEqual(expectedCollection);
    });

    it('Should call Video query and add missing value', () => {
      const favourite: IFavourite = { id: 456 };
      const video: IVideo = { id: 7548 };
      favourite.video = video;

      const videoCollection: IVideo[] = [{ id: 77178 }];
      jest.spyOn(videoService, 'query').mockReturnValue(of(new HttpResponse({ body: videoCollection })));
      const additionalVideos = [video];
      const expectedCollection: IVideo[] = [...additionalVideos, ...videoCollection];
      jest.spyOn(videoService, 'addVideoToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ favourite });
      comp.ngOnInit();

      expect(videoService.query).toHaveBeenCalled();
      expect(videoService.addVideoToCollectionIfMissing).toHaveBeenCalledWith(
        videoCollection,
        ...additionalVideos.map(expect.objectContaining)
      );
      expect(comp.videosSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const favourite: IFavourite = { id: 456 };
      const appUser: IUser = { id: 13280 };
      favourite.appUser = appUser;
      const article: IArticle = { id: 70277 };
      favourite.article = article;
      const video: IVideo = { id: 32663 };
      favourite.video = video;

      activatedRoute.data = of({ favourite });
      comp.ngOnInit();

      expect(comp.usersSharedCollection).toContain(appUser);
      expect(comp.articlesSharedCollection).toContain(article);
      expect(comp.videosSharedCollection).toContain(video);
      expect(comp.favourite).toEqual(favourite);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IFavourite>>();
      const favourite = { id: 123 };
      jest.spyOn(favouriteFormService, 'getFavourite').mockReturnValue(favourite);
      jest.spyOn(favouriteService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ favourite });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: favourite }));
      saveSubject.complete();

      // THEN
      expect(favouriteFormService.getFavourite).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(favouriteService.update).toHaveBeenCalledWith(expect.objectContaining(favourite));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IFavourite>>();
      const favourite = { id: 123 };
      jest.spyOn(favouriteFormService, 'getFavourite').mockReturnValue({ id: null });
      jest.spyOn(favouriteService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ favourite: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: favourite }));
      saveSubject.complete();

      // THEN
      expect(favouriteFormService.getFavourite).toHaveBeenCalled();
      expect(favouriteService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IFavourite>>();
      const favourite = { id: 123 };
      jest.spyOn(favouriteService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ favourite });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(favouriteService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareUser', () => {
      it('Should forward to userService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(userService, 'compareUser');
        comp.compareUser(entity, entity2);
        expect(userService.compareUser).toHaveBeenCalledWith(entity, entity2);
      });
    });

    describe('compareArticle', () => {
      it('Should forward to articleService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(articleService, 'compareArticle');
        comp.compareArticle(entity, entity2);
        expect(articleService.compareArticle).toHaveBeenCalledWith(entity, entity2);
      });
    });

    describe('compareVideo', () => {
      it('Should forward to videoService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(videoService, 'compareVideo');
        comp.compareVideo(entity, entity2);
        expect(videoService.compareVideo).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
