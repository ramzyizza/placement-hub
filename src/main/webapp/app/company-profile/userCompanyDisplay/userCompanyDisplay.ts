import { Component, inject, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IUserCompany } from '../../entities/user-company/user-company.model';
import { RouterModule } from '@angular/router';
import { CompanyProfileService } from '../company-profile.service';
import { OnInit } from '@angular/core';

@Component({
  selector: 'user-company-display',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <section class="listing">
      <div *ngIf="userCompany.logo">
        <img
          class="profile-photo"
          [src]="'data:' + userCompany.logoContentType + ';base64,' + userCompany.logo"
          alt="Profile photo of {{ userCompany.name }}"
        />
      </div>
      <h2 class="profile-heading">{{ userCompany.name }}</h2>
      <p class="profile-size">Company size: {{ companySize }}</p>
      <button class="profile-details" [routerLink]="['/details', userCompany.id]">Details</button>
      <button class="dashboard" *ngIf="userId === userCompany.appUser?.id" [routerLink]="['/companydashboard', userCompany.id]">
        Dashboard
      </button>
    </section>
  `,
  styleUrls: ['./userCompanyDisplay.scss'],
})
export class UserCompanyDisplay implements OnInit {
  @Input() userCompany!: IUserCompany;
  CompanyProfileService = inject(CompanyProfileService);
  userId: number | undefined;
  companySize: string | undefined;
  constructor() {
    this.CompanyProfileService.getCurrentUser().subscribe(user => {
      this.userId = user.id;
    });
  }
  ngOnInit(): void {
    this.companySize = this.userCompany.companySize?.valueOf().replace(/_/g, ' ');
    this.companySize = this.companySize?.toLowerCase();
  }
}
