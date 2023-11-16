import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MyCharPage } from './my-char.page';

describe('MyCharPage', () => {
  let component: MyCharPage;
  let fixture: ComponentFixture<MyCharPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(MyCharPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
