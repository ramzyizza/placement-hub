import { Component, OnInit } from '@angular/core';
import { IReview } from '../entities/review/review.model';
import { ReviewService } from '../entities/review/service/review.service';
import { HttpResponse } from '@angular/common/http';

@Component({
  selector: 'jhi-ratings-display',
  templateUrl: './ratings-display.component.html',
  styleUrls: ['./ratings-display.component.scss'],
})
export class RatingsDisplayComponent implements OnInit {
  reviews: IReview[] = [];
  totalReviews = 0;
  filteredReviews: IReview[] = [];
  searchKeyword: string = '';

  constructor(private reviewService: ReviewService) {}

  ngOnInit(): void {
    this.loadReviews();
  }

  loadReviews(): void {
    this.reviewService.query().subscribe({
      next: (res: HttpResponse<IReview[]>) => {
        this.reviews = res.body || [];
        this.totalReviews = this.reviews.length;
        this.filteredReviews = this.reviews;
      },
      error: err => console.error('Failed to load reviews', err),
    });
  }

  searchReviews(): void {
    if (!this.searchKeyword.trim()) {
      this.filteredReviews = this.reviews;
      return;
    }
    this.filteredReviews = this.reviews.filter(
      review =>
        review.userCompany?.name?.toLowerCase().includes(this.searchKeyword.toLowerCase()) ||
        review.review?.toLowerCase().includes(this.searchKeyword.toLowerCase()) ||
        review.role?.toLowerCase().includes(this.searchKeyword.toLowerCase())
    );
  }
}
