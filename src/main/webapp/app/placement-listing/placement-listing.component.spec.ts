import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlacementListingComponent } from './placement-listing.component';

describe('PlacementListingComponent', () => {
  let component: PlacementListingComponent;
  let fixture: ComponentFixture<PlacementListingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PlacementListingComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PlacementListingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
