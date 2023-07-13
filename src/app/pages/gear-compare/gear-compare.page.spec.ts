import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GearComparePage } from './gear-compare.page';

describe('GearComparePage', () => {
  let component: GearComparePage;
  let fixture: ComponentFixture<GearComparePage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(GearComparePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
