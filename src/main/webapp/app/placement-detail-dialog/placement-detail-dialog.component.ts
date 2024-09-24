import { Component, Input, OnInit } from '@angular/core';
import { IPlacement } from 'app/entities/placement/placement.model';
import { PlacementService } from 'app/entities/placement/service/placement.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'jhi-placement-detail-dialog',
  templateUrl: './placement-detail-dialog.component.html',
  styleUrls: ['./placement-detail-dialog.component.scss'],
  providers: [DatePipe],
})
export class PlacementDetailDialogComponent implements OnInit {
  @Input() placementId?: number;
  placement?: IPlacement;
  formattedDeadline: string = '';

  constructor(private placementService: PlacementService, public activeModal: NgbActiveModal, private datePipe: DatePipe) {}

  ngOnInit(): void {
    if (this.placementId) {
      this.loadPlacement();
    }
  }

  loadPlacement(): void {
    if (this.placementId !== undefined) {
      this.placementService.find(this.placementId as number).subscribe({
        next: response => {
          this.placement = response.body !== null ? response.body : undefined;
          const deadlineDate = this.placement?.applicationDeadline?.toDate();
          this.formattedDeadline = this.datePipe.transform(deadlineDate, 'EEE MMM d yyyy HH:mm:ss') || '';
        },
        error: err => console.error('Failed to load placement details', err),
      });
    } else {
      console.error('Placement ID is undefined.');
    }
  }

  redirectToLink(): void {
    if (this.placement?.link) {
      window.open(this.placement.link, '_blank');
    } else {
      console.warn('No application link available for this placement.');
      this.activeModal.close('No application link');
    }
  }
}
