import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RatingsDisplayComponent } from './ratings-display.component';

describe('RatingsDisplayComponent', () => {
  let component: RatingsDisplayComponent;
  let fixture: ComponentFixture<RatingsDisplayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RatingsDisplayComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(RatingsDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
