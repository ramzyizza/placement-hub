import { Component, OnInit, ElementRef } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { CompanyPostsFormService, CompanyPostsFormGroup } from './company-posts-form.service';
import { ICompanyPosts } from '../company-posts.model';
import { CompanyPostsService } from '../service/company-posts.service';
import { AlertError } from 'app/shared/alert/alert-error.model';
import { EventManager, EventWithContent } from 'app/core/util/event-manager.service';
import { DataUtils, FileLoadError } from 'app/core/util/data-util.service';
import { IUserCompany } from 'app/entities/user-company/user-company.model';
import { UserCompanyService } from 'app/entities/user-company/service/user-company.service';
import { HttpClient } from '@angular/common/http';
@Component({
  selector: 'jhi-company-posts-update',
  templateUrl: './company-posts-update.component.html',
  styleUrls: ['./company-posts-update.component.scss'],
})
export class CompanyPostsUpdateComponent implements OnInit {
  isSaving = false;
  companyPosts: ICompanyPosts | null = null;

  userCompaniesSharedCollection: IUserCompany[] = [];

  editForm: CompanyPostsFormGroup = this.companyPostsFormService.createCompanyPostsFormGroup();
  userId: number | undefined;

  constructor(
    protected dataUtils: DataUtils,
    protected eventManager: EventManager,
    protected companyPostsService: CompanyPostsService,
    protected companyPostsFormService: CompanyPostsFormService,
    protected userCompanyService: UserCompanyService,
    protected elementRef: ElementRef,
    protected activatedRoute: ActivatedRoute,
    private http: HttpClient
  ) {}

  compareUserCompany = (o1: IUserCompany | null, o2: IUserCompany | null): boolean => this.userCompanyService.compareUserCompany(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ companyPosts }) => {
      this.companyPosts = companyPosts;
      if (companyPosts) {
        this.updateForm(companyPosts);
      }

      this.loadRelationshipsOptions();
    });
  }

  byteSize(base64String: string): string {
    return this.dataUtils.byteSize(base64String);
  }

  openFile(base64String: string, contentType: string | null | undefined): void {
    this.dataUtils.openFile(base64String, contentType);
  }

  setFileData(event: Event, field: string, isImage: boolean): void {
    this.dataUtils.loadFileToForm(event, this.editForm, field, isImage).subscribe({
      error: (err: FileLoadError) =>
        this.eventManager.broadcast(new EventWithContent<AlertError>('teamprojectApp.error', { message: err.message })),
    });
  }

  clearInputImage(field: string, fieldContentType: string, idInput: string): void {
    this.editForm.patchValue({
      [field]: null,
      [fieldContentType]: null,
    });
    if (idInput && this.elementRef.nativeElement.querySelector('#' + idInput)) {
      this.elementRef.nativeElement.querySelector('#' + idInput).value = null;
    }
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const companyPosts = this.companyPostsFormService.getCompanyPosts(this.editForm);
    if (companyPosts.id !== null) {
      this.subscribeToSaveResponse(this.companyPostsService.update(companyPosts));
    } else {
      this.subscribeToSaveResponse(this.companyPostsService.create(companyPosts));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ICompanyPosts>>): void {
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

  protected updateForm(companyPosts: ICompanyPosts): void {
    this.companyPosts = companyPosts;
    this.companyPostsFormService.resetForm(this.editForm, companyPosts);

    this.userCompaniesSharedCollection = this.userCompanyService.addUserCompanyToCollectionIfMissing<IUserCompany>(
      this.userCompaniesSharedCollection,
      companyPosts.userCompany
    );
  }

  protected loadRelationshipsOptions(): void {
    this.http.get<any>('/api/account').subscribe(user => {
      this.userId = user.id;
    });
    this.userCompanyService
      .query()
      .pipe(map((res: HttpResponse<IUserCompany[]>) => res.body ?? []))
      .pipe(
        map((userCompanies: IUserCompany[]) =>
          this.userCompanyService.addUserCompanyToCollectionIfMissing<IUserCompany>(userCompanies, this.companyPosts?.userCompany)
        )
      )
      .subscribe((userCompanies: IUserCompany[]) => {
        this.userCompaniesSharedCollection = userCompanies;
        this.userCompaniesSharedCollection = this.userCompaniesSharedCollection.filter(user => user.appUser?.id === this.userId);
      });
  }
}
