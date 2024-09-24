import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IFavourite } from '../favourite.model';
import { FavouriteService } from '../service/favourite.service';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';

@Component({
  templateUrl: './favourite-delete-dialog.component.html',
})
export class FavouriteDeleteDialogComponent {
  favourite?: IFavourite;

  constructor(protected favouriteService: FavouriteService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.favouriteService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
