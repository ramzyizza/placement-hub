import { Component, OnInit, OnDestroy, ViewChild, TemplateRef, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subject, of } from 'rxjs';
import { switchMap, catchError, takeUntil } from 'rxjs/operators';
import { HttpResponse } from '@angular/common/http';

import { AccountService } from 'app/core/auth/account.service';
import { IPlacement } from '../entities/placement/placement.model';
import { PlacementService } from '../entities/placement/service/placement.service';
import { CardService } from '../entities/card/service/card.service';
import { CardStatus } from 'app/entities/enumerations/card-status.model';
import { ICard } from '../entities/card/card.model';
import { PlacementDetailDialogComponent } from '../placement-detail-dialog/placement-detail-dialog.component';

@Component({
  selector: 'jhi-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, OnDestroy, AfterViewInit {
  placements: IPlacement[] = [];
  statusCounts: { [key in CardStatus]?: number } = {};
  isLoggedIn = false;
  userLogin: string | undefined;

  @ViewChild('userConsentModal') userConsentModal!: TemplateRef<any>;
  private readonly destroy$ = new Subject<void>();

  constructor(
    private accountService: AccountService,
    private placementService: PlacementService,
    private cardService: CardService,
    private router: Router,
    private modalService: NgbModal
  ) {}

  ngOnInit(): void {
    this.accountService.identity().subscribe(account => {
      this.userLogin = account?.login;
    });
    this.checkLoginStatus();
    this.loadPlacements();
    this.loadUserCardStatusCounts();
  }

  checkLoginStatus(): void {
    this.accountService.identity().subscribe(account => {
      this.isLoggedIn = !!account;
    });
  }

  loadPlacements(): void {
    this.placementService.query().subscribe({
      next: (res: HttpResponse<IPlacement[]>) => {
        this.placements = res.body ? res.body.slice(0, 4) : [];
      },
      error: err => console.error('Failed to load placements', err),
    });
  }

  loadUserCardStatusCounts(): void {
    this.accountService
      .identity()
      .pipe(
        switchMap(account => {
          if (account && account.login) {
            return this.cardService.getCardStatusCountsForCurrentUser().pipe(catchError(() => of({})));
          }
          return of({});
        }),
        takeUntil(this.destroy$)
      )
      .subscribe((statusCounts: { [key: string]: number }) => {
        this.statusCounts = statusCounts;
      });
  }

  getCountForStatus(statusKey: string): number {
    return this.statusCounts[statusKey as keyof typeof CardStatus] || 0;
  }

  showUserConsentModal(): void {
    const hasConsented = localStorage.getItem('userConsented');
    if (!hasConsented) {
      this.modalService.open(this.userConsentModal, { ariaLabelledBy: 'userConsentModalLabel' }).result.then(
        () => localStorage.setItem('userConsented', 'true'),
        () => {}
      );
    }
  }

  openDialog(placementId: number): void {
    const modalRef = this.modalService.open(PlacementDetailDialogComponent, { size: 'lg' });
    modalRef.componentInstance.placementId = placementId;
  }

  navigateToPrivacyPolicy(): void {
    this.router.navigate(['/gdpr']);
    this.modalService.dismissAll();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  ngAfterViewInit(): void {
    setTimeout(() => this.showUserConsentModal(), 0);
  }

  login(): void {
    this.router.navigate(['/login']);
  }
}
