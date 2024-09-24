import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { CardFormService, CardFormGroup } from './card-form.service';
import { ICard } from '../card.model';
import { CardService } from '../service/card.service';
import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/user.service';
import { CardStatus } from 'app/entities/enumerations/card-status.model';
import { HttpClient } from '@angular/common/http';

import { CardDeleteDialogComponent } from '../delete/card-delete-dialog.component';
import { ITEM_DELETED_EVENT } from '../../../config/navigation.constants';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'jhi-card-update',
  templateUrl: './card-update.component.html',
  styleUrls: ['./card-update.component.scss'],
})
export class CardUpdateComponent implements OnInit {
  isSaving = false;
  card: ICard | null = null;
  userId: number;
  cardStatusValues = Object.values(CardStatus);

  usersSharedCollection: IUser[] = [];

  editForm: CardFormGroup = this.cardFormService.createCardFormGroup();

  cardStatusOptions = Object.keys(CardStatus)
    .filter(key => isNaN(+key))
    .map(key => ({
      name: CardStatus[key as keyof typeof CardStatus],
      value: key,
    }));

  constructor(
    protected cardService: CardService,
    protected cardFormService: CardFormService,
    protected userService: UserService,
    protected activatedRoute: ActivatedRoute,
    private http: HttpClient,
    private modalService: NgbModal
  ) {
    this.userId = 0;
  }

  compareUser = (o1: IUser | null, o2: IUser | null): boolean => this.userService.compareUser(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ card }) => {
      this.card = card;
      if (card) {
        this.updateForm(card);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  protected deleteCard(): void {
    const modalRef = this.modalService.open(CardDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.card = this.card;
    modalRef.result.then(result => {
      if (result === ITEM_DELETED_EVENT) {
        this.previousState();
      }
    });
  }

  protected checkNew(): boolean {
    if (this.card === null) {
      return true;
    }
    return false;
  }

  save(): void {
    this.isSaving = true;
    const card = this.cardFormService.getCard(this.editForm);
    if (card.id !== null) {
      this.subscribeToSaveResponse(this.cardService.update(card));
    } else {
      this.subscribeToSaveResponse(this.cardService.create(card));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ICard>>): void {
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

  protected updateForm(card: ICard): void {
    this.card = card;
    this.cardFormService.resetForm(this.editForm, card);

    this.usersSharedCollection = this.userService.addUserToCollectionIfMissing<IUser>(this.usersSharedCollection, card.appUser);
  }

  protected loadRelationshipsOptions(): void {
    this.http.get<any>('/api/account').subscribe(
      response => {
        this.userId = response.id;
        // alert(' this.userId ' + this.userId)
      },
      error => {
        console.error('Error fetching user information:', error);
      }
    );

    this.userService
      .query()
      .pipe(map((res: HttpResponse<IUser[]>) => res.body ?? []))
      .pipe(map((users: IUser[]) => this.userService.addUserToCollectionIfMissing<IUser>(users, this.card?.appUser)))
      .subscribe((users: IUser[]) => {
        this.usersSharedCollection = users;
        this.usersSharedCollection = this.usersSharedCollection.filter(user => user.id === this.userId);
      });
  }
}
