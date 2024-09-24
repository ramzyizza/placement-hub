import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IPlacement } from '../entities/placement/placement.model';
import { PlacementService } from '../entities/placement/service/placement.service';
import { PlacementDetailDialogComponent } from '../placement-detail-dialog/placement-detail-dialog.component';

@Component({
  selector: 'jhi-placement-listing',
  templateUrl: './placement-listing.component.html',
  styleUrls: ['./placement-listing.component.scss'],
})
export class PlacementListingComponent implements OnInit {
  placements: IPlacement[] = [];
  totalAvailablePlacements = 0;
  displayedPlacementsCount = 0;
  searchKeyword = '';

  constructor(private placementService: PlacementService, private modalService: NgbModal) {}

  ngOnInit(): void {
    this.loadPlacements();
  }

  loadPlacements(): void {
    this.placementService.query().subscribe({
      next: (res: HttpResponse<IPlacement[]>) => {
        this.placements = res.body || [];
        this.displayedPlacementsCount = this.placements.length;
        this.totalAvailablePlacements = this.placements.length;
      },
      error: err => console.error('Failed to load placements', err),
    });
  }

  openDialog(placementId: number): void {
    const modalRef = this.modalService.open(PlacementDetailDialogComponent, { size: 'lg' });
    modalRef.componentInstance.placementId = placementId;
  }

  searchPlacements(): void {
    if (this.searchKeyword.trim()) {
      this.placementService.searchPlacements(this.searchKeyword).subscribe({
        next: (res: HttpResponse<IPlacement[]>) => {
          this.placements = res.body || [];
          this.displayedPlacementsCount = this.placements.length;
        },
        error: err => console.error('Failed to search placements', err),
      });
    } else {
      this.loadPlacements();
    }
  }
}
