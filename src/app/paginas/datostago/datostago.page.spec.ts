import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DatostagoPage } from './datostago.page';

describe('DatostagoPage', () => {
  let component: DatostagoPage;
  let fixture: ComponentFixture<DatostagoPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(DatostagoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
