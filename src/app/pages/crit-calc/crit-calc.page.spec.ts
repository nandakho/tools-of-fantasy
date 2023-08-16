import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CritCalcPage } from './crit-calc.page';

describe('CritCalcPage', () => {
  let component: CritCalcPage;
  let fixture: ComponentFixture<CritCalcPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(CritCalcPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
