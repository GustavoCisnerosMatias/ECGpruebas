import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CrearParametrosPage } from './crear-parametros.page';

describe('CrearParametrosPage', () => {
  let component: CrearParametrosPage;
  let fixture: ComponentFixture<CrearParametrosPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(CrearParametrosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
