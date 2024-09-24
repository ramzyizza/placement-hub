import { Component, OnInit } from '@angular/core';
import { IReview } from '../entities/review/review.model';
import { ReviewService } from '../entities/review/service/review.service';
import { HttpResponse } from '@angular/common/http';
import { IUserCompany } from '../entities/user-company/user-company.model';
import { UserCompanyService } from '../entities/user-company/service/user-company.service';
import { CompanySize } from '../entities/enumerations/company-size.model';
import { Industry } from '../entities/enumerations/industry.model';

@Component({
  selector: 'jhi-ratings-home',
  templateUrl: './ratings-home.component.html',
  styleUrls: ['./ratings-home.component.scss'],
})
export class RatingsHomeComponent implements OnInit {
  reviews: IReview[] = [];
  companies: IUserCompany[] = [];
  ratingsMap: { [companyId: number]: number } = {};
  reviewsCountMap: { [companyId: number]: number } = {};
  recommendationsCountMap: { [companyId: number]: number } = {};
  allCompanies: IUserCompany[] = [];
  searchKeyword = '';
  displayReviews: IReview[] = [];

  companySizeLabels: { [key in CompanySize]: string } = {
    [CompanySize.LESS_THAN_500]: '< 500 Employees',
    [CompanySize.BETWEEN_500_AND_1000]: '500+ Employees',
    [CompanySize.BETWEEN_1001_AND_5000]: '1000+ Employees',
    [CompanySize.BETWEEN_5001_AND_10000]: '5000+ Employees',
    [CompanySize.MORE_THAN_10000]: '10000+ Employees',
  };

  constructor(private reviewService: ReviewService, private userCompanyService: UserCompanyService) {}

  calculateAllRatingsAndCounts(): void {
    this.companies.forEach(company => {
      const companyReviews = this.reviews.filter(review => review.userCompany?.id === company.id);
      const total = companyReviews.reduce((acc, review) => acc + (review.rating || 0), 0);
      const averageRating = companyReviews.length ? Number((total / companyReviews.length).toFixed(1)) : 0;
      this.ratingsMap[company.id] = averageRating;

      this.reviewsCountMap[company.id] = companyReviews.length;
      this.recommendationsCountMap[company.id] = companyReviews.filter(review => review.recommend).length;
      console.log('Ratings map:', this.ratingsMap); // Log the ratings map
    });
  }

  ngOnInit(): void {
    this.loadAllReviews();
    this.loadReviews();
    this.loadCompany();
  }

  loadAllReviews(): void {
    this.reviewService.query({ include: 'userCompany' }).subscribe({
      next: (res: HttpResponse<IReview[]>) => {
        this.reviews = res.body || [];
        this.calculateAllRatingsAndCounts();
      },
      error: err => console.error('Failed to load all reviews', err),
    });
  }

  loadReviews(): void {
    this.reviewService.query({ include: 'userCompany' }).subscribe({
      next: (res: HttpResponse<IReview[]>) => {
        this.displayReviews = (res.body || []).slice(0, 3);
        console.log('Loaded top 3 reviews:', this.displayReviews);
      },
      error: err => console.error('Failed to load top 3 reviews', err),
    });
  }

  loadCompany(): void {
    this.userCompanyService.query().subscribe({
      next: (res: HttpResponse<IUserCompany[]>) => {
        this.allCompanies = res.body || [];
        this.companies = res.body || [];
        console.log('Loaded companies:', this.companies);
        this.calculateAllRatingsAndCounts();
      },
      error: err => console.error('Failed to load company data', err),
    });
  }

  getCompanySizeLabel(size: CompanySize | null | undefined): string {
    if (size === null || size === undefined) {
      return 'Unknown Size';
    }
    return this.companySizeLabels[size];
  }

  formatIndustry(industry: Industry | null | undefined): string {
    if (industry === null || industry === undefined) {
      return 'Unknown Industry';
    }
    return industry
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  }

  calculateAllRatings(): void {
    this.companies.forEach(company => {
      const companyReviews = this.reviews.filter(review => review.userCompany?.id === company.id);
      const total = companyReviews.reduce((acc, review) => acc + (review.rating || 0), 0);
      const averageRating = companyReviews.length ? Number((total / companyReviews.length).toFixed(1)) : 0;
      this.ratingsMap[company.id] = averageRating;
    });
  }

  getRating(companyId: number): string {
    return this.ratingsMap[companyId] ? `${this.ratingsMap[companyId]} ★` : 'No Ratings';
  }

  searchCompanies(): void {
    if (this.searchKeyword.trim()) {
      this.companies = this.allCompanies.filter(company => company.name?.toLowerCase().includes(this.searchKeyword.toLowerCase()));
    } else {
      this.companies = this.allCompanies;
    }
  }
}
