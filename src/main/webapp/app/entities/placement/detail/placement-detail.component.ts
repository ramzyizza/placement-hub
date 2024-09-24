import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IPlacement } from '../placement.model';
import { DataUtils } from 'app/core/util/data-util.service';

@Component({
  selector: 'jhi-placement-detail',
  templateUrl: './placement-detail.component.html',
  styleUrls: ['./placement-detail.component.scss'],
})
export class PlacementDetailComponent implements OnInit {
  placement: IPlacement | null = null;

  constructor(protected dataUtils: DataUtils, protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ placement }) => {
      this.placement = placement;
    });
  }

  byteSize(base64String: string): string {
    return this.dataUtils.byteSize(base64String);
  }

  openFile(base64String: string, contentType: string | null | undefined): void {
    this.dataUtils.openFile(base64String, contentType);
  }

  previousState(): void {
    window.history.back();
  }
}
