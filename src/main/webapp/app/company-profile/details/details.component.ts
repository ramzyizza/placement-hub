import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { IUserCompany } from '../../entities/user-company/user-company.model';
import { ICompanyPosts } from '../../entities/company-posts/company-posts.model';
import { CompanyProfileService } from '../company-profile.service';
import { CompanyPostsDisplay } from '../userCompanyPostsDisplay/companyPostsDisplay.component';

@Component({
  selector: 'app-details',
  standalone: true,
  imports: [CommonModule, CompanyPostsDisplay],
  template: `
    <div class="div">
      <img
        *ngIf="companyUsers[0].profileImageBackgroundContentType"
        class="background-something"
        [src]="'data:' + companyUsers[0].profileImageBackgroundContentType + ';base64,' + companyUsers[0].profileImageBackground"
        alt="Profile background of {{ this.companyUsers[0].name }}"
      />
      <div class="div2">
        <img
          class="company-logo"
          [src]="'data:' + companyUsers[0].logoContentType + ';base64,' + companyUsers[0].logo"
          alt="Profile logo of {{ this.companyUsers[0].name }}"
        />
        <div class="company-name">{{ companyUsers[0].name }}</div>
      </div>
    </div>
    <company-post-display
      *ngFor="let ICompanyPosts of posts"
      [companyPosts]="ICompanyPosts"
      [companyUsers]="this.companyUsers[0]"
      class="posts"
    ></company-post-display>
  `,
  styleUrls: ['./details.component.css'],
})
export class DetailsComponent {
  posts: ICompanyPosts[] = [];
  companyUsers: IUserCompany[] = [];
  route: ActivatedRoute = inject(ActivatedRoute);
  CompanyProfileService = inject(CompanyProfileService);
  companyPosts: ICompanyPosts | undefined;
  constructor() {
    const companyProfileId = Number(this.route.snapshot.params['id']);
    this.CompanyProfileService.getAllPosts().subscribe(posts => {
      this.posts = posts.filter(post => post.userCompany.id === companyProfileId);
    });
    this.CompanyProfileService.getAllUserCompany().subscribe(users => {
      this.companyUsers = users.filter(user => user.id === companyProfileId);
    });
  }
}
