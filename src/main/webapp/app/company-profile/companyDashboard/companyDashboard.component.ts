import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ICompanyPosts } from '../../entities/company-posts/company-posts.model';
import { IUserCompany } from '../../entities/user-company/user-company.model';
import { ActivatedRoute } from '@angular/router';
import { CompanyProfileService } from '../company-profile.service';
import { CompanyPostsDisplay } from '../userCompanyPostsDisplay/companyPostsDisplay.component';
import { IPlacement } from '../../entities/placement/placement.model';
import { PlacementDisplayComponent } from '../placementDisplay/placementDisplay.component';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'company-dashboard-display',
  standalone: true,
  imports: [CommonModule, CompanyPostsDisplay, PlacementDisplayComponent, RouterModule],
  template: `
    <div class="div">
      <div class="posts">
        <button class="post-button" [routerLink]="['/company-posts/new']">Create new company post</button>
        <company-post-display
          *ngFor="let ICompanyPosts of posts"
          [companyPosts]="ICompanyPosts"
          [companyUsers]="this.companyUsers[0]"
          class="posts"
        ></company-post-display>
      </div>
      <div class="listings">
        <button class="placement-button" [routerLink]="'/placement/new'">Create new placement</button>
        <placement-display *ngIf="placementsPost" [placements]="this.placementsPost"></placement-display>
      </div>
    </div>
  `,
  styleUrls: ['./companyDashboard.component.scss'],
})
export class CompanyDashboardComponent {
  posts: ICompanyPosts[] = [];
  companyUsers: IUserCompany[] = [];
  route: ActivatedRoute = inject(ActivatedRoute);
  CompanyProfileService = inject(CompanyProfileService);
  companyPosts: ICompanyPosts | undefined;
  placementsPost: IPlacement[] | undefined;
  userId: number | undefined;
  constructor(private router: Router) {
    const companyProfileId = Number(this.route.snapshot.params['id']);
    this.CompanyProfileService.getAllPosts().subscribe(posts => {
      this.posts = posts.filter(post => post.userCompany.id === companyProfileId);
    });
    this.CompanyProfileService.getAllUserCompany().subscribe(users => {
      this.companyUsers = users.filter(user => user.id === companyProfileId);
      if (this.companyUsers[0].appUser?.id !== this.userId) {
        router.navigateByUrl('/404');
      }
    });
    this.CompanyProfileService.getAllPlacements().subscribe(placements => {
      this.placementsPost = placements.filter(placement => placement.userCompany.id === companyProfileId);
    });
    this.CompanyProfileService.getCurrentUser().subscribe(users => {
      this.userId = users.id;
    });
  }
}
