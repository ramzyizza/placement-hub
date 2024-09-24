import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlacementDetailDialogComponent } from './placement-detail-dialog.component';

describe('PLacementDetailDialogComponent', () => {
  let component: PlacementDetailDialogComponent;
  let fixture: ComponentFixture<PlacementDetailDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PlacementDetailDialogComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PlacementDetailDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
