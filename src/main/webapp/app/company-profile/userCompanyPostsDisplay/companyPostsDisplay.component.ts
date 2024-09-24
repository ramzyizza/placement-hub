import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ICompanyPosts } from '../../entities/company-posts/company-posts.model';
import { IUserCompany } from '../../entities/user-company/user-company.model';
import { RouterModule } from '@angular/router';
import { Location } from '@angular/common';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CompanyPostsDeleteDialogComponent } from '../../entities/company-posts/delete/company-posts-delete-dialog.component';
import { filter } from 'rxjs';
import { ITEM_DELETED_EVENT } from '../../config/navigation.constants';
import { EntityArrayResponseType } from '../../entities/company-posts/service/company-posts.service';

@Component({
  selector: 'company-post-display',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="div">
      <section class="post">
        <div class="header">
          <img
            *ngIf="companyUsers.logoContentType"
            class="profile-photo"
            [src]="'data:' + companyUsers.logoContentType + ';base64,' + companyUsers.logo"
            alt="Profile photo of {{ companyUsers.name }}"
          />
          <h2 class="post-heading">{{ companyUsers.name }}</h2>
        </div>
        <p class="post-description">{{ companyPosts.postContent }}</p>
        <div *ngIf="companyPosts.postImageContentType" class="photo">
          <img
            class="post-photo"
            [src]="'data:' + companyPosts.postImageContentType + ';base64,' + companyPosts.postImage"
            alt="Company post photo"
          />
        </div>
        <button class="delPost" *ngIf="pageCheck" (click)="deleteDialog(companyPosts); $event.preventDefault()">
          <span> Delete </span>
        </button>
      </section>
    </div>
  `,
  styleUrls: ['./companyPostsDisplay.component.scss'],
})
export class CompanyPostsDisplay {
  @Input() companyPosts!: ICompanyPosts;
  @Input() companyUsers!: IUserCompany;
  pageCheck: boolean;
  constructor(private location: Location, private modalService: NgbModal) {
    this.pageCheck = location.path().split('/')[1] === 'companydashboard';
  }
  deleteDialog(post: ICompanyPosts): void {
    const modalRef = this.modalService.open(CompanyPostsDeleteDialogComponent);
    modalRef.componentInstance.companyPosts = post;
    modalRef.closed.pipe(filter(reason => reason === ITEM_DELETED_EVENT)).subscribe({
      next: (res: EntityArrayResponseType) => {
        window.location.reload();
      },
    });
  }
}
