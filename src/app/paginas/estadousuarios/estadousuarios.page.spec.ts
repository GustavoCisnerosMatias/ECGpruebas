import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EstadousuariosPage } from './estadousuarios.page';

describe('EstadousuariosPage', () => {
  let component: EstadousuariosPage;
  let fixture: ComponentFixture<EstadousuariosPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(EstadousuariosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
