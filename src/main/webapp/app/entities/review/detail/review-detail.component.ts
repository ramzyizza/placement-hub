import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IReview } from '../review.model';

@Component({
  selector: 'jhi-review-detail',
  templateUrl: './review-detail.component.html',
  styleUrls: ['./review-detail.component.scss'],
})
export class ReviewDetailComponent implements OnInit {
  review: IReview | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ review }) => {
      this.review = review;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
