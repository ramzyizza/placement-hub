import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IFavourite } from '../favourite.model';

@Component({
  selector: 'jhi-favourite-detail',
  templateUrl: './favourite-detail.component.html',
  styleUrls: ['./favourite-detail.component.scss'],
})
export class FavouriteDetailComponent implements OnInit {
  favourite: IFavourite | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ favourite }) => {
      this.favourite = favourite;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
