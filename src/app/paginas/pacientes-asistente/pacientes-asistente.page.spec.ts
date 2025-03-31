import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PacientesAsistentePage } from './pacientes-asistente.page';

describe('PacientesAsistentePage', () => {
  let component: PacientesAsistentePage;
  let fixture: ComponentFixture<PacientesAsistentePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(PacientesAsistentePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
