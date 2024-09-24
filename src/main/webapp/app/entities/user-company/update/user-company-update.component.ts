import { Component, OnInit, ElementRef } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { UserCompanyFormService, UserCompanyFormGroup } from './user-company-form.service';
import { IUserCompany } from '../user-company.model';
import { UserCompanyService } from '../service/user-company.service';
import { AlertError } from 'app/shared/alert/alert-error.model';
import { EventManager, EventWithContent } from 'app/core/util/event-manager.service';
import { DataUtils, FileLoadError } from 'app/core/util/data-util.service';
import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/user.service';
import { CompanySize } from 'app/entities/enumerations/company-size.model';
import { Industry } from 'app/entities/enumerations/industry.model';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'jhi-user-company-update',
  templateUrl: './user-company-update.component.html',
  styleUrls: ['./user-company-form.component.scss'],
})
export class UserCompanyUpdateComponent implements OnInit {
  isSaving = false;
  userCompany: IUserCompany | null = null;
  companySizeValues = Object.keys(CompanySize);
  industryValues = Object.keys(Industry);

  usersSharedCollection: IUser[] = [];
  userId: number | undefined;
  editForm: UserCompanyFormGroup = this.userCompanyFormService.createUserCompanyFormGroup();

  companySizeOptions = Object.entries(CompanySize).map(([key, value]) => ({ key, value }));
  industryOptions = Object.entries(Industry).map(([key, value]) => ({ key, value }));

  constructor(
    protected dataUtils: DataUtils,
    protected eventManager: EventManager,
    protected userCompanyService: UserCompanyService,
    protected userCompanyFormService: UserCompanyFormService,
    protected userService: UserService,
    protected elementRef: ElementRef,
    protected activatedRoute: ActivatedRoute,
    private http: HttpClient
  ) {}

  compareUser = (o1: IUser | null, o2: IUser | null): boolean => this.userService.compareUser(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ userCompany }) => {
      this.userCompany = userCompany;
      if (userCompany) {
        this.updateForm(userCompany);
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
    const userCompany = this.userCompanyFormService.getUserCompany(this.editForm);
    if (userCompany.id !== null) {
      this.subscribeToSaveResponse(this.userCompanyService.update(userCompany));
    } else {
      this.subscribeToSaveResponse(this.userCompanyService.create(userCompany));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IUserCompany>>): void {
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

  protected updateForm(userCompany: IUserCompany): void {
    this.userCompany = userCompany;
    this.userCompanyFormService.resetForm(this.editForm, userCompany);

    this.usersSharedCollection = this.userService.addUserToCollectionIfMissing<IUser>(this.usersSharedCollection, userCompany.appUser);
  }

  protected loadRelationshipsOptions(): void {
    this.http.get<any>('/api/account').subscribe(user => {
      this.userId = user.id;
    });
    this.userService
      .query()
      .pipe(map((res: HttpResponse<IUser[]>) => res.body ?? []))
      .pipe(map((users: IUser[]) => this.userService.addUserToCollectionIfMissing<IUser>(users, this.userCompany?.appUser)))
      .subscribe((users: IUser[]) => {
        this.usersSharedCollection = users;
        this.usersSharedCollection = this.usersSharedCollection.filter(user => user.id === this.userId);
      });
  }
}
