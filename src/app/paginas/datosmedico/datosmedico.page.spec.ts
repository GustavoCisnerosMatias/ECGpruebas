import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DatosmedicoPage } from './datosmedico.page';

describe('DatosmedicoPage', () => {
  let component: DatosmedicoPage;
  let fixture: ComponentFixture<DatosmedicoPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(DatosmedicoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
