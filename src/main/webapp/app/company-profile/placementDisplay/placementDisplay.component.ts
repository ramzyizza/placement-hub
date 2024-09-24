import { Component, Input, inject } from '@angular/core';
import { NgForOf, NgIf } from '@angular/common';
import { IPlacement } from '../../entities/placement/placement.model';
import { PlacementDetailDialogComponent } from '../../placement-detail-dialog/placement-detail-dialog.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { RouterModule } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { PlacementDeleteDialogComponent } from '../../entities/placement/delete/placement-delete-dialog.component';
import { filter } from 'rxjs';
import { ITEM_DELETED_EVENT } from '../../config/navigation.constants';
@Component({
  selector: 'placement-display',
  standalone: true,
  templateUrl: './placementDisplay.component.html',
  styleUrls: ['./placementDisplay.component.scss'],
  imports: [NgForOf, NgIf, RouterModule],
})
export class PlacementDisplayComponent {
  @Input() placements!: IPlacement[] | undefined;
  router: ActivatedRoute = inject(ActivatedRoute);
  userID: number;
  constructor(private modalService: NgbModal) {
    this.userID = Number(this.router.snapshot.paramMap.get('id'));
  }
  openDialog(placementId: number): void {
    const modalRef = this.modalService.open(PlacementDetailDialogComponent, { size: 'lg' });
    modalRef.componentInstance.placementId = placementId;
  }
  deleteDialog(placement: IPlacement): void {
    const modalRef = this.modalService.open(PlacementDeleteDialogComponent, { size: 'lg' });
    modalRef.componentInstance.placement = placement;
    modalRef.closed.pipe(filter(reason => reason === ITEM_DELETED_EVENT)).subscribe({
      next: res => {
        window.location.reload();
      },
    });
  }
}
