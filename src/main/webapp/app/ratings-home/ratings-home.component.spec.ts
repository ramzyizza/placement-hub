import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RatingsHomeComponent } from './ratings-home.component';

describe('RatingsHomeComponent', () => {
  let component: RatingsHomeComponent;
  let fixture: ComponentFixture<RatingsHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RatingsHomeComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(RatingsHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
