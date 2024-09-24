import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ICard } from '../card.model';

@Component({
  selector: 'jhi-card-detail',
  templateUrl: './card-detail.component.html',
  styleUrls: ['./card-detail.component.scss'],
})
export class CardDetailComponent implements OnInit {
  card: ICard | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ card }) => {
      this.card = card;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
