import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { PlacementFormService, PlacementFormGroup } from './placement-form.service';
import { IPlacement } from '../placement.model';
import { PlacementService } from '../service/placement.service';
import { AlertError } from 'app/shared/alert/alert-error.model';
import { EventManager, EventWithContent } from 'app/core/util/event-manager.service';
import { DataUtils, FileLoadError } from 'app/core/util/data-util.service';
import { IUserCompany } from 'app/entities/user-company/user-company.model';
import { UserCompanyService } from 'app/entities/user-company/service/user-company.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'jhi-placement-update',
  templateUrl: './placement-update.component.html',
  styleUrls: ['./placement-update.component.scss'],
})
export class PlacementUpdateComponent implements OnInit {
  isSaving = false;
  placement: IPlacement | null = null;

  userId: number | undefined;
  userCompaniesSharedCollection: IUserCompany[] = [];

  editForm: PlacementFormGroup = this.placementFormService.createPlacementFormGroup();

  constructor(
    protected dataUtils: DataUtils,
    protected eventManager: EventManager,
    protected placementService: PlacementService,
    protected placementFormService: PlacementFormService,
    protected userCompanyService: UserCompanyService,
    protected activatedRoute: ActivatedRoute,
    private http: HttpClient
  ) {}

  compareUserCompany = (o1: IUserCompany | null, o2: IUserCompany | null): boolean => this.userCompanyService.compareUserCompany(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ placement }) => {
      this.placement = placement;
      if (placement) {
        this.updateForm(placement);
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

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const placement = this.placementFormService.getPlacement(this.editForm);
    if (placement.id !== null) {
      this.subscribeToSaveResponse(this.placementService.update(placement));
    } else {
      this.subscribeToSaveResponse(this.placementService.create(placement));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IPlacement>>): void {
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

  protected updateForm(placement: IPlacement): void {
    this.placement = placement;
    this.placementFormService.resetForm(this.editForm, placement);

    this.userCompaniesSharedCollection = this.userCompanyService.addUserCompanyToCollectionIfMissing<IUserCompany>(
      this.userCompaniesSharedCollection,
      placement.userCompany
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
          this.userCompanyService.addUserCompanyToCollectionIfMissing<IUserCompany>(userCompanies, this.placement?.userCompany)
        )
      )
      .subscribe((userCompanies: IUserCompany[]) => {
        this.userCompaniesSharedCollection = userCompanies;
        this.userCompaniesSharedCollection = this.userCompaniesSharedCollection.filter(user => user.appUser?.id === this.userId);
      });
  }
}
