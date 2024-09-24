import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router'; // Import Router here
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { ReviewFormService, ReviewFormGroup } from './review-form.service';
import { IReview } from './review.model';
import { ReviewService } from './service/review.service';
import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/user.service';
import { IUserCompany } from 'app/entities/user-company/user-company.model';
import { UserCompanyService } from 'app/entities/user-company/service/user-company.service';

@Component({
  selector: 'jhi-ratings',
  templateUrl: './ratings.component.html',
  styleUrls: ['./ratings.component.scss'],
})
export class RatingsComponent implements OnInit {
  isSaving = false;
  review: IReview | null = null;
  currentUser: IUser | null = null;

  usersSharedCollection: IUser[] = [];
  userCompaniesSharedCollection: IUserCompany[] = [];

  editForm: ReviewFormGroup = this.reviewFormService.createReviewFormGroup();
  userId: number;

  constructor(
    protected reviewService: ReviewService,
    protected reviewFormService: ReviewFormService,
    protected userService: UserService,
    protected userCompanyService: UserCompanyService,
    protected activatedRoute: ActivatedRoute,
    private http: HttpClient,
    private router: Router
  ) {
    this.userId = 0;
  }

  compareUser(o1: IUser | null, o2: IUser | null): boolean {
    return o1 && o2 ? o1.id === o2.id : o1 === o2;
  }

  compareUserCompany(o1: IUserCompany | null, o2: IUserCompany | null): boolean {
    return o1 && o2 ? o1.id === o2.id : o1 === o2;
  }

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ review }) => {
      this.review = review;
      if (review) {
        this.updateForm(review);
      }
    });
    this.loadRelationshipsOptions();
    this.http.get<any>('api/account').subscribe(
      response => {
        this.userId = response.id;
      },
      error => {
        console.log('Error fetching user information', error);
      }
    );
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const review = this.reviewFormService.getReview(this.editForm);
    review.rating = this.editForm.get('rating')?.value;
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

  protected onSaveSuccess(): void {
    this.router.navigate(['/ratings-all']); // Redirect to the ratings-all page on save success
  }

  protected onSaveError(): void {}

  protected loadRelationshipsOptions(): void {
    this.userService
      .query()
      .pipe(map((res: HttpResponse<IUser[]>) => res.body ?? []))
      .pipe(map((users: IUser[]) => this.userService.addUserToCollectionIfMissing<IUser>(users, this.review?.appUser)))
      .subscribe((users: IUser[]) => {
        this.usersSharedCollection = users;
        this.usersSharedCollection = this.usersSharedCollection.filter(user => user.id === this.userId);
      });

    this.userCompanyService
      .query()
      .pipe(map((res: HttpResponse<IUserCompany[]>) => res.body ?? []))
      .subscribe((userCompanies: IUserCompany[]) => (this.userCompaniesSharedCollection = userCompanies));
  }
}
