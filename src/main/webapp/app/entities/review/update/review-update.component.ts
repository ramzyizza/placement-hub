import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { ReviewFormService, ReviewFormGroup } from './review-form.service';
import { IReview } from '../review.model';
import { ReviewService } from '../service/review.service';
import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/user.service';
import { IUserCompany } from 'app/entities/user-company/user-company.model';
import { UserCompanyService } from 'app/entities/user-company/service/user-company.service';

@Component({
  selector: 'jhi-review-update',
  templateUrl: './review-update.component.html',
  styleUrls: ['./review-update.component.scss'],
})
export class ReviewUpdateComponent implements OnInit {
  isSaving = false;
  review: IReview | null = null;

  usersSharedCollection: IUser[] = [];
  userCompaniesSharedCollection: IUserCompany[] = [];

  editForm: ReviewFormGroup = this.reviewFormService.createReviewFormGroup();

  constructor(
    protected reviewService: ReviewService,
    protected reviewFormService: ReviewFormService,
    protected userService: UserService,
    protected userCompanyService: UserCompanyService,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareUser = (o1: IUser | null, o2: IUser | null): boolean => this.userService.compareUser(o1, o2);

  compareUserCompany = (o1: IUserCompany | null, o2: IUserCompany | null): boolean => this.userCompanyService.compareUserCompany(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ review }) => {
      this.review = review;
      if (review) {
        this.updateForm(review);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const review = this.reviewFormService.getReview(this.editForm);
    if (review.id !== null) {
      this.subscribeToSaveResponse(this.reviewService.update(review));
    } else {
      this.subscribeToSaveResponse(this.reviewService.create(review));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IReview>>): void {
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

  protected updateForm(review: IReview): void {
    this.review = review;
    this.reviewFormService.resetForm(this.editForm, review);

    this.usersSharedCollection = this.userService.addUserToCollectionIfMissing<IUser>(this.usersSharedCollection, review.appUser);
    this.userCompaniesSharedCollection = this.userCompanyService.addUserCompanyToCollectionIfMissing<IUserCompany>(
      this.userCompaniesSharedCollection,
      review.userCompany
    );
  }

  protected loadRelationshipsOptions(): void {
    this.userService
      .query()
      .pipe(map((res: HttpResponse<IUser[]>) => res.body ?? []))
      .pipe(map((users: IUser[]) => this.userService.addUserToCollectionIfMissing<IUser>(users, this.review?.appUser)))
      .subscribe((users: IUser[]) => (this.usersSharedCollection = users));

    this.userCompanyService
      .query()
      .pipe(map((res: HttpResponse<IUserCompany[]>) => res.body ?? []))
      .pipe(
        map((userCompanies: IUserCompany[]) =>
          this.userCompanyService.addUserCompanyToCollectionIfMissing<IUserCompany>(userCompanies, this.review?.userCompany)
        )
      )
      .subscribe((userCompanies: IUserCompany[]) => (this.userCompaniesSharedCollection = userCompanies));
  }
}
