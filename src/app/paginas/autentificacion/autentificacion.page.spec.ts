import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AutentificacionPage } from './autentificacion.page';

describe('AutentificacionPage', () => {
  let component: AutentificacionPage;
  let fixture: ComponentFixture<AutentificacionPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AutentificacionPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
