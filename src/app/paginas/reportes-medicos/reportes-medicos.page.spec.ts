import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReportesMedicosPage } from './reportes-medicos.page';

describe('ReportesMedicosPage', () => {
  let component: ReportesMedicosPage;
  let fixture: ComponentFixture<ReportesMedicosPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportesMedicosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
