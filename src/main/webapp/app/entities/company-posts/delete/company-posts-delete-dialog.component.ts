import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { ICompanyPosts } from '../company-posts.model';
import { CompanyPostsService } from '../service/company-posts.service';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';

@Component({
  templateUrl: './company-posts-delete-dialog.component.html',
})
export class CompanyPostsDeleteDialogComponent {
  companyPosts?: ICompanyPosts;

  constructor(protected companyPostsService: CompanyPostsService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.companyPostsService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
