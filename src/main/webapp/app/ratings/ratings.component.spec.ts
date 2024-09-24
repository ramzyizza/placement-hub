import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RatingsComponent } from './ratings.component';

describe('RatingsComponent', () => {
  let component: RatingsComponent;
  let fixture: ComponentFixture<RatingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RatingsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(RatingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
